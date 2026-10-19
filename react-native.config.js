// FACE DETECTOR DISABLED: the project doesn't need it right now, and Google ML Kit
// (pulled in by the face detector) ships no arm64 simulator slice, which leaves no
// eligible simulator on Apple Silicon. The package stays in package.json but is not
// linked natively on either platform.
// To re-enable: delete the entry below, uncomment the face detector code in
// src/common/components/CameraWrapper.tsx, then run `yarn pod`.
module.exports = {
  dependencies: {
    'react-native-vision-camera-face-detector': {
      platforms: { ios: null, android: null },
    },
  },
};
