import gql from "graphql-tag";
import { SEASON_FRAG } from "../fragments/SEASON";

export const SEASON = gql`
  query season($_id: String) {
    season(_id: $_id) {
      ...SeasonFragment
    }
  }
  ${SEASON_FRAG}
`