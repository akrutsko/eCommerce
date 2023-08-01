const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

const devServer = (isProduction) =>
  isProduction
    ? {}
    : {
        devtool: 'inline-source-map',
        devServer: {
          port: 8080,
          historyApiFallback: true,
        },
      };

const esLintPlugin = (isProduction) =>
  isProduction
    ? [
        new ESLintPlugin({
          extensions: ['ts', 'js'],
        }),
      ]
    : [];

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  const config = {
    entry: {
      index: './src/index.ts',
    },
    output: {
      clean: true,
      filename: '[name].[contenthash].js',
      path: path.join(__dirname, 'dist'),
      assetModuleFilename: 'assets/[hash][ext]',
    },
    resolve: {
      extensions: ['.ts', '.js', 'json', '...'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/i,
          use: 'ts-loader',
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.svg$/i,
          type: 'asset/source',
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: './src/assets/favicon.ico',
        minify: {
          html5: true,
          minifyCSS: true,
          minifyJS: true,
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      ...esLintPlugin(isProduction),
    ],
    ...devServer(isProduction),
  };

  return config;
};
