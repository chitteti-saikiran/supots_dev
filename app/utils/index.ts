import * as React from "react";
import Methods from "~/Methods";
import * as AppSettings from '@nativescript/core/application-settings';
import strings from "./strings";
import * as ISupotsu from '~/DB/interfaces';

export const groupChatMembersCache = (group: ISupotsu.GroupChat) => {
  AppSettings.setString(`${strings.GROUP_MEMBERS}${group._id}`, JSON.stringify(group.members));
}

export const getGroupChatMembers = (group: ISupotsu.GroupChat): ISupotsu.User[] => {
  const _cached = AppSettings.getString(`${strings.GROUP_MEMBERS}${group._id}`, '[]');
  const list: ISupotsu.User[] = JSON.parse(_cached);
  return list.length === 0 ? group.members : list;
}

export const getGroupChatRemoved = (_id: string): string[] => {
  const _cached = AppSettings.getString(`${strings.GROUP_REMOVED}${_id}`, '[]');
  const list: string[] = JSON.parse(_cached);
  return list;
}

export const chatMessagesCache = (_id: string, messages: ISupotsu.Message[]) => {
  AppSettings.setString(`${strings.CONVO_MESSAGES_CACHE}${_id}`, JSON.stringify(messages));
}

export const getMessagesCache = (convo: ISupotsu.Conversation): ISupotsu.Message[] => {
  const _cached = AppSettings.getString(`${strings.CONVO_MESSAGES_CACHE}${convo._id}`, '[]');
  const list: ISupotsu.Message[] = JSON.parse(_cached);
  return list;
}

export const conversationCache = (_id: string, conversation?: ISupotsu.Conversation) => {
  // console.log(`${strings.CONVO_CACHE}${_id}`, 'started')
  if (conversation) {
    AppSettings.setString(`${strings.CONVO_CACHE}${conversation._id}`, JSON.stringify(conversation));
    if (conversation.group) groupChatMembersCache(conversation.group);
    // chatMessagesCache(_id, conversation.messages)
  }
  Methods.post(`https://supotsu.com/api/message/view`, {
    _id
  }, {
    headers: {
      'Content-Type': 'application/json'
    },
    success(res) {
      if (!res.error) {
        const convo: ISupotsu.Conversation = res;
        AppSettings.setString(`${strings.CONVO_CACHE}${convo._id}`, JSON.stringify(convo));
        if (convo.group) groupChatMembersCache(convo.group);
        // chatMessagesCache(_id, convo.messages)
      }
    }
  })
};

export const getConversationCache = (_id: string, conversation: ISupotsu.Conversation) => {
  const _cached = AppSettings.getString(`${strings.CONVO_CACHE}${_id}`, undefined);
  if (!_cached) return conversation;
  const cachedConvo: ISupotsu.Conversation = JSON.parse(_cached);
  return cachedConvo;
}

export const isConversationDeleted = (_id: string): boolean => {
  return AppSettings.getBoolean(`${strings.CONVO_DELETED}${_id}`, false);
}

export const deleteConversation = (_id: string) => {
  const _cached = AppSettings.getString(`${strings.CONVO_CACHE}${_id}`, undefined);
  if (_cached) {
    AppSettings.remove(`${strings.CONVO_CACHE}${_id}`);
  }
  AppSettings.setBoolean(`${strings.CONVO_DELETED}${_id}`, true);
}

export const useTimeout = (interval = 1000) => {
  const [updated, setUpdated] = React.useState<number>(0);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setUpdated(Date.now());
    }, interval)

    return () => {
      clearTimeout(timeout);
    }
  }, [interval, updated])
  return updated;
}

export const useIsConversationDeleted = () => {
  const [deleted, setDeleted] = React.useState<string[]>([]);
  const updated = useTimeout(2000);
  React.useEffect(() => {
    const current = deleted;
    const _messages = AppSettings.getString('chats', '[]');
    const messages: ISupotsu.Conversation[] = JSON.parse(_messages);
    messages.forEach((item) => {
      if (isConversationDeleted(item._id)) {
        setDeleted([...current, item._id])
      } else{

      }
    });
  }, [deleted, updated])
  return deleted;
}

export const getTeams = (teams: ISupotsu.Team[]) => {
  const ids = [];
  const list: ISupotsu.Team[] = [];
  teams.forEach((item) => {
    if (!ids.includes(item._id)) {
      list.push(item);
      ids.push(item._id);
    }
  });
  return list;
}
