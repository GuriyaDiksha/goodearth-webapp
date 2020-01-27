const path = require('path');
const context = path.resolve(__dirname, "../");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
// const nodeExternals = require('webpack-node-externals');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const LoadablePlugin = require('@loadable/webpack-plugin')

const alias = {
    components : "",
    actions : context + "/src/actions",
    reducers : context + "/src/reducers",
    store : context + "/src/store",
    utils : context + "/src/utils",
    containers : context + "/src/containers",
    hooks : context + "/src/hooks",
    styles : context + "/src/styles",
    typings : context + "/src/typings",
    routerHistory : context + "/src/routerHistory"
}

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
            publicPath: `/`,
            filename: `[name].js`
        },
        resolve: {
            extensions: [".wasm", ".mjs", ".js", ".jsx", ".tsx", ".ts", ".json", ".scss"],
            alias
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Goodearth"
            })
        ],
        devServer: {
            contentBase: context + '/dist/static',
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