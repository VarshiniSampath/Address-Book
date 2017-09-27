/**
* This file gets bundled and rendered by babel-loader and webpack to public/main.js
**/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

const ES6Promise = require("es6-promise");
ES6Promise.polyfill();
let jsonData = null;

// Renders Table component from App.jsx
ReactDOM.render(<App/>, document.getElementById('app'));
