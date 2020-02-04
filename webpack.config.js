const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',

  entry: {
    main: './src/js/main.js',
    kr: './src/js/main-kr.js',
    IE: './src/js/ie.js',
  },

  output: {
    path: __dirname + 'dist/js',
    filename: '[name].js',
  },

  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: false,
        extractComments: false,
        terserOptions: {
          mangle: true,
          output: {
            comments: false,
          },
        },
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
