set -e

mkdir_libs() {
  rm -rf "$1"
  mkdir "$1"
  cd "$1"
  mkdir arm64-v8a armeabi-v7a x86 x86_64
}

unzip_xray() {
  rm -rf tmp
  unzip -d tmp tmp.zip
  mv tmp/xray "$1"/libxray.so
  rm -rf tmp tmp.zip
}

unzip_singbox() {
  rm -rf tmp
  mkdir tmp
  tar -zxvf tmp.tar.gz -C tmp
  mv tmp/*/sing-box "$1"/libsingbox.so
  rm -rf tmp tmp.tar.gz
}

unzip_juicity() {
  rm -rf tmp
  unzip -d tmp tmp.zip
  mv tmp/juicity-client "$1"/libjuicity.so
  rm -rf tmp tmp.zip
}

unzip_naive() {
  rm -rf tmp
  mkdir -p tmp
  tar -xf tmp.tar.xz -C tmp

  mv tmp/*/naive "$1"/libnaive.so
  rm -rf tmp*
}

unzip_mieru() {
  rm -rf tmp
  mkdir -p tmp
  tar -xf tmp.tar.gz -C tmp

  mv tmp/mieru "$1"/libmieru.so
  rm -rf tmp*
}

download_xray() {
  VERSION="v1.7.5"
  mkdir_libs "app_xray/libs"

  curl -Lso tmp.zip "https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-android-arm64-v8a.zip"
  unzip_xray arm64-v8a
  curl -Lso tmp.zip "https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-linux-arm32-v7a.zip"
  unzip_xray armeabi-v7a
  curl -Lso tmp.zip "https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-linux-32.zip"
  unzip_xray x86
  curl -Lso tmp.zip "https://github.com/XTLS/Xray-core/releases/download/$VERSION/Xray-linux-64.zip"
  unzip_xray x86_64
}

download_singbox() {
  mkdir_libs "app_singbox/libs"
  curl -Lso tmp.tar.gz "https://github.com/SagerNet/sing-box/releases/download/v1.2-beta5/sing-box-1.2-beta5-android-arm64.tar.gz"
  unzip_singbox arm64-v8a
  curl -Lso tmp.tar.gz "https://github.com/SagerNet/sing-box/releases/download/v1.2-beta5/sing-box-1.2-beta5-android-amd64.tar.gz"
  unzip_singbox x86_64
}

dl_and_chmod() {
  curl -fLso "$1" "$2" && chmod +x "$1"
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
  VERSION="v1.3.5-1"
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

download_tuic5() {
  VERSION="1.0.0-3"
  mkdir_libs "app_tuic5/libs"

  dl_and_chmod arm64-v8a/libtuic.so "https://github.com/MatsuriDayo/tuic/releases/download/rel/tuic-client-"$VERSION"-aarch64-linux-android"
  dl_and_chmod armeabi-v7a/libtuic.so "https://github.com/MatsuriDayo/tuic/releases/download/rel/tuic-client-"$VERSION"-armv7-linux-androideabi"
  dl_and_chmod x86/libtuic.so "https://github.com/MatsuriDayo/tuic/releases/download/rel/tuic-client-"$VERSION"-i686-linux-android"
  dl_and_chmod x86_64/libtuic.so "https://github.com/MatsuriDayo/tuic/releases/download/rel/tuic-client-"$VERSION"-x86_64-linux-android"
}

download_juicity() {
  VERSION="v0.4.0"
  mkdir_libs "app_juicity/libs"

  curl -Lso tmp.zip "https://github.com/juicity/juicity/releases/download/"$VERSION"/juicity-android-arm64.zip"
  unzip_juicity arm64-v8a
}

download_naive() {
  source ./get_version.sh naive
  mkdir_libs "app_naive/libs"

  curl -Lso tmp.tar.xz "https://github.com/klzgrad/naiveproxy/releases/download/${VERSION}/naiveproxy-${VERSION}-android-arm64.tar.xz"
  unzip_naive arm64-v8a
  curl -Lso tmp.tar.xz "https://github.com/klzgrad/naiveproxy/releases/download/${VERSION}/naiveproxy-${VERSION}-android-x64.tar.xz"
  unzip_naive x86_64
}

download_mieru() {
  TAG="v2.2.0"
  VERSION="2.2.0"
  mkdir_libs "app_mieru/libs"

  curl -Lso tmp.tar.gz "https://github.com/enfein/mieru/releases/download/${TAG}/mieru_${VERSION}_android_arm64.tar.gz"
  unzip_mieru arm64-v8a
  curl -Lso tmp.tar.gz "https://github.com/enfein/mieru/releases/download/${TAG}/mieru_${VERSION}_android_amd64.tar.gz"
  unzip_mieru x86_64
}

download_"$1"
