# react-native-vision-camera-facekit

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
[![npm version](https://badge.fury.io/js/react-native-vision-camera-facekit.svg)](https://www.npmjs.com/package/react-native-vision-camera-facekit)

## Description

`react-native-vision-camera-facekit` is a React Native Frame Processor Plugin for Vision Camera v4 that provides cross-platform face detection functionality. It supports:

* Android via MLKit Vision Face Detector
* iOS via Apple Vision Framework
* Real-time face detection using the device camera
* Configurable detection options (performance, landmarks, contours, classification, minimum face size, tracking)

## Features

* High-performance, native JSI-based frame processors
* Flexible options for speed vs. accuracy
* Contour and landmark extraction
* Face tracking (optional)

## Installation

```bash
# yarn
yarn add react-native-vision-camera-facekit

# or npm
npm install react-native-vision-camera-facekit --save
```

Then install pods (iOS):

```bash
cd ios && pod install && cd ..
```

## Usage

```tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { scanFaces } from 'react-native-vision-camera-facekit';
import { runOnJS } from 'react-native-reanimated';

export default function App() {
  const device = useCameraDevice('front');
  const [faces, setFaces] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log('Camera permission:', status);
    })();
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    try {
      const detected = scanFaces(frame, {
        performanceMode: 'fast',
        classificationMode: 'all',
        contourMode: 'all',
        landmarkMode: 'all',
        minFaceSize: 0.1,
        trackingEnabled: false,
      });
      runOnJS(setFaces)(detected);
    } catch (e) {
      console.error('scanFaces error', e);
    }
  }, []);

  if (!device) {
    return <Text>Loading camera...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        photo={false}
      />
    </View>
  );
}
```

## API

### `scanFaces(frame: Frame, options?: FaceDetectionOptions): Face[]`

* **frame**: `Frame` from Vision Camera
* **options** (all optional):

  * `performanceMode`: `'fast' | 'accurate'` (default `'fast'`)
  * `landmarkMode`: `'none' | 'all'` (default `'none'`)
  * `contourMode`: `'none' | 'all'` (default `'none'`)
  * `classificationMode`: `'none' | 'all'` (default `'none'`)
  * `minFaceSize`: `number` (default `0.1`)
  * `trackingEnabled`: `boolean` (default `false`)

**Returns**: Array of `Face` objects with bounds, angles, probabilities, contours, and landmarks.

## License

MIT © Cristofer Feliz
