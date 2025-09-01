import { gql } from "@apollo/client";

export default gql`
  mutation AddSeasons($id: ID, $list: ID, $media_id: ID) {
    addSeasons(id: $id, list: $list, media_id: $media_id) {
      id
      media {
        id
      }
    }
  }
`;
