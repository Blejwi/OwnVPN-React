/* eslint-disable no-unused-vars */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const autoprefixer = require('autoprefixer');

const options = {
    module: {
        loaders: [{
            test: /\.js(x|)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'es2016', 'stage-0', 'react', 'react-hmre'],
            },
        }, {
            test: /\.json$/,
            loaders: ['json-loader'],
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader',
        }, {
            test: /\.scss$/,
            loaders: ['style-loader', 'css-loader', 'sass-loader'],
        }, {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader',
        }],
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
    },
    entry: [
        './src/render.jsx',
    ],
    devtool: 'inline-source-map',
    target: 'electron-main',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/resource/index.html'),
            filename: 'index.html',
            inject: 'body',
        }),
    ],
};

/**
 * PostCSS
 * Reference: https://github.com/postcss/autoprefixer-core
 * Add vendor prefixes to your css
 */
options.postcss = [
    autoprefixer({
        browsers: ['last 2 version'],
    }),
];

module.exports = options;
