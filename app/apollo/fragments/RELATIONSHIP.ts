import gql from "graphql-tag";

export const RELATIONSHIP_FRAG = gql`
  fragment RelationShipFrag on UserRelationship {
    _id
    status
    sender
    receiver
    users {
      _id
      name
      email
      image
    }
    user {
      _id
      name
      email
      image
    }
    me {
      _id
      name
      image
      email
    }
  }
`
