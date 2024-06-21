import gql from "graphql-tag";
import { AsyncPostUserFragment } from "~/components/GQL";

export const MediaFragment = gql`
  fragment MediaFragment on File{
    _id
		status
		date
		url
		name
    type
		object_type
		height
		width
		orientation
		user{
			...AsyncPostUserFragment
		}
		userTo{
			...AsyncPostUserFragment
		}
		tags{
			...AsyncPostUserFragment
		}
  }

  ${AsyncPostUserFragment}
`;
