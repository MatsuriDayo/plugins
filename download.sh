set -e

unzip_xray() {
  rm -rf tmp
  unzip -d tmp xray.zip
  mv tmp/xray "$1"/libxray.so
  rm -rf tmp xray.zip
}

download_xray() {
  VERSION="v1.5.3"

  rm -rf app_xray/libs
  mkdir app_xray/libs
  cd app_xray/libs
  mkdir arm64-v8a armeabi-v7a x86 x86_64

  curl -Lso xray.zip https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-android-arm64-v8a.zip
  unzip_xray arm64-v8a
  curl -Lso xray.zip https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-linux-arm32-v7a.zip
  unzip_xray armeabi-v7a
  curl -Lso xray.zip https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-linux-32.zip
  unzip_xray x86
  curl -Lso xray.zip https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-linux-64.zip
  unzip_xray x86_64
}

download_"$1"
