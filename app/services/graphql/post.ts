import gql from "graphql-tag";

export const LIKE_POST = gql`
mutation likePost($likeData: LikeData){
  likePost(likeData: $likeData) {
    _id
  }
}
`

export const LIKE_COMMENT = gql`
mutation likeComment($likeData: LikeData){
  likeComment(likeData: $likeData) {
    _id
  }
}
`

export const VIEW_POST = gql`
mutation viewPost($likeData: LikeData){
  viewPost(likeData: $likeData) {
    _id
  }
}
`

export const LIKE_REPLY = gql`
mutation likeReply($likeData: LikeData){
  likeReply(likeData: $likeData) {
    _id
  }
}
`
