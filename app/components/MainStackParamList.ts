import { User } from "~/generated/graphql"
import { Profile } from "~/Screens/Profile"

export enum Route {
  Profile = 'profile',
  CreatePage = 'createPage'
}

export type MainStackParamList = {
  'home': {}
  [Route.Profile]: {
    user?: User
  },
  [Route.CreatePage]: {}
}
