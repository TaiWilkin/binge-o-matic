import gql from "graphql-tag";

export default gql`
  mutation CreateList($name: String) {
    createList(name: $name) {
      id
      name
    }
  }
`;
