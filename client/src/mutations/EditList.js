import { gql } from "@apollo/client";

export default gql`
  mutation EditList($name: String, $id: ID) {
    editList(name: $name, id: $id) {
      id
      name
    }
  }
`;
