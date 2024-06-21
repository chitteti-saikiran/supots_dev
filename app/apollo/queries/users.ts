import gql from "graphql-tag";

export const USERS = gql`
  query users{
    users{
      _id
      name
      image
    }
  }
`
