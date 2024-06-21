import { gql } from "graphql-tag";
import { MediaFragment } from './MediaFragment';

export const CommentsFragment = gql`
  ${MediaFragment}
  fragment CommentsFragment on Comment{
    _id
    user{
			...AsyncPostUserFragment
		}
    content
    rawContent
    owner{
			...AsyncPostUserFragment
		}
    userTo{
			...AsyncPostUserFragment
		}
    contentUsers{
			...AsyncPostUserFragment
		}
    replies{
      _id
      content
      rawContent
      user{
        ...AsyncPostUserFragment
      }
      owner{
        ...AsyncPostUserFragment
      }
      userTo{
        ...AsyncPostUserFragment
      }
      contentUsers{
        ...AsyncPostUserFragment
      }
      media {
        ...MediaFragment
      }
    }
    tag
    team{
      _id
      name
      image
    }
    media{
      ...MediaFragment
    }
  }
`;
