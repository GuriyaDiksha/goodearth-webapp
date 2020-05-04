rm -rf ./node_modules

yarn install --ignore-optional --production=false

yarn generateFonts
yarn build