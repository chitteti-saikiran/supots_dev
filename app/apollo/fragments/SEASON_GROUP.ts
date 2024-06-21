import gql from "graphql-tag";

export const SEASON_GROUP_FRAG = gql`
  fragment SeasonGroupFragment on SeasonGroup {
    _id
    legs
    noOfTeams
    teams {
      _id
      team {
        name
        image
        _id
      }
    }
  }
`
