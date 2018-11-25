import gql from 'graphql-tag';

export default gql`
  mutation RemoveFromList($id: ID, $list: ID){
    removeFromList(id: $id, list: $list) {
      id
      media { id }
    }
  }
`;
