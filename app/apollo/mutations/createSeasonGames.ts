import gql from "graphql-tag";
import { SEASON_GROUP_GAME } from "../fragments/SEASON_GROUP_GAME";

export const CREATE_SEASON_GAMES = gql`
  mutation createSeasonGames($games: [SeasonGameInput], $seasonId: String) {
    createSeasonGames(games: $games, seasonId: $seasonId) {
      ...SeasonGroupGameFrag
    }
  }
  ${SEASON_GROUP_GAME}
`