#!/bin/sh
# Automatically configure MLKit binaries for the active platform:
# - iphoneos (device) -> platform 2
# - iphonesimulator (simulator) -> platform 7

TARGET_PLATFORM="${PLATFORM_NAME:-iphoneos}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

python3 -c "
import os, sys

target = sys.argv[1]
base_dir = sys.argv[2]

target_byte = b'\x07' if 'simulator' in target else b'\x02'
other_byte = b'\x02' if 'simulator' in target else b'\x07'

p_from = b'\x32\x00\x00\x00\x18\x00\x00\x00' + other_byte + b'\x00\x00\x00'
p_to   = b'\x32\x00\x00\x00\x18\x00\x00\x00' + target_byte + b'\x00\x00\x00'

frameworks = [
    'Pods/MLImage/Frameworks/MLImage.framework/MLImage',
    'Pods/MLKitCommon/Frameworks/MLKitCommon.framework/MLKitCommon',
    'Pods/MLKitVision/Frameworks/MLKitVision.framework/MLKitVision'
]

for fw in frameworks:
    path = os.path.join(base_dir, fw)
    if os.path.exists(path):
        with open(path, 'rb') as f:
            data = f.read()
        if p_from in data:
            with open(path, 'wb') as f:
                f.write(data.replace(p_from, p_to))
" "$TARGET_PLATFORM" "$SCRIPT_DIR"

