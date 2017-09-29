import React from 'react';
import Relay, { graphql, createFragmentContainer } from 'react-relay';

class Table extends React.Component {
  constructor(props){
    super(props);
    console.log(props);
  }
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th> Author </th>
            <th> Title </th>
          </tr>
        </thead>
        <tbody><TableRow /></tbody>
      </table>
    );
  }
};

/**
 * Component for each row of the table. Holds details of each publication.
 **/
class TableRow extends React.Component {

  constructor(props: Object) {
    super(props);
    console.log(props);
  }

  render() {
    const {
      id,
      author,
      title,
    } = this.props;
    return (
      <tr key={id}>
        <td>{author}</td>
        <td className='title'>{title}</td>
      </tr>
    );
  }
};

export default Relay.createFragmentContainer(TableRow, graphql`
      fragment on papers {
        id
        title
        author
      }
    `,
);
