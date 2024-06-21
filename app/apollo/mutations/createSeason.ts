import gql from "graphql-tag";
import { SEASON_FRAG } from "../fragments/SEASON";

export const CREATE_SEASON = gql`
  mutation createSeason($data: SeasonInput) {
    createSeason(data: $data) {
      ...SeasonFragment
    }
  }
  ${SEASON_FRAG}
`
