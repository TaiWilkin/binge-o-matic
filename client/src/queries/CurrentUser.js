import { gql } from "@apollo/client";

export default gql`
  {
    user {
      id
      __typename
      email
    }
  }
`;
