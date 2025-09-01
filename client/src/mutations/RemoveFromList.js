import { gql } from "@apollo/client";

export default gql`
  mutation RemoveFromList($id: ID, $list: ID) {
    removeFromList(id: $id, list: $list) {
      id
      media {
        id
      }
    }
  }
`;
