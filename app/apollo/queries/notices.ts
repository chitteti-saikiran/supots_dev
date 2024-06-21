import gql from "graphql-tag";
import { Clubs } from "~/Screens/Clubs";
import { Tournament } from "~/Screens/Tournament";

export const NOTICES = gql`
  query notices($_id: String, $type: String) {
    notices(_id: $_id, type: $type) { # F
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
