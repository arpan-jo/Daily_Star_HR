import React from 'react';
import { Platform } from 'react-native';
import { Camera as RNCamera, useFrameProcessor } from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets, useSharedValue } from 'react-native-worklets-core';

// Types mapping to match the original face detector structure
export interface Face {
  pitchAngle: number;
  rollAngle: number;
  yawAngle: number;
  bounds: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  leftEyeOpenProbability?: number;
  rightEyeOpenProbability?: number;
  smilingProbability?: number;
}

export type FrameFaceDetectionOptions = {
  performanceMode?: 'fast' | 'accurate';
  landmarkMode?: 'none' | 'all';
  contourMode?: 'none' | 'all';
  classificationMode?: 'none' | 'all';
  minFaceSize?: number;
  trackingEnabled?: boolean;
};

interface CameraWrapperProps extends React.ComponentProps<typeof RNCamera> {
  faceDetectionOptions?: FrameFaceDetectionOptions;
  faceDetectionCallback: (faces: Face[], frame: any) => void;
}

export const Camera = React.forwardRef<any, CameraWrapperProps>(
  ({ faceDetectionOptions, faceDetectionCallback, ...props }, ref) => {
    const isAsyncContextBusy = useSharedValue(false);
    const cameraRef = React.useRef<RNCamera>(null);

    React.useImperativeHandle(ref, () => ({
      takeSnapshot: async (options?: any) => {
        if (Platform.OS === 'ios') {
          return await cameraRef.current?.takePhoto({
            flash: 'off',
            enableShutterSound: false,
            ...options,
          });
        }
        return await cameraRef.current?.takeSnapshot(options);
      },
      takePhoto: async (options?: any) => {
        return await cameraRef.current?.takePhoto(options);
      },
      focus: async (point: { x: number; y: number }) => {
        return await cameraRef.current?.focus(point);
      },
    }), []);

    const faceDetectorOptionsObj = React.useMemo(() => ({
      performanceMode: faceDetectionOptions?.performanceMode ?? 'fast',
      classificationMode: faceDetectionOptions?.classificationMode ?? 'none',
      landmarkMode: faceDetectionOptions?.landmarkMode ?? 'none',
      contourMode: faceDetectionOptions?.contourMode ?? 'none',
      minFaceSize: faceDetectionOptions?.minFaceSize ?? 0.15,
      trackingEnabled: faceDetectionOptions?.trackingEnabled ?? false,
    }), [faceDetectionOptions]);

    const { detectFaces } = useFaceDetector(faceDetectorOptionsObj);

    // Run callback on JS thread
    const runOnJs = React.useMemo(
      () => Worklets.createRunOnJS(faceDetectionCallback),
      [faceDetectionCallback]
    );

    // Frame Processor logic using face-detector
    const frameProcessor = useFrameProcessor((frame) => {
      'worklet';
      if (isAsyncContextBusy.value) return;
      isAsyncContextBusy.value = true;

      try {
        const detected = detectFaces(frame) ?? [];

        // Map returning properties to ensure compatibility with old library
        const mappedFaces: Face[] = detected.map((face: any) => {
          return {
            pitchAngle: face.pitchAngle ?? 0,
            rollAngle: face.rollAngle ?? 0,
            yawAngle: face.yawAngle ?? 0,
            bounds: face.bounds,
            leftEyeOpenProbability: face.leftEyeOpenProbability ?? 0,
            rightEyeOpenProbability: face.rightEyeOpenProbability ?? 0,
            smilingProbability: face.smilingProbability ?? 0,
          };
        });

        (frame as any).incrementRefCount();

        runOnJs(mappedFaces, frame).finally(() => {
          'worklet';
          (frame as any).decrementRefCount();
        });
      } catch (error) {
        console.error('Face detection execution error:', error);
      } finally {
        isAsyncContextBusy.value = false;
      }
    }, [detectFaces, runOnJs]);

    return (
      <RNCamera
        {...props}
        ref={cameraRef}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
      />
    );
  }
);
