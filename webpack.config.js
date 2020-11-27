const path = require('path')
const outputPath = path.resolve(__dirname, 'dist')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')

module.exports = (env, argv) => {
  const enabledSourceMap = argv.mode === 'development'

  return {
    mode: process.env.WEBPACK_ENV,
    entry: './src/js/index.js',
    output: {
      path: outputPath,
      filename: 'js/bundle.[contenthash].js',
    },

    module: {
      rules: [
        {
          test: /\.scss/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: enabledSourceMap,
                importLoaders: 2,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: enabledSourceMap,
              },
            },
          ],
        },
        {
          test: /\.css/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: enabledSourceMap,
                importLoaders: 2,
              },
            },
          ],
        },
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          loader: 'babel-loader',
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/app.[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'html', 'index.html'),
        filename: 'index.html',
        title: 'HOME',
      }),
      new CopyPlugin({
        patterns: [{ from: 'src/img', to: 'img' }],
      }),
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        pngquant: {
          quality: '65-80',
        },
        plugins: [
          imageminMozjpeg({
            quality: 85,
            progressive: true,
          }),
        ],
      }),
    ],
    devServer: {
      contentBase: __dirname + 'src/html',
    },
  }
}
