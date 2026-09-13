// Google ML Kit (pulled in by the face detector) ships no arm64 simulator slice,
// which leaves no eligible simulator on Apple Silicon. Run `yarn pod:sim` to
// unlink it for simulator builds; run `yarn pod` again before device/release builds.
const skipFaceDetector = process.env.SKIP_FACE_DETECTOR === '1';

module.exports = {
  dependencies: skipFaceDetector
    ? {
        'react-native-vision-camera-face-detector': {
          platforms: { ios: null },
        },
      }
    : {},
};
