const path = require("path");

const appConfig = require("../webpack/config");

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  if (!config.resolve) {
    config.resolve = {};
  }
  config.resolve.extensions = [".ts", ".js", ".json", ".tsx", ".scss"];
  config.resolve.alias = Object.assign({}, config.resolve.alias, appConfig[0].resolve.alias);
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: "ts-loader"
  });
  config.module.rules.push({
    test: /\.scss/,
    include: path.resolve(__dirname, "../"),
    loaders: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: "[path]_[name]_[local]"
          },
          importLoaders: 0,
          localsConvention: "camelCase",
          sourceMap: true
        }
      },
      "sass-loader"
    ]
  });
  return config;
};
