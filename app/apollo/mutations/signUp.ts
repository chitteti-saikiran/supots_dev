import gql from "graphql-tag";

export const SIGN_UP = gql`
  mutation signUp($user: UserCreateInput) {
    signUp(user: $user) {
      _id
      name
      username
      image
      id
      first_name
      last_name
      phone
      email
    }
  }
`
