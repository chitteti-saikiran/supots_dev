import React, {createContext, useContext, ReactNode, useEffect, useState} from 'react';
import * as firebase from "nativescript-plugin-firebase";
import { Notice, NoticesQueryResult, NoticesQueryVariables, ReadNoticeMutationResult, ReadNoticeMutationVariables } from '~/generated/graphql';
import { useSupotsuMutation, useSupotsuQuery } from '~/utils/useSupotsuMutation';
import { NOTICES } from '~/apollo/queries/notices';
import { AppAuthContext } from '~/components/Root';
import { READ_NOTICE } from '~/apollo/mutations/readNotice';

interface NotificationContextData {
  message: firebase.Message;
  token: string;
  notices: Notice[],
  readNotice(_id: string): void
}

const NotificationContext = createContext({} as NotificationContextData);

export const NotificationProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const { user } = useContext(AppAuthContext)
  const [notices, setNotices] = useState<Notice[]>([])
  const [message, setMessage] = useState<firebase.Message>();
  const [token, setToken] = useState<string>();

  const [readNotification] = useSupotsuMutation<ReadNoticeMutationResult, ReadNoticeMutationVariables>(READ_NOTICE, {})

  const { fetchMore, refetch, client } = useSupotsuQuery<NoticesQueryResult, NoticesQueryVariables>(NOTICES, {
    variables: {
      _id: user._id,
      type: 'F'
    },
    onCompleted(data) {
       setNotices(data.notices)
    },
  })

  function readNotice(_id: string) {
    readNotification({
      variables: {
        _id
      },
      update() {
        console.log('fetch notices')
        client.query({
          query: NOTICES,
          variables: {
            _id: user._id,
            type: 'F'
          },
          fetchPolicy: 'network-only'
        }).then(({ data }) => {
          if (data.notices) {
            setNotices(data.notices)
          } else {
            console.log(data)
          }
        }).catch((e) => {
          console.log(e)
        })
      }
    })
  }
  useEffect(() => {
    firebase.addOnPushTokenReceivedCallback((token) => {
      setToken(token);
      console.log('NotificationContext: user token received ', token)
    });
    firebase.addOnMessageReceivedCallback((data: firebase.Message) => {
      setMessage(data);
      console.log('NotificationContext: message received ', data)
    });
  }, [firebase])


  return (
    <NotificationContext.Provider value={{
      message,
      token,
      notices,
      readNotice
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  return context;
}
