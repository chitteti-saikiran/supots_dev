import { gql } from "graphql-tag";
import { MediaFragment } from './fragments/MediaFragment';

export const SESSIONS = gql`
  query sessions($_id: String, $type: String) {
    sessions(_id: $_id, type: $type) {
      _id
      status
      date
      timeAgo
      userTo {
        _id
        type
      }
      user {
        _id
        name
        image
      }
      type
      description
      name
      image {
        ...MediaFragment
      }
      files {
        _id
        likes {
          _id
        }
        user {
          _id
        }
        comments {
          _id
        }
      }
    }
  }

  ${MediaFragment}
`;
