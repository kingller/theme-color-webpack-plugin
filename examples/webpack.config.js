const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ThemeColorWebpackPlugin = require('../index');
const args = require('node-args');

const TARGET = `${__dirname}/dist`;

const ROOT_PATH = require('path').resolve(__dirname);

const mode = args.mode;
const port = 9200;

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
                exclude: /\/node_modules\//
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
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
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
            chunkFilename: '[name].[contenthash:8].css' // use contenthash *
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
                    new UglifyJsPlugin({
                        cache: true,
                        parallel: true,
                        sourceMap: true
                    }),
                    new OptimizeCSSAssetsPlugin({}) // use OptimizeCSSAssetsPlugin
                ]
            },
            plugins: [new CleanWebpackPlugin([TARGET])]
        });
        break;

    case 'development':
        config = merge(config, {
            plugins: [new OpenBrowserPlugin({ url: `http://localhost:${port}` })],
            devServer: {
                host: '0.0.0.0',
                port: port, //和package.json中配置的port作用一致
                contentBase: '../',
                hot: true,
                disableHostCheck: true
            },
            devtool: '#source-map'
        });
        break;
}

module.exports = config;
