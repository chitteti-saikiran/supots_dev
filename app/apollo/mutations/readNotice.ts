import gql from "graphql-tag";

export const READ_NOTICE = gql`
  mutation readNotice($_id: String) {
    readNotice(_id: $_id)
  }
`
