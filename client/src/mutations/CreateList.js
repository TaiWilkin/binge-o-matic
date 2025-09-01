import { gql } from "@apollo/client";

export default gql`
  mutation CreateList($name: String) {
    createList(name: $name) {
      id
      name
    }
  }
`;
