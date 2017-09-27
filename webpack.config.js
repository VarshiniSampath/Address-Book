/**
* Config file to load all the react loaders and to define the entry point for React.
**/


module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/public',
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets:['react','es2015', 'stage-0']
        }
      },
      {
        test:/\.css$/,
        loader:'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css']
  }
};
