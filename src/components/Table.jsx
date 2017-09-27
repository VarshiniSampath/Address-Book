import React from 'react';
import Relay, { graphql, createFragmentContainer } from 'react-relay';

class Table extends React.Component {
  constructor(props){
    super(props);
    console.log(props);
  }
  render() {
    return (
      <p>
        item: {this.props}
      </p>
    );
  }
};

export default Relay.createFragmentContainer(Table, graphql`
      fragment Table on Viewer {
        title
      }
    `,
);
