import { gql } from "@apollo/client";

export default gql`
  {
    user {
      id
      email
      lists {
        id
        name
      }
    }
    lists {
      id
      name
    }
  }
`;
