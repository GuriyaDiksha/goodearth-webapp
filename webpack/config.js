const path = require('path');
const webpack = require('webpack');
const context = path.resolve(__dirname, "../");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const reactLoadableTransformer = require('react-loadable-ts-transformer');
const ManifestPlugin = require('webpack-manifest-plugin');
const nodeExternals = require('webpack-node-externals');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const env = process.env.NODE_ENV || "development";

const envConfig = require("../src/config");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const LoadablePlugin = require('@loadable/webpack-plugin');

const domain = JSON.stringify(envConfig.domain);
const apiDomain = JSON.stringify("https://devapi.goodearth.in");
const publicPath = "/static/";

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
    images: context + "/src/images",
    contexts: context + "/src/contexts",
    middlewares: context + "/src/middlewares",
    fonts: context + "/src/fonts"
}

const fileNamePattern = env === "production" ? '[name].[contenthash]' : '[name]';


let config = [
    {
        mode: env,
        devtool: env === "production"? undefined : '#cheap-module-source-map',
        context: context,
        optimization: {
            minimize: env === "production",
            minimizer: [new TerserPlugin()],
            splitChunks: {
                chunks: 'all',
                automaticNameDelimiter: "-",
                minChunks: 2
            }
        },
        entry: {
            'client': './src/client/index.tsx'
        },
        output: {
            path: context + '/dist/static',
            publicPath: publicPath,
            filename: `${fileNamePattern}.js`
        },
        resolve: {
            extensions: [".wasm", ".mjs", ".js", ".jsx", ".tsx", ".ts", ".json", ".scss", ".css",".svg",".jpg",".png"],
            alias
        },
        plugins: [
            new webpack.DefinePlugin({
                __API_HOST__: apiDomain,
                __DOMAIN__: domain
              }),
            new LoadablePlugin(),
            new MiniCssExtractPlugin({
                filename: `${fileNamePattern}.css`
            }),
            env === "development" ? new BundleAnalyzerPlugin() : () => {},
            new WorkboxPlugin.GenerateSW({
                clientsClaim: true,
                swDest: context + "/dist/sw.js",
                // additionalManifestEntries: ["/"],
                runtimeCaching: [{
                    urlPattern: /^$/,
                    handler: 'NetworkFirst',
                    options: {
                      cacheName: 'home'
                    },
                  }, {
                    urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                    handler: 'CacheFirst',
                    options: {
                      cacheName: 'ge-images',
                      expiration: {
                        maxEntries: 50,
                      },
                    },
                  }, {
                    urlPattern: /\.(?:js)$/,
                    handler: 'CacheFirst',
                    options: {
                      cacheName: 'ge-js',
                      expiration: {
                        maxEntries: 50,
                      },
                    },
                  }],
            }),
            new WebpackPwaManifest({
                filename: `manifest.v${envConfig.manifestVersion}.json`,
                name: 'Goodearth',
                short_name: 'Goodearth',
                description: '',
                start_url: '../',
                background_color: '#ffffff',
                theme_color: '#ffffff',
                crossorigin: 'use-credentials',
                icons: [
                  {
                    src: context + '/src/images/AppIcon.png',
                    sizes: [96, 128, 192, 256, 384, 512, 1024]
                  }
                ],
                inject: false,
                fingerprints: false,
                ios: true,
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
                    exclude: /server/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                babelrc: false,
                                presets: [
                                    "@babel/env",
                                    "@babel/preset-react",
                                ],
                                plugins: [
                                    "@loadable/babel-plugin",
                                    "@babel/proposal-class-properties",
                                    "@babel/proposal-object-rest-spread",
                                    "@babel/plugin-syntax-dynamic-import",
                                    "@babel/plugin-transform-runtime"
                                ],
                            }
                        },
                        {
                            loader: "ts-loader",
                            options: {
                                onlyCompileBundledFiles: true
                            }
                        }],
                },
                {
                    test: /\.css/,
                    loaders: [
                        MiniCssExtractPlugin.loader,
                        "css-loader"
                    ],
                    sideEffects: true
                },
                {
                    test: /\.scss/,
                    loaders: [
                        MiniCssExtractPlugin.loader,
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
                        name: `${fileNamePattern}.[ext]`,
                        outputPath: 'fonts',
                        publicPath: `${publicPath}fonts/`
                    }
                },
                {
                    test: /\.svg(\?.*)?$/,
                    issuer: {
                        test: /\.tsx?$/
                    },
                    use: ['@svgr/webpack']
                },
                {
                    test: /\.(jpg|svg|jpeg|png|gif)(\?.*)?$/,
                    loader: 'file-loader',
                    options: {
                        name: `${fileNamePattern}.[ext]`,
                        outputPath: 'images',
                        publicPath: `${publicPath}images/`
                    }
                },
            ]
        }
    },
    {
        mode: env,
        target: 'node',
        devtool: env === "production"? undefined : '#cheap-module-source-map',
        context: context,
        node: {
            __filename: false,
            __dirname: false,
        },
        optimization: {
            minimize: false
        },
        entry: {
            'server': './src/server/index.ts'
        },
        output: {
            path: context + '/dist/static/server',
            publicPath: publicPath,
            filename: `[name].js`,
        },
        resolve: {
            extensions: [".wasm", ".mjs", ".js", ".jsx", ".tsx", ".ts", ".json", ".scss", ".css",".svg",".jpg",".png"],
            alias
        },
        externals: [nodeExternals({
            whitelist: function(path){
                            return  /slick-carousel|rc-slider|rc-util/.test(path);
                        }
        })],
        plugins: [
            new webpack.DefinePlugin({
                __API_HOST__: apiDomain,
                __DOMAIN__: domain
            }),
            new MiniCssExtractPlugin({
                filename: `${fileNamePattern}.css`,
            }),
            new CopyWebpackPlugin([{
                from: path.join(__dirname, '..', 'src/server/templates'),
                to: path.join(__dirname, '..', 'dist/static/server/templates')
            }])
        ],
        module: {
            rules: [
                           
                {
                    test: /\.(ts|tsx)$/,
                    use: [ {
                        loader: "babel-loader",
                        options: {
                            babelrc: false,
                            presets: [
                                "@babel/env",
                                "@babel/preset-react",
                            ],
                            plugins: [
                                "@loadable/babel-plugin",
                                "@babel/proposal-class-properties",
                                "@babel/proposal-object-rest-spread",
                                "@babel/plugin-transform-runtime"
                            ],
                        }
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            onlyCompileBundledFiles: true
                        }
                    }]
                },
                {
                    test: /\.css/,
                    loaders: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                    ],
                    sideEffects: true
                },
                {
                    test: /\.scss/,
                    loaders: [
                        MiniCssExtractPlugin.loader,
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
                        name: `${fileNamePattern}.[ext]`,
                        outputPath: 'fonts',
                        publicPath: `${publicPath}fonts/`
                    }
                },
                {
                    test: /\.svg(\?.*)?$/,
                    issuer: {
                        test: /\.tsx?$/
                    },
                    use: ['@svgr/webpack']
                },
                {
                    test: /\.(jpg|svg|jpeg|png|gif)(\?.*)?$/,
                    loader: 'file-loader',
                    options: {
                        name: `${fileNamePattern}.[ext]`,
                        outputPath: 'images',
                        publicPath: `${publicPath}images/`
                    }
                },
            ]
        }
    }
]

module.exports = process.env.APP === "client" ? config[0]: (process.env.APP === "server" ? config[1]: config);