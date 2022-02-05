const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
console.log(path.resolve(__dirname, 'src/index.js'));
module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index.js'),
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    static: './dist',
    open: false,
    client: {
      overlay: true,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'To-do',
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