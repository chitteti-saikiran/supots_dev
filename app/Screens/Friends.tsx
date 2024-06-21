import * as React from 'react'
import { FRIENDS } from '~/apollo/queries/friends'
import { PENDING } from '~/apollo/queries/pending'
import { USERS } from '~/apollo/queries/users'
import { AppAuthContext } from '~/components/Root'
import { Query, UserRelationship } from '~/generated/graphql'
import { useSupotsuMutation, useSupotsuQuery } from '~/utils/useSupotsuMutation'
import { PhotoSementItem } from './Photos'
import { Empty } from '~/ui/common.ui'
import { LabelItem } from '~/components/LabelItem'
import { ConfirmSheet } from '~/components/ConfirmSheet'
import { useNavigation } from '@react-navigation/core'
import { Profile } from './Profile'
import { ACCEPT_DECLINE_FRIEND } from '~/apollo/mutations/acceptOrDeclineFriend'
import Theme from '~/Theme'
import icons from '~/utils/icons'
import { useFriendsContext } from '~/contexts/FriendsContext'

type FriendView = 'Friends' | 'Pending'
export const Friends = () => {
  const navigation = useNavigation()
  const { user } = React.useContext(AppAuthContext)
  const [actOnPending, setActOnPending] = React.useState<UserRelationship>()
  const [active, setActive] = React.useState<FriendView>('Friends')
  const { acceptOrDeclineFriend, friendsList, loading, pendingList, rfFriends, rfPending, userList } = useFriendsContext()
  // if (!user) return <></>


  function refetchAll() {
    rfFriends()
    rfPending()
  }

  async function onRespondToReq(req: UserRelationship, accepted: boolean) {
    acceptOrDeclineFriend({
      variables: {
        _id: req._id,
        accepted,
      },
      refetchQueries: [
        {
          query: FRIENDS,
          variables: {
            _id: user._id,
          },
        },
        {
          query: PENDING,
          variables: {
            _id: user._id,
          },
        }
      ],
      update() {
        refetchAll()
      }
    })
  }

  return (
    <gridLayout width={'100%'} rows='auto, *'>
      <gridLayout marginTop={16} columns="*,*">
        {(['Friends', 'Pending'] as FriendView[]).map((item, i) => {
          return (
            <PhotoSementItem key={item} onSelect={() => {
              setActive(item)
            }} active={Boolean(active === item)} col={i} item={item} />
          )
        })}
      </gridLayout>
      {active === 'Friends' ? (
        <scrollView row={1} background={'#eee'}>
          <stackLayout padding={17}>
            {friendsList.length === 0 && <Empty onTap={() => refetchAll()} style={{
              width: '100%',
              padding: 20,
              height: 200,
              borderRadius: 10,
            }} text='No friend found! Please consider adding some people to you friend list.' />}
            {friendsList.map((item) => {
              const itemUser = item.users.find((e) => e._id !== user._id)

              return (
                <LabelItem icon={{
                  type: 'AntDesign',
                  name: 'eyeo'
                }} onTap={() => {
                  navigation.navigate(Profile.routeName, {
                    user: itemUser,
                  })
                }} key={item._id} name={itemUser.name} username={itemUser.email} />
              )
            })}
          </stackLayout>
        </scrollView>
      ) : <></>}
      {active === 'Pending' ? (
        <scrollView row={1} background={'#eee'}>
          <stackLayout padding={17}>
            {pendingList.length === 0 && <Empty onTap={() => refetchAll()} style={{
              width: '100%',
              padding: 20,
              height: 200,
              borderRadius: 10,
            }} text='No pending friend requests!' />}
            {pendingList.map((item) => {
              const itemUser = item.users.find((e) => e._id !== user._id)
              return (
                <LabelItem icon={{
                  type: 'AntDesign',
                  name: 'eyeo'
                }} onTap={() => setActOnPending(item)} key={item._id} name={itemUser.name} username={itemUser.email} />
              )
            })}
          </stackLayout>
        </scrollView>
      ) : <></>}
      {actOnPending && (
        <ConfirmSheet okText='Accept' cancelText='Decline' onConfirm={() => {

        }} onClose={(accepted) => {
          console.log(accepted, actOnPending)
          onRespondToReq(actOnPending, accepted)
          setActOnPending(undefined)
        }} message={`You have a friend request from ${actOnPending.user.name}`} title={'Friend Request'} />
      )}
      {loading ? (
        <flexboxLayout row={1} style={{
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <activityIndicator busy color={Theme[500]} />
        </flexboxLayout>
      ) : <></>}
    </gridLayout>
  )
}
