import gql from "graphql-tag";

export const GET_SETTING = gql`
  query getSetting($_id: String, $key: String) {
    getSetting(_id: $_id, key: $key) {
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
