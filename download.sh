set -e

mkdir_libs() {
  rm -rf "$1"
  mkdir "$1"
  cd "$1"
  mkdir arm64-v8a armeabi-v7a x86 x86_64
}

unzip_xray() {
  rm -rf tmp
  unzip -d tmp xray.zip
  mv tmp/xray "$1"/libxray.so
  rm -rf tmp xray.zip
}

download_xray() {
  VERSION="v1.5.7"
  mkdir_libs "app_xray/libs"

  curl -Lso xray.zip "https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-android-arm64-v8a.zip"
  unzip_xray arm64-v8a
  curl -Lso xray.zip "https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-linux-arm32-v7a.zip"
  unzip_xray armeabi-v7a
  curl -Lso xray.zip "https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-linux-32.zip"
  unzip_xray x86
  curl -Lso xray.zip "https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-linux-64.zip"
  unzip_xray x86_64
}

dl_and_chmod() {
  curl -Lso "$1" "$2" && chmod +x "$1"
}

download_brook() {
  VERSION="v20220406"
  mkdir_libs "app_brook/libs"

  dl_and_chmod arm64-v8a/libbrook.so "https://github.com/txthinking/brook/releases/download/$VERSION/brook_linux_arm64"
  dl_and_chmod armeabi-v7a/libbrook.so "https://github.com/txthinking/brook/releases/download/$VERSION/brook_linux_arm7"
  dl_and_chmod x86/libbrook.so "https://github.com/txthinking/brook/releases/download/$VERSION/brook_linux_386"
  dl_and_chmod x86_64/libbrook.so "https://github.com/txthinking/brook/releases/download/$VERSION/brook_linux_amd64"
}

download_"$1"
