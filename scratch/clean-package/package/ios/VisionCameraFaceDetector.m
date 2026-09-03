#import <Foundation/Foundation.h>
#import "VisionCameraFaceDetector.h"

// 1) Header Swift autogenerado ─ versión “local” vs “módulo”.
#if __has_include("VisionCameraFaceDetector-Swift.h")
#import "VisionCameraFaceDetector-Swift.h"
#else
// Sustituye YourPodName por el s.module_name (o s.name) de tu .podspec
#import <react_native_vision_camera_facekit/VisionCameraFaceDetector-Swift.h>
#endif

// 2) La clase puede llamarse como quieras; aquí la dejamos como RegisterPlugins
@implementation RegisterPlugins

+ (void)load {
  // 3) Asegúrate de usar EXACTAMENTE la misma key que usas en JS:
  //    frameProcessorPlugins.detectFaces(frame, options)
  [FrameProcessorPluginRegistry addFrameProcessorPlugin:@"detectFaces"
                                        withInitializer:^FrameProcessorPlugin * (NSDictionary *options) {
    return [VisionCameraFaceDetector new];
  }];
}

@end