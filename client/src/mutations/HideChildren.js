import { gql } from "@apollo/client";

export default gql`
  mutation HideChildren($id: ID, $list: ID) {
    hideChildren(id: $id, list: $list) {
      id
    }
  }
`;
