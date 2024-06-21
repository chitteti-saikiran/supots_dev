import gql from "graphql-tag";

export const AUTH = gql`
  query auth($username: String!, $password: String!) {
    auth(username: $username, password: $password) {
      _id
      name
      username
      image
      first_name
      last_name
      phone
      email
    }
  }
`
