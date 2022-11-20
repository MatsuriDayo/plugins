set -e

build() {
    [ $dl ] && bash download.sh "$1"
    cd js
    bash make.sh "$1"
    cd ..
    rm -f app_"$1"/build/outputs/apk/release/*
    ./gradlew :app_"$1":assembleRelease
}

build $1
