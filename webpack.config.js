const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    open: false, 
    client: {
      overlay: true,
    },
  },
  entry: {
    index: path.resolve(__dirname, 'src/index.js'),

  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'To-do',
      // template: path.resolve(__dirname, 'src/index.html'),
      template: path.resolve(__dirname, 'src/index.html'),
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: '[name].bundle.js', 
    path: path.resolve(__dirname, 'dist'), 
    clean: true,
  }
}