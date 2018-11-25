import gql from 'graphql-tag';

export default gql`
  query Media($searchQuery: String!) {
    media(searchQuery: $searchQuery) {
      id
      title
      release_date
      poster_path
      media_type
      number
    }
  }
`;
