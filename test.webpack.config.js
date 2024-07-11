const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './tests/unitTest.js',
  output: {
    filename: 'test.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'node',
  mode: 'development',
  plugins: [
    new Dotenv({
      path: './.env.test'
    })
  ]
};
