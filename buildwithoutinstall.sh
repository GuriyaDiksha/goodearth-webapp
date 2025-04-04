rm -rf ./dist
APP=client NODE_ENV=production ./node_modules/.bin/webpack --config webpack/config.js -a client
APP=server NODE_ENV=production ./node_modules/.bin/webpack --config webpack/config.js -a server
cp moengageserviceworker.js dist
node generateSitemap.js