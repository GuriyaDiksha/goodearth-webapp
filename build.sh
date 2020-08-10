rm -rf ./node_modules
rm -rf ./dist

yarn install --ignore-optional --production=false

yarn generateFonts
APP=client NODE_ENV=production ./node_modules/.bin/webpack --config webpack/config.js -a client
APP=server NODE_ENV=production ./node_modules/.bin/webpack --config webpack/config.js -a server