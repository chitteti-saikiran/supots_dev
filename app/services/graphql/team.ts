import { gql } from "graphql-tag";

const TEAM = gql`
  query team($_id: String) {
    team(_id:$_id) {
      _id
      squads {
        current {
          _id
          name
          roles {
            _id
            user {
              _id
              name
              image
            }
            role
          }
          age
          entry
          gender
          year
        }
        past {
          _id
          name
          roles {
            _id
            user {
              _id
              name
              image
            }
            role
          }
          age
          entry
          gender
          year
        }
      }
    }
  }
`

export const LIKE_PAGE = gql`
  mutation likePage($data: LikePageData) {
    likePage(data: $data) {
      isLiked
    }
  }
`

export const FOLLOW_PAGE = gql`
  mutation followPage($data: LikePageData) {
    followPage(data: $data) {
      isLiked
    }
  }
`

export const FAN_PAGE = gql`
  mutation fanPage($data: LikePageData) {
    fanPage(data: $data) {
      isLiked
    }
  }
`

export const ADD_ROLE = gql`
  mutation addRole($role: RoleInput) {
    addRole(role: $role) {
      _id
    }
  }
`

export const UPDATE_ROLE = gql`
  mutation updateRole($role: String, $_id: String) {
    updateRole(role: $role, _id: $_id) {
      _id
    }
  }
`

export const REMOVE_ROLE = gql`
  mutation removeRole($_id: String) {
    removeRole(_id: $_id)
  }
`

export const ADD_SOCIAL = gql`
  mutation addSocial($toId: String, $toType: String, $social: SocialInput) {
    addSocial(toId: $toId, toType: $toType, social: $social) {
      _id
    }
  }
`

export const UPDATE_SOCIAL = gql`
  mutation updateSocial($_id: String, $social: SocialInput) {
    updateSocial(_id: $_id, social: $social) {
      _id
    }
  }
`

export const REMOVER_SOCIAL = gql`
  mutation removeSocial($_id: String) {
    removeSocial(_id: $_id)
  }
`

export const UPDATE_TBL_FIELD = gql`
  mutation updateProfileField($field: String, $value: String, $table: String, $_id: String) {
    updateProfileField(field: $field, value: $value, table: $table, _id: $_id)
  }
`

export const UPDATE_TBL_FIELDS = gql`
  mutation updateProfileFields($data: [UpdateDataInput], $table: String, $_id: String) {
    updateProfileFields(data: $data, table: $table, _id: $_id)
  }
`
export const ADD_TEAM = gql`
  mutation addTeam($data: PageAddData) {
    addTeam(data: $data)
  }
`

export const ADD_CLUB = gql`
  mutation addClub($data: PageAddData) {
    addClub(data: $data)
  }
`

export const ADD_TOURN = gql`
  mutation addTournament($data: PageAddData) {
    addTournament(data: $data)
  }
`

export const ADD_INSTITUTION = gql`
  mutation addInstitution($data: PageAddData) {
    addInstitution(data: $data)
  }
`

export const UPDATE_TEAM = gql`
  mutation updateTeam($data: PageAddData, $_id: String) {
    updateTeam(data: $data, _id: $_id)
  }
`
