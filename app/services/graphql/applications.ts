import gql from "graphql-tag";

const APP_FRAG = gql`
  fragment AppFrag on Application {
    _id
    read
    date
    name
    surname
    address
    country
    email
    height
    number
    position
    postal
    state
    suburb
    weight
    comment
    userFrom {
      _id
      name
      image
    }
  }
`;

export const GET_APPS = gql`
  ${APP_FRAG}
  query applications($_id: String, $type: String) {
    applications(_id: $_id, type: $type){
      ...AppFrag
    }
  }
`

export const CREATE_APP = gql`
  mutation createApplication($app: ApplicationInput) {
    ${APP_FRAG}
    createApplication(app: $app){
      ...AppFrag
    }
  }
`
export const READ_APP = gql`
  mutation readApplication($_id: String) {
    ${APP_FRAG}
    readApplication(_id: $_id){
      ...AppFrag
    }
  }
`
