import { gql } from "@apollo/client";

export default gql`
  query GetLists {
    lists {
      id
      __typename
      name
      user
    }
  }
`;
