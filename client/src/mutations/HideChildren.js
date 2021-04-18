import gql from "graphql-tag";

export default gql`
  mutation HideChildren($id: ID, $list: ID) {
    hideChildren(id: $id, list: $list) {
      id
    }
  }
`;
