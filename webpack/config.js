const path = require('path');
const webpack = require('webpack');
const context = path.resolve(__dirname, "../");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const env = process.env.NODE_ENV || "development";
// const ManifestPlugin = require('webpack-manifest-plugin');
// const nodeExternals = require('webpack-node-externals');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const LoadablePlugin = require('@loadable/webpack-plugin')

const alias = {
    components : context + "/src/components",
    constants : context + "/src/constants",
    actions : context + "/src/actions",
    reducers : context + "/src/reducers",
    store : context + "/src/store",
    utils : context + "/src/utils",
    containers : context + "/src/containers",
    hooks : context + "/src/hooks",
    styles : context + "/src/styles",
    typings : context + "/src/typings",
    routerHistory : context + "/src/routerHistory",
    routes: context + "/src/routes",
    selectors: context + "/src/selectors",
    services: context + "/src/services",
    images: context + "/src/images"
}


let config = [
    {
        mode: env,
        devtool: env === "production"? undefined : '#cheap-module-source-map',
        context: context,
        optimization: {
            minimize: env === "production",
            minimizer: [new TerserPlugin()],
        },
        entry: {
            'client': './src/client/index.tsx'
        },
        output: {
            path: context + '/dist/static',
            publicPath: `/`,
            filename: `[name].js`
        },
        resolve: {
            extensions: [".wasm", ".mjs", ".js", ".jsx", ".tsx", ".ts", ".json", ".scss", ".css",".svg",".jpg",".png"],
            alias
        },
        plugins: [
            new webpack.DefinePlugin({
                __API_HOST__: "http://api.goodearth.in"
              }),
            new HtmlWebpackPlugin({
                title: "Goodearth",
                meta: {
                    viewport: 'width=device-width, initial-scale=1'
                }
            })
        ],
        devServer: {
            contentBase: context + '/dist/static',
            compress: true,
            port: 8000,
            historyApiFallback: {
                index: 'index.html'
            }
        },
        module: {
            rules: [
                           
                {
                    test: /\.(ts|tsx)$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.css/,
                    loaders: [
                        "style-loader",
                        "css-loader",
                        "sass-loader",
                      ]
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
                    test: /\.(eot|otf|ttf|woff|woff2|gif)(\?.*)?$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts',
                        publicPath: '/fonts/'
                    }
                },
                {
                    test: /\.(jpg|jpeg|svg|png|gif)(\?.*)?$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images',
                        publicPath: '/images/'
                    }
                }
            ]
        }
    }
]

module.exports = config