import { gql } from "@apollo/client";

export default gql`
  query List($id: ID) {
    user {
      id
      __typename
    }
    list(id: $id) {
      id
      __typename
      name
      media {
        id
        media_id
        title
        release_date
        poster_path
        media_type
        number
        isWatched
        parent_show
        parent_season
        episode
        show_children
      }
      user
    }
  }
`;
