import gql from 'graphql-tag';

export const GET_ROLES = gql`
  query getRoles($_id: String) {
    getRoles(_id: $_id) {
      _id
      role
      content {
        _id
        type
        F {
          _id
          name
          image
        }
        T {
          _id
          name
          image
        }
        C {
          _id
          name
          image
        }
        I{
          _id
          name
          image
        }
        L{
          _id
          name
          image
        }
      }
    }
  }
`

const DOC_FRAG = gql`
  fragment DocFrag on Document {
    _id
    date
    commentType
    title
    description
    tags
    read
    file {
      _id
      name
      url
    }
    teams {
      _id
      name
      image
    }
    sport {
      _id
      image
      name
    }
  }
`;

export const GET_DOCS = gql`
  ${DOC_FRAG}
  query documents($_id: String, $type: String) {
    documents(_id: $_id, type: $type){
      ...DocFrag
    }
  }
`

export const CREATE_DOC = gql`
  mutation createDocument($doc: CreateDocInput) {
    ${DOC_FRAG}
    createDocument(doc: $doc){
      ...DocFrag
    }
  }
`

export const READ_DOC = gql`
  mutation readDocument($_id: String) {
    ${DOC_FRAG}
    readDocument(_id: $_id){
      ...DocFrag
    }
  }
`
