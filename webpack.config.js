/**
* Config file to load all the react loaders and to define the entry point for React.
**/


module.exports = {
  entry: __dirname + '/src/app/',
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
