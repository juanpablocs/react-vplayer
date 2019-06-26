const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/VPlayer.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'VPlayer.js',
        library: 'VPlayer',
        libraryTarget:'umd'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    // devtool: 'source-map',
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
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "NODE_ENV": process.env.NODE_ENV
        })
    ],
    optimization:{
        minimize: true
    }
}