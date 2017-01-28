const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const options = {
    module: {
        loaders: [{
            test: /\.js(x|)$/,
            // loader: 'babel-loader',
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'es2016', 'stage-0', 'react', 'react-hmre']
            }
        }, {
            test: /\.json$/,
            loaders: ['json-loader']
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader'
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
        './src/render.jsx'
    ],
    target: 'electron-main',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/resource/index.html'),
            filename: 'index.html',
            inject: 'body'
        })
    ]
};

module.exports = options;