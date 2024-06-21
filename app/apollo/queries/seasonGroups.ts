import gql from "graphql-tag";
import { SEASON_GROUP_FRAG } from "../fragments/SEASON_GROUP";

export const SEASON_GROUPS = gql`
  query seasonGroups($_id: String) {
    seasonGroups(_id: $_id) {
      ...SeasonGroupFragment
    }
  }
  ${SEASON_GROUP_FRAG}
`
