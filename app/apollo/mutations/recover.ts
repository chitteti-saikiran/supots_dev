import gql from "graphql-tag";

export const RECOVER_PWD = gql`
  mutation recover($data: RecoveryInput) {
    recover(data: $data)
  }
`
