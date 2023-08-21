const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';
  const devServer = devMode
    ? {
        devtool: 'inline-source-map',
        devServer: {
          port: 8080,
          historyApiFallback: true,
          watchFiles: './src/index.html',
        },
      }
    : {};
  const esLintPlugin = devMode ? [] : [new ESLintPlugin({ extensions: ['ts', 'js'] })];
  const cssMinimizerPlugin = devMode
    ? {}
    : {
        optimization: {
          minimizer: [new CssMinimizerPlugin()],
        },
      };

  return {
    entry: {
      index: './src/index.ts',
    },
    output: {
      clean: true,
      filename: '[name].[contenthash].js',
      path: path.join(__dirname, 'dist'),
      assetModuleFilename: 'assets/[hash][ext]',
      publicPath: '/',
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
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
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
        filename: '[name].[contenthash].css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'netlify.toml'),
            to: path.resolve(__dirname, 'dist')
          }
        ]
      }),
      ...esLintPlugin,
    ],
    ...devServer,
    ...cssMinimizerPlugin,
  };
};
