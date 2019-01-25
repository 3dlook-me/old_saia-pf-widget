/* eslint import/no-dynamic-require: 0 */
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const cssnano = require('cssnano');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { NODE_ENV } = process.env;
const mode = (NODE_ENV && NODE_ENV.trim() === 'production') ? 'production' : 'development';

const configFileName = `./saia-config.${mode}`;
const config = require(configFileName);

/**
 * SCSS configs
 */
const sass = {
  loader: 'sass-loader',
};

const css = {
  loader: 'css-loader',
  options: {
    url: false,
  },
};

const style = {
  loader: 'style-loader',
};

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [
      autoprefixer('last 3 versions', 'ie 10'),
      cssnano(),
    ],
  },
};

/**
 * Webpack config
 */
module.exports = {
  mode,
  watch: mode === 'development',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },
  entry: {
    'saia-pf-widget': path.resolve(`${__dirname}/src/js/index.js`),
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['last 2 versions', 'safari >= 7'],
                  },
                }],
              ],
            },
          },
        ],
      },

      {
        test: /\.scss/,
        use: [style, css, postcss, sass],
      },

      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: mode === 'production',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      'node_modules',
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      API_HOST: JSON.stringify(config.API_HOST),
    }),
    new CopyWebpackPlugin([
      {
        from: './src/demo.html',
        to: './index.html',
        flatten: true,
      },
    ], {}),
  ],
  devtool: (mode === 'production') ? false : 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};