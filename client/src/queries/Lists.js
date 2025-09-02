import { gql } from "@apollo/client";

export default gql`
  query GetLists {
    lists {
      id
      name
      user
    }
  }
`;
