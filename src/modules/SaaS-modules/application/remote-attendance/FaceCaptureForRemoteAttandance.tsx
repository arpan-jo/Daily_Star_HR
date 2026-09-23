import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
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
import { useIsFocused } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../../common/constant/Themes';

interface Props {
  onFaceCaptured: (base64: string) => void;
  onError: (msg: string) => void;
  onCancel: () => void;
  isVerifying?: boolean;
  verifiedEmployeeName?: string | null;
  successMessage?: string | null;
  verificationFailed?: boolean;
  failureMessage?: string | null;
  onSuccessDismiss?: () => void;
  onErrorDismiss?: () => void;
}

const STABLE_MS = 2500;
const FRAME_W = 250;
const FRAME_H = 320;
const FRAME_RADIUS = 125;

const FaceCaptureForRemoteAttandance = ({
  onFaceCaptured,
  onError,
  onCancel,
  isVerifying = false,
  verifiedEmployeeName = null,
  successMessage = null,
  verificationFailed = false,
  failureMessage = null,
  onSuccessDismiss,
  onErrorDismiss,
}: Props) => {
  const device = useCameraDevice('front');
  const isFocused = useIsFocused();
  const camera = useRef<VisionCamera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();

  const [faceDetected, setFaceDetected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const capturingRef = useRef(false);
  const stableTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scanAnim = useRef(new Animated.Value(0)).current;
  const scanLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const resultScale = useRef(new Animated.Value(0.3)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;

  const onSuccessDismissRef = useRef(onSuccessDismiss);
  onSuccessDismissRef.current = onSuccessDismiss;
  const onErrorDismissRef = useRef(onErrorDismiss);
  onErrorDismissRef.current = onErrorDismiss;
  // Same idiom, so the capture path below can keep a stable identity.
  const onFaceCapturedRef = useRef(onFaceCaptured);
  onFaceCapturedRef.current = onFaceCaptured;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  // Mirrors faceDetected so the per-frame handler can skip redundant dispatches.
  const faceDetectedRef = useRef(false);

  // Cancelling inside the 2.5s stable window unmounts this screen with the
  // capture still pending.
  useEffect(
    () => () => {
      if (stableTimerRef.current) {
        clearTimeout(stableTimerRef.current);
        stableTimerRef.current = null;
      }
    },
    [],
  );

  const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
    performanceMode: 'fast',
    classificationMode: 'none',
    landmarkMode: 'none',
    contourMode: 'none',
    minFaceSize: 0.25,
    trackingEnabled: false,
  }).current;

  const showingResult = !!verifiedEmployeeName || verificationFailed;

  const animateResultIn = useCallback(() => {
    resultScale.setValue(0.3);
    resultOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(resultScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(resultOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [resultScale, resultOpacity]);

  const startScan = useCallback(() => {
    if (scanLoopRef.current) return;
    scanAnim.setValue(0);
    scanLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    );
    scanLoopRef.current.start();
  }, [scanAnim]);

  const stopScan = useCallback(() => {
    scanLoopRef.current?.stop();
    scanLoopRef.current = null;
    scanAnim.setValue(0);
  }, [scanAnim]);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  // Scan animation — runs only when face is in frame and idle
  useEffect(() => {
    const shouldScan =
      faceDetected && !isCapturing && !isVerifying && !showingResult;
    if (shouldScan) {
      startScan();
    } else {
      stopScan();
    }
    return stopScan;
  }, [
    faceDetected,
    isCapturing,
    isVerifying,
    showingResult,
    startScan,
    stopScan,
  ]);

  // Success overlay animation + auto-dismiss
  useEffect(() => {
    if (!verifiedEmployeeName) return;
    animateResultIn();
    const timer = setTimeout(() => onSuccessDismissRef.current?.(), 3000);
    return () => clearTimeout(timer);
  }, [verifiedEmployeeName, animateResultIn]);

  // Error overlay animation + auto-reset for retry
  useEffect(() => {
    if (!verificationFailed) return;
    animateResultIn();
    const timer = setTimeout(() => {
      capturingRef.current = false;
      setIsCapturing(false);
      faceDetectedRef.current = false;
      setFaceDetected(false);
      onErrorDismissRef.current?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [verificationFailed, animateResultIn]);

  const capturePhoto = useCallback(async () => {
    if (capturingRef.current || !camera.current) return;
    capturingRef.current = true;
    setIsCapturing(true);
    try {
      const { path } = await camera.current.takeSnapshot();
      const cleanPath = path.startsWith('file://') ? path.replace('file://', '') : path;
      const readPath = Platform.OS === 'ios' ? cleanPath : `file://${cleanPath}`;
      const base64 = await RNFS.readFile(readPath, 'base64');
      // Every capture, including every retry after a failed verification,
      // wrote a full-resolution JPEG into the cache dir and left it there.
      RNFS.unlink(cleanPath).catch(() => {});
      onFaceCapturedRef.current(`data:image/jpeg;base64,${base64}`);
    } catch (err) {
      console.log('Capture error:', err);
      capturingRef.current = false;
      setIsCapturing(false);
      onErrorRef.current('Failed to capture photo');
    }
  }, []);

  // Identity must stay stable: CameraWrapper memoizes the worklet bridge and
  // the frame processor on this callback, so a new function on every render
  // rebuilds both. The parent re-renders on every GPS tick.
  const handleFacesDetected = useCallback(
    (faces: Face[], _frame: any) => {
      if (capturingRef.current || isVerifying || showingResult) return;

      if (faces.length === 0) {
        // Only dispatch on change; this runs once per frame (~30/s).
        if (faceDetectedRef.current) {
          faceDetectedRef.current = false;
          setFaceDetected(false);
        }
        if (stableTimerRef.current) {
          clearTimeout(stableTimerRef.current);
          stableTimerRef.current = null;
        }
        return;
      }

      if (!faceDetectedRef.current) {
        faceDetectedRef.current = true;
        setFaceDetected(true);
      }

      if (!stableTimerRef.current) {
        stableTimerRef.current = setTimeout(() => {
          stableTimerRef.current = null;
          capturePhoto();
        }, STABLE_MS);
      }
    },
    [isVerifying, showingResult, capturePhoto],
  );

  const scanTranslateY = useMemo(
    () =>
      scanAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-(FRAME_H / 2), FRAME_H / 2],
      }),
    [scanAnim],
  );

  if (!device) {
    return (
      <View style={styles.centerContainer}>
        <MIcon name="no-photography" size={60} color="rgba(255,255,255,0.5)" />
        <Text style={styles.message}>No Device</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={onCancel}>
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <MIcon name="lock" size={60} color="rgba(255,255,255,0.5)" />
        <Text style={styles.message}>Camera permission required</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={onCancel}>
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        // @ts-ignore
        ref={camera}
        style={StyleSheet.absoluteFill}
        // Also idle while verifying / showing the error overlay, otherwise the
        // ML Kit frame processor keeps running through the whole round trip.
        isActive={isFocused && !showingResult && !isVerifying}
        device={device}
        photo={true}
        faceDetectionCallback={handleFacesDetected}
        faceDetectionOptions={faceDetectionOptions}
        onError={(error: any) => console.error('camera mount error', error)}
      />

      {/* Capturing / verifying overlay */}
      {(isCapturing || isVerifying) && !showingResult && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            {isVerifying ? 'Verifying face...' : 'Capturing...'}
          </Text>
        </View>
      )}

      {/* Success overlay */}
      {!!verifiedEmployeeName && (
        <View style={styles.resultOverlay}>
          <Animated.View
            style={[
              styles.resultContent,
              {
                opacity: resultOpacity,
                transform: [{ scale: resultScale }],
              },
            ]}
          >
            <MIcon name="check-circle" size={96} color="#4CAF50" />
            <Text style={styles.resultTitleText}>
              Welcome {verifiedEmployeeName}
            </Text>
            <Text style={styles.resultSubText}>
              {successMessage || 'Your face has been verified successfully'}
            </Text>
          </Animated.View>
        </View>
      )}

      {/* Error overlay */}
      {verificationFailed && (
        <View style={styles.resultOverlay}>
          <Animated.View
            style={[
              styles.resultContent,
              {
                opacity: resultOpacity,
                transform: [{ scale: resultScale }],
              },
            ]}
          >
            <MIcon
              name="sentiment-very-dissatisfied"
              size={96}
              color="#F44336"
            />
            <Text style={[styles.resultTitleText, styles.errorTitleText]}>
              Sorry!
            </Text>
            <Text style={styles.resultSubText}>
              {failureMessage || "Your face hasn't been verified successfully"}
            </Text>
          </Animated.View>
        </View>
      )}

      {/* Camera UI — hidden while verifying / showing result */}
      {!showingResult && !isVerifying && !isCapturing && (
        <View style={styles.overlay}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
              <MIcon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: faceDetected
                    ? 'rgba(76,175,80,0.8)'
                    : 'rgba(255,255,255,0.2)',
                },
              ]}
            >
              <MIcon
                name={faceDetected ? 'face' : 'face-retouching-off'}
                size={18}
                color="#fff"
              />
              <Text style={styles.statusText}>
                {faceDetected ? 'Face detected' : 'No face'}
              </Text>
            </View>
          </View>

          {/* Face frame with scan line */}
          <View style={styles.centerArea}>
            <View style={styles.faceFrameWrapper}>
              <View style={styles.faceFrameClip}>
                {faceDetected && (
                  <Animated.View
                    style={[
                      styles.scanLine,
                      { transform: [{ translateY: scanTranslateY }] },
                    ]}
                  />
                )}
              </View>
              <View
                style={[
                  styles.faceFrameBorder,
                  {
                    borderColor: faceDetected
                      ? '#4CAF50'
                      : 'rgba(255,255,255,0.4)',
                  },
                ]}
              />
            </View>
            <Text style={styles.instruction}>
              {faceDetected
                ? 'Hold still...'
                : 'Position your face in the frame'}
            </Text>
          </View>

          {/* Bottom cancel */}
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.cancelTextBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    zIndex: 20,
  },
  resultContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  resultTitleText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
  errorTitleText: {
    color: '#FF6B6B',
  },
  resultSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  centerArea: {
    alignItems: 'center',
  },
  faceFrameWrapper: {
    width: FRAME_W,
    height: FRAME_H,
  },
  faceFrameClip: {
    ...StyleSheet.absoluteFill,
    borderRadius: FRAME_RADIUS,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    width: FRAME_W,
    height: 3,
    backgroundColor: 'rgba(76,175,80,0.9)',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  faceFrameBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: FRAME_RADIUS,
    borderWidth: 3,
  },
  instruction: {
    color: '#fff',
    fontSize: 15,
    marginTop: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bottomBar: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  cancelTextBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelText: {
    color: 'rgba(190, 7, 7, 0.7)',
    fontSize: 14,
  },
  goBackBtn: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  goBackBtnText: {
    color: '#fff',
    fontSize: 15,
  },
  message: {
    color: '#fff',
    fontSize: 16,
  },
});

export default React.memo(FaceCaptureForRemoteAttandance);
