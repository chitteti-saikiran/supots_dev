import gql from "graphql-tag";

export const REMOVE_TEAM_FROM_SEASON = gql`
  mutation removeTeamFromSeasonGroup($teamID: String, $_id: String, $group: String){
    removeTeamFromSeasonGroup(teamID: $teamID, _id: $_id, group: $group)
  }
`