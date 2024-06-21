import gql from "graphql-tag";

export const ADD_TEAM_TO_SEASON = gql`
  mutation addTeamToSeasonGroup($teamID: String, $_id: String){
    addTeamToSeasonGroup(teamID: $teamID, _id: $_id) {
      _id
      team {
        name
        image
        _id
      }
    }
  }
`