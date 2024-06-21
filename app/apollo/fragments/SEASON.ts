import gql from "graphql-tag";

export const SEASON_FRAG = gql`
  fragment SeasonFragment on Season {
    _id
    date
    league {
      _id
      name
      image
      sport {
        _id
        name
      }
    }
    legs
    name
    noOfTeams
    status
    teams {
      _id
    }
    type
    user {
      _id
      name
      image
    }
    isPast
    started
    hasGames
    finished
  }
`
