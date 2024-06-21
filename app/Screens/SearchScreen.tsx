import * as React from 'react';
import { Page } from 'tns-core-modules/ui/page/page';
import { Frame } from 'tns-core-modules/ui/frame';
import { screen } from 'tns-core-modules/platform/platform';
import { EventData } from 'tns-core-modules/data/observable/observable';
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';;
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout'
import { PanGestureEventData, SwipeGestureEventData, SwipeDirection } from 'tns-core-modules/ui/gestures/gestures';
import {
  useNavigation
} from '@react-navigation/core';
import { ListView as $ListView, NSVElement } from "react-nativescript";
import { ScreenProps } from '~/app';
import { useState } from 'react';
import { CommonHeader, Empty, LoadingState } from '~/ui/common.ui';
import icons from '~/utils/icons';
import { useFormState } from '~/hooks/useFormState';
import { EventFilterSegments, EventItem } from './Events';
import Theme from '~/Theme';
import { useSupotsuQuery } from '~/utils/useSupotsuMutation';
import { Query, SearchQueryHookResult, SearchQueryVariables } from '~/generated/graphql';
import { SEARCH } from '~/apollo/queries/search';
import { LabelItem } from '~/components/LabelItem';
import Methods from '~/Methods';
import { format, isDate } from 'date-fns';
import { getImgSrc } from './Training';
import { AsyncPostItem } from '~/components/AsyncPostItem';
import { AppAuthContext } from '~/components/Root';
import { TimeLinePlaceHolder } from '~/components/AppContainer';
import { Profile } from './Profile';
import { Club } from './Club';
import { Tournament } from './Tournament';
import { Institution } from './Institution';
import Team from './Team';
import { useSettingsConext } from '~/contexts/SettingsContext';

interface Props { }

type SearchScreenType = 'People' | 'Posts' | 'Events' | 'Training' | 'Teams' | 'Clubs' | 'Tournaments' | 'Institutions'
const types: SearchScreenType[] = ['People', 'Posts', 'Events', 'Training', 'Teams', 'Clubs', 'Tournaments', 'Institutions']

// TODO:
// Fix all empty placeholders
const SearchScreen = ({ navigation }: ScreenProps) => {
  const { navigate, goBack } = useNavigation()
  const { canPerformAction} = useSettingsConext()
  const [active, setActive] = useState<SearchScreenType>("People")
  const { formState, handleValueChange } = useFormState({
    initialState: {
      values: {
        search: ''
      }
    }
  })
  const { data, loading, refetch } = useSupotsuQuery<SearchQueryHookResult, SearchQueryVariables>(SEARCH, {
    variables: {
      query: formState.values.search
    }
  })
  async function onSearch(){
    const { search } = formState.values
    if (search === '') return
    await refetch({
      query: search
    })
  }
  const textColor = Theme[500]
  const color = '#fff'
  return (
    <gridLayout rows="auto, auto, auto, *" background="#fff">
      <CommonHeader goBack={goBack} user={{
        name: "Search"
      }} />
      <gridLayout columns='*, 45' row={1} style={{
        padding: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
      }}>
        <textField returnKeyType='search' onReturnKeyTypeChange={onSearch} text={formState.values.search} onTextChange={(event) => {
          const { value } = event
          handleValueChange('search', value)
        }} style={{

        }} hint='Search...' />
        <label onTap={onSearch} col={1} style={{

        }} verticalAlignment='middle' textAlignment='center' horizontalAlignment='center' className='MaterialIcons size20' text={icons.MaterialIcons.search} />
      </gridLayout>
      <stackLayout row={2}>
        <EventFilterSegments stripe color={textColor} background={color} scroll options={types.map(item => item as string)} active={active} onChange={(item) => {
          setActive(item as SearchScreenType);
        }} />
      </stackLayout>
      <gridLayout row={3} background='#eee' paddingTop={loading ? 0 : 16} paddingLeft={16} paddingRight={16}>
        {!loading ? <gridLayout>
          {active === 'People' ? <SearchList keyProp='people' people={data?.search?.people} /> : <></>}
          {active === 'Clubs' ? <SearchList keyProp='clubs' clubs={data?.search?.clubs} /> : <></>}
          {active === 'Institutions' ? <SearchList keyProp='institutions' institutions={data?.search?.institutions} /> : <></>}
          {active === 'Teams' ? <SearchList keyProp='teams' teams={data?.search?.teams} /> : <></>}
          {active === 'Tournaments' ? <SearchList keyProp='tournaments' tournaments={data?.search?.tournaments} /> : <></>}
          {active === 'Events' ? <EventsList items={data?.search?.events} /> : <></>}
          {active === 'Training' ? <TrainingList items={data?.search?.training} /> : <></>}
          {active === 'Posts' ? <PostList items={data?.search?.posts} />: <></>}
        </gridLayout> : <></>}
        {loading ? <LoadingState /> : <></>}
      </gridLayout>
    </gridLayout>
  )
}

interface SearchListProps {
  people?: Query['search']['people']
  clubs?: Query['search']['clubs']
  // events: Query['search']['events']
  institutions?: Query['search']['institutions']
  // posts: Query['search']['posts']
  teams?: Query['search']['teams']
  tournaments?: Query['search']['tournaments']
  // training: Query['search']['training'],
}

type SearchListKeyType = keyof SearchListProps

interface SearchListKey {
  keyProp: SearchListKeyType
}

const Settings = {
  can_post_comments: true,
  can_comment_on_post_8989898989: false,
}

const SearchList = ({ keyProp, ...items }: SearchListProps & SearchListKey) => {
  const list = items[keyProp]
  const nav = useNavigation()
  const getRouterOptions = React.useCallback((item) => {
    if (keyProp === 'people') {
      return { route: Profile.routeName, opts: { user: item }}
    } else if (keyProp === 'clubs') {
      return { route: Club.routeName, opts: { club: item }}
    } else if (keyProp === 'tournaments') {
      return { route: Tournament.routeName, opts: { tournament: item }}
    } else if (keyProp === 'institutions') {
      return {route: Institution.routeName, opts: { institution: item }}
    } else {
      return {
        opts: { team: item },
        route: Team.routeName
      }
    }
  }, [keyProp])
  return (
    <>
      {!list || list.length === 0 ? <flexboxLayout style={{
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white'
      }}>
        <Empty />
      </flexboxLayout> : (
        <scrollView scrollBarIndicatorVisible={false}>
          <stackLayout>
            {list.map((item) => {
              return (
                <LabelItem key={item._id} onTap={() => {
                  const routeData = getRouterOptions(item)
                  nav.navigate(routeData.route, routeData.opts)
                }} icon={{
                  type: 'AntDesign',
                  name: 'eyeo'
                }} name={item.name} username={`${item.followers.length} follower${item.followers.length === 1 ? '' : 's'}`} poster={item.image} />
              )
            })}
          </stackLayout>
        </scrollView>
      )}
    </>
  )
}

interface EventsListProps{
  items: Query['search']['events']
}
const EventsList = ({ items }: EventsListProps) => {
  const list = items
  return (
    <>
      {!list || list.length === 0 ? <flexboxLayout style={{
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white'
      }}>
        <Empty />
      </flexboxLayout> : (
        <scrollView scrollBarIndicatorVisible={false}>
          <stackLayout>
            {list.map((item) => {
              const user = Methods.getUser(item.user)
              const dateStrToInt = Number(item.fullTimestamp)
              const validDate = isNaN(dateStrToInt) ? new Date(item.fullTimestamp) : new Date(dateStrToInt)
              const date = format(validDate, "dd MMM yyyy")
            return (
              <LabelItem key={item._id} onTap={() => {

              }} icon={{
                type: 'AntDesign',
                name: 'eyeo'
              }} name={item.name} username={`${user.name} - ${date}`} />
            )
            })}
          </stackLayout>
        </scrollView>
      )}
    </>
  )
}

interface TrainingListProps{
  items: Query['search']['training']
}
const TrainingList = ({ items }: TrainingListProps) => {
  const list = items
  const nav = useNavigation()
  return (
    <>
      {!list || list.length === 0 ? <flexboxLayout style={{
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white'
      }}>
        <Empty />
      </flexboxLayout> : (
        <scrollView scrollBarIndicatorVisible={false}>
          <stackLayout>
            {list.map((item) => {
              const dateStrToInt = Number(item.date)
              const validDate = isNaN(dateStrToInt) ? new Date(item.date) : new Date(dateStrToInt)
              const date = format(validDate, "dd MMM yyyy")
              const src = item.file ? getImgSrc(item.file) : '' //
              console.log(src)
            return (
              <LabelItem key={item._id} onTap={() => {
                nav.navigate("trainingSessionFileDetails", {
                  file: item._id,
                  session: ""
                })
              }} icon={{
                type: 'AntDesign',
                name: 'eyeo'
              }} name={item.title} poster={src !== "" ? src : undefined} username={`${item?.user?.name} - ${date}`} />
            )
            })}
          </stackLayout>
        </scrollView>
      )}
    </>
  )
}

interface PostListProps{
  items: Query['search']['posts']
}
const PostList = ({ items }: PostListProps) => {
  const navigation = useNavigation()
  const { user } = React.useContext(AppAuthContext)
  const list = items
  return (
    <>
      {!list || list.length === 0 ? <flexboxLayout style={{
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white'
      }}>
        <Empty />
      </flexboxLayout> : (
        <scrollView scrollBarIndicatorVisible={false}>
          <stackLayout>
            {list.map((item) => {
              return (
                <AsyncPostItem
                  navigation={navigation}
                  onBack={navigation.goBack}
                  post={item}
                  userType={user.type}
                  userTo={user._id}
                  user={user}
                  key={item._id}
                  Placholder={(args: any) => {
                    return (
                      <stackLayout padding={0}>
                        <TimeLinePlaceHolder />
                      </stackLayout>
                    )
                  }}
                />
              )
            })}
          </stackLayout>
        </scrollView>
      )}
    </>
  )
}

export default SearchScreen;
