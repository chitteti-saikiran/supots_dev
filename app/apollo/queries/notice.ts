import gql from "graphql-tag";

export const NOTICE = gql`
  query notice($_id: String) {
    notices(_id: $_id) {
      _id
      date
      context {
        body
        title
        date
        status
        __typename
      }
      actionData {
        context
        contextId
        isBlock
        contextTarget {
          type
          _id
        }
      }
    }
  }
`
