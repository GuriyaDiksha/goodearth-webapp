const path = require("path");

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'

  config.module.rules.push({ test: /\.(ts|tsx)$/, loader: "ts-loader" });
  config.module.rules.push({
    test: /\.scss/,
    include: path.resolve(__dirname, "../"),
    loaders: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: "[name]_[local]--[hash:base64:5]"
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
