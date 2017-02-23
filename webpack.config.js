'use strict';

const webpack = require('webpack');
const env = process.env.NODE_ENV || 'production';
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const buildPath = path.resolve(__dirname, 'public', 'dist');
const assetsPath = path.resolve(__dirname, 'assets');

const babelOptions = env === 'production'
    ? {
        presets: [
            ["es2015", { modules: false }]
        ],
        // Old IE support
        plugins: [
            'transform-es3-member-expression-literals',
            'transform-es3-property-literals'
        ]
    }
    : {
        presets: [
            ["es2015", { modules: false }]
        ]
    };

module.exports = {
    entry: {
        'scripts/app': path.resolve(assetsPath, 'scripts', 'app.js'),
        'styles/app': path.resolve(assetsPath, 'styles', 'app.less')
    },
    output: {
        path: buildPath,
        filename: '[name].bundle.js',
        publicPath: '/dist/',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions
                }
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!less-loader'
                })
            },
            // the url-loader uses DataUrls.
            // the file-loader emits files.
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml'},
        ]
    },
    plugins: env !== 'production'
        ? [
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) }),
            new ExtractTextPlugin({
                filename: '[name].css',
                allChunks: true
            })
        ]
        : [
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    drop_console: true,
                    screw_ie8: false,
                    warnings: false
                },
                mangle: {
                    screw_ie8: false
                },
                output: {
                    screw_ie8: false,
                    keep_quoted_props: true
                }
            }),
            new ExtractTextPlugin({
                filename: '[name].css',
                allChunks: true
            })
        ],
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    }
};
