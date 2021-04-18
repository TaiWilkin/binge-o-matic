import gql from "graphql-tag";

export default gql`
  query List($id: ID) {
    user {
      id
    }
    list(id: $id) {
      id
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
