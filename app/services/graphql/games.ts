import gql from 'graphql-tag';

export const GAME_POSTS = gql`
  query gamePosts($_id: String) {
    gamePosts(_id: $_id) {
      status
      date
      content
      min
      moment {
        key
        image
      }
      reaction {
        key
        icon
        iconType
        image
        background
        color
      }
      user {
        _id
        name
        image
      }
      player {
        _id
        name
        image
      }
      likes {
        _id
        type
      }
      comments {
        _id
        content
      }
    }
  }
`
