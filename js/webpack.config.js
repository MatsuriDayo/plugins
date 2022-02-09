
const path = require('path');

module.exports = {
  mode: 'production',
  target: ['browserslist'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'p.js',
    publicPath: './'
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.js$/, exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ],
            }
          }
        ]
      }
    ]
  }
}
