import { gql } from "graphql-tag";
import { SEASON_FRAG } from "~/apollo/fragments/SEASON";
const FRAG_STR = `
_id
name
image
website
email
contactMain
color
isLiked
type
likes {
  _id
  user {
    _id
  }
}
followers {
  _id
  user {
    _id
  }
}
fans {
  _id
  user {
    _id
  }
}
socials {
  _id
  key
  value
  icon
  date
}
country
address
state
suburb
manager {
  name
  id
  _id
  image
}
sport {
  _id
  name
  image
}
about
type
level
roles {
  _id
  role
  user {
    _id
    name
    image
  }
}
establishMonth
establishYear
`
export const ALL_TOURNAMENTS = gql`
  query tournaments{
    tournaments{
      ${FRAG_STR}
    }
  }
`

export const TOURNAMENT = gql`
  query tournament($_id: String) {
    tournament(_id: $_id) {
      ${FRAG_STR}
    }
  }
`

export const SEASONS = gql`
  query seasons($_id: String){
    seasons(_id: $_id) {
      ...SeasonFragment
    }
  }
  ${SEASON_FRAG}
`
