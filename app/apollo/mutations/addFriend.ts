import gql from "graphql-tag";
import { RELATIONSHIP_FRAG } from "../fragments/RELATIONSHIP";

export const ADD_FRIEND = gql`
  mutation addFriend($from: String, $to: String) {
    addFriend(from: $from, to: $to) {
      ...RelationShipFrag
    }
  }
  ${RELATIONSHIP_FRAG}
`
