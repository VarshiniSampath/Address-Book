import React from 'react';
import Relay from 'react-relay';
import { Table } from './Table.jsx';
import { AppRoute } from '../routes/AppRoute.js';

export  default class App extends React.Component {
  render() {
    return (
      <Relay.RootContainer Component={ Table } route={ new AppRoute } />
    );
  }
}
