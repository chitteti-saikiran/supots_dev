import * as React from 'react';
import { eachDayOfInterval, endOfMonth, format, isDate, startOfMonth } from 'date-fns'
import {
  useNavigation
} from '@react-navigation/core';
import { ListView as $ListView, NSVElement } from "react-nativescript";
import { ScreenProps } from '~/app';
import { CommonHeader } from '~/ui/common.ui';
import { useState } from 'react';
import Theme from '~/Theme';
import Methods from '~/Methods';
import { LabelItem } from '~/components/LabelItem';
import IconSet from '~/font-icons';
import { useNotificationContext } from '~/contexts/NotificationContext';
import { Notice, NoticeQueryResult, NoticeQueryVariables } from '~/generated/graphql';
import { PhotoSementItem } from './Photos';
import { ConfirmSheet } from '~/components/ConfirmSheet';
import { useSupotsuQuery } from '~/utils/useSupotsuMutation';
import { NOTICE } from '~/apollo/queries/notice';

interface Props { }
type NoticeScreenView = 'General' | 'Chat'
const NoticeScreen = ({ }: ScreenProps) => {
  const [view, setView] = useState<NoticeScreenView>('General')
  const { navigate, goBack } = useNavigation()
  const [active, setActive] = useState("All")
  const { notices } = useNotificationContext()

  const dateMappedNotices = React.useMemo(() => {
    let data: Record<string, Notice[]> = {}
    notices.forEach((n) => {
      const key = String(n.date)
      if (data[key]) {
        data = {
          ...data,
          [key]: [...data[key], n]
        }
      } else {
        data[key] = [n]
      }
    })
    return data
  }, [])
  const dates = notices.map((a) => Number(a.date)).sort((a, b) => b - a)
  const dateRange = eachDayOfInterval({
    end: endOfMonth(dates[0] ? new Date(dates[0]) : new Date()),
    start: startOfMonth(dates[dates.length - 1] ? new Date(dates[dates.length - 1]) : new Date())
  })
  const structuredNotifications = Object.keys(dateMappedNotices).sort((a, b) => {
    return (new Date(Number(b))).getTime() - (new Date(Number(a))).getTime()
  }).map((date) => {
    const data = {
      date,
      notices: dateMappedNotices[date]
    }
    return data
  })
  return (
    <gridLayout rows="auto, auto, *" background="#fff">
      <CommonHeader goBack={goBack} user={{
        name: "Notifications"
      }} />
      <gridLayout  background="#eee" row={2} rows='auto, 16, *'>
      <gridLayout background="#fff" columns="*,*">
        {(['General', 'Chat'] as NoticeScreenView[]).map((item, i) => {
          return (
            <PhotoSementItem key={item} onSelect={() => {
              setView(item)
            }} active={Boolean(view === item)} col={i} item={item} />
          )
        })}
      </gridLayout>
      <scrollView row={2}>
        <stackLayout>
          {structuredNotifications.map((st, index) => {
            const date = new Date(Number(st.date))
            const noticeList = st.notices.filter((n) => {
              if (view === 'General') return !n.context?.title.includes('chat')
              return n.context?.title.includes('chat')
            })
            if (noticeList.length <= 0) return null
            return (
              <flexboxLayout key={index} style={{
                borderBottomColor: '#eee',
                borderBottomWidth: 1,
                width: '100%',
                flexDirection: 'column'
              }}>
                <label padding={8} style={{
                  color: Theme[500],
                  fontWeight: 'bold',
                  fontSize: 14,
                  paddingBottom: 8,
                  background: '#fff',
                }} text={format(date, 'dd MMM yyyy')} />
                <stackLayout style={{
                  padding: '16 8 8 8',
                  background: '#eee',
                }}>
                  {noticeList.map((notice, index) => {
                    return (
                      <NoticeItem notice={notice} key={index} />
                    )
                  })}
                </stackLayout>
              </flexboxLayout>
            )
          })}
        </stackLayout>
      </scrollView>
      </gridLayout>
    </gridLayout>
  )
}

interface NoticeItemProps {
  notice: Notice
}
const NoticeItem = ({
   notice
}: NoticeItemProps) => {
  const [open, setOpen] = React.useState(false)
  const { readNotice } = useNotificationContext()
  const [data, setData] = React.useState(notice)
  const { fetchMore, refetch } = useSupotsuQuery<NoticeQueryResult, NoticeQueryVariables>(NOTICE, {
    variables: {
      _id: notice._id,
    },
    onCompleted(data) {
      setData(data.notice)
    },
  })
  return (
    <>
    <flexboxLayout style={{
          height: 95
        }} marginBottom={0} key={notice._id}>
          <LabelItem textWrap unread={notice.context?.status === "unread"} name={notice.context?.title} username={notice.context?.body} icon={{
            type: 'MaterialIcons',
            name: 'keyboard-arrow-right'
          }} onTap={() => {
            setOpen(true)
          }} />
        </flexboxLayout>
        {open && (
          <ConfirmSheet
          message={notice.context?.body ?? ''}
          title={notice.context?.title ?? ''}
          open={open}
          background='white'
          onClose={() => {
            setOpen(false)
          }}
          okText={!notice.context?.title.includes('chat') ? 'VIEW' : 'OPEN CHAT'}
          onConfirm={() => {
            // get notice
            setOpen(false)
            readNotice(notice._id)
            console.log(data)
          }}
          customView={
            <LabelItem textWrap unread={notice.context?.status === "unread"} name={notice.context?.title} username={notice.context?.body} icon={{
              type: 'MaterialIcons',
              name: 'keyboard-arrow-right'
            }} />
          }
        />
        )}
    </>

  )
}

export default NoticeScreen;
