//  VisionCameraFaceDetector.swift
//  Fully migrated to Apple Vision — replicates MLKit API & keys.
//  Works with react‑native‑vision‑camera frame‑processors.
//
//  Created 13‑05‑2025.

import Foundation
import VisionCamera
import Vision
import UIKit
import AVFoundation

@objc(VisionCameraFaceDetector)
public class VisionCameraFaceDetector: FrameProcessorPlugin {
  // MARK: – Factory
  @objc public class func newInstance() -> VisionCameraFaceDetector {
    VisionCameraFaceDetector()
  }

  // MARK: – Internal state
  private let ciContext = CIContext(options: nil)
  private let sequenceHandler = VNSequenceRequestHandler()
  private lazy var faceRequest: VNDetectFaceLandmarksRequest = {
    let r = VNDetectFaceLandmarksRequest()
    r.revision = VNDetectFaceLandmarksRequestRevision3 // best compromise iOS 13+
    return r
  }()

  // MARK: – Frame callback
  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable : Any]?) -> Any {
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(frame.buffer) else { return [] }

    // Run Vision synchronously on the current thread (same as MLKit did)
    do {
      try sequenceHandler.perform([faceRequest], on: pixelBuffer, orientation: .right)
    } catch {
      print("[VisionFD] Vision failed → \(error)")
      return []
    }

    guard let observations = faceRequest.results as? [VNFaceObservation] else { return [] }

    let width  = CGFloat(CVPixelBufferGetWidth(pixelBuffer))
    let height = CGFloat(CVPixelBufferGetHeight(pixelBuffer))

    var facesArr: [[String: Any]] = []

    for obs in observations {
      var map: [String: Any] = [:]
      map["rollAngle"]  = obs.roll?.doubleValue ?? 0.0
      map["pitchAngle"] = obs.pitch?.doubleValue ?? 0.0
      map["yawAngle"]   = obs.yaw?.doubleValue  ?? 0.0

      // Probabilities → heuristic estimations so we always return a value like MLKit.
      map["leftEyeOpenProbability"]  = eyeOpenProbability(region: obs.landmarks?.leftEye)
      map["rightEyeOpenProbability"] = eyeOpenProbability(region: obs.landmarks?.rightEye)
      map["smilingProbability"]      = smilingProbability(landmarks: obs.landmarks)

      map["bounds"]     = boundingBox(from: obs, frameW: width, frameH: height)
      map["contours"]   = processContours(from: obs, frameW: width, frameH: height)
      map["landMarks"]  = processLandmarks(from: obs, frameW: width, frameH: height)

      facesArr.append(map)
    }

    return [
      "faces": facesArr,
      "frameData": convertFrameToBase64(frame) ?? ""
    ]
  }

  // MARK: – Helpers
  private func boundingBox(from obs: VNFaceObservation, frameW: CGFloat, frameH: CGFloat) -> [String: Any] {
    let bb = obs.boundingBox
    let x = bb.minX * frameW
    let y = (1.0 - bb.minY - bb.height) * frameH
    let w = bb.width * frameW
    let h = bb.height * frameH
    return [
      "x": x,
      "y": y,
      "width": w,
      "height": h,
      "boundingCenterX": x + w / 2.0,
      "boundingCenterY": y + h / 2.0,
      "aspectRatio": w / frameW
    ]
  }

  // Contours → arrays of CGPoint dictionaries
  private func processContours(from obs: VNFaceObservation, frameW: CGFloat, frameH: CGFloat) -> [String: [[String: CGFloat]]] {
    guard let lms = obs.landmarks else { return [:] }
    var map: [String: [[String: CGFloat]]] = [:]

    // Helper to store converted points
    func add(_ region: VNFaceLandmarkRegion2D?, label: String) {
      guard let pts = region?.normalizedPoints, !pts.isEmpty else { return }
      let out = pts.map { p -> [String: CGFloat] in
        let cg = convert(p, within: obs.boundingBox, frameW: frameW, frameH: frameH)
        return ["x": cg.x, "y": cg.y]
      }
      map[label] = out
    }

    add(lms.faceContour,        label: "FACE")
    add(lms.leftEyebrow,        label: "LEFT_EYEBROW_TOP") // Vision has single eyebrow contour
    add(lms.rightEyebrow,       label: "RIGHT_EYEBROW_TOP")
    add(lms.leftEye,            label: "LEFT_EYE")
    add(lms.rightEye,           label: "RIGHT_EYE")
    add(lms.upperLip,           label: "UPPER_LIP_TOP")
    add(lms.lowerLip,           label: "LOWER_LIP_BOTTOM")
    add(lms.noseCrest,          label: "NOSE_BRIDGE")
    add(lms.nose,               label: "NOSE_BOTTOM")
    // Cheeks are single‑point regions – wrap each into an array for consistency
    if let pt = lms.leftCheek?.normalizedPoints.first {
      let c = convert(pt, within: obs.boundingBox, frameW: frameW, frameH: frameH)
      map["LEFT_CHEEK"] = [["x": c.x, "y": c.y]]
    }
    if let pt = lms.rightCheek?.normalizedPoints.first {
      let c = convert(pt, within: obs.boundingBox, frameW: frameW, frameH: frameH)
      map["RIGHT_CHEEK"] = [["x": c.x, "y": c.y]]
    }

    // Duplicate eyebrow as _BOTTOM if caller expects key present (array identical)
    if let brow = map["LEFT_EYEBROW_TOP"] { map["LEFT_EYEBROW_BOTTOM"] = brow }
    if let brow = map["RIGHT_EYEBROW_TOP"] { map["RIGHT_EYEBROW_BOTTOM"] = brow }
    // Approx lip regions duplication
    if let lipUp = map["UPPER_LIP_TOP"] { map["UPPER_LIP_BOTTOM"] = lipUp }
    if let lipLow = map["LOWER_LIP_BOTTOM"] { map["LOWER_LIP_TOP"] = lipLow }

    return map
  }

  // Landmarks → 1‑point dictionaries preserving MLKit schema
  private func processLandmarks(from obs: VNFaceObservation, frameW: CGFloat, frameH: CGFloat) -> [String: [String: CGFloat?]] {
    guard let lms = obs.landmarks else { return [:] }
    var map: [String: [String: CGFloat?]] = [:]

    func onePoint(_ region: VNFaceLandmarkRegion2D?) -> [String: CGFloat?] {
      guard let pt = region?.normalizedPoints.first else { return ["x": nil, "y": nil] }
      let cg = convert(pt, within: obs.boundingBox, frameW: frameW, frameH: frameH)
      return ["x": cg.x, "y": cg.y]
    }

    map["LEFT_CHEEK"]   = onePoint(lms.leftCheek)
    map["RIGHT_CHEEK"]  = onePoint(lms.rightCheek)
    map["LEFT_EYE"]     = onePoint(lms.leftEye)
    map["RIGHT_EYE"]    = onePoint(lms.rightEye)
    map["LEFT_EAR"]     = onePoint(lms.leftEar)
    map["RIGHT_EAR"]    = onePoint(lms.rightEar)
    map["NOSE_BASE"]    = onePoint(lms.nose)
    // Mouth corners & bottom estimated from outer lips
    if let outer = lms.outerLips?.normalizedPoints {
      if let left = outer.min(by: { $0.x < $1.x }) {
        let cg = convert(left, within: obs.boundingBox, frameW: frameW, frameH: frameH)
        map["MOUTH_LEFT"] = ["x": cg.x, "y": cg.y]
      }
      if let right = outer.max(by: { $0.x < $1.x }) {
        let cg = convert(right, within: obs.boundingBox, frameW: frameW, frameH: frameH)
        map["MOUTH_RIGHT"] = ["x": cg.x, "y": cg.y]
      }
      if let bottom = outer.max(by: { $0.y < $1.y }) {
        let cg = convert(bottom, within: obs.boundingBox, frameW: frameW, frameH: frameH)
        map["MOUTH_BOTTOM"] = ["x": cg.x, "y": cg.y]
      }
    }

    return map
  }

  // MARK: – Probability heuristics
  private func eyeOpenProbability(region: VNFaceLandmarkRegion2D?) -> Double {
    guard let pts = region?.normalizedPoints, pts.count >= 6 else { return 0.5 }
    // very rough: vertical span / horizontal span (higher → eye open)
    let xs = pts.map { $0.x }
    let ys = pts.map { $0.y }
    let dx = (xs.max() ?? 0) - (xs.min() ?? 0)
    let dy = (ys.max() ?? 0) - (ys.min() ?? 0)
    let ratio = dy / dx
    // Map ratio ~0.15 (closed) → 0, ~0.35 (wide) → 1
    return Double(min(max((ratio - 0.15) / 0.2, 0), 1))
  }

  private func smilingProbability(landmarks: VNFaceLandmarks2D?) -> Double {
    guard let outer = landmarks?.outerLips?.normalizedPoints, outer.count >= 8 else { return 0.0 }
    let xs = outer.map { $0.x }
    let ys = outer.map { $0.y }
    let w = (xs.max() ?? 0) - (xs.min() ?? 0)
    let h = (ys.max() ?? 0) - (ys.min() ?? 0)
    let ratio = w == 0 ? 0 : h / w // smiling mouths are usually wider than tall → smaller ratio
    // Map ratio 0.25 (big smile) →1, 0.5 (no smile) →0
    return Double(min(max((0.5 - ratio) / 0.25, 0), 1))
  }

  // MARK: – Point conversion
  private func convert(_ pt: CGPoint, within bbox: CGRect, frameW: CGFloat, frameH: CGFloat) -> CGPoint {
    let absX = bbox.minX + pt.x * bbox.width
    let absY = bbox.minY + pt.y * bbox.height
    return CGPoint(x: absX * frameW, y: (1.0 - absY) * frameH)
  }

  // MARK: – Frame → Base64 (unchanged)
  private func convertFrameToBase64(_ frame: Frame) -> String? {
    guard let buffer = CMSampleBufferGetImageBuffer(frame.buffer) else { return nil }
    let ci = CIImage(cvPixelBuffer: buffer)
    guard let cg = ciContext.createCGImage(ci, from: ci.extent) else { return nil }
    return UIImage(cgImage: cg).jpegData(compressionQuality: 1.0)?.base64EncodedString()
  }
}
