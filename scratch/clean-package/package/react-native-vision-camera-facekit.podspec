# react-native-vision-camera-facekit.podspec
require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-vision-camera-facekit"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = { "Cristofer Feliz" => package["author"] }

  # iOS 12.4+ sigue siendo válido; VNDetectFaceLandmarksRequest está disponible
  s.platform     = :ios, "12.4"

  s.source       = {
    :git  => "https://github.com/cristofer03/react-native-vision-camera-facekit.git",
    :tag  => "#{s.version}"
  }

  s.source_files         = "ios/**/*.{h,m,mm,swift}"
  s.public_header_files  = "ios/**/*.h"

  # Frameworks del sistema que ahora utiliza tu clase Swift
  s.frameworks = "Foundation",
                 "UIKit",
                 "AVFoundation",
                 "CoreMedia",
                 "CoreVideo",
                 "Vision"

  # ⬇️ ❌ Elimina la referencia a un framework vendorizado que ya no existe
  # s.vendored_frameworks = "ios/AppleVision.framework"

  s.dependency "React-Core"
  s.dependency "VisionCamera"

  # Opcional pero recomendable indicar la versión de Swift
  s.swift_version = "5.9"
end