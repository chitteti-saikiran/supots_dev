import gql from "graphql-tag";

export const GET_SETTINGS = gql`
  query getSettings($_id: String) {
    getSettings(_id: $_id) {
      _id
      status
      date
      type
      key
      desc
      default
      user_id
      __typename
    }
  }
`
