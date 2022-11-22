set -e

echo "$LOCAL_PROPERTIES" | base64 -d > local.properties

sudo npm install -g webpack-cli@4.9.2
cd js
npm install
