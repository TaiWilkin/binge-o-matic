import gql from 'graphql-tag';

export default gql`
  mutation AddToList($id: ID, $title: String, $release_date: Date, $poster_path: String, $media_type: String, $list: ID){
    addToList(id: $id, title: $title, release_date: $release_date, poster_path: $poster_path, media_type: $media_type, list: $list) {
      id
      media { id }
    }
  }
`;
