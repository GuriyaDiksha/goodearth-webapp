rm -rf ./node_modules
rm -rf ./dist

yarn install --ignore-optional --production=false

yarn generateFonts
yarn buildClient
yarn buildServer