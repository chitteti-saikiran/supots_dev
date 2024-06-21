import gql from "graphql-tag";
import { RELATIONSHIP_FRAG } from "../fragments/RELATIONSHIP";

export const PENDING = gql`
  query pending($_id: String) {
    pending(_id: $_id) {
      ...RelationShipFrag
    }
  }
  ${RELATIONSHIP_FRAG}
`
