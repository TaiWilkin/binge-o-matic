import { gql } from "@apollo/client";

export default gql`
  mutation ToggleWatched($id: ID, $isWatched: Boolean, $list: ID) {
    toggleWatched(id: $id, isWatched: $isWatched, list: $list) {
      id
    }
  }
`;
