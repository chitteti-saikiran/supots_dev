import gql from "graphql-tag";
import { RELATIONSHIP_FRAG } from "../fragments/RELATIONSHIP";

export const FRIENDS = gql`
  query friends($_id: String) {
    friends(_id: $_id) {
      ...RelationShipFrag
    }
  }
  ${RELATIONSHIP_FRAG}
`
