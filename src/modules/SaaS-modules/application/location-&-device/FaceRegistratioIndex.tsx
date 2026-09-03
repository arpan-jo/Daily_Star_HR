// ==================================================================
// FaceRegistrationMainIndex.tsx
// ------------------------------------------------------------------
// Captures 5 face photos from different angles using vision camera
// + face detector. Each pose is validated in real-time before capture.
//
// Flow:
// 1. User taps "Start Registration"
// 2. Guided through 5 poses: Front → Left → Right → Up → Smile
// 3. Border colors:
//    White  = no face
//    Orange = face found but wrong pose
//    Green  = correct pose (hold 2 seconds to auto-capture)
// 4. After 5 photos → sends to enrollment API
// 5. Success → go back | Failure → retry option
// ==================================================================

import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  Camera as VisionCamera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  Face,
  Camera,
  FrameFaceDetectionOptions,
} from '../../../../common/components/CameraWrapper';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../../common/constant/Themes';
import { useRootStore } from '../../../../stores/rootStore';
import { useToast } from '../../../../common/components/CustomToast';
import axios from 'axios';

// ==================================================================
// CONFIG
// ==================================================================

// How long user must hold correct pose before auto-capture (ms)
const HOLD_DURATION = 2000;

// ==================================================================
// POSE DEFINITIONS
// ------------------------------------------------------------------
// Face angles from detector:
//   yawAngle   = left/right turn (positive=left, negative=right)
//   pitchAngle = up/down tilt (negative=looking up, positive=down)
//   smilingProbability = 0.0 to 1.0
//
// NOTE: Front camera mirrors image. If left/right are swapped on
// your device, flip > and < signs in Left/Right validate functions.
// ==================================================================

const POSE_STEPS = [
  {
    instruction: 'Look straight at the camera',
    icon: 'face',
    shortLabel: 'Front',
    hint: 'Keep your head straight',
    validate: (face: Face) => {
      const yaw = Math.abs(face.yawAngle || 0);
      const pitch = Math.abs(face.pitchAngle || 0);
      return yaw < 10 && pitch < 10;
    },
  },
  {
    instruction: 'Slowly turn your head LEFT',
    icon: 'rotate-left',
    shortLabel: 'Left',
    hint: 'Turn more to your left',
    validate: (face: Face) => {
      const yaw = face.yawAngle || 0;
      return yaw > 20;
    },
  },
  {
    instruction: 'Slowly turn your head RIGHT',
    icon: 'rotate-right',
    shortLabel: 'Right',
    hint: 'Turn more to your right',
    validate: (face: Face) => {
      const yaw = face.yawAngle || 0;
      return yaw < -20;
    },
  },
  {
    instruction: 'Tilt your head slightly UP',
    icon: 'arrow-upward',
    shortLabel: 'Up',
    hint: 'Look up a bit more',
    validate: (face: Face) => {
      const pitch = face.pitchAngle || 0;
      return pitch < -10;
    },
  },
  {
    instruction: 'Now give a big SMILE',
    icon: 'mood',
    shortLabel: 'Smile',
    hint: 'Smile wider!',
    validate: (face: Face) => {
      return (face.smilingProbability || 0) > 0.7;
    },
  },
];

const TOTAL_PHOTOS = POSE_STEPS.length;
const faceClient = axios.create({
  baseURL: 'https://face.ibos.io/api',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

// ==================================================================
// COMPONENT
// ==================================================================

const FaceRegistrationMainIndex = () => {
  // ------------------------------------------------------------------
  // Navigation & stores
  // ------------------------------------------------------------------
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const toaster = useToast();
  const isFocused = useIsFocused();

  // ------------------------------------------------------------------
  // Camera setup
  // ------------------------------------------------------------------
  const device = useCameraDevice('front');
  const camera = useRef<VisionCamera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();

  // ------------------------------------------------------------------
  // UI state (only for rendering)
  // ------------------------------------------------------------------
  const [faceDetected, setFaceDetected] = useState(false);
  const [poseValid, setPoseValid] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  // const [angles, setAngles] = useState({ yaw: 0, pitch: 0, smile: 0 });

  // ------------------------------------------------------------------
  // Refs (used inside callbacks to avoid stale closures)
  // ------------------------------------------------------------------
  const isStartedRef = useRef(false); // has user tapped Start?
  const isCapturingRef = useRef(false); // is a photo being taken right now?
  const isPoseValidRef = useRef(false); // is current pose correct?
  const isEnrollingRef = useRef(false); // is API call in progress?
  const photosRef = useRef<string[]>([]); // captured base64 images
  const stepRef = useRef(0); // current pose index (0-4)
  const holdTimerRef = useRef<any>(null);
  const progressTimerRef = useRef<any>(null);

  // ------------------------------------------------------------------
  // Face detection config
  // classificationMode: 'all' needed for smilingProbability
  // ------------------------------------------------------------------
  const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
    performanceMode: 'fast',
    classificationMode: 'all',
    landmarkMode: 'none',
    contourMode: 'none',
    minFaceSize: 0.25,
    trackingEnabled: false,
  }).current;

  // ------------------------------------------------------------------
  // Request camera permission on mount
  // ------------------------------------------------------------------
  useEffect(() => {
    if (hasPermission) return;
    requestPermission();
  }, []);

  // Clean up timers when screen unmounts
  useEffect(() => {
    return () => stopTimers();
  }, []);

  // ==================================================================
  // TIMER FUNCTIONS
  // ==================================================================

  /** Stop all running timers */
  const stopTimers = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  /**
   * Start hold timer when correct pose is detected.
   * Progress bar fills over HOLD_DURATION.
   * Auto-captures when complete.
   */
  const startHoldTimer = () => {
    // Safety: don't start if already capturing or enrolling
    if (isCapturingRef.current || isEnrollingRef.current) return;

    // Clear any existing timers first
    stopTimers();

    const startTime = Date.now();

    // Update progress bar every 50ms
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
    }, 50);

    // Take photo after hold duration
    holdTimerRef.current = setTimeout(() => {
      if (isPoseValidRef.current && !isCapturingRef.current) {
        takePhoto();
      }
    }, HOLD_DURATION);
  };

  /** Stop hold timer and reset progress bar to 0 */
  const stopHoldTimer = () => {
    stopTimers();
    setHoldProgress(0);
  };

  // ==================================================================
  // FACE DETECTION CALLBACK
  // ------------------------------------------------------------------
  // Called on EVERY camera frame by the face detector.
  // Checks if face matches required pose for current step.
  //
  // Uses REFS (not state) for all checks because this runs
  // on every frame and state closures can be stale.
  // ==================================================================

  function onFacesDetected(faces: Face[], frame: any) {
    // Skip if not started, capturing, or enrolling
    if (
      !isStartedRef.current ||
      isCapturingRef.current ||
      isEnrollingRef.current
    ) {
      return;
    }

    // --- NO FACE DETECTED ---
    if (!faces || faces.length <= 0) {
      // Only update if face was previously visible (avoid unnecessary re-renders)
      if (isPoseValidRef.current || faceDetected) {
        isPoseValidRef.current = false;
        setFaceDetected(false);
        setPoseValid(false);
        stopHoldTimer();
      }
      return;
    }

    // --- FACE DETECTED ---
    const face = faces[0];
    const pose = POSE_STEPS[stepRef.current];

    // Update UI to show face is visible
    setFaceDetected(true);

    // Show live angles for debugging (remove in production)
    // setAngles({
    //   yaw: Math.round(face.yawAngle || 0),
    //   pitch: Math.round(face.pitchAngle || 0),
    //   smile: Math.round((face.smilingProbability || 0) * 100),
    // });

    // Check if face matches required pose
    const isCorrect = pose.validate(face);
    setPoseValid(isCorrect);

    // POSE JUST BECAME CORRECT → start hold timer
    if (isCorrect && !isPoseValidRef.current) {
      isPoseValidRef.current = true;
      startHoldTimer();
    }

    // POSE WAS CORRECT BUT NOW WRONG → stop timer
    if (!isCorrect && isPoseValidRef.current) {
      isPoseValidRef.current = false;
      stopHoldTimer();
    }
  }

  // ==================================================================
  // PHOTO CAPTURE
  // ------------------------------------------------------------------
  // Takes a snapshot, converts to base64, moves to next step.
  // After all 5 photos → calls enrollment API.
  // ==================================================================

  const takePhoto = async () => {
    if (!camera.current || isCapturingRef.current) return;

    // Lock capture to prevent double-tap
    isCapturingRef.current = true;
    stopTimers();

    try {
      // takeSnapshot is faster than takePhoto (per library docs)
      const { path } = await camera.current.takeSnapshot();

      // Convert file to base64
      const cleanPath = path.startsWith('file://') ? path.replace('file://', '') : path;
      const readPath = Platform.OS === 'ios' ? cleanPath : `file://${cleanPath}`;
      const base64 = await RNFS.readFile(readPath, 'base64');
      const base64Image = `data:image/jpeg;base64,${base64}`;

      // Add to photos array
      const updatedPhotos = [...photosRef.current, base64Image];
      photosRef.current = updatedPhotos;
      setCapturedPhotos(updatedPhotos);

      // Reset detection state for next pose
      isCapturingRef.current = false;
      isPoseValidRef.current = false;
      setFaceDetected(false);
      setPoseValid(false);
      setHoldProgress(0);

      // Check if all photos are done
      if (updatedPhotos.length >= TOTAL_PHOTOS) {
        // All 5 captured → enroll
        enrollFace(updatedPhotos);
      } else {
        // Move to next pose
        const nextStep = updatedPhotos.length;
        stepRef.current = nextStep;
        setCurrentStep(nextStep);
      }
    } catch (err) {
      console.log('Capture error:', err);

      // Reset on error so user can retry
      isCapturingRef.current = false;
      isPoseValidRef.current = false;
      setFaceDetected(false);
      setPoseValid(false);
      setHoldProgress(0);

      toaster.show({ message: 'Capture failed, try again', type: 'error' });
    }
  };

  // ==================================================================
  // ENROLLMENT API CALL
  // ------------------------------------------------------------------
  // POST https://devface.ibos.io/api/v1/enroll-base64
  // Sends: { user_id, images (5 base64), name }
  // ==================================================================

  const enrollFace = async (images: string[]) => {
    setIsEnrolling(true);
    isEnrollingRef.current = true;

    try {
      const payload = {
        user_id: userInfo?.intEmployeeId?.toString(),
        images: images,
        name: userInfo?.strDisplayName,
        metadata: {},
      };
      const response = await faceClient.post('/v1/enroll-base64', payload);

      const res = response?.data;
      console.log('Enroll Response =>', res);
      isEnrollingRef.current = false;
      setIsEnrolling(false);
      if (res?.success) {
        toaster.show({
          message: res?.message || res?.Message || 'Face Registration Success!',
          type: 'success',
        });
        navigation.goBack();
      }
    } catch (error) {
      setIsEnrolling(false);
      resetEverything();
      // console.log(error?.response?.data?.detail);
      toaster.show({
        message: error?.response?.data?.message || 'Someting Went Wrong!',
        type: 'error',
      });
    }
  };

  // ==================================================================
  // RESET EVERYTHING
  // ------------------------------------------------------------------
  // Returns to initial state. Called on:
  // - "Start Over" button
  // - Enrollment failure
  // ==================================================================

  const resetEverything = () => {
    stopTimers();

    // Reset all refs
    isStartedRef.current = false;
    isCapturingRef.current = false;
    isPoseValidRef.current = false;
    isEnrollingRef.current = false;
    photosRef.current = [];
    stepRef.current = 0;

    // Reset all state
    setCapturedPhotos([]);
    setCurrentStep(0);
    setIsEnrolling(false);
    setIsStarted(false);
    setFaceDetected(false);
    setPoseValid(false);
    setHoldProgress(0);
  };

  // ==================================================================
  // START REGISTRATION
  // ------------------------------------------------------------------
  // Called when user taps "Start Registration" button.
  // Resets everything and enables face detection callback.
  // ==================================================================

  const handleStart = () => {
    // Reset refs to clean state
    isStartedRef.current = true;
    isCapturingRef.current = false;
    isPoseValidRef.current = false;
    isEnrollingRef.current = false;
    photosRef.current = [];
    stepRef.current = 0;

    // Reset state
    setCapturedPhotos([]);
    setCurrentStep(0);
    setFaceDetected(false);
    setPoseValid(false);
    setHoldProgress(0);
    setIsStarted(true);
  };

  // ==================================================================
  // HELPERS
  // ==================================================================

  /** Get border color: white (no face) / orange (wrong pose) / green (correct) */
  const getBorderColor = () => {
    if (!faceDetected) return 'rgba(255,255,255,0.4)';
    if (poseValid) return '#4CAF50';
    return '#FFA500';
  };

  /** Get status badge color */
  const getBadgeColor = () => {
    if (!faceDetected) return 'rgba(255,255,255,0.2)';
    if (poseValid) return 'rgba(76,175,80,0.8)';
    return 'rgba(255,165,0,0.8)';
  };

  // Current pose data
  const currentPose = POSE_STEPS[currentStep];

  // ==================================================================
  // RENDER: No camera device
  // ==================================================================

  if (!device) {
    return (
      <View style={styles.centerContainer}>
        <MIcon name="no-photography" size={60} color="rgba(255,255,255,0.5)" />
        <Text style={styles.message}>No Device</Text>
        <TouchableOpacity
          style={styles.goBackBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ==================================================================
  // RENDER: No camera permission
  // ==================================================================

  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <MIcon name="lock" size={60} color="rgba(255,255,255,0.5)" />
        <Text style={styles.message}>Camera permission required</Text>
        <TouchableOpacity
          style={styles.goBackBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ==================================================================
  // RENDER: Main camera screen
  // ==================================================================

  return (
    <View style={styles.container}>
      {/* ============================================================
          CAMERA
          Pauses when enrolling to freeze preview
          ============================================================ */}
      <Camera
        // @ts-ignore
        ref={camera}
        style={StyleSheet.absoluteFill}
        isActive={isFocused && !isEnrolling}
        device={device}
        photo={true}
        faceDetectionCallback={onFacesDetected}
        faceDetectionOptions={faceDetectionOptions}
        onError={(error: any) => console.error('camera mount error', error)}
      />

      {/* ============================================================
          ENROLLING OVERLAY — shown while uploading to API
          ============================================================ */}
      {isEnrolling && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Registering your face...</Text>
          <Text style={styles.loadingSubText}>
            Uploading {TOTAL_PHOTOS} photos
          </Text>

          {/* Allow cancel if it takes too long */}
          <TouchableOpacity
            style={[styles.cancelBtn, { marginTop: 30 }]}
            onPress={() => {
              resetEverything();
              toaster.show({
                message: 'Registration cancelled',
                type: 'warning',
              });
            }}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ============================================================
          UI OVERLAY
          ============================================================ */}
      <View style={styles.overlay}>
        {/* ----------------------------------------------------------
            TOP BAR
            ---------------------------------------------------------- */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            disabled={isEnrolling}
          >
            <MIcon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>Face Registration</Text>

          <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
            <MIcon
              name={faceDetected ? 'face' : 'face-retouching-off'}
              size={18}
              color="#fff"
            />
          </View>
        </View>

        {/* ----------------------------------------------------------
            CENTER
            ---------------------------------------------------------- */}
        <View style={styles.center}>
          {/* Oval face frame */}
          <View style={[styles.faceFrame, { borderColor: getBorderColor() }]} />

          {/* Progress bar (visible when holding correct pose) */}
          {poseValid && isStarted && (
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${holdProgress}%` }]}
              />
            </View>
          )}

          {/* Debug angles — REMOVE IN PRODUCTION */}
          {/* {isStarted && faceDetected && (
            <View style={styles.debugBox}>
              <Text style={styles.debugText}>
                Yaw: {angles.yaw}° | Pitch: {angles.pitch}° | Smile:{' '}
                {angles.smile}%
              </Text>
            </View>
          )} */}

          {/* Progress dots — one per pose */}
          <View style={styles.dotsRow}>
            {POSE_STEPS.map((step, i) => (
              <View key={i} style={styles.dotItem}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        i < capturedPhotos.length
                          ? '#4CAF50'
                          : i === currentStep && isStarted
                            ? poseValid
                              ? '#4CAF50'
                              : COLORS.primary
                            : 'rgba(255,255,255,0.2)',
                    },
                  ]}
                >
                  {i < capturedPhotos.length ? (
                    <MIcon name="check" size={14} color="#fff" />
                  ) : (
                    <MIcon name={step.icon} size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.dotLabel}>{step.shortLabel}</Text>
              </View>
            ))}
          </View>

          {/* Instruction box */}
          {isStarted ? (
            <View style={styles.instructionBox}>
              <MIcon name={currentPose.icon} size={28} color="#fff" />
              <Text style={styles.instructionText}>
                {currentPose.instruction}
              </Text>

              {!faceDetected && (
                <Text style={styles.feedbackText}>
                  Show your face to continue
                </Text>
              )}
              {faceDetected && !poseValid && (
                <Text style={[styles.feedbackText, { color: '#FFA500' }]}>
                  ⚠️ {currentPose.hint}
                </Text>
              )}
              {faceDetected && poseValid && (
                <Text style={[styles.feedbackText, { color: '#4CAF50' }]}>
                  ✓ Perfect! Hold still... {Math.round(holdProgress)}%
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.instructionBox}>
              <MIcon name="info-outline" size={28} color="#fff" />
              <Text style={styles.instructionText}>
                We need {TOTAL_PHOTOS} photos from different angles
              </Text>
              <Text style={styles.feedbackText}>
                Front · Left · Right · Up · Smile
              </Text>
              <Text style={styles.feedbackText}>
                Each pose is validated in real-time
              </Text>
            </View>
          )}

          {/* Photo counter */}
          <Text style={styles.counter}>
            {capturedPhotos.length} / {TOTAL_PHOTOS}
          </Text>
        </View>

        {/* ----------------------------------------------------------
            BOTTOM BAR
            ---------------------------------------------------------- */}
        <View style={styles.bottom}>
          {/* Start button */}
          {!isStarted && !isEnrolling && (
            <TouchableOpacity
              style={styles.startBtn}
              onPress={handleStart}
              activeOpacity={0.7}
            >
              <MIcon name="camera-alt" size={22} color="#fff" />
              <Text style={styles.startBtnText}>Start Registration</Text>
            </TouchableOpacity>
          )}

          {/* Start Over button */}
          {isStarted && capturedPhotos.length > 0 && !isEnrolling && (
            <TouchableOpacity style={styles.resetBtn} onPress={resetEverything}>
              <MIcon name="refresh" size={20} color="#fff" />
              <Text style={styles.resetBtnText}>Start Over</Text>
            </TouchableOpacity>
          )}

          {/* Cancel button */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            disabled={isEnrolling}
          >
            <MIcon name="close" size={20} color="#fff" />
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FaceRegistrationMainIndex;

// ==================================================================
// STYLES
// ==================================================================

const styles = StyleSheet.create({
  // Layout
  container: { flex: 1, backgroundColor: '#000' },
  centerContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },

  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  loadingSubText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginTop: 6,
  },

  // Top bar
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 17, fontWeight: '600' },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Center
  center: { alignItems: 'center' },
  faceFrame: { width: 250, height: 320, borderRadius: 125, borderWidth: 3 },

  // Progress bar
  progressBarBg: {
    width: 200,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },

  // Debug (remove in production)
  // debugBox: {
  //   marginTop: 8,
  //   backgroundColor: 'rgba(0,0,0,0.6)',
  //   paddingHorizontal: 12,
  //   paddingVertical: 4,
  //   borderRadius: 4,
  // },
  debugText: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },

  // Progress dots
  dotsRow: { flexDirection: 'row', marginTop: 16, gap: 16 },
  dotItem: { alignItems: 'center', gap: 4 },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '500' },

  // Instruction box
  instructionBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    // paddingVertical: 14,
    borderRadius: 12,
    // marginTop: 16,
    gap: 6,
    maxWidth: 320,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  feedbackText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    textAlign: 'center',
  },

  // Counter
  counter: { color: '#4CAF50', fontSize: 24, fontWeight: '700', marginTop: 8 },

  // Bottom bar
  bottom: { paddingBottom: 50, alignItems: 'center', gap: 12 },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 99,
    gap: 10,
  },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,165,0,0.6)',
    borderRadius: 99,
    gap: 8,
  },
  resetBtnText: { color: '#fff', fontSize: 15, fontWeight: '500' },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 99,
    gap: 8,
  },
  cancelBtnText: { color: '#fff', fontSize: 16, fontWeight: '500' },

  // Fallback screens
  goBackBtn: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  goBackBtnText: { color: '#fff', fontSize: 15 },
  message: { color: '#fff', fontSize: 16 },
});
