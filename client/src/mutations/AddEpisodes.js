import gql from 'graphql-tag';

export default gql`
  mutation AddEpisodes($id: ID, $list: ID, $season_number: Int, $show_id: ID){
    addEpisodes(id: $id, list: $list, season_number: $season_number, show_id: $show_id) {
      id
      media {
        id
      }
    }
  }
`;
