import gql from "graphql-tag";

export default gql`
  mutation EditList($name: String, $id: ID) {
    editList(name: $name, id: $id) {
      id
      name
    }
  }
`;
