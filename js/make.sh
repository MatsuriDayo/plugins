set -e

# SN Plugin -> no js build
[ $1 == "hysteria" ] && exit

HTML=../app_$1/html
SRC=./plugin_$1

webpack --entry "$SRC"/main.js

rm -rf "$HTML"
mkdir -p "$HTML"
cp plugin.html "$HTML"
cp dist/p.js "$HTML"
