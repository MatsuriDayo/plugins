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

unzip_singbox() {
  rm -rf tmp
  mkdir tmp
  tar -zxvf singbox.tar.gz -C tmp
  mv tmp/*/sing-box "$1"/libsingbox.so
  rm -rf tmp singbox.tar.gz
}

download_xray() {
  VERSION="v1.7.2"
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

download_singbox() {
  mkdir_libs "app_singbox/libs"
  curl -Lso singbox.tar.gz "https://github.com/SagerNet/sing-box/releases/download/v1.1.2/sing-box-1.1.2-android-arm64.tar.gz"
  unzip_singbox arm64-v8a
  curl -Lso singbox.tar.gz "https://github.com/SagerNet/sing-box/releases/download/v1.1.2/sing-box-1.1.2-android-amd64.tar.gz"
  unzip_singbox x86_64
}

dl_and_chmod() {
  curl -Lso "$1" "$2" && chmod +x "$1"
}

download_brook() {
  VERSION="v20220707"
  mkdir_libs "app_brook/libs"

  dl_and_chmod arm64-v8a/libbrook.so "https://github.com/txthinking/brook/releases/download/$VERSION/brook_linux_arm64"
  dl_and_chmod armeabi-v7a/libbrook.so "https://github.com/txthinking/brook/releases/download/$VERSION/brook_linux_arm7"
  dl_and_chmod x86/libbrook.so "https://github.com/txthinking/brook/releases/download/$VERSION/brook_linux_386"
  dl_and_chmod x86_64/libbrook.so "https://github.com/txthinking/brook/releases/download/$VERSION/brook_linux_amd64"
}

download_hysteria() {
  VERSION="v1.3.1-1"
  mkdir_libs "app_hysteria/libs"

  dl_and_chmod arm64-v8a/libhysteria.so "https://github.com/MatsuriDayo/hysteria/releases/download/$VERSION/hysteria-linux-arm64"
  dl_and_chmod armeabi-v7a/libhysteria.so "https://github.com/MatsuriDayo/hysteria/releases/download/$VERSION/hysteria-linux-arm"
  dl_and_chmod x86/libhysteria.so "https://github.com/MatsuriDayo/hysteria/releases/download/$VERSION/hysteria-linux-386"
  dl_and_chmod x86_64/libhysteria.so "https://github.com/MatsuriDayo/hysteria/releases/download/$VERSION/hysteria-linux-amd64"
}

download_tuic() {
  mkdir_libs "app_tuic/libs"

  dl_and_chmod arm64-v8a/libtuic.so "https://github.com/MatsuriDayo/tuic/releases/download/rel/tuic-client-0.8.5-2-aarch64-android"
  dl_and_chmod x86_64/libtuic.so "https://github.com/MatsuriDayo/tuic/releases/download/rel/tuic-client-0.8.5-2-x86_64-android"
}

download_"$1"
