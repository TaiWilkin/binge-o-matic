import { gql } from "@apollo/client";

export default gql`
  {
    user {
      id
    }
    lists {
      id
      name
    }
  }
`;
