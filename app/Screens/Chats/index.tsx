import * as React from 'react';
import { File, Color, TextField, Frame, PropertyChangeData, EventData, ScrollView, ScrollEventData, StackLayout } from '@nativescript/core';
import { screen } from '@nativescript/core/platform/platform';
import {
  useNavigation,
  useRoute
} from '@react-navigation/core';
import { Request, CompleteEventData, ErrorEventData, ProgressEventData, ResultEventData, Session, Task, session as uploadSession, session } from 'nativescript-background-http'
import { ListView as $ListView, ListView, NSVElement, RNSStyle } from 'react-nativescript';
import { ScreenProps, client } from '~/app';
import { CommonHeader, CameraRollFileType, Empty, LoadingState } from '~/ui/common.ui';
import { useState } from 'react';
import { PhotoSementItem } from '~/Screens/Photos';
import IconSet from '~/font-icons';
import * as ISupotsu from '~/DB/interfaces';
import Methods from '~/Methods';
import { AppAuthContext } from '~/components/Root';
import * as AppSettings from '@nativescript/core/application-settings';
import Theme, { Theme2 } from '~/Theme';
import { TextEditField } from '../Events';
import { SaveButton, getImgSrc } from '../Training';
import { openFilePicker } from '@nativescript-community/ui-document-picker';
import { UploadMeta } from '~/Screens/Events';
import * as dialogs from '@nativescript/core/ui/dialogs';
import strings from '~/utils/strings';
import { conversationCache, getConversationCache, useIsConversationDeleted, deleteConversation, chatMessagesCache, getMessagesCache } from '../../utils/index';
import { useFileUploads, FileUploaderProvider } from '~/services/File.uploads';
import { useSubscription, useQuery } from '@apollo/react-hooks';
import { MESSAGES, NEW_MESSAGE } from '~/services/graphql/messages';
import * as moment from 'moment';
import { UPDATE_CHATS, SEND_MESSAGE } from '../../services/graphql/messages';
import { UnionUser } from '~/utils/types';

type ChatsScreenTab = 'All' | 'Chats' | 'Groups' | 'Emails' | 'Parents' | 'Teams';
const ChatsScreenTabs: ChatsScreenTab[] = ['All', 'Chats', 'Groups', 'Emails'];

const ChatsScreenMiniTabs: ChatsScreenTab[] = ['All', 'Parents', 'Teams', 'Emails'];

interface ChatsScreenState {
  messages: ISupotsu.Conversation[];
  selectedMessages: ISupotsu.Conversation[];
  isLoading: boolean;
  uptime: number;
  emails: ISupotsu.EmailMessage[];
  selectedEmails: ISupotsu.EmailMessage[];
  isLoadingMails: boolean;
  filter: string;
}

const ChatsScreen = ({ navigation }: ScreenProps) => {
  const {
    user
  } = React.useContext(AppAuthContext)
  const deletedChats = useIsConversationDeleted();
  const { navigate, goBack, isFocused } = useNavigation()
  const [active, setActive] = useState<ChatsScreenTab>("All")
  const [state, updateState] = useState<ChatsScreenState>(() => {
    const _messages = AppSettings.getString('chats', '[]');
    const messages: ISupotsu.Conversation[] = JSON.parse(_messages);

    const _emails = AppSettings.getString('emails', '[]');
    const emails: ISupotsu.EmailMessage[] = JSON.parse(_emails);

    return {
      messages,
      isLoading: messages.length === 0,
      emails,
      isLoadingMails: emails.length === 0,
      uptime: Date.now(),
      selectedEmails: [],
      selectedMessages: [],
      filter: ''
    }
  });

  const setState = (newState: Partial<ChatsScreenState>, cb = () => { }) => {
    updateState({
      ...state,
      ...newState
    })
    if (cb) cb()
  }

  useSubscription(UPDATE_CHATS, {
    onSubscriptionData({subscriptionData}) {
      console.log('ChatsScreen', 'refresh', 'chats list')
      getData();
    },
    variables: {
      _id: user._id
    }
  })

  React.useEffect(() => {
    if (!isFocused) return;
    console.log('CHAT:FOCUS')
    getData();
    getEmails();
  }, [isFocused])

  const getData = () => {
    Methods.post(`https://supotsu.com/api/message/all`, {}, {
      headers: {
        "Content-Type": "application/json"
      },
      success(res) {
        (res as ISupotsu.Conversation[]).forEach((item) => conversationCache(item._id, item))
        res.sort((a, b) => {
          const aDate = !a.last_message ? new Date() : new Date(a.last_message.createdAt);
          const bDate = !b.last_message ? new Date() : new Date(b.last_message.createdAt);

          return bDate.getTime() > aDate.getTime();
        });
        AppSettings.setString('chats', JSON.stringify(res));
        setState({
          messages: res,
          isLoading: false,
          uptime: Date.now()
        });
      },
      error(err) {
        setState({
          isLoading: false
        });
      }
    })
  }

  const getEmails = () => {
    Methods.post(`https://supotsu.com/api/message/all_mails`, {}, {
      headers: {
        "Content-Type": "application/json"
      },
      success(res) {
        res.sort((a, b) => {
          const aDate = !a.createdAt ? new Date() : new Date(a.createdAt);
          const bDate = !b.createdAt ? new Date() : new Date(b.createdAt);

          return bDate.getTime() > aDate.getTime();
        });

        AppSettings.setString('emails', JSON.stringify(res))

        setState({
          emails: res,
          isLoadingMails: false,
        });
      },
      error(err) {
        setState({
          isLoadingMails: false
        });
      }
    })
  }

  const icons = state.selectedMessages.length > 0 ? [
    {
      icon: 'delete',
      className: 'MaterialIcons',
      size: 10,
      onPress() {
        dialogs.confirm(`Are you sure you want to delete all ${state.selectedMessages.length} chats?`).then((yes) => {
          if (yes) {

          }
        }).catch((err) => {
          console.log(err);
        })
      }
    }
  ] : state.selectedEmails.length > 0 ? [
    {
      icon: 'delete',
      className: 'MaterialIcons',
      size: 10,
      onPress() {
        dialogs.confirm(`Are you sure you want to delete all ${state.selectedEmails.length} emails?`).then((yes) => {
          if (yes) {

          }
        }).catch((err) => {
          console.log(err);
        })
      }
    }
  ] : [
    {
      icon: 'new-message',
      className: 'Entypo',
      size: 10,
      onPress() {
        if (active === 'Emails') {
          navigate(CreateEmail.routeName);
        } else if(active === 'Chats') {
          navigate(CreateChat.routeName);
        } else {
          navigate(CreateGroup.routeName, {
            type: 'Normal',
            isTeam: false
          });
        }
      }
    }
  ]


  const chats = React.useMemo(() => {
    return state.messages.filter((a) => {
      const userOf = getChatUser(a);
      return !deletedChats.includes(a._id) && userOf.name.toLowerCase().indexOf(state.filter.toLowerCase()) !== -1;
    })
  }, [state.filter, state.messages, deletedChats])

  return (
    <gridLayout rows="auto, auto, auto, *" background="#fff">
      <CommonHeader goBack={goBack} user={{
        name: "Chats"
      }} icons={icons} />
      <gridLayout row={1} marginBottom={16} columns="*, * ,*, *">
        {ChatsScreenTabs.map((item, i) => {
          return (
            <PhotoSementItem key={item} onSelect={() => {
              setActive(item)
            }} active={Boolean(active === item)} col={i} item={item} />
          )
        })}
      </gridLayout>
      <gridLayout row={2} columns="auto, *" margin="0 16 16" padding={"4 16"} borderRadius={8} background="#eee">
        <label className="Ionicons size18" verticalAlignment="middle" horizontalAlignment="center">{IconSet.Ionicons['md-search']}</label>
        <textField col={1} onTextChange={({value}) => {
          setState({
            filter: value
          })
        }} margin={"0 8"} background='#eee' hint="Search for a chat" borderColor="transparent" />
      </gridLayout>
      <ListView
        items={chats.sort((a, b) => {
          const aDate = new Date(a.last_message ? a.last_message.createdAt : a.date);
          const bDate = new Date(b.last_message ? b.last_message.createdAt : b.date);
          return (aDate.getTime() < bDate.getTime()) ? 1 : -1
        }).filter((item) => {
          if (active === 'Chats') {
            return !item.isGroup;
          } else if (active === 'Groups') {
            return item.isGroup;
          }
          return true;
        })}
        visibility={active === 'Emails' ? 'hidden' : 'visible'}
        row={3}
        cellFactory={(item: ISupotsu.Conversation)=>{
          const isSelected = state.selectedMessages.find((a) => a._id === item._id);
          const cb = () => {
            if (isSelected) {
              setState({
                selectedMessages: state.selectedMessages.filter((a) => a._id !== item._id)
              })
            } else {
              setState({
                selectedMessages: [...state.selectedMessages, item]
              })
            }
          }
          return (
            <ChatItem isSelected={isSelected ? true : false} onLongPress={() => cb()} item={item} openChat={() => {
              if (state.selectedMessages.length > 0) {
                cb();
                return;
              }
              navigate(ChatScreen.routeName, {
                item: getConversationCache(item._id, item)
              });
            }} />
          )
        }}
      />
      <ListView
        items={state.emails.filter((a) => {
          return a.body.toLowerCase().indexOf(state.filter.toLowerCase()) > -1 || a.user.name.toLowerCase().indexOf(state.filter.toLowerCase()) > -1
        }).sort((a, b) => {
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);
          return (aDate.getTime() < bDate.getTime()) ? 1 : -1
        })}
        visibility={active !== 'Emails' ? 'hidden' : 'visible'}
        row={3}
        cellFactory={(item: ISupotsu.EmailMessage)=>{
          const isSelected = state.selectedEmails.find((a) => a._id === item._id);
          const cb = () => {
            if (isSelected) {
              setState({
                selectedEmails: state.selectedEmails.filter((a) => a._id !== item._id)
              })
            } else {
              setState({
                selectedEmails: [...state.selectedEmails, item]
              })
            }
          }
          return (
            <EmailItem isSelected={isSelected ? true : false} onLongPress={() => cb()} item={item} openEmail={() => {
              if (state.selectedEmails.length > 0) {
                cb();
                return;
              }
              navigate(EmailScreen.routeName, {
                item
              });
            }} />
          )
        }}
      />
    </gridLayout>
  )
}

ChatsScreen.routeName = 'chats'

interface ChatScreenMiniProps {
  user: UnionUser;
  row?: number;
  isShown?: boolean;
  query: Record<string, any>;
  emailsQuery: Record<string, any>
}

export const ChatScreenMini = ({
  user,
  isShown,
  row,
  query,
  emailsQuery
}: ChatScreenMiniProps) => {

  const { navigate, isFocused } = useNavigation()

  const deletedChats = useIsConversationDeleted();

  const [active, setActive] = useState<ChatsScreenTab>("All")

  const [state, updateState] = useState<ChatsScreenState>(() => {
    const _messages = AppSettings.getString(`chats-dash-${user._id}`, '[]');
    const messages: ISupotsu.Conversation[] = JSON.parse(_messages);

    const _emails = AppSettings.getString(`emails-dash-${user._id}`, '[]');
    const emails: ISupotsu.EmailMessage[] = JSON.parse(_emails);

    return {
      messages,
      isLoading: messages.length === 0,
      emails,
      isLoadingMails: emails.length === 0,
      uptime: Date.now(),
      selectedEmails: [],
      selectedMessages: [],
      filter: ''
    }
  });

  const setState = (newState: Partial<ChatsScreenState>, cb = () => { }) => {
    updateState({
      ...state,
      ...newState
    })
    if (cb) cb()
  }


  React.useEffect(() => {
    if (!isFocused) return;
    console.log('CHAT:DASHBOARD:FOCUS')
    getData();
    getEmails();
  }, [isFocused])

  const getData = () => {
    Methods.post(`https://supotsu.com/api/message/all`, {
      query
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      success(res) {
        (res as ISupotsu.Conversation[]).forEach((item) => conversationCache(item._id, item))
        res.sort((a, b) => {
          const aDate = new Date(a.last_message ? a.last_message.createdAt : a.date);
          const bDate = new Date(b.last_message ? b.last_message.createdAt : b.date);

          return bDate.getTime() > aDate.getTime();
        });
        AppSettings.setString(`chats-dash-${user._id}`, JSON.stringify(res));
        setState({
          messages: res,
          isLoading: false,
          uptime: Date.now()
        });
      },
      error(err) {
        setState({
          isLoading: false
        });
      }
    })
  }

  const getEmails = () => {
    Methods.post(`https://supotsu.com/api/message/all_mails`, {
      query: emailsQuery
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      success(res) {
        res.sort((a, b) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);

          return bDate.getTime() > aDate.getTime();
        });

        AppSettings.setString(`emails-dash-${user._id}`, JSON.stringify(res))

        setState({
          emails: res,
          isLoadingMails: false,
        });
      },
      error(err) {
        setState({
          isLoadingMails: false
        });
      }
    })
  }

  const createNewChat = () => {
    if (active === 'Emails') {
      navigate(CreateEmail.routeName);
    } else if(active === 'Chats') {
      navigate(CreateChat.routeName);
    } else if(active === 'Parents') {
      navigate(CreateGroup.routeName, {
        type: 'Normal',
        isTeam: false,
        team: user
      });
    } else {
      navigate(CreateGroup.routeName, {
        type: 'Normal',
        isTeam: true,
        team: user
      });
    }
  }

  const chats = React.useMemo(() => {
    return state.messages.filter((a) => {
      const userOf = getChatUser(a);
      return !deletedChats.includes(a._id) && userOf.name.toLowerCase().indexOf(state.filter.toLowerCase()) !== -1;
    }).filter((item) => {
      if (active === 'Chats') {
        return !item.isGroup && !item.isPage;
      } else if (active === 'Parents') {
        return item.isGroup && !item.isPage;
      } else if (active === 'Teams') {
        return item.isPage;
      }
      return true;
    })
  }, [state.filter, state.messages, deletedChats, active])

  const emails = React.useMemo(() => {
    return state.emails.filter((a) => {
      return a.body.toLowerCase().indexOf(state.filter.toLowerCase()) > -1 || a.user.name.toLowerCase().indexOf(state.filter.toLowerCase()) > -1
    }).sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return (aDate.getTime() < bDate.getTime()) ? 1 : -1
    })
  }, [state.filter, state.emails])

  const isEmailView = active === 'Emails';

  return (
    <gridLayout rows="auto, auto, *"  {...row ? { row } : {}} visibility={isShown ? 'visible' : 'collapse'} background="#fff">
      <gridLayout row={0} marginBottom={16} columns="*, * ,*, *">
        {ChatsScreenMiniTabs.map((item, i) => {
          return (
            <PhotoSementItem key={item} onSelect={() => {
              setActive(item)
            }} active={Boolean(active === item)} col={i} item={item} />
          )
        })}
      </gridLayout>
      <gridLayout row={1} columns="auto, *, auto, 8, auto" margin="0 16 16" padding={"4 8"} borderRadius={8} background="#eee">
        <label col={0} className="Ionicons size26" verticalAlignment="middle" horizontalAlignment="center">{IconSet.Ionicons['md-search']}</label>
        <textField col={1} onTextChange={({value}) => {
          setState({
            filter: value
          })
        }} margin={"0 8"} hint="Search for a chat" borderColor="transparent" />
        <stackLayout col={2} width={1} marginRight={8} background="#ddd" />
        <label col={4} marginRight={4} onTap={createNewChat} className="Ionicons size26" verticalAlignment="middle" horizontalAlignment="center">{IconSet.Ionicons['md-create']}</label>
      </gridLayout>
      {!isEmailView && (
        <>
          <ListView
            items={chats.sort((a, b) => {
              const aDate = new Date(a.last_message ? a.last_message.createdAt : a.date);
              const bDate = new Date(b.last_message ? b.last_message.createdAt : b.date);
              return (aDate.getTime() < bDate.getTime()) ? 1 : -1
            })}
            visibility={state.isLoading && chats.length > 0 ? 'hidden' : 'visible'}
            row={2}
            cellFactory={(item: ISupotsu.Conversation) => {
              const isSelected = state.selectedMessages.find((a) => a._id === item._id);
              const cb = () => {
                if (isSelected) {
                  setState({
                    selectedMessages: state.selectedMessages.filter((a) => a._id !== item._id)
                  })
                } else {
                  setState({
                    selectedMessages: [...state.selectedMessages, item]
                  })
                }
              }
              return (
                <ChatItem isSelected={isSelected ? true : false} onLongPress={() => cb()} item={item} openChat={() => {
                  if (state.selectedMessages.length > 0) {
                    cb();
                    return;
                  }
                  navigate(ChatScreen.routeName, {
                    item: getConversationCache(item._id, item)
                  });
                }} />
              )
            }}
          />
          <flexboxLayout justifyContent="center" alignItems="center" visibility={state.isLoading && chats.length === 0 ? "visible" : "collapse"} row={2}>
            <LoadingState />
          </flexboxLayout>
          <flexboxLayout justifyContent="center" alignItems="center" visibility={!state.isLoading && chats.length === 0 ? "visible" : "collapse"} row={2}>
            <Empty />
          </flexboxLayout>
        </>
      )}
      {isEmailView && (
        <>
          <ListView
            items={emails}
            visibility={!state.isLoadingMails && emails.length > 0 ? 'hidden' : 'visible'}
            row={2}
            cellFactory={(item: ISupotsu.EmailMessage) => {
              const isSelected = state.selectedEmails.find((a) => a._id === item._id);
              const cb = () => {
                if (isSelected) {
                  setState({
                    selectedEmails: state.selectedEmails.filter((a) => a._id !== item._id)
                  })
                } else {
                  setState({
                    selectedEmails: [...state.selectedEmails, item]
                  })
                }
              }
              return (
                <EmailItem isSelected={isSelected ? true : false} onLongPress={() => cb()} item={item} openEmail={() => {
                  if (state.selectedEmails.length > 0) {
                    cb();
                    return;
                  }
                  navigate(EmailScreen.routeName, {
                    item
                  });
                }} />
              )
            }}
          />
          <flexboxLayout justifyContent="center" alignItems="center" visibility={state.isLoadingMails ? "visible" : "collapse"} row={2}>
            <LoadingState />
          </flexboxLayout>
          <flexboxLayout justifyContent="center" alignItems="center" visibility={!state.isLoadingMails && emails.length === 0 ? "visible" : "collapse"} row={2}>
            <Empty />
          </flexboxLayout>
        </>
      )}
    </gridLayout>
  )
}

interface ChatUser {
  name: string;
  _id: string;
  image: string
}

const getChatUser = (item: ISupotsu.Conversation): ChatUser => {
  const { group, user, creator, userTo } = item;
  let chatUser: ChatUser;
  const userOne = Methods.getUser(user);
  const userTwo = Methods.getUser(userTo);
  if (group && group.file) {
    const ext = group.file ? group.file.name.split('.')[1] : 'webp';
    const src = getImgSrc(group.file);
    chatUser = {
      name: group.name,
      _id: group._id,
      image: src.replace('webp', ext)
    };
  } else if (group) {
    chatUser = {
      name: group.name,
      _id: group._id,
      image: group.creator.image
    };
  } else if(userOne._id === Methods.you()._id) {
    chatUser = {
      _id: userTwo._id,
      image: userTwo.image,
      name: userTwo.name
    }
  } else if (userTwo._id === Methods.you()._id) {
    chatUser = {
      _id: userOne._id || creator._id,
      image: userOne.image || creator.image,
      name: userOne.name || creator.name
    }
  } else {
    chatUser = {
      _id: userOne._id || creator._id,
      image: userOne.image || creator.image,
      name: userOne.name || creator.name
    };
  }

  return {
    ...chatUser,
    image: chatUser.image.replace('.svg', '.png')
  }
};

interface ChatItemProps {
  item: ISupotsu.Conversation;
  openChat(): void;
  onLongPress(): void;
  isSelected: boolean;
}

const ChatItem = ({
  item,
  openChat,
  isSelected,
  onLongPress
}: ChatItemProps) => {
  const chatUser = getChatUser(item)
  return (
    <gridLayout padding="16" onLongPress={onLongPress} onTap={openChat} columns="40, *, auto">
      <flexboxLayout col={0} height={40} background="#000" borderRadius={20} width={40} alignItems="flex-start" justifyContent="center">
        <image src={chatUser.image} style={{
          height: 40,
          width: 40,
          borderRadius: 20,
          borderColor: Theme2[500],
          borderWidth: isSelected ? 1 : 0
        }} stretch="fill" loadMode="async" />
      </flexboxLayout>
      <stackLayout padding={0} col={1} color={isSelected || (item.last_message && item.last_message.read_status === 'unread') ? Theme2[500] : '#000'}>
        <label className="size16" margin={0} padding="0 8">{chatUser ? chatUser.name : 'Name'}</label>
        <label margin={0} className="size12" padding="0 8">{item.last_message? item.last_message.text : 'New chaat'}</label>
      </stackLayout>
    </gridLayout>
  )
}

type SectionedMessaged = Record<string, ISupotsu.Message[]>

const getSectionedMessages = (messages: ISupotsu.Message[]) => {
  const data: SectionedMessaged = {};
  const dates: string[] = [];
  messages.sort((a, b) => {
    const aDate = parseInt(a.createdAt);
    const bDate = parseInt(b.createdAt);
    return aDate - bDate;
  }).forEach((message) => {
    const _str = Methods.moment(parseInt(message.createdAt)).calendar();
    if (dates.includes(_str)) {
      if (!data[_str]) {
        data[_str] = [message];
      } else {
        data[_str] = [...data[_str], message]
      }
    } else {
      dates.push(_str);
      if (!data[_str]) {
        data[_str] = [message];
      } else {
        data[_str] = [...data[_str], message]
      }
    }
  });

  return data;
}

export const ChatScreen = () => {
  const {
    user: me
  } = React.useContext(AppAuthContext)

  const router = useNavigation()

  const route = useRoute();

  const [offset, setOffset] = React.useState(1);

  const [hasOlder, setHasOlder] = React.useState(false);

  const scrollRef = React.useRef<ScrollView>(null)

  const {item: initConvo, isNew = false, otherUser} = route.params as {item: ISupotsu.Conversation, isNew?: boolean, otherUser?: ISupotsu.User}

  const [msgs, setMsgs] = React.useState<ISupotsu.Message[]>(getMessagesCache(initConvo));

  const [item, setItem] = React.useState<ISupotsu.Conversation>(() => {
    return initConvo
  })

  const { fetchMore, loading, data: dataForMessages } = useQuery(MESSAGES, {
    variables: {
      _id: initConvo._id,
      limit: 20,
      offset: 1
    },
    onCompleted(data) {
      const {messages = [], hasOlder} = data.messages;
      setMsgs(messages);
      chatMessagesCache(initConvo._id, messages);
      setHasOlder(hasOlder);
      console.log('ChatScreen', 'fetched', messages, hasOlder);
      if (scrollRef.current) {
        scrollRef.current.scrollToVerticalOffset(scrollRef.current.scrollableHeight, true)
      }
    },
    fetchPolicy: 'network-only',
    partialRefetch: true,
    notifyOnNetworkStatusChange: true
  })

  useSubscription(NEW_MESSAGE, {
    variables: {
      _id: item._id
    },
    onSubscriptionData({client, subscriptionData}) {
      const {newMessage} = subscriptionData.data;
      const message_ids = msgs.map((m) => m._id);
      console.log('ChatScreen', 'refreshed', subscriptionData, newMessage);
      if (newMessage && !message_ids.includes(newMessage._id)){
        const newMessages = msgs;
        if (newMessage.user._id !== me._id) {
          newMessages.push(newMessage);
          setMsgs([...newMessages]);
          console.log('ChatScreen', 'new messages 0', newMessages.reverse());
          chatMessagesCache(initConvo._id, newMessages);
        }
      } else {
        console.log('message exists')
      }
    },
    onSubscriptionComplete(){
      console.log('ChatScreen', 'complete')
    },
    fetchPolicy: 'network-only'
  })

  const data = React.useMemo(() => getSectionedMessages(msgs), [msgs]);
  console.log(dataForMessages?.messages)

  const chatUser = isNew ? otherUser : getChatUser(item);
  const composerUser = item.isGroup && item.group ? item.group : item.isGroup && !item.group ? item.creator: Methods.getUser(item.userTo);

  React.useEffect(() => {
    router.addListener('focus', () => {
      setItem(getConversationCache(item._id, item))
      console.log('CONVO:FOCUS', item._id);
      if (scrollRef.current) {
        const current = scrollRef.current.verticalOffset;
        if (current === 0) {
          scrollRef.current.scrollToVerticalOffset(scrollRef.current.scrollableHeight, true)
        }
      }
    })

    return () => {
      router.removeListener('focus', () => {
        conversationCache(item._id, item);
      })
    }
  }, [router.isFocused]);

  return(
    <gridLayout rows={'auto, *, auto, auto'} backgroundColor="#fff">
      <CommonHeader subTitle={item.group && item.group.desc ? item.group.desc : undefined} goBack={() => router.goBack()} user={chatUser} icons={[
        {
          icon: 'info',
          className: 'Entypo',
          size: 9,
          onPress() {
            router.navigate(ChatDetails.routeName, {
              item: getConversationCache(item._id, item),
              otherUser,
              isNew
            })
          }
        }
      ]} />
      <scrollView onScroll={(args: ScrollEventData) => {
        const {scrollY} = args;
        if (scrollY === 0) {
          const variables = {
            _id: initConvo._id,
            limit: 20,
            offset: offset + 1
          };
          // fetchMore({
          //   variables
          // })
        }
      }} onLoaded={(args: EventData) => {
          const view = args.object as ScrollView;
          scrollRef.current = view;
          view.scrollToVerticalOffset(view.scrollableHeight, true)
        }} row={1}>
        <stackLayout padding={8}>
          {Object.keys(data).length > 0 && Object.keys(data).map((key, index) => {
            return (
              <>
                <gridLayout margin={16} columns="*, auto, *">
                  <stackLayout col={0} />
                  <stackLayout col={2} />
                  <label padding={4} borderColor="#ddd" borderWidth={1} borderRadius={4} col={1} color="#555" fontSize={9} textTransform="uppercase">{key}</label>
                </gridLayout>
                {data[key].map((msg) => {
                  const isPrevChatMine = /*hasPrev && (msgs[index - 1] && msgs[index - 1].user && msgs[index - 1].user._id === me._id) ? true : !hasPrev ? false : true*/ false;
                  const isNextChatMine = /*hasNext && msgs[index + 1] && msgs[index + 1].user && msgs[index + 1].user._id === me._id ? true : */ false;

                  return <ChatScreenItem prev={msgs[index - 1] || msg} next={msgs[index + 1] || msg} isNextChatMine={isNextChatMine} isPrevChatMine={isPrevChatMine} item={msg} key={msg._id} />
                })}
              </>
            )
          })}
          {!loading && Object.keys(data).length < 1 && (
            <Empty text="No messages found.." />
          )}
          {loading && Object.keys(data).length < 1 && (
            <LoadingState text="Loading chat..." />
          )}
        </stackLayout>
      </scrollView>
      <FileUploaderProvider _id={item._id}>
        <ChatComposer conversation={item} user={composerUser} onSendDone={(c) => {
          const lastMsg = c.messages[c.messages.length - 1];
          setMsgs([...msgs, lastMsg]);
          scrollRef.current.scrollToVerticalOffset(scrollRef.current.scrollableHeight, true)
          conversationCache(c._id, c);
        }} onNewMessage={(newMessage) => {
          const message_ids = msgs.map((m) => m._id)
          if (newMessage && !message_ids.includes(newMessage._id)){
            if (newMessage.user._id === me._id && scrollRef.current) {
              const newMessages = msgs;
              newMessages.push(newMessage);
              setMsgs([...newMessages]);
              console.log('ChatScreen', 'new messages 1', newMessages.reverse());
              chatMessagesCache(initConvo._id, newMessages);
              scrollRef.current.scrollToVerticalOffset(scrollRef.current.scrollableHeight, true);
            }
          } else {
            console.log('message exists')
          }
        }} />
      </FileUploaderProvider>
    </gridLayout>
  )
}

ChatScreen.routeName = 'chatScreen';

type ChatDetailsTab = 'Members' | 'Media' | 'Settings' | 'Info';

interface ChatDetailsGroupState {
  group: ISupotsu.GroupChat
  errors: {
    name: boolean
    desc: boolean
    file: boolean
  }
}

export const ChatDetails = () => {
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const router = useNavigation()
  const route = useRoute();
  const { item, isNew = false, otherUser } = route.params as { item: ISupotsu.Conversation, isNew?: boolean, otherUser?: ISupotsu.User }
  const [msgs, setMsgs] = React.useState<ISupotsu.Message[]>(() => {
    return item.messages;
  })
  const [state, updateState] = React.useState<ChatDetailsGroupState>(() => {
    return {
      group: {
        ...item.group,
        desc: item.group ? item.group.desc : ""
      },
      errors: {
        name: false,
        desc: false,
        file: false
      }
    }
  })
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [isAddingMembers, setIsAddingMembers] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [active, setActive] = React.useState<ChatDetailsTab>(item.isGroup ? 'Members' : 'Info');
  const taskRef = React.useRef<Task>(null)

  const [uploadMeta, setUploadMeta] = React.useState<UploadMeta>({
    progress: 0,
    total: 0
  })
  const chatUser = isNew ? otherUser : getChatUser(item);
  const user = item.isGroup && item.group ? item.group : item.isGroup && !item.group ? item.creator: Methods.getUser(item.userTo);
  const getMedia = (messages = []) => {
    const files = [];
    messages.forEach((item, i) => {
      if (item.image) {
        files.push({
          isPhoto: true,
          url: item.image
        });
      } else if (item.video) {
        files.push({
          isPhoto: false,
          url: item.video
        });
      }
    })

    return files;
  }

  const { widthPixels } = screen.mainScreen;
  const widthOf = widthPixels / 6 - 2;

  const isAdmin = item.creator._id = user._id;
  const tabs: ChatDetailsTab[] = item.isGroup ? ['Members','Media', 'Settings'] : ['Info','Media', 'Settings'];

  const file_Chunks = Methods.arrayChunks(getMedia(item.messages), 3);

  // @ts-ignore
  const setState = (newState: Partial<ChatDetailsGroupState>, cb = () => { }) => {
    updateState({
      ...state,
      ...newState
    })
    if (cb) cb()
  }

  const save = () => {
    const {group, errors} = state;

    if (group.name === "" || group.name.length < 3) {
      setState({
        errors: {
          ...errors,
          name: true
        }
       });
      return;
    }
    if (group.desc === "" || group.desc.length < 3) {
      setState({
        errors: {
          ...errors,
          desc: true
        }
       });
      return;
    }

    const data = {
      group,
      conversation_id: item._id
    }

    setIsLoading(true)

    Methods.post(`https://supotsu.com/api/message/group/edit`, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        setIsLoading(!true)
        if (res.error) {
          //alert(res.message)
        } else {
          conversationCache(item._id)
        }
      },
      error(res) {
        setIsLoading(!true)
      }
    })
  };

  const remove = () => {};

  const leaveGroup = () => {
    const proceed = () => {
      setIsLoading(true)
      const data = {
        actions: ['remove_chat'],
        conversation_id: item._id,
        member_id: Methods.you()._id,
        group_id: item.group._id
      }

      Methods.post(`https://supotsu.com/api/message/group/remove`, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        success(res) {
          setIsLoading(!true)
          if (res.error) {
            //alert(res.message)
          } else {
            deleteConversation(item._id);
            router.goBack();
          }
        },
        error(res) {
          setIsLoading(!true)
        }
      })
    }

    dialogs.confirm('Are you sure you want to leave this group?').then((yes) => {
      if (yes) {
        proceed();
      }
    }).catch((err) => console.log(err))
  }

  const groupAdminIcons = isAddingMembers ? [
    {
      className: "MaterialIcons",
      icon: "save",
      onPress() {
        setIsAddingMembers(true)
      }
    }
  ] : isEdit ? [
    {
      className: "MaterialIcons",
      icon: "camera-alt",
      onPress() {
        openFilePicker({
          pickerMode: 0,
          extensions: [".png", ".jpg"],
          multipleSelection: false
        }).then(({ files }) => {
          if (files[0]) {
            const fileObj = File.fromPath(files[0])
            console.log('uploading...');
            const run = () => {
              const url = "https://supotsu.com/api/file/upload"

              var request: Request = {
                url: url,
                method: "POST",
                headers: {
                  "Content-Type": "application/octet-stream",
                  "File-Name": fileObj.name
                },
                description: "Uploading file...",
                androidAutoClearNotification: true,
                androidDisplayNotificationProgress: true,
                androidNotificationTitle: `Supotsu Upload`,
                //androidAutoDeleteAfterUpload:
              };

              var re = /(?:\.([^.]+))?$/;
              const ext = (filename: string) => {
                const _ = re.exec(filename)[1] || "*";
                return _;
              }

              var params = [
                { name: "location", value: "" },
                { name: "albumId", value: "" },
                { name: "tags", value: "[]" },
                { name: "objType", value: "profile" },
                { name: "fromId", value: Methods.you()._id },
                { name: "fromType", value: Methods.you().type },
                { name: "toId", value: me?._id || Methods.you()._id },
                { name: "toType", value: me?.type || 'F' },
                { name: "file", filename: fileObj.path, mimeType: `image/${ext(fileObj.name)}` }
              ];

              const session_ = uploadSession(fileObj.name)
              var task: Task = session_.multipartUpload(params, request);
              task.on('complete', (args: CompleteEventData) => {
                //_modal.closeCallback(false);
                //task.cancel();
                //console.log(args)
              })
              task.on('progress', (args: ProgressEventData) => {
                console.log(args.currentBytes, "/", args.totalBytes);
                const progress = args.currentBytes / args.totalBytes * 100
                const total = args.totalBytes / args.totalBytes * 100
                setIsUploading(true);
                setUploadMeta({
                  progress,
                  total
                })
              })

              task.on('error', (args: ErrorEventData) => {
                console.log('error', args)
                setIsUploading(false);
                taskRef.current = null;
                alert("Error while uploading file, please try again!")
              });

              task.on('responded', (args: ResultEventData) => {
                const _data: ISupotsu.IFile = JSON.parse(args.data);
                console.log(_data);
                setIsUploading(false);
                setState({
                  // @ts-ignore
                  group: {
                    ...group,
                    file: _data
                  }
                })
                taskRef.current = null;
              });

              taskRef.current = task;
            }
            run();
          }
        }).catch(err => {
          alert(err)
        })
      }
    },
  ] : [
    {
      className: "MaterialIcons",
      icon: "add",
      onPress() {
        setIsAddingMembers(true)
      }
    },
    {
      className: "MaterialIcons",
      icon: "edit",
      onPress() {
        setIsEdit(true)
        setActive(item.isGroup ? 'Members' : 'Info')
      }
    },
    {
      className: "MaterialIcons",
      icon: "delete",
      onPress() {
        dialogs.confirm(`Are you sure you want to delete this group?`).then((val) => {
          setIsEdit(false)
          if (val) {
            remove()
          }
        }).catch(() => {

        })
      }
    }
  ];

  const groupMemberIcons = [
    {
      className: "MaterialIcons",
      icon: "delete",
      onPress() {
        leaveGroup();
      }
    }
  ]

  const icons = item.isGroup && isAdmin ? groupAdminIcons : item.isGroup ? groupMemberIcons : [];

  const bannerHeight = isEdit ? 70 : 258;

  React.useEffect(() => {
    const currentTaskRef = taskRef?.current
    if (currentTaskRef) {

    }

    return () => {
      if (currentTaskRef) {
        currentTaskRef.cancel();
      }
    }
  }, [taskRef])

  const style: RNSStyle = {
    fontWeight: 'bold',
    marginBottom: 8
  };

  return (
    <>
      <gridLayout rows={'*, auto'} backgroundColor="#fff">
        {!isUploading && (
          <>
            {!isLoading && (
              <scrollView row={0}>
                <stackLayout>
                  <absoluteLayout style={{
                    backgroundColor: Theme2[500],
                    height: bannerHeight
                  }}>
                    <image stretch="fill" top={0} width="100%" left={0} src={chatUser.image} style={{
                      backgroundColor: "#000",
                      height: bannerHeight
                    }} />
                    <gridLayout top={0} left={0} height={bannerHeight} width="100%" rows="*, auto">
                      {!isEdit && (
                        <>
                          <flexboxLayout row={0} alignItems={"flex-end"} padding="16 16 0 16">
                            <label style={{
                              fontSize: 24,
                              color: '#fff',
                              fontWeight: 'bold'
                            }}>{chatUser.name}</label>
                          </flexboxLayout>
                        </>
                      )}
                    </gridLayout>
                  </absoluteLayout>
                  <gridLayout row={1} marginBottom={16} columns="*, * , *">
                    {tabs.map((item, i) => {
                      return (
                        <PhotoSementItem key={item} onSelect={() => {
                          if (isEdit) return;
                          setActive(item)
                        }} active={Boolean(active === item)} col={i} item={item} />
                      )
                    })}
                  </gridLayout>
                  <stackLayout visibility={active === 'Members' ? 'visible' : 'collapse'}>
                    <stackLayout padding={16} visibility={isEdit ? 'visible' : 'collapse'}>
                      <TextEditField disabled={isLoading} type="text" labelFor='Group name' value={state.group && state.group.name ? state.group.name : ""} error={state.errors.name} errorLabel='Invalid group name!' onChange={(value: string) => {
                        setState({
                          errors: {
                            ...state.errors,
                            name: value.length < 3 ? true : false
                          },
                          group: {
                            ...state.group,
                            name: value
                          }
                        })
                      }} />
                      <TextEditField disabled={isLoading} type="textArea" labelFor='Group Description' value={state.group && state.group.desc ? state.group.desc : ""} error={state.errors.desc} errorLabel='Invalid group name!' onChange={(value: string) => {
                        setState({
                          errors: {
                            ...state.errors,
                            desc: value.length < 3 ? true : false
                          },
                          group: {
                            ...state.group,
                            desc: value
                          }
                        })
                      }} />
                    </stackLayout>
                    <stackLayout padding={16} visibility={!isEdit ? 'visible' : 'collapse'}>
                      <label style={style}>ABOUT GROUP</label>
                      {item.group && (
                        <label textWrap style={{
                          marginBottom: 8
                        }}>{item.group.desc || "Not Set"}</label>
                      )}
                      <label style={style}>MEMBERS</label>
                    </stackLayout>
                    {item.isGroup && (
                      <>
                        {item.group.members.length > 0 && item.group.members.map((member, index) => {
                          return (
                            <ChatGroupMember conversation={item} key={`member_${index}_${member._id}`} isEdit={isEdit} isAdmin={member._id === item.group.creator._id} user={member} />
                          )
                        })}y
                        {item.group.members.length === 0 && (
                          <Empty text={'No members found in this group!'} />
                        )}
                      </>
                    )}
                  </stackLayout>
                  <stackLayout visibility={active === 'Media' ? 'visible' : 'collapse'}>
                    {file_Chunks.map((chunk, i) => {
                      return (
                        <gridLayout columns="*, 8, *, 8, *" background="transparent" margin={"0 8 8"} height={widthOf} key={i}>
                          {chunk.map((file, index) => {
                            if (!file.isPhoto) return null;
                            const col = index === 0 ? 0 : index === 1 ? 2 : 4;
                            return (
                              <flexboxLayout key={col} col={col} style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#000'
                              }}>
                                <image loadMode={'async'} stretch='fill' style={{
                                  height: '100%',
                                  width: '100%',
                                }} src={file.url} />
                              </flexboxLayout>
                            )
                          })}
                        </gridLayout>
                      )
                    })}
                    {file_Chunks.length === 0 &&
                      <Empty text={'No Media Files Found!'} />
                    }
                  </stackLayout>
                  <stackLayout padding={16} visibility={active === 'Info' ? 'visible' : 'collapse'}>
                    <ChatDetailLabel labelFor="Name" valueFor={`${(user as ISupotsu.User).first_name} ${(user as ISupotsu.User).last_name}`} />
                    <ChatDetailLabel labelFor="Gender" valueFor={(user as ISupotsu.User).user_gender} />
                    <ChatDetailLabel labelFor="Country" valueFor={(user as ISupotsu.User).country} />
                    <ChatDetailLabel labelFor="City" valueFor={(user as ISupotsu.User).suburb} />
                    <SaveButton text="View Profile" />
                  </stackLayout>
                  <stackLayout padding={16} visibility={active === 'Settings' ? 'visible' : 'collapse'}>
                    <ChatDetailSetting conversation_id={item._id} value={item.settings && (item.settings[Methods.you()._id] && item.settings[Methods.you()._id]['no_notice']) ? item.settings[Methods.you()._id]['no_notice'] : 'Yes'} setting={'no_notice'} options={['Yes', 'No']} label={'Recieve Notifications'} icon={'md-notifications'} iconOff={'md-notifications-off'} type={'Ionicons'} />

                    <ChatDetailSetting conversation_id={item._id} value={item.settings && (item.settings[Methods.you()._id] && item.settings[Methods.you()._id]['no_message']) ? item.settings[Methods.you()._id]['no_message'] : 'No'} setting={'no_message'} options={['Yes', 'No']} label={'Block Messages'} iconOff={'volume-up'} icon={'volume-mute'} type={'FontAwesome5'} />

                    {!item.isGroup &&
                      <ChatDetailSetting conversation_id={item._id} value={item.settings && (item.settings[Methods.you()._id] && item.settings[Methods.you()._id]['no_chat']) ? item.settings[Methods.you()._id]['no_chat'] : 'No'} setting={'no_chat'} options={['Yes', 'No']} label={'Block User'} icon={'block-helper'} iconOff={'block-helper'} type={'MaterialCommunityIcons'} />
                    }
                  </stackLayout>
                </stackLayout>
              </scrollView>
            )}
            {isLoading && (
              <flexboxLayout row={0} style={{
                width: '100%',
                padding: 20,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <LoadingState text={isAdmin ? 'Saving profile...' : 'Leaving group...'} />
              </flexboxLayout>
            )}
            {isEdit && (
              <gridLayout row={1} borderTopColor="#eee" borderTopWidth={1} columns="*, 16, *" padding={16}>
                <stackLayout col={0}>
                  <SaveButton onTap={() => {
                    if (isLoading) return;
                    setIsEdit(false)
                  }} text="Cancel" />
                </stackLayout>
                <stackLayout col={2}>
                  <SaveButton onTap={() => {
                    if (isLoading) return;
                    save()
                  }} text="Save" />
                </stackLayout>
              </gridLayout>
            )}
          </>
        )}
        {isUploading && (
          <flexboxLayout row={0} style={{
            width: '100%',
            padding: 20,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <LoadingState text={`Uploading file: ${uploadMeta.progress} of ${uploadMeta.total}`} />
          </flexboxLayout>
        )}

        <CommonHeader transparent={!isLoading || !isUploading} titleOnly user={{
          name: ""
        }} goBack={() => {
          if (isEdit) {
            setIsEdit(false)
            return;
          } else if (isAddingMembers) {
            setIsAddingMembers(false);
            return;
          }
          router.goBack()
        }} icons={icons} />
        {isAddingMembers && (
          <ChatDetailsAddMemberModal conversation={item} onClose={() => setIsAddingMembers(false)} />
        )}
      </gridLayout>
    </>
  )
}

ChatDetails.routeName = 'chatDetails';

interface ChatDetailsAddMemberModalProps {
  conversation: ISupotsu.Conversation;
  onClose(): void;
}

const ChatDetailsAddMemberModal = ({
  conversation,
  onClose
}: ChatDetailsAddMemberModalProps) => {
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const [users] = useState(() => {
    const _users = AppSettings.getString('users', '[]');
    const groupMembers = conversation.group.members.map((m) => m._id);
    const usersToAdd: ISupotsu.User[] = JSON.parse(_users)
    return usersToAdd.filter((u) => !groupMembers.includes(u._id));
  });
  const data = extractUsers(users, me);

  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const [members, setMembers] = React.useState<ISupotsu.User[]>([])

  const addToGroup = (members: ISupotsu.User[], cb = () => { }) => {
    const data = {
      conversation_id: conversation._id,
      members,
      group_id: conversation.group._id
    }

    if (members.length === 0) {
      if (cb) cb();
      alert('Please select more people to add!')
      return;
    }

    setIsLoading(true)

    Methods.post(`https://supotsu.com/api/message/group/add`, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        setIsLoading(false)
        if (res.error) {
          alert(res.message);
        } else {
          alert('Member(s) added to group!')
        }

        if (cb) cb();
      },
      error(res) {
        setIsLoading(false)
        alert(res.message);
        if (cb) cb();
      }
    })
  }

  return (
    <gridLayout rows="58, *, 70" marginTop={70} borderTopLeftRadius={20} borderTopRightRadius={20} background="#fff">
      <scrollView row={1}>
        <stackLayout>
          {alphabets.map((item, index) => {
            if (!data[item]) return null;
            const users = data[item];
            return (
              <stackLayout key={`${item}-${index}`} marginBottom={8}>
                <flexboxLayout style={{
                  background: '#ddd',
                  padding: '2 8'
                }}>
                  <label>{item}</label>
                </flexboxLayout>
                {users.map((user, i) => {
                  const isSelected = members.filter((member) => member._id === user._id).length > 0
                  return (
                    <gridLayout onTap={() => {
                      if (isLoading) return;
                      if (isSelected) {
                        setMembers(members.filter((member) => member._id !== user._id))
                      } else {
                        setMembers([...members, user])
                      }
                    }} margin="8 16" columns="35, 8, *" key={`${user._id}-${i}`}>
                      <image background="black" stretch="fill" borderColor={isSelected ? Theme2[500] : '#000'} borderWidth={isSelected ? 1 : 0} col={0} src={user.image.replace(".svg", ".png")} height={35} width={35} borderRadius={35 / 2} />
                      <label verticalAlignment="middle" color={isSelected ? Theme2[500] : '#000'} col={2}>{user.name}</label>
                    </gridLayout>
                  )
                })}
              </stackLayout>
            )
          })}
        </stackLayout>
      </scrollView>
      <flexboxLayout padding="8 16" row={2}>
        <SaveButton style={{
          width: '100%'
        }} text="Add Members" isLoading={isLoading} onTap={() => {
          if (isLoading) return;
          addToGroup(members, () => {
            conversationCache(conversation._id);
            onClose();
          })
        }} />
      </flexboxLayout>
    </gridLayout>
  )
}

interface ChatDetailLabelProps {
  labelFor: string;
  valueFor: string;
}

const ChatDetailLabel = ({
  labelFor,
  valueFor
}: ChatDetailLabelProps) => {
  return (
    <gridLayout marginBottom={16} height={45} borderBottomColor='#eee' borderBottomWidth={1} columns="*, auto">
      <label col={0} style={{
        fontSize: 16,
        color: '#000'
      }}>{labelFor}</label>
      <label col={1} style={{
        fontSize: 16,
        color: '#999'
      }}>{String(valueFor).length > 0 ? valueFor : 'Not Set'}</label>
    </gridLayout>
  )
}

interface ChatDetailSettingProps {
  label: string,
  setting: string,
  value: string,
  icon: string,
  iconOff: string,
  type: string,
  conversation_id: string,
  options: string[]
}

const ChatDetailSetting = ({
  ...props
}: ChatDetailSettingProps) => {
  const [isEdit, setEdit] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(props.value || 'Yes');
  const save = (item) => {
    if (!props.setting) return;
    setLoading(true)
    Methods.post(`https://supotsu.com/api/message/settings`, {
      conversation_id: props.conversation_id,
      setting: props.setting,
      value: item
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      success(res) {
        setLoading(!true)
        setValue(item)
        conversationCache(props.conversation_id)
      },
      error(err) {
        setLoading(!true)
      }
    })
  }

  return (
    <gridLayout marginBottom={16} height={45} borderBottomColor='#eee' borderBottomWidth={1} columns="*, auto">
      <label col={0} style={{
        fontSize: 16,
        color: '#000'
      }}>{props.label}</label>
      {isLoading &&
        <activityIndicator width={25} height={25} busy col={1} color={Theme2['500']} />
      }
      {!isLoading && (
        <flexboxLayout padding='7.5 0' col={1}>
          {props.options.map((item)=> {
            return (
              <flexboxLayout onTap={() => {
                save(item)
              }} key={item} style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                borderColor: Theme2[500],
                borderWidth: 0.5,
                padding: 3,
                marginRight: 8
              }}>
                <flexboxLayout style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: value === item ? Theme2[500] : '#fff'
                }}/>
              </flexboxLayout>
            )
          })}
        </flexboxLayout>
      )}
    </gridLayout>
  )
}

interface ChatGroupMemberProps {
  user: ISupotsu.User;
  isAdmin: boolean;
  isEdit: boolean;
  conversation: ISupotsu.Conversation;
}

const ChatGroupMember = ({
  isAdmin,
  user,
  isEdit,
  conversation
}: ChatGroupMemberProps) => {
  const item = user;
  const [isLoading, setLoading] = React.useState(false);
  const [isRemoved, setRemoved] = React.useState(false);
  const group_removed: string[] = JSON.parse(AppSettings.getString(`${strings.GROUP_REMOVED}${conversation.group._id}`, '[]'))

  const proceed = () => {
    setLoading(true)
    const data = {
      actions: ['remove_member'],
      conversation_id: conversation._id,
      member_id: user._id,
      group_id: conversation.group._id
    }

    Methods.post(`https://supotsu.com/api/message/group/remove`, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        setLoading(false)
        if (res.error) {
          alert(res.message)
        } else {
          const ids = [...group_removed, user._id];
          AppSettings.setString(`${strings.GROUP_REMOVED}${conversation.group._id}`, JSON.stringify(ids));
          conversationCache(conversation._id)
          alert(res.message)
          setRemoved(true);
        }
      },
      error(res) {
        alert(res.message)
        setLoading(false)
      }
    })
  }

  if (isRemoved || group_removed.includes(user._id)) return null;

  return (
    <gridLayout padding="8 16" columns="auto, 8, *, auto">
      <flexboxLayout col={0} style={{
        height: 35,
        width: 35,
        borderRadius: 35/2,
        background: Theme['500'],
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {isLoading && (
          <activityIndicator busy color={Theme2[500]} />
        )}
        {!isLoading && (
          <image stretch="fill" src={user.image.includes(".svg") ?user.image.replace(".svg", ".png") : user.image } style={{
            height: 35,
            width: 35,
            borderRadius: 35 / 2,
          }}/>
        )}
      </flexboxLayout>
      <stackLayout col={2}>
        <label style={{
          fontSize: 16,
          padding: 0,
          margin: 0,
          textTransform: 'capitalize'
        }}>{item.name}</label>

        <label style={{
          color: '#999',
          margin: 0,
          fontSize: 12
        }}>{item.username}</label>
      </stackLayout>
      {isEdit && !isAdmin && !isLoading && (
        <flexboxLayout col={3} onTap={() => {
          if (isLoading) return;
          dialogs.confirm('Are you sure you want to remove this member from the group?').then((yes) => {
            if (yes) {
              proceed();
            }
          }).catch((err) => {
            console.log(err);
          })
        }} style={{
          height: 35,
          width: 35,
          borderRadius: 35 / 2,
          background: 'rgba(255, 255, 255, 0.9)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <label className="MaterialIcons size18">{IconSet.MaterialIcons.delete}</label>
        </flexboxLayout>
      )}
    </gridLayout>
  )
}

export const CreateChat = () => {
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const router = useNavigation();
  const route = useRoute();
  const scrollRef = React.useRef<ScrollView>(null);
  const onUserSelect = React.useCallback((user: ISupotsu.User) => {
    const _messages = AppSettings.getString('chats', '[]');
    const messages: ISupotsu.Conversation[] = JSON.parse(_messages);
    const filteredMessages = messages.filter((item) => !item.isGroup).filter((msg) => {
      const users = [Methods.getUser(msg.user)._id, Methods.getUser(msg.userTo)._id];
      return users.includes(user._id);
    })

    const newConvo: Partial<ISupotsu.Conversation> = {
      messages: [],
      creator: me,
    };

    router.navigate(ChatScreen.routeName, {
      item: filteredMessages[0] ? filteredMessages[0] : newConvo,
      isNew: filteredMessages[0] ? false : true,
      otherUser: user
    });
  },  [router])
  return(
    <gridLayout rows={'auto, *, auto'} backgroundColor="#fff">
      <CommonHeader goBack={() => router.goBack()} user={{
        name: "Create a Chat"
      }} icons={[]} />
      <scrollView onLoaded={(args: EventData) => {
          const view = args.object as ScrollView;
          scrollRef.current = view;
        }} row={1}>
        <stackLayout padding={8}>
          <CreateChatScreenSectionList onUserSelect={onUserSelect} />
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

CreateChat.routeName = "createChat";
const alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

const extractUsers = (users: ISupotsu.User[], me: ISupotsu.User): Record<string, ISupotsu.User[]> => {
  const data: Record<string, ISupotsu.User[]> = {};
  users.filter((item) => item._id !== me._id).forEach((item) => {
    const firstLetter = item.name.charAt(0);
    if (data[firstLetter]) {
      data[firstLetter].filter((user) => item._id !== user._id).push(item);
    } else {
      data[firstLetter] = [item];
    }
  });

  return data;
}

interface CreateChatScreenSectionListProps {
  onUserSelect(user: ISupotsu.User): void;
}

const CreateChatScreenSectionList = ({
  onUserSelect
}: CreateChatScreenSectionListProps) => {
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const [users] = useState(() => {
    const _users = AppSettings.getString('users', '[]');
    return JSON.parse(_users);
  });
  const data = extractUsers(users, me);
  return (
    <>
      {alphabets.map((item, index) => {
        if (!data[item]) return null;
        const users = data[item];
        return (
          <stackLayout key={`${item}-${index}`} marginBottom={8}>
            <flexboxLayout style={{
              background: '#ddd',
              padding: '2 8'
            }}>
              <label>{item}</label>
            </flexboxLayout>
            {users.map((user, i) => {
              return (
                <gridLayout onTap={() => {
                  onUserSelect(user);
                }} margin="8 0" columns="35, 8, *" key={`${user._id}-${i}`}>
                  <image background="black" stretch="fill" col={0} src={user.image} height={35} width={35} borderRadius={35/2} />
                  <label verticalAlignment="middle" col={2}>{user.name}</label>
                </gridLayout>
              )
            })}
          </stackLayout>
        )
      })}
    </>
  )
}

interface ChatScreenItemProps {
  item: ISupotsu.Message;
  prev?: ISupotsu.Message;
  next?: ISupotsu.Message;
  isNextChatMine: boolean;
  isPrevChatMine: boolean;
}

const sanitizeBody = (txt?: string): string[] => {
  if (!txt) return [];
  const newLines = txt.split(/\n/);
  const linesWithoutSpaces = newLines.map((line) => line.allTrim());
  return linesWithoutSpaces;
}

const ChatScreenItem = ({
  item,
  isNextChatMine,
  isPrevChatMine,
  prev,
  next
}: ChatScreenItemProps) => {
  const {
    user
  } = React.useContext(AppAuthContext)
  if (item.system) {
    return (
      <stackLayout margin="4 8">
        <flexboxLayout alignItems="center" justifyContent="center">
          <label background={Theme2['300']} className="size10" borderRadius={8} padding={4}>{item.text}</label>
        </flexboxLayout>
      </stackLayout>
    )
  }

  const isYou = item.user._id === user._id;
  const hasBody = item.text && item.text.trim().length > 0;
  const styleForBubbleBox: RNSStyle = {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8
  }
  const styleForBubbleBoxMedia: RNSStyle = {
    borderTopRightRadius: hasBody ? 0 : 8,
    borderBottomRightRadius: 0,
    borderTopLeftRadius:  hasBody ? 0 : 8,
    borderBottomLeftRadius: 0
  }
  const renderMedia = () => {
    if (item.attachments) {
      return (
        <>
        {item.attachments.map((attachment) => {
          if (!attachment) return <></>
          if (attachment.type !== 'image') return <></>
          return (
            <image src={item.image} stretch="fill" width={170} height={170} style={{
              ...styleForBubbleBoxMedia
            }} />
          )
        })}
        </>
      )
    }

    return <></>
  }
  const cleanText = sanitizeBody(item.text);
  const timestamp = item ? new Date(parseInt(item.createdAt)) : new Date();
  return (
    <gridLayout columns={isYou ? "auto, *, auto" : "auto, auto, *, auto"} marginLeft={8} marginRight={8} marginBottom={isYou ? 1 : 4} marginTop={isYou ? 1 : 4}>
      {!isYou && (
        <flexboxLayout col={0} style={{
          width: 40,
          marginRight: 4
        }}>
          <image style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            background: 'black'
          }} stretch="fill" src={item.user.image.replace('.svg', '.png')} />
        </flexboxLayout>
      )}
      <stackLayout col={isYou ? 2 : 1} background={isYou ? Theme2[300] : "#ddd"} style={{
        ...styleForBubbleBox
      }}>
        <stackLayout visibility={!hasBody ? 'collapse' : 'visible'} margin={"4 8"} >
          {cleanText.map((text, index) => {
            return (
              <label key={`text-${index}`} textWrap className="size12">{text}</label>
            )
          })}
        </stackLayout>
        {renderMedia()}
        <stackLayout margin="0 8 4">
          <label className={'size9'}>{Methods.moment(timestamp).format('HH:mm a')}</label>
        </stackLayout>
      </stackLayout>
    </gridLayout>
  )
}

interface ChatComposerProps {
  onSendDone?(updateConvo: ISupotsu.Conversation): void;
  conversation: ISupotsu.Conversation,
  user: ISupotsu.User | ISupotsu.GroupChat | ISupotsu.Club | ISupotsu.Team,
  isNew?: boolean,
  onNewMessage(newMessage: ISupotsu.Message): void
}

const ChatComposer = ({
  conversation,
  user,
  onSendDone,
  isNew,
  onNewMessage,
}: ChatComposerProps) => {
  const {
    user: me
  } = React.useContext(AppAuthContext)
  const { files, pickAFile, isRawFile, removeFile, clearFiles } = useFileUploads();
  const [text, setText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const textFieldRef = React.useRef<TextField>(null);
  const onSend = () => {
    if (isLoading) return;
    const fileIDs = Object.keys(files)
    const media = fileIDs[0] && !isRawFile(files[fileIDs[0]].file) ? files[fileIDs[0]].file : undefined;

    const oldText = text;
    // @ts-ignore
    const message: Partial<ISupotsu.Message> = {
      text,
      // @ts-ignore
      createdAt: Date.now(),
      user: me,
      system: false,
      ...media ? {
        media: media as ISupotsu.IFile
      } : {}
    };

    if (message.text === "" || message.text.length === 0) {
      if (!media) return;
    }

    setIsLoading(true);

    if (conversation._id) {
      const _data = {
        conversation,
        message: message,
        isNew: false,
        userTo: user,
        isBulk: false,
      }

      setText('');

      // Methods.post(`https://supotsu.com/api/message/send`, _data, {
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   success(res) {
      //     setIsLoading(false);
      //     clearFiles();
      //     if (onSendDone) onSendDone(res)
      //   },
      //   error(err) {
      //     setIsLoading(false);
      //     setText(oldText);
      //     alert('Error while sending message! Please try again');
      //   }
      // })
      const variables = {
        message: {
          user: me._id,
          conversation_id: conversation._id,
          attachments: media ? [(media as ISupotsu.IFile)._id] : [],
          text: oldText
        }
      }

      client.mutate({
        mutation: SEND_MESSAGE,
        variables
      }).then(({data}) => {
        console.log(data)
        setIsLoading(false)
        clearFiles();
        // @ts-ignore
        if (onNewMessage && data.sendMessage) onNewMessage(data.sendMessage)
      }).catch((e) => {
        console.log(e);
        setIsLoading(false)
        setText(oldText);
        alert('Error while sending message! Please try again');
      })
    } else {
      //alert('new conversation');

      const _data = {
        conversation,
        message: message,
        isNew: true,
        userTo: user,
        isBulk: false
      }

      setText('');

      Methods.post(`https://supotsu.com/api/message/send`, _data, {
        headers: {
          "Content-Type": "application/json"
        },
        success(res) {
          setIsLoading(false);
          if (onSendDone) onSendDone(res)
        },
        error(err) {
          setIsLoading(false);
          alert('Error while sending message! Please try again');
        }
      })
    }
  }

  const fileIDs = Object.keys(files)

  return (
    <>
      <stackLayout visibility={fileIDs.length === 0 ? 'hidden' : 'visible'} row={2} style={{
        padding: 8,
        borderColor: '#eee',
        borderWidth: 1,
        opacity: isLoading ? 0.5 : 1
      }}>
        {fileIDs.map((key, index) => {
          const file = files[key];
          return (
            <gridLayout padding={4} key={key} columns="auto, *, auto" style={{
              height: 58,
              marginBottom: 4,
              borderColor: '#eee',
              borderWidth: 1
            }}>
              <flexboxLayout col={0} style={{
                height: 45,
                width: 45,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <label className="Feather size30" text={IconSet.Feather.file}/>
              </flexboxLayout>
              <stackLayout col={1} padding={4}>
                {file.file ? (
                  <>
                  <label>{isRawFile(file.file) ? file.file['_name'] : file.file.name}</label>
                  <progress value={file.meta.progress} maxValue={file.meta.total}></progress>
                  </>
                ) : (
                  <>
                    <label>Invalid File</label>
                    <progress value={100} color="crimson" maxValue={100}></progress>
                  </>
                )}
              </stackLayout>
              <flexboxLayout onTap={() => {
                if (!isLoading) removeFile(key, file.file);
              }} col={3} style={{
                height: 45,
                width: 45,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {!file.isDeleting && (
                  <label className="MaterialIcons size30" text={IconSet.MaterialIcons.delete}/>
                )}
                {file.isDeleting && (
                  <activityIndicator busy width={25} height={25} color={Theme2[500]}/>
                )}
              </flexboxLayout>
            </gridLayout>
          )
        })}
      </stackLayout>
      <gridLayout row={3} height={70} borderTopColor="#eee" borderTopWidth={1} columns="auto, *, auto, auto" padding={"4 8"}>
        <stackLayout style={{
          height: 30,
          verticalAlignment: 'middle',
          horizontalAlignment: 'center'
        }} col={0} onTap={() => {
          if (fileIDs.length < 1) pickAFile();
        }}>
          <label className={'Ionicons'} text={IconSet.Ionicons["md-camera"]} style={{
            color: new Color('green'),
            fontSize: 25
          }} />
        </stackLayout>
        <stackLayout
          col={1}
          effectiveMinHeight={35}
          style={{
            margin: `0 12`,
            borderColor: '#ddd',
            verticalAlignment: 'middle',
            borderWidth: 1,
            borderRadius: 35 / 2
          }}
        >
          <textView
            hint={"Type a message..."}
            style={{

            }}
            minHeight={35}
            onLoaded={(args: EventData) => {
              const view = args.object as TextField;
              textFieldRef.current = view;
            }}
            editable={!isLoading}
            text={text}
            onTextChange={(args: PropertyChangeData) => {
              setText(args.value)
            }}
            borderBottomColor={new Color('rgba(0,0,0,0)')}
          />
        </stackLayout>
        <flexboxLayout col={2} style={{
          height: 35,
          padding: `0 10`,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 35 / 2,
          background: Theme2['500']
        }} onTap={() => {
          onSend();
        }}>
          {!isLoading && (
            <label style={{
              color: new Color('#fff'),
            }} text={"Send"} />
          )}
          {isLoading && (
            <activityIndicator busy width={20} height={20} color="#fff" />
          )}
        </flexboxLayout>
      </gridLayout>
    </>
  )
}

const Topics = [
  "General",
  "Announcements",
  "Game",
  "Team Event",
  "Training",
  "Accounts",
  "Social",
  "Schedules",
  "Meeting",
  "Fundraising",
  "Clases",
  "Tournaments",
  "Camps"
];

interface CreateGroupState {
  type: string,
  filter: string,
  isTeam: boolean,
  topic: string,
  isUploading?: boolean,
  isLoading?: boolean,
  group: {
    _id: string,
    name: string,
    desc?: string,
    members: ISupotsu.User[],
    file?: ISupotsu.IFile,
    team?: ISupotsu.Team,
    teams: ISupotsu.Team[],
    users: ISupotsu.User[],
    tags: string[]
  },
  errors: {
    name: boolean,
    desc?: boolean,
    members: boolean,
    file: boolean,
    team: boolean,
    topic: boolean,
    type: boolean,
    teams: boolean
  },
  isAll: boolean,
  isAllTeams: boolean,
  tFilter: string,
  isCameraOpen: boolean
}

export const CreateGroup = () => {
  const {
    user
  } = React.useContext(AppAuthContext)
  const router = useNavigation();
  const route = useRoute();
  const {isTeam = false, type = '', data, team, isEdit } = route.params as { type: string, isTeam: boolean, data?: ISupotsu.GroupChat, isEdit?: boolean, team?: ISupotsu.Team}
  const scrollRef = React.useRef<ScrollView>(null);
  const taskRef = React.useRef<Task>(null)

  const [uploadMeta, setUploadMeta] = React.useState<UploadMeta>({
    progress: 0,
    total: 0
  })

  const [state, updateState] = React.useState<Partial<CreateGroupState>>(() => {
    return {
      type,
      filter: "",
      isTeam,
      topic: "General",
      group: isEdit ? data :{
        _id: null,
        name: "",
        members: [],
        teams: [],
        users: [],
        tags: [],
        team,
      },
      errors: {
        name: false,
        members: false,
        file: false,
        team: false,
        topic: false,
        type: false,
        teams: false
      },
      isAll: false,
      isAllTeams: false,
      tFilter: "",
      isCameraOpen: false
    }
  });

  const setState = (newState: Partial<CreateGroupState>, cb = () => { }) => {
    updateState({
      ...state,
      ...newState
    })
    if (cb) cb()
  };

  const save = () => {
    const { group, errors, isAll, topic } = state;
    const friends = Methods.listify(Methods.getData("yoo").friends);
    if (!group.file) {
      setState({
        errors: {
          ...errors,
          file: true
        }
       });
       alert('Please select group photo')
      return;
    }

    if (group.name === "" || group.name.length < 3) {
      setState({
        errors: {
          ...errors,
          name: true
        }
       });
      return;
    }

    if (group.desc === "" || group.desc.length < 3) {
      setState({
        errors: {
          ...errors,
          desc: true
        }
       });
      return;
    }

    if (isAll) {
      const list = [];
      friends.forEach((item, i) => {
        list.push(item._id + "^F");
      });

      setState({ errors: {
        ...errors,
        members: false
      }, group: {
        ...group,
        members: list
      } });
    }

    // if (group.members.length === 0) {
    //   errors.members = true;
    //   setState({ errors: {
    //     ...errors,
    //     members: true
    //   } });
    //   return;
    // }

    setState({
      isLoading: true
    })

    const dataTo = {
      group : {
        ...group,
        type: type.toLowerCase(),
        teamType: "T",
        topic,
        tags: group.tags.join(","),
        members: typeof group.members === "boolean" ? [] : group.members,
        isParent: team && !isTeam ? true : false
      },
      id: (isEdit) ? data._id : 0,
      team: group.team,
      userFrom: Methods.getData("yoo")._id,
      type: type.toLowerCase(),
      teamType: "F",
      topic,
      tags: group.tags.join(","),
      members: typeof group.members === "boolean" ? [] : group.members,
      isParent: team && !isTeam ? true : false
    }

    Methods.post(`https://supotsu.com/api/message/group/create`, dataTo, {
      success(res) {
        setState({
          isLoading: false
        })
        console.log(res);
        if (res.error) {

        } else {
          // TODO
          alert('Group created successfully');
          router.goBack();
        }
      },
      error(err) {
        setState({
          isLoading: false
        })
        console.log(err)
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  React.useEffect(() => {
    const currentTaskRef = taskRef?.current
    if (currentTaskRef) {

    }

    return () => {
      if (currentTaskRef) {
        currentTaskRef.cancel();
      }
    }
  }, [taskRef])
  const {group, errors} = state;


  const ext = group.file ? group.file.name.split('.')[1] : 'webp';

  const src = group.file ? getImgSrc(group.file) : '';

  const users = [];

  console.log(team, group.team)
  return(
    <gridLayout rows={'auto, *, auto'} backgroundColor="#fff">
      <CommonHeader goBack={() => router.goBack()} user={{
        name: "Create a Group"
      }} icons={[
        {
          className: "MaterialIcons",
          icon: "camera-alt",
          onPress() {
            openFilePicker({
              pickerMode: 0,
              extensions: [".png", ".jpg"],
              multipleSelection: false
            }).then(({ files }) => {
              if (files[0]) {
                const fileObj = File.fromPath(files[0])
                console.log('uploading...');
                const run = () => {
                  const url = "https://supotsu.com/api/file/upload"

                  var request: Request = {
                    url: url,
                    method: "POST",
                    headers: {
                      "Content-Type": "application/octet-stream",
                      "File-Name": fileObj.name
                    },
                    description: "Uploading file...",
                    androidAutoClearNotification: true,
                    androidDisplayNotificationProgress: true,
                    androidNotificationTitle: `Supotsu Upload`,
                    //androidAutoDeleteAfterUpload:
                  };

                  var re = /(?:\.([^.]+))?$/;
                  const ext = (filename: string) => {
                    const _ = re.exec(filename)[1] || "*";
                    return _;
                  }

                  var params = [
                    { name: "location", value: "" },
                    { name: "albumId", value: "" },
                    { name: "tags", value: "[]" },
                    { name: "objType", value: "profile" },
                    { name: "fromId", value: Methods.you()._id },
                    { name: "fromType", value: Methods.you().type },
                    { name: "toId", value: user?._id },
                    { name: "toType", value: user?.type },
                    { name: "file", filename: fileObj.path, mimeType: `image/${ext(fileObj.name)}` }
                  ];

                  const session_ = uploadSession(fileObj.name)
                  var task: Task = session_.multipartUpload(params, request);
                  task.on('complete', (args: CompleteEventData) => {
                    //_modal.closeCallback(false);
                    //task.cancel();
                    //console.log(args)
                  })
                  task.on('progress', (args: ProgressEventData) => {
                    console.log(args.currentBytes, "/", args.totalBytes);
                    const progress = args.currentBytes / args.totalBytes * 100
                    const total = args.totalBytes / args.totalBytes * 100
                    setState({
                      isUploading: false,
                    })
                    setUploadMeta({
                      progress,
                      total
                    })
                  })

                  task.on('error', (args: ErrorEventData) => {
                    console.log('error', args)
                    setState({
                      isUploading: false,
                    })
                    taskRef.current = null;
                    alert("Error while uploading file, please try again!")
                  });

                  task.on('responded', (args: ResultEventData) => {
                    const _data = JSON.parse(args.data);
                    console.log(_data);
                    setState({
                      isUploading: false,
                      group: {
                        ...group,
                        file: _data as ISupotsu.IFile
                      }
                    })
                    taskRef.current = null;
                  });

                  taskRef.current = task;
                }
                run();
              }
            }).catch(err => {
              alert(err)
            })
          }
        },
      ]} />
      {!state.isUploading && (
        <scrollView onLoaded={(args: EventData) => {
          const view = args.object as ScrollView;
          scrollRef.current = view;
        }} row={1}>
          <stackLayout>
            <flexboxLayout style={{
              height: 258,
              background: Theme2[500]
            }}>
              {group.file && (
                <image stretch="fill" top={0} width="100%" left={0} src={src.replace('.webp', `.${ext}`)} style={{
                  backgroundColor: "#000",
                  height: 258
                }} />
              )}
            </flexboxLayout>
            <stackLayout padding={16}>
              <TextEditField disabled={state.isLoading} type="text" labelFor='Group name' value={group.name} error={errors.name} errorLabel='Invalid group name!' onChange={(value: string) => {
                setState({
                  errors: {
                    ...errors,
                    name: value.length < 3 ? true : false
                  },
                  group: {
                    ...group,
                    name: value
                  }
                })
              }} />
              <TextEditField disabled={state.isLoading} type="textArea" labelFor='Group Description' value={state.group.desc} error={state.errors.name} errorLabel='Invalid group name!' onChange={(value: string) => {
                setState({
                  errors: {
                    ...state.errors,
                    desc: value.length < 3 ? true : false
                  },
                  group: {
                    ...state.group,
                    desc: value
                  }
                })
              }} />
              {isTeam && (
                <TextEditField disabled={state.isLoading} value={state.topic} type="select" onChange={(topic: string) => {
                  setState({
                    errors: {
                      ...errors,
                      topic: topic.length < 3 ? true : false
                    },
                    topic: topic.length < 3 ? state.topic : topic
                  })
                }} selectOptions={Topics} error={errors.topic} errorLabel="Please select a topic for the group" labelFor="Group topic" />
              )}
              <TextEditField disabled={state.isLoading} value="" type="select" multiple onChange={(members: ISupotsu.User[]) => {
                setState({
                  errors: {
                    ...errors,
                    members: members.length > 1 ? true : false
                  },
                  group: {
                    ...group,
                    members: members.length === 0 ? [] : members
                  }
                })
              }} selectOptions={users} error={errors.members} errorLabel="Please select some people to add to the group" labelFor="Group members" />
              <SaveButton isLoading={state.isLoading} onTap={() => {
                if (state.isLoading) return;
                save()
              }} text="Save" />
            </stackLayout>
          </stackLayout>
        </scrollView>
      )}
      {state.isUploading && (
        <flexboxLayout row={1} style={{
          width: '100%',
          padding: 20,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <LoadingState text={`Uploading file: ${uploadMeta.progress} of ${uploadMeta.total}`} />
        </flexboxLayout>
      )}
    </gridLayout>
  )
}

CreateGroup.routeName = "createGroup";

interface EmailItemProps {
  item: ISupotsu.EmailMessage;
  openEmail(): void;
  isSelected: boolean;
  onLongPress(): void;
}

const EmailItem = ({
  item,
  openEmail,
  isSelected,
  onLongPress
}: EmailItemProps) => {
  return (
    <gridLayout padding='16' onLongPress={onLongPress} onTap={openEmail} style={{
      // height: 60
    }} columns={"40, *, auto"}>
      <flexboxLayout col={0} height={40} width={40} borderRadius={40/2} alignItems="center" justifyContent="center">
        <image src={item.user.image} style={{
          height: 40,
          width: 40,
          borderRadius: 40 / 2,
          background: "#000",
          borderColor: Theme2[500],
          borderWidth: isSelected ? 1 : 0
        }} stretch="fill" loadMode="async" />
      </flexboxLayout>
      <stackLayout color={isSelected ? Theme2[500] : "#000"} col={1}>
        <label className="size16" style={{
          margin: 0,
          padding: '0 8',
        }}>{item.subject}</label>
        <label className="size12" style={{
          margin: 0,
          padding: '0 8',
        }}>{item.body}</label>
      </stackLayout>
      {item.attachments.length > 0 && (
        <flexboxLayout style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          background: "#ddd",
          alignItems: 'center',
          justifyContent: 'center',
        }} col={2}>
          <label className="MaterialIcons size18" color="black">{IconSet.MaterialIcons.attachment}</label>
        </flexboxLayout>
      )}
    </gridLayout>
  )
}

export const EmailScreen = () => {
  const router = useNavigation()
  const route = useRoute();
  const scrollRef = React.useRef<ScrollView>(null)
  const { item } = route.params as {item: ISupotsu.EmailMessage}
  return(
    <gridLayout rows={'auto, *, auto'} backgroundColor="#fff">
      <CommonHeader goBack={() => router.goBack()} user={{
        ...item.user,
        name: item.subject,
        first_name: item.subject
      }} subTitle={item.user.name} icons={[]} />
      <scrollView onLoaded={(args: EventData) => {
          const view = args.object as ScrollView;
          scrollRef.current = view;
        }} row={1}>
        <stackLayout padding={16}>
          <TextEditField type="text" disabled value={item.user.email} labelFor="From:" />
          <TextEditField type="text" disabled value={item.subject} labelFor="Subject:" />
          <TextEditField type="textArea" disabled value={item.body} labelFor="Message:" />
          {item.attachments.length > 0 && (
            <TextEditField type="custom" value={null} disabled labelFor="Attachments:">
              <stackLayout padding={8}>
                {
                  item.attachments.map((item, index) => {
                    return (
                      <EmailAttachmentItem key={item._id} item={item} />
                    )
                  })
                }
              </stackLayout>
            </TextEditField>
          )}
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

EmailScreen.routeName = 'emailScreen';

interface EmailAttachmentItemProps {
  item: ISupotsu.IFile
}

const EmailAttachmentItem = ({
  item
}: EmailAttachmentItemProps) => {
  return (
    <gridLayout borderBottomColor="#ddd" borderBottomWidth={1} margin="8 0" padding="4 8" columns="*, 16, auto">
      <label verticalAlignment="middle" text={item.name} col={0} />
      <flexboxLayout borderRadius={5} background={Theme2[500]} height={30} width={30} col={2} alignItems="center" justifyContent="center">
        <label verticalAlignment="middle" horizontalAlignment="center" className={"MaterialIcons size24"} color={"#fff"} onTap={() => {

        }} col={1}>{IconSet.MaterialIcons['open-in-browser']}</label>
      </flexboxLayout>
    </gridLayout>
  )
}

interface CreateEmailMessage {
  members: Partial<ISupotsu.User>[]
}

interface AttachmentTask {
  task: Task;
  uploadMeta: UploadMeta;
  file?: ISupotsu.IFile;
}

interface CreateEmailState {
  to: string;
  subject: string;
  msg: string;
  message: CreateEmailMessage;
  attachments: AttachmentTask[];
  uploadAttactments: any[];
  errors: {
    to?: boolean;
    subject?: boolean;
    msg?: boolean;
    members?: boolean;
  };
  isLoading: boolean;
}

const exts = [".jpeg", ".jpg", ".png", ".gif", '.mp4', '.mov', '.mpg', '.flv', '.3gp', '.wmv', '.flv', '.avi', '.xls', '.pdf', '.doc', '.ppt'];
const imgs = [".jpeg", ".jpg", ".png", ".gif"];
const vids = ['.mp4', '.mov', '.mpg', '.flv', '.3gp', '.wmv', '.flv', '.avi'];

export const CreateEmail = () => {
  const [state, updateState] = React.useState<CreateEmailState>(() => ({
    to: '',
    subject: '',
    msg: '',
    message: {
      members: []
    },
    errors: {},
    isLoading: false,
    attachments: [],
    uploadAttactments: []
  }))
  const router = useNavigation();
  const route = useRoute();
  const scrollRef = React.useRef<ScrollView>(null);

  const uploadsRef = React.useRef<AttachmentTask[]>([]);

  const setState = (newState: Partial<CreateEmailState>, cb = () => { }) => {
    updateState({
      ...state,
      ...newState
    })
    if (cb) cb()
  }

  const send = () => {
    // if (message.members.length <= 0) {
    //   errors.members = true;
    //   setState({ errors });
    //   return;
    // }
    if (!Methods.isEmail(state.to)) {
      setState({
        errors: {
          ...state.errors,
          to: true
        }
      });

      return;
    }

    if (state.subject.length < 10) {
      setState({
        errors: {
          ...state.errors,
          subject: true
        }
      });
      return;
    }

    if (state.msg.length < 20) {
      setState({
        errors: {
          ...state.errors,
          msg: true
        }
      });
      return;
    }

    const { msg, subject, message, uploadAttactments } = state;

    const data = {
      members: [
        ...message.members,
        {
          email: state.to
        }
      ],
      msg,
      subject,
      attachments: uploadAttactments
    };

    setState({
      isLoading: true
    })

    Methods.post(`https://supotsu.com/api/message/email`, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        setState({ isLoading: false })
        if (res.error) {
          alert(res.message);
        } else {
          router.goBack();
        }
      },
      error(res) {
        setState({ isLoading: false })
        alert(res.message);
      }
    })
  }

  const addAttachment = () => {
    openFilePicker({
      pickerMode: 0,
      extensions: [],
      multipleSelection: false
    }).then(({ files }) => {
      const fileObj = File.fromPath(files[0]);
      const url = "https://supotsu.com/api/file/upload";
      const attachments = uploadsRef.current;
      const index = attachments.length;

      var request: Request = {
        url: url,
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "File-Name": fileObj.name
        },
        description: "Uploading file...",
        androidAutoClearNotification: true,
        androidDisplayNotificationProgress: true,
        androidNotificationTitle: `Supotsu Upload`,
        //androidAutoDeleteAfterUpload:
      };
      var re = /(?:\.([^.]+))?$/;
      const ext = (filename: string) => {
        const _ = re.exec(filename)[1] || "*";
        return _;
      }
      var params = [
        { name: "location", value: "" },
        { name: "albumId", value: "" },
        { name: "tags", value: "[]" },
        { name: "objType", value: "none" },
        { name: "fromId", value: Methods.you()._id },
        { name: "fromType", value: Methods.you().type },
        { name: "toId", value: Methods.you()._id },
        { name: "toType", value: Methods.you().type },
        { name: "file", filename: fileObj.path, mimeType: `${imgs.includes(fileObj.extension) ? CameraRollFileType.image : vids.includes(fileObj.extension) ? CameraRollFileType.video : CameraRollFileType.other}/${fileObj.extension}` }
      ];

      const session_ = uploadSession(fileObj.name)
      const newTask: Task = session_.multipartUpload(params, request);

      newTask.on('progress', (args: ProgressEventData) => {
        console.log(args.currentBytes, "/", args.totalBytes);
        const progress = args.currentBytes / args.totalBytes * 100
        const total = args.totalBytes / args.totalBytes * 100;
        attachments[index].uploadMeta = {
          progress,
          total
        }
        uploadsRef.current = attachments;
      })

      newTask.on('error', (args: ErrorEventData) => {
        console.log('error', args)
        alert("Error while uploading file, please try again!")
      });

      newTask.on('responded', (args: ResultEventData) => {
        const _data = JSON.parse(args.data);
        const {uploadAttactments} = state;
        attachments[index].file = _data;
        uploadsRef.current = attachments;
        setState({
          uploadAttactments: [...uploadAttactments, _data]
        });
      });
      attachments[index] = {
        task: newTask,
        uploadMeta: {
          progress: 0,
          total: 0
        }
      };
      uploadsRef.current = attachments;
    }).catch((err)=> {
      console.log(err);
    });
  }

  const removeFile = (index: number) => {
    const attachment = uploadsRef.current[index]
    const dataTo = {
      _id: attachment.file._id,
      user: {
        _id: Methods.you()._id,
        type: Methods.you().type
      },
      img: attachment.file,
      tags: []
    };

    Methods.post(`https://supotsu.com/api/file/remove`, dataTo, {
      headers: {
        'Content-Type': 'application/json'
      },
      success() {
        uploadsRef.current = uploadsRef.current.filter((item) => item.file._id !== attachment.file._id);
        setState({
          uploadAttactments: state.uploadAttactments.filter((item) => item._id !== attachment.file._id)
        })
        alert("File deleletd")
      },
      error() {
        alert("File not deleletd")
      }
    })
  }

  return(
    <gridLayout rows={'auto, *, auto'} backgroundColor="#fff">
      <CommonHeader goBack={() => router.goBack()} user={{
        name: "Create an Email"
      }} icons={[]} />
      <scrollView onLoaded={(args: EventData) => {
          const view = args.object as ScrollView;
          scrollRef.current = view;
        }} row={1}>
        <stackLayout padding={16}>
          <TextEditField border disabled={state.isLoading} labelFor="To:" value={state.to} type="text" onChange={(text) => {
            setState({
              to: text as string,
              errors: {
                ...state.errors,
                to: !Methods.isEmail(text as string)
              }
            });
          }} error={state.errors.to} errorLabel="Invalid email address" />
          <TextEditField border disabled={state.isLoading} labelFor="Subject:" value={state.subject} type="text" onChange={(text) => {
            setState({
              subject: text as string,
              errors: {
                ...state.errors,
                subject: (text as string).length < 10
              }
            });
          }} error={state.errors.subject} errorLabel="Subject length can't be less than 10 characters" />
          <TextEditField border disabled={state.isLoading} labelFor="Message:" value={state.msg} type="textArea" onChange={(text) => {
            setState({
              msg: text as string,
              errors: {
                ...state.errors,
                msg: (text as string).length < 20
              }
            });
          }} error={state.errors.msg} errorLabel="Message length can't be less than 20 characters" />

          <TextEditField border type="custom" value={null} disabled labelFor="Attachments:">
            <stackLayout padding={8}>
              {
                uploadsRef.current.map((item, index) => {
                  return (
                    <EmailAttachmentUploader onRemove={() => {
                      removeFile(index);
                    }} item={item} key={index} />
                  )
                })
              }
              <SaveButton text='Add Attachment' onTap={addAttachment} />
            </stackLayout>
          </TextEditField>

          <SaveButton text={'Send Email'} isLoading={state.isLoading} onTap={send} />
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

CreateEmail.routeName = "createEmail";


interface EmailAttachmentUploaderProps {
  item: AttachmentTask;
  onRemove(): void
}

const EmailAttachmentUploader = ({
  item,
  onRemove
}: EmailAttachmentUploaderProps) => {

  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <gridLayout borderBottomColor="#ddd" borderBottomWidth={1} margin="8 0" padding="4 8" columns="*, 16, auto">
      {!item.file && (
        <>
          <progress col={0} maxValue={item.uploadMeta.total} value={item.uploadMeta.progress} />
          <activityIndicator col={2} width={10} height={10} busy />
        </>
      )}
      {item.file && (
        <>
          <label verticalAlignment="middle" text={item.file.name} col={0} />
          <flexboxLayout borderRadius={5} background={Theme2[500]} height={30} width={30} col={2} alignItems="center" justifyContent="center">
            {isDeleting && (
              <activityIndicator busy color="#fff" width={20} height={20} />
            )}
            {!isDeleting && (
              <label verticalAlignment="middle" horizontalAlignment="center" className={"MaterialIcons size24"} color={"#fff"} onTap={() => {
                dialogs.confirm('Are you sure you want to remove this file?').then((yes) => {
                  if (yes) {
                    setIsDeleting(true);
                    onRemove();
                  }
                }).catch((err) => {
                  console.log(err);
                })
              }} col={1}>{IconSet.MaterialIcons.close}</label>
            )}
          </flexboxLayout>
        </>
      )}
    </gridLayout>
  )
}

export default ChatsScreen;
