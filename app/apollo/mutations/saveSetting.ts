import gql from "graphql-tag";

export const SAVE_SETTING = gql`
  mutation saveSetting($_id: String, $data: SettingInput) {
    saveSetting(_id: $_id, data: $data) {
      _id
      status
      date
      type
      key
      desc
      default
      user_id
      __typename
    }
  }
`
