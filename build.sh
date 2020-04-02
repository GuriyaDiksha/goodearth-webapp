rm -rf ./node_modules

yarn install --ignore-optional

yarn generateFonts
yarn build