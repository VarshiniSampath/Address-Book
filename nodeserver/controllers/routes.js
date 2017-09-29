import express from 'express';
import graphQLHTTP from 'express-graphql';
import mongoose from 'mongoose';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Schema } from '../../data/schema';

const APP_PORT = 8000;
const GRAPHQL_PORT = 8080;
const MONGODB = process.env.MONGO || "mongodb://localhost:27017/publications";

// Expose a GraphQL endpoint
module.exports = (server) => {
  server.use('/', graphQLHTTP({
    schema: Schema,
    pretty: true
  }))
  .listen(GRAPHQL_PORT, () => { console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}` );
  });
};

// Serve the Relay app
const compiler = webpack({
  entry: path.resolve(__dirname, 'js', 'index.js'),
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
  output: {
    path: '/',
    filename: 'main.js'
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
  },
});
const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
  publicPath: '/src/',
  stats: {colors: true},
});

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
