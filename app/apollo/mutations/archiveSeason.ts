import gql from "graphql-tag";

export const ARCHIVE_SEASON = gql`
  mutation archiveSeason($_id: String, $value: Boolean) {
    archiveSeason(_id: $_id, value: $value)
  }
`