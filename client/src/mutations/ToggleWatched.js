import gql from "graphql-tag";

export default gql`
  mutation ToggleWatched($id: ID, $isWatched: Boolean, $list: ID) {
    toggleWatched(id: $id, isWatched: $isWatched, list: $list) {
      id
    }
  }
`;
