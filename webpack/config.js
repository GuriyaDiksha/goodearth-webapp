const path = require('path');
const context = path.resolve(__dirname, "../");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
// const nodeExternals = require('webpack-node-externals');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const LoadablePlugin = require('@loadable/webpack-plugin')

let config = [
    {
        mode: 'development',
        devtool: '#cheap-module-source-map',
        context: context,
        entry: {
            'client': './src/client/index.tsx'
        },
        output: {
            path: context + '/dist/static',
            publicPath: `/static/`,
            filename: `[name].js`
        },
        resolve: {
            extensions: [".wasm", ".mjs", ".js", ".jsx", ".tsx", ".ts", ".json", ".scss"]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Goodearth"
            })
        ],
        devServer: {
            contentBase: context + '/dist',
            compress: true,
            port: 8000
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.scss/,
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
                },
                {
                    test: /\.(eot|otf|ttf|woff|woff2)(\?.*)?$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: context + '/dist/static',
                        publicPath: '/static/'
                    }
                }
            ]
        }
    }
]

module.exports = config