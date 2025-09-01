import { gql } from "@apollo/client";

export default gql`
  mutation DeleteList($id: ID) {
    deleteList(id: $id) {
      id
    }
  }
`;
