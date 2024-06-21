import gql from "graphql-tag";

export const SEASON_GROUP_GAME = gql`
  fragment SeasonGroupGameFrag on SeasonGroupGame {
    _id
    status
    game {
      _id
    }
  }
`