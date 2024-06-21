import { ApolloQueryResult } from 'apollo-client'
import { ExecutionResult } from 'graphql'
import * as React from 'react'
import { MutationFunctionOptions } from 'react-apollo'
import { ACCEPT_DECLINE_FRIEND } from '~/apollo/mutations/acceptOrDeclineFriend'
import { ADD_FRIEND } from '~/apollo/mutations/addFriend'
import { FRIENDS } from '~/apollo/queries/friends'
import { PENDING } from '~/apollo/queries/pending'
import { USERS } from '~/apollo/queries/users'
import { AppAuthContext } from '~/components/Root'
import {
  Query,
  User,
  UserRelationship,
  AddFriendMutationHookResult,
  AddFriendMutationVariables,
  AcceptOrDeclineFriendMutationHookResult,
  AcceptOrDeclineFriendMutationVariables
} from '~/generated/graphql'
import { useSupotsuMutation, useSupotsuQuery } from '~/utils/useSupotsuMutation'
interface FriendsContextData {
  acceptOrDeclineFriend: (options?: MutationFunctionOptions<AcceptOrDeclineFriendMutationHookResult, AcceptOrDeclineFriendMutationVariables>) => Promise<ExecutionResult<AcceptOrDeclineFriendMutationHookResult>>
  addFriend: (options?: MutationFunctionOptions<AddFriendMutationHookResult, AddFriendMutationVariables>) => Promise<ExecutionResult<AddFriendMutationHookResult>>
  friendsList: UserRelationship[]
  pendingList: UserRelationship[]
  userList: User[]
  rfFriends: (variables?: any) => Promise<ApolloQueryResult<any>>
  rfPending: (variables?: any) => Promise<ApolloQueryResult<any>>
  loading: boolean
}
const FriendsContext = React.createContext({} as FriendsContextData)

export const FriendsProvider: React.FC = ({ children }) => {
  const { user } = React.useContext(AppAuthContext)
  const [acceptOrDeclineFriend] = useSupotsuMutation<AcceptOrDeclineFriendMutationHookResult, AcceptOrDeclineFriendMutationVariables>(ACCEPT_DECLINE_FRIEND, {

  })
  const [addFriend] = useSupotsuMutation<AddFriendMutationHookResult, AddFriendMutationVariables>(ADD_FRIEND, {})
  const { data: usersData, loading: loadingUsers } = useSupotsuQuery(USERS, {})
  const { data: friendsData, loading: loadingFriends, refetch: rfFriends } = useSupotsuQuery(FRIENDS, {
    variables: {
      _id: user._id ?? ""
    },
    fetchPolicy: 'network-only'
  })
  const { data: pendingData, loading: loadingPending, refetch: rfPending } = useSupotsuQuery(PENDING, {
    variables: {
      _id: user._id ?? ""
    },
    fetchPolicy: 'network-only'
  })
  const userList: Query['users'] = React.useMemo(() => {
    return usersData ? usersData.users : []
  }, [usersData])

  const friendsList: Query['friends'] = React.useMemo(() => {
    return friendsData ? friendsData.friends : []
  }, [friendsData])

  const pendingList: Query['pending'] = React.useMemo(() => {
    return pendingData ? pendingData.pending : []
  }, [pendingData])

  const loading = loadingFriends || loadingPending

  return (
    <FriendsContext.Provider value={{
      acceptOrDeclineFriend,
      friendsList,
      pendingList,
      userList,
      rfFriends,
      rfPending,
      loading,
      addFriend
    }}>{children}</FriendsContext.Provider>
  )
}

export const useFriendsContext = () => React.useContext(FriendsContext)
