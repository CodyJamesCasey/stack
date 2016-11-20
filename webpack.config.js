const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  SRC: path.resolve(__dirname, 'src'),
  DIST: path.resolve(__dirname, 'dist'),
  VENDOR: path.resolve(__dirname, 'node_modules'),
}

const HTML_OPTS = {
  filename: 'index.html',
  title: 'Stack',
  inject: true,
  minify: { collapseWhitespace: false, },
  template: PATHS.SRC + '/template.html',
};

const common = {
  entry: {
    src: PATHS.SRC,
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: [
      PATHS.SRC,
      PATHS.VENDOR
    ],
  },
  output: {
    path: PATHS.DIST,
    filename: 'bundle.js'
  },
  plugins: [
    new ExtractTextPlugin('style.css', {
        allChunks: true,
    }),
    new HtmlWebpackPlugin(HTML_OPTS),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015', 'stage-0'],
          'env': {
            'development': {
              'presets': ['react-hmre']
            }
          }
        },
        include: PATHS.SRC,
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css-loader!sass-loader'),
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192',
      },
      {
        test: /\.(svg|mp3)$/,
        loader: 'file',
        include: PATHS.SRC
      },
      {
        test: /\.ttf(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url',
        query: {
          limit: 50000,
          mimetype: 'application/font-woff',
          name: './fonts/[hash].[ext]'
        }
      },
    ],
  },
};

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.DIST,

      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      stats: 'errors-only',

      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {});
}
