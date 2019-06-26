const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './demo/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.scss?$/,
                loader: ['style-loader', 'css-loader', 'sass-loader', ]
            },
            {
                test: /\.svg$/,
                loader: ['@svgr/webpack', 'file-loader'],
            },
            {
                test: /\.(woff|woff2|ttf|eot|jpg|png|gif)$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "NODE_ENV": process.env.NODE_ENV
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'demo/index.html')
        })
    ]
}