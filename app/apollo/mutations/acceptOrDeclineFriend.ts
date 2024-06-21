import gql from "graphql-tag";

export const ACCEPT_DECLINE_FRIEND = gql`
  mutation acceptOrDeclineFriend($_id: String, $accepted: Boolean) {
    acceptOrDeclineFriend(_id: $_id, accepted: $accepted)
  }
`
