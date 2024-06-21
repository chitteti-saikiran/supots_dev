import gql from "graphql-tag";

export const SEASON_GAMES = gql`
  query seasonGames($_id: String) {
    seasonGames(_id: $_id) {
      _id
      game {
        _id
      }
    }
  }
`