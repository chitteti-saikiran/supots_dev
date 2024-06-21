import { gql } from "graphql-tag";

const MessageFragment = gql`
  fragment MessageFragment on Message{
    _id
    status
    date
    text
    system
    read_status
    createdAt
    user{
      _id
      image
      name
    }
    attachments{
      _id
      url
      name
      type
    }
  }
`

export const SEND_MESSAGE = gql`
  ${MessageFragment}
  mutation sendMessage($message: MessageInput) {
    sendMessage(message: $message){
      ...MessageFragment
    }
  }
`;

export const NEW_MESSAGE = gql`
    ${MessageFragment}
    subscription newMessage($_id:String){
      newMessage(_id:$_id){
        ...MessageFragment
      }
    }
`;


export const UPDATE_CHATS = gql`
    ${MessageFragment}
    subscription updateChats($_id:String){
      updateChats(_id:$_id){
        ...MessageFragment
      }
    }
`;

export const MESSAGES = gql`
  ${MessageFragment}
  query getMessages($_id: String, $limit: Int, $offset: Int){
    messages(_id: $_id, limit: $limit, offset: $offset){
      messages{
        ...MessageFragment
      }
      hasOlder
    }
  }
`
