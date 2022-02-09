set -e

build() {
    [ $dl ] && bash download.sh "$1"
    cd js
    bash make.sh "$1"
    cd ..
    ./gradlew :app_"$1":assembleRelease
}

build $1
