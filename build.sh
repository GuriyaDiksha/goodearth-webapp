rm -rf ./node_modules

yarn install --production=false

yarn generateFonts
yarn build