const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const ThemeColorWebpackPlugin = require('theme-color-webpack-plugin');

const TARGET = `${__dirname}/dist`;

const ROOT_PATH = require('path').resolve(__dirname);

const port = 9200;

module.exports = function (env, args = {}) {
    const mode = args.mode;

    let config = {
        mode,
        entry: {},
        stats: 'errors-warnings',
        output: {
            path: TARGET,
            filename: '[name].[hash:8].js',
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: {
                        loader: 'babel-loader',
                    },
                    exclude: /\/node_modules\//,
                },
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                math: 'strict',
                                plugins: [
                                    new LessPluginAutoPrefix({
                                        browsers: ['ie >= 9', 'last 1 version'],
                                    }),
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
            ],
        },
        optimization: {
            runtimeChunk: {
                name: 'manifest',
            },
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                name: false,
                cacheGroups: {
                    vendor: {
                        name: 'vendor',
                        chunks: 'initial',
                        priority: -10,
                        reuseExistingChunk: false,
                        test: /node_modules\/(.*)\.js[x]?/,
                    },
                    styles: {
                        name: 'styles',
                        test: /\.(less|css)$/,
                        minChunks: 1,
                        reuseExistingChunk: true,
                        enforce: true,
                    },
                },
            },
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].css',
                chunkFilename: '[name].[contenthash:8].css', // use contenthash *
            }),
            new ThemeColorWebpackPlugin({
                stylesDir: path.join(__dirname, './src/styles'),
                varFile: path.join(__dirname, './src/styles/vars.less'),
                outputFilePath: path.join(__dirname, './dest/color.less'),
            }),
        ],
    };

    function addEntries() {
        let pages = require('./pages.js');
        pages.forEach(function (page) {
            config.entry[page.name] = [`${ROOT_PATH}/src/${page.name}.js`];
            let plugin = new HtmlWebpackPlugin({
                filename: `${page.name}.html`,
                template: `${ROOT_PATH}/template.ejs`,
                chunks: ['manifest', 'vendor', page.name],
                favicon: 'src/images/favicon.ico',
                name: page.name,
                title: page.title,
            });
            config.plugins.push(plugin);
        });
    }
    addEntries();

    switch (mode) {
        case 'production':
            config = merge(config, {
                optimization: {
                    minimizer: [
                        new TerserPlugin({
                            terserOptions: {
                                format: {
                                    comments: false,
                                },
                            },
                            extractComments: false,
                        }),
                        new CssMinimizerPlugin(),
                    ],
                },
                plugins: [new CleanWebpackPlugin([TARGET])],
            });
            break;

        case 'development':
            config = merge(config, {
                devServer: {
                    host: '0.0.0.0',
                    port: port,
                    open: true,
                    open: true,
                    hot: true,
                    proxy: {
                        '/index': { target: `http://localhost:${port}/`, pathRewrite: { $: '.html' } },
                    },
                },
                devtool: 'source-map',
            });
            break;
    }
    return config;
};
