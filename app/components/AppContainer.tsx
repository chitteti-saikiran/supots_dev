import * as React from "react";
import * as ReactNativeScript from "react-nativescript";
import { useNavigation, useRoute } from '@react-navigation/core';
import { stackNavigatorFactory } from "react-nativescript-navigation";
import IconSet from '../font-icons';
import { NSVElement, ListView } from 'react-nativescript';
import { ListView as NSListView } from '@nativescript/core/ui/list-view';
import { Color } from "tns-core-modules/color";
import Icon from "./Icon";
import Theme, { Theme2 } from "~/Theme";
import * as ISupotsu from '~/DB/interfaces';
//@ts-ignore
import { client } from "~/app";
import * as AppSettings from "@nativescript/core/application-settings";
import PostScreen from "~/Screens/PostScreen";
import Methods from "~/Methods";
import { AsyncPost } from "./GQL";
import { AsyncPostItem } from './AsyncPostItem';
import { screen } from '@nativescript/core/platform/platform';
import tabNavigatorFactoryTwo from './TabNav';
import ChatsScreen, { ChatScreen, EmailScreen, CreateEmail, CreateChat, CreateGroup, ChatDetails } from '../Screens/Chats';
import { ScreenProps } from '../app';
import NoticeScreen from '../Screens/NoticeScreen';
import SearchScreen from '../Screens/SearchScreen';
import { Page, PropertyChangeData, View } from "tns-core-modules/ui/page";
import { EventsTab, CreateEvent, EventsAvailability } from "~/Screens/Events";
import { Games } from "~/Screens/Games";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { Videos, VideoFullScreen } from "~/Screens/Videos";
import { Photos } from "~/Screens/Photos";
import { useContext, useState } from 'react';
import { Training, TrainingDetails, TrainingSessionFileDetails, TrainingMaterialCreate, TrainingSessionCreate, TrainingNotifications } from "~/Screens/Training";
import { AppAuthContext } from "./Root";
import { useSubscription } from "@apollo/react-hooks";
import { GMC_STATUS_SUBSCRIPTION } from '~/components/GQL';
import Dashboard from "~/Screens/Dashboard";
import { AddDocument, DocumentDetails } from '../Screens/Documents/index';
import { GMC, GMCNext, GMCRefs, GMCTeamsRefactor, GMCPlayersRefactor, GMCStream } from '../gmc/gmx-react';
import { AddApplication } from '../Screens/Applications/index';
import { Game, GamePostDetails } from '../Screens/Game/index';
import { CommentLightBox } from './CommentsThread';
import { GameComments } from '../Screens/Game/Comments/index';
import { FullScreenVideoScreen } from "~/Screens/Game/FullScreenVideoScreen";
import Team, { SquadPlayers } from "~/Screens/Team";
import { Clubs } from "~/Screens/Clubs";
import { Club } from "~/Screens/Club";
import { Institutions } from "~/Screens/Institutions";
import { Institution } from "~/Screens/Institution";
import { Tournaments } from "~/Screens/Tournaments";
import { Tournament, ViewEditSeason } from "~/Screens/Tournament";
import { Profile } from "~/Screens/Profile";
import { SportTeamPicker } from "./SportsTeamPicker";
import { CreatePage } from "~/Screens/CreatePage";
import { Teams } from "~/Screens/Teams";
import { Friends } from "~/Screens/Friends";
import { useSettingsConext } from "~/contexts/SettingsContext";
import { useNotificationContext } from "~/contexts/NotificationContext";

export interface Props { }

declare var PageComponentProps
const TabNavigator = tabNavigatorFactoryTwo();
const StackNavigator = stackNavigatorFactory();

/* Tabs Navigator. */

const getDummy = (_num: number, obj = null) => {
  const list = [];
  for (var index = 0; index < _num; index++) {
    list.push(obj === null ? index : obj)
  }

  return list;
}

interface WithUserState {
  user: ISupotsu.User
}

class Timeline extends React.Component<any & ScreenProps, WithUserState & {
  isLoading: boolean,
  posts: ISupotsu.Post[],
  errors: Array<any>,
  words: any,
  isLoadingMorePosts: false,
  isNoMore: false,
  isRefreshing: false,
  settings: any[],
  update: number,
  page: number,
  limit: number,
  data: Map<string, any>,
  isPostScreen: boolean,
  token?: number
}>{
  roots = new Set();

  private readonly list: React.RefObject<NSVElement<NSListView>> = React.createRef<NSVElement<NSListView>>();

  goToCreatePosts = () => {
    const { user } = this.state;
    const navProps = {
      user,
      isAdmin: true,
      postToName: user.name,
      postToImage: user.image,
      postToId: user._id,
      postToType: user.type,
    };

    this.props.navigation.navigate('post', navProps)
  }

  renderPostField = (ref?: any) => {
    const { user } = this.state;
    return (
      <gridLayout padding={`16 0`} onTap={() => this.goToCreatePosts()} {...ref ? { ref } : {}} style={{
        background: 'white',
        margin: '0px 0px'
      }}
        columns={'*'}
        rows={'*,*,*,*'}
        marginBottom={16}
      >
        <gridLayout row={1} col={0}
          columns={"20,*,10,50,15"}
          rows={'50'}
          style={{
            verticalAlignment: 'top'
          }}
        >

          <label style={{
            fontSize: 16,
            verticalAlignment: 'middle',
            color: new Color('#345')
          }} row={0} col={1} text={'Write something...'} />



          <absoluteLayout row={0} col={3} style={{
            height: 50,
            width: 50
          }}>
            <image src={(user && user.image) ? user.image : ''} decodeHeight={40} decodeWidth={40} stretch={'aspectFill'} loadMode={'async'} style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              background: '#eee'
            }} />
            <stackLayout left={25} top={40} col={3} style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              marginTop: -20,
              textAlignment: 'center',

              verticalAlignment: 'middle',
              //horizontalAlignment: 'center',
              color: new Color('#fff'),
              fontWeight: 'bold',
              background: Theme2['500']
            }}>
              <label textAlignment={'center'} verticalAlignment={'middle'} className={'Ionicons size16'} text={IconSet.Ionicons["md-add"]} style={{
                textAlignment: 'center',
                color: new Color('#fff'),
              }} />
            </stackLayout>
          </absoluteLayout>

        </gridLayout>

        <gridLayout row={3} columns={'*,*,*,*'} col={0} rows={'40'}>
          {
            this.icons().map((icon, i) => {
              return (
                <TimelineFormIcon key={i} icon={icon.name} color={new Color(icon.color)} label={String(icon.label)} row={0} col={i} />
              )
            })
          }
        </gridLayout>
      </gridLayout>
    )
  }

  refreshPosts = () => {
    const _that = this;
    this.setState({
      page: 0,
      limit: 10,
    }, () => {
      _that.getPosts();
    })
  }

  getPosts = () => {
    const _that = this;
    const { user, isHome } = this.props;
    const dateFrom = Math.floor(Date.now() / 1000);
    const defaultUser = {
      type: user.type,
      _id: user._id
    }

    const data = {
      user: Methods.you()._id,
      limit: this.state.limit,
      page: this.state.page,
      ids: !isHome ? [
        defaultUser
      ] : [
        {
          _id: Methods.you()._id,
          type: Methods.you().type
        },
        ...Methods.getTaggableUsers().map((item) => {
          return { _id: item._id, type: item.type }
        })
      ]
    }

    const variables = {
      user: data.user,
      ids: data.ids,
      limit: data.limit,
      page: data.page
    }
    const _posts = AppSettings.getString(`home-posts`, "[]");
    const cachedPosts: ISupotsu.Post[] = JSON.parse(_posts);

    _that.setState({
      posts: cachedPosts,
      isLoading: cachedPosts.length > 0
    })

    client.query({
      query: AsyncPost,
      variables,
      fetchPolicy: 'cache-first'
    }).then(({ data }) => {
      client.writeQuery({
        data: {
          posts: data.posts
        },
        query: AsyncPost,
        variables
      })
      const dateTo = Math.floor(Date.now() / 1000);
      const { posts = [] } = data;

      _that.setState({
        isLoading: false,
        posts,
        token: Date.now()
      }, () => {
        /*res.forEach(async (item, i) => {
            const _post = await DBSupotsu.Post.findOne({
                where: {_id:item._id}
            });

            if(_post){
                Object.keys(item)
            }
        })
        */
        AppSettings.setString(`home-posts`, JSON.stringify(posts))
      })
      console.log('done...');
      console.log(`TimeLine[Time taken]: ${dateTo - dateFrom}s`)
    }).catch((err) => {
      console.log("ERR", err);
      _that.setState({
        isLoading: false
      })
    })
  }

  constructor(props: any) {
    super(props);
    const _posts: ISupotsu.Post[] = JSON.parse(AppSettings.getString('home-posts', '[]'));
    const data: Map<string, any> = new Map([])
    this.state = {
      isLoading: _posts.length > 0 ? false : true,
      posts: _posts,
      errors: [],
      data,
      words: props.words ? props.words() : [],
      isLoadingMorePosts: false,
      isNoMore: false,
      isRefreshing: false,
      settings: [],
      update: 0,
      page: 0,
      limit: 15,
      token: Date.now(),
      isPostScreen: false,
      user: null
    }
  }

  componentDidMount = () => {
    const _that = this;
    const user = AppSettings.getString('you', '{}');
    const _user = JSON.parse(user);
    this.setState({
      user: _user
    }, () => {
      _that.getPosts()
    })
  }

  cellFactories = () => {
    const { renderPostField } = this;
    const _map = new Map([
      [
        "post_field",
        {
          placeholderItem: {

          },
          cellFactory: renderPostField
        }
      ],
      [
        "post",
        {
          placeholderItem: {

          },
          cellFactory: null
        }
      ]
    ]);
    return _map;
  }

  itemTemplateSelector = (item: any, index: number, items: any[]) => {
    if (index === 0) return "post_field";
    return "post_data";
  }

  private readonly icons = () => {
    //const _that = this;
    return [
      {
        name: 'panorama-fish-eye',
        label: 'Video',
        desc: 'Share Live Video',
        color: '#4ac',
        cb: () => {

        },
        //svg: require('../images/photo_icon_green.svg')
      },
      {
        name: 'camera-alt',
        label: 'Media',
        desc: 'Share Photos or Videos',
        color: '#4a5',
        cb: () => {

        },
        //svg: require('../images/photo_icon_green.svg')
      },
      {
        name: 'location-on',
        label: 'Check In',
        desc: 'Check In',
        color: '#EB6262',
        cb: () => {

        },
        //svg: require('../images/checkin_pink.svg')
      },
      {
        name: 'person-add',
        label: 'Tag',
        desc: 'Tag friends',
        color: '#4ac',
        cb: () => {

        },
        //svg: require('../images/tag_icon_blu.svg')
      }
    ]
  }

  render = () => {
    const _that = this;
    const { user, isLoading, posts } = this.state;
    const items = [
      {
        name: 'Test'
      },
      {
        name: 'Test2'
      },
      {
        name: 'Test3'
      },
      {
        name: 'Test4'
      }
    ];

    const onItemTap = (args: any) => {
      const index: number = args.index;
      const item: any = items[index];
    };

    return (
      <gridLayout>
        <scrollView background={'#eee'}>
          <stackLayout padding={`16 0`}>
            {this.renderPostField()}
            {isLoading &&
              <stackLayout recycleNativeView={'never'} paddingLeft={0} paddingTop={10} paddingRight={0}>
                <TimeLinePlaceHolder />
                <TimeLinePlaceHolderDiveder />
                <TimeLinePlaceHolder />
                <TimeLinePlaceHolderDiveder />
                <TimeLinePlaceHolder />
                <TimeLinePlaceHolderDiveder />
                <TimeLinePlaceHolder />
              </stackLayout>
            }
            {!isLoading && posts.length > 1 &&
              posts.map((item, i) => {
                return (
                  <AsyncPostItem key={i} Placholder={(args: any) => {
                    return (
                      <stackLayout padding={0}>
                        <TimeLinePlaceHolder />
                      </stackLayout>
                    )
                  }} post={item} navigation={this.props.navigation} {...this.props} />
                )
              })
            }
            {!isLoading && posts.length === 0 &&
              <stackLayout recycleNativeView={'never'} paddingLeft={0} paddingRight={0} paddingTop={10}>
                <flexboxLayout recycleNativeView={'never'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} style={{
                  //height: 50,
                  padding: 20,
                  background: '#fff'
                }}>
                  <label fontSize={24} color={new Color('#888')} text={`Ops, nothing yet!`} />
                  <label textWrap textAlignment={'center'} fontSize={15} color={new Color('#999')} text={`Make a post or follow other users to see some action!`} />
                </flexboxLayout>
              </stackLayout>
            }
          </stackLayout>
        </scrollView>
        <flexboxLayout alignItems="flex-end" justifyContent="flex-end" padding={16}>
          <flexboxLayout onTap={() => this.goToCreatePosts()} style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            background: Theme2[500],
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <label className={"MaterialIcons size25"} color="#fff" text={IconSet.MaterialIcons["chat-bubble"]} />
          </flexboxLayout>
        </flexboxLayout>
      </gridLayout>

    )
  }

  renderNew = () => {
    const _that = this;
    const { user, isLoading, posts } = this.state;
    const items = [
      {
        name: 'Test'
      },
      {
        name: 'Test2'
      },
      {
        name: 'Test3'
      },
      {
        name: 'Test4'
      }
    ];

    const onItemTap = (args: any) => {
      const index: number = args.index;
      const item: any = items[index];
    };

    return (
      <ListView
        ref={this.list}
        background={'#ddd'}
        items={[
          {},
          ...posts
        ]}
        itemTemplateSelector={this.itemTemplateSelector}
        cellFactories={this.cellFactories()}
      />
    )
  }
}

const EmptyPosts = () => {
  return (
    <stackLayout recycleNativeView={'never'} paddingLeft={0} paddingRight={0} paddingTop={10}>
      <flexboxLayout recycleNativeView={'never'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} style={{
        //height: 50,
        padding: 20,
        background: '#fff'
      }}>
        <label fontSize={24} color={new Color('#888')} text={`Ops, nothing yet!`} />
        <label textWrap textAlignment={'center'} fontSize={15} color={new Color('#999')} text={`Make a post or follow other users to see some action!`} />
      </flexboxLayout>
    </stackLayout>
  )
}

const LoadingPosts = () => {
  return (
    <stackLayout recycleNativeView={'never'} paddingLeft={0} paddingTop={10} paddingRight={0}>
      <TimeLinePlaceHolder />
      <TimeLinePlaceHolderDiveder />
      <TimeLinePlaceHolder />
      <TimeLinePlaceHolderDiveder />
      <TimeLinePlaceHolder />
      <TimeLinePlaceHolderDiveder />
      <TimeLinePlaceHolder />
    </stackLayout>
  )
}

export const TimeLinePlaceHolderDiveder = () => {
  return (
    <stackLayout style={{
      height: 10
    }} />
  )
}

export const TimelineFormIcon = (props: {
  row: number,
  col: number,
  label: string,
  icon: string,
  color: Color
}) => {
  return (
    <flexboxLayout justifyContent={'center'} alignItems={'center'} style={{

    }} row={props.row} col={props.col}>
      <Icon type={'MaterialIcons'} name={props.icon} style={{
        color: props.color,
        fontSize: 20,
        marginRight: 5,
      }} />
      <label color={new Color('#000')} text={props.label} />
    </flexboxLayout>
  )
}

export const TimeLinePlaceHolder = (props: any) => {
  const [isLight, setLight] = React.useState(false);

  return (
    <gridLayout className={'shimmer'} rows={'10,30,10,50,10'} style={{
      background: '#fff',
      opacity: isLight ? 0.6 : 1,
      ...props.style
    }} columns={`10,*,10`}>
      <gridLayout row={1} col={1} columns={`30,10,*`} rows={'30'}>
        <stackLayout row={0} col={0} style={{
          background: '#ddd',
          borderRadius: 50
        }} />

        <stackLayout row={0} col={2} style={{
          background: '#ddd'
        }} />
      </gridLayout>

      <gridLayout style={{
        background: '#ddd'
      }} row={3} col={1} rows={'30'} />
    </gridLayout>
  )
}

const HomeTabs = (props: any) => {
  const [activeIndex, setActiveIndex] = React.useState(5)
  const [active, setActive] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: true,
  })
  return (
    <tabs
      style={{ width: "100%", height: "100%", }}
      selectedIndex={activeIndex}
      swipeEnabled={false}
      onSelectedIndexChange={(args: PropertyChangeData) => {
        setActiveIndex(args.value)
        setTimeout(() => {
          setActive({
            ...active,
            [args.value]: true
          })
        }, 500)
      }}
    >
      <tabStrip nodeRole="tabStrip">
        <tabStripItem nodeRole="items">
          <label nodeRole="label" text={"Timeline"} />
        </tabStripItem>
        <tabStripItem nodeRole="items">
          <label nodeRole="label" text={"Videos"} />
        </tabStripItem>
        <tabStripItem nodeRole="items">
          <label nodeRole="label" text={"Photos"} />
        </tabStripItem>
        <tabStripItem nodeRole="items">
          <label nodeRole="label" text={"Games"} />
        </tabStripItem>
        <tabStripItem nodeRole="items">
          <label nodeRole="label" text={"Friends"} />
        </tabStripItem>
        <tabStripItem nodeRole="items">
          <label nodeRole="label" text={"Training"} />
        </tabStripItem>
        <tabStripItem nodeRole="items">
          <label nodeRole="label" text={"Events"} />
        </tabStripItem>
      </tabStrip>
      <tabContentItem nodeRole="items">
        <Timeline {...props} />
      </tabContentItem>
      <tabContentItem canBeLoaded={false} nodeRole="items">
        <Videos canBeLoaded={active['1']} {...props} />
      </tabContentItem>
      <tabContentItem canBeLoaded={false} nodeRole="items">
        <Photos canBeLoaded={active['2']} {...props} />
      </tabContentItem>
      <tabContentItem canBeLoaded={false} nodeRole="items">
        <Games {...props} />
      </tabContentItem>
      <tabContentItem canBeLoaded={false} nodeRole="items">
        <gridLayout>
          <Friends />
        </gridLayout>
      </tabContentItem>
      <tabContentItem canBeLoaded={false} nodeRole="items">
        <Training {...props} />
      </tabContentItem>
      <tabContentItem canBeLoaded={false} nodeRole="items">
        <EventsTab {...props} />
      </tabContentItem>
    </tabs>
  )
}

/* Stack Navigator. */
const StackAppContainer = () => {
  const { isAuth } = useContext(AppAuthContext);
  const game_id = '5e6a482c4987d320e0755dd6';
  const { loading, data, variables, error } = useSubscription(GMC_STATUS_SUBSCRIPTION, {
    variables: {
      _id: game_id
    },
  });

  if (!isAuth) return <></>

  return (
    <Drawer>
      {({ closeDraweCallback, openDraweCallback }: DrawerCallbacks) => {
        return (
          <>
            <StackNavigator.Navigator
              initialRouteName="home"
              screenOptions={{
                headerShown: !true,
                headerStyle: {
                  backgroundColor: 'red'
                },
                contentStyle: {
                  backgroundColor: 'white'
                },
                stackAnimation: 'flip'
              }}
            >
              <StackNavigator.Screen
                name="home"
                component={Home}
                initialParams={{
                  closeDraweCallback,
                  openDraweCallback
                }} />
              <StackNavigator.Screen
                component={Dashboard}
                name={Dashboard.routeName}
              />

              <StackNavigator.Screen
                component={Profile}
                name={Profile.routeName}
              />

              <StackNavigator.Screen
                name={CreatePage.routeName}
                component={CreatePage}
              />

              <StackNavigator.Screen
                name={AddApplication.routeName}
                component={AddApplication}
              />

              <StackNavigator.Screen
                name={AddDocument.routeName}
                component={AddDocument}
              />

              <StackNavigator.Screen
                name={DocumentDetails.routeName}
                component={DocumentDetails}
              />
              <StackNavigator.Screen
                name="search"
                component={SearchScreen}
                initialParams={{
                  closeDraweCallback,
                  openDraweCallback
                }} />
              <StackNavigator.Screen
                name="notice"
                component={NoticeScreen}
                initialParams={{
                  closeDraweCallback,
                  openDraweCallback
                }} />
              <StackNavigator.Screen
                name="post"
                component={PostScreen}
                initialParams={{
                  closeDraweCallback,
                  openDraweCallback
                }} />
              <StackNavigator.Screen
                name={CommentLightBox.routeName}
                component={CommentLightBox}
                initialParams={{
                  closeDraweCallback,
                  openDraweCallback
                }} />
              <StackNavigator.Screen
                name={ChatsScreen.routeName}
                component={ChatsScreen}
                initialParams={{
                  closeDraweCallback,
                  openDraweCallback
                }} />
              <StackNavigator.Screen
                name={ChatScreen.routeName}
                component={ChatScreen}
              />
              <StackNavigator.Screen
                name={ChatDetails.routeName}
                component={ChatDetails}
              />
              <StackNavigator.Screen
                name={EmailScreen.routeName}
                component={EmailScreen}
              />
              <StackNavigator.Screen
                name={CreateChat.routeName}
                component={CreateChat}
              />
              <StackNavigator.Screen
                name={CreateGroup.routeName}
                component={CreateGroup}
              />
              <StackNavigator.Screen
                name={CreateEmail.routeName}
                component={CreateEmail}
              />
              <StackNavigator.Screen
                name="createEvent"
                component={CreateEvent}
                initialParams={{
                  closeDraweCallback,
                  openDraweCallback
                }} />
              <StackNavigator.Screen
                name="eventAvailability"
                component={EventsAvailability}
                initialParams={{
                  closeDraweCallback,
                  openDraweCallback
                }} />

              <StackNavigator.Screen
                name="videoScreen"
                component={VideoFullScreen}
              />

              <StackNavigator.Screen
                name='trainingDetails'
                component={TrainingDetails}
              />

              <StackNavigator.Screen
                name="trainingSessionFileDetails"
                component={TrainingSessionFileDetails}
              />

              <StackNavigator.Screen
                name='trainingSessionCreate'
                component={TrainingSessionCreate}
              />

              <StackNavigator.Screen
                name='trainingMaterialCreate'
                component={TrainingMaterialCreate}
              />

              <StackNavigator.Screen
                name='trainingNotifications'
                component={TrainingNotifications}
              />

              <StackNavigator.Screen
                name={Game.routeName}
                component={Game}
              />

              <StackNavigator.Screen
                name={GameComments.routeName}
                component={GameComments}
              />

              <StackNavigator.Screen
                name={'gamePostDetails'}
                component={GamePostDetails}
              />

              <StackNavigator.Screen component={FullScreenVideoScreen} name={FullScreenVideoScreen.routeName} />

              <StackNavigator.Screen component={Team} name={Team.routeName} />

              <StackNavigator.Screen component={SquadPlayers} name={SquadPlayers.routeName} />

              <StackNavigator.Screen
                name="gmc"
                component={GMC}
              />

              <StackNavigator.Screen
                name={GMCNext.routeName}
                component={GMCNext}
              />

              <StackNavigator.Screen
                name={GMCRefs.routeName}
                component={GMCRefs}
              />

              <StackNavigator.Screen
                component={GMCTeamsRefactor}
                name={GMCTeamsRefactor.routeName}
              />

              <StackNavigator.Screen
                name={GMCPlayersRefactor.routeName}
                component={GMCPlayersRefactor}
              />

              <StackNavigator.Screen
                component={GMCStream}
                name={GMCStream.routeName}
              />

              <StackNavigator.Screen
                component={Clubs}
                name={Clubs.routeName}
              />

              <StackNavigator.Screen
                component={Club}
                name={Club.routeName}
              />

              <StackNavigator.Screen
                component={Institutions}
                name={Institutions.routeName}
              />

              <StackNavigator.Screen
                component={Institution}
                name={Institution.routeName}
              />

              <StackNavigator.Screen
                component={Tournaments}
                name={Tournaments.routeName}
              />

              <StackNavigator.Screen
                component={Teams}
                name={Teams.routeName}
              />

              <StackNavigator.Screen
                component={Tournament}
                name={Tournament.routeName}
              />

              <StackNavigator.Screen
                component={ViewEditSeason}
                name={ViewEditSeason.routeName}
              />

            </StackNavigator.Navigator>
          </>
        )
      }}
    </Drawer>
  )
};

function Home() {
  const navigation = useNavigation()
  const action = useRoute()
  const {
    isAuth,
    signIn,
    signOut,
    user
  } = useContext(AppAuthContext);
  const {
    closeDraweCallback,
    openDraweCallback,
    setNavigation
  } = useContext(DrawerContext);
  const { notices } = useNotificationContext()
  const [timestamp, setTimestamp] = React.useState(Date.now());
  const [loading, setLoading] = React.useState(!isAuth)

  const unread = notices.filter((n) => !n.context?.title.includes('chat')).filter((n) => n.context?.status === "unread")
  const unreadMgs = notices.filter((n) => n.context?.title.includes('chat')).filter((n) => n.context?.status === "unread")

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTimestamp(Date.now());
    }, 2000)
    return () => {
      clearTimeout(timer);
    }
  }, [timestamp]);

  React.useEffect(() => {
    setNavigation(navigation)
  }, [navigation])

  const iconStyle = {
    height: 40,
    width: 40,
    borderRadius: 20,
    background: "#283542"
  }

  return (
    <gridLayout
      rows={'auto,auto,*'}
      style={{
        backgroundColor: "#eee"
      }}
    >
      <stackLayout row={1}>
        <gridLayout background={'#345'} rows="5, 58" columns="16,40,*,40,6,40,6,40,16">
          <image onTap={() => {
            if (openDraweCallback) openDraweCallback();
          }} src={user && user.image ? user.image.replace(".svg", ".png") : "https://supotsu.com/default_avatar.png"} stretch="fill" loadMode="async" row={1} col={1} style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            background: "#283542"
          }} />

          <SportTeamPicker
            renderTriggerAction={(ref, open) => (
              <label ref={ref} onTap={open} margin="0 10" verticalAlignment="middle" style={{
                textAlignment: "left",
                fontWeight: "bold",
                fontSize: 24
              }} color="white" row={1} col={2} text={user && user.name ? user.name.split(" ")[0] : "Home"} />
            )}
          />

          <flexboxLayout onTap={() => {
            navigation.navigate("search", {
              user: user._id
            })
          }} justifyContent="center" alignItems="center" row={1} col={3} style={iconStyle}>
            <label className={"Ionicons size24"} color={'#fff'} text={IconSet.Ionicons["md-search"]} />
          </flexboxLayout>

          <gridLayout rows="auto, *" columns="auto, *" row={1} col={5}>
            <flexboxLayout rowSpan={2} colSpan={2} onTap={() => {
              navigation.navigate("notice", {
                user: user._id
              })
            }} justifyContent="center" alignItems="center" style={iconStyle}>
              <label className={"Ionicons size24"} color={'#fff'} text={IconSet.Ionicons["md-notifications"]} />
            </flexboxLayout>
            {unread.length > 0 && (
              <flexboxLayout justifyContent="center" alignItems="center" style={{ height: 12, width: 12, borderRadius: 50, background: 'red' }}>
                <label text={unread.length} style={{
                  fontSize: 7,
                  color: '#fff'
                }}/>
              </flexboxLayout>
            )}
          </gridLayout>

          <gridLayout rows="auto, *" columns="auto, *" row={1} col={7}>
            <flexboxLayout rowSpan={2} colSpan={2} onTap={() => {
              navigation.navigate(ChatsScreen.routeName, {
                user: user._id
              })
            }} justifyContent="center" alignItems="center" style={iconStyle}>
              <label className={"Ionicons size24"} color={'#fff'} text={IconSet.Ionicons["md-chatboxes"]} />
            </flexboxLayout>
            {unreadMgs.length > 0 && (
              <flexboxLayout justifyContent="center" alignItems="center" style={{ height: 12, width: 12, borderRadius: 50, background: 'red' }}>
                <label text={unreadMgs.length} style={{
                  fontSize: 7,
                  color: '#fff'
                }}/>
              </flexboxLayout>
            )}
          </gridLayout>
        </gridLayout>
      </stackLayout>

      {!loading &&
        <flexboxLayout row={2}>
          <HomeTabs user={user} navigation={navigation} />
        </flexboxLayout>
      }
      {loading &&
        <flexboxLayout row={2} style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <activityIndicator color={Theme[500]} busy />
        </flexboxLayout>
      }
    </gridLayout>
  );
}

//@ts-ignore
export function goToPageReact<T extends PageComponentProps<Page>>(
  PageJSXElement: React.JSXElementConstructor<T>,
  props: any,//Omit<T, "forwardedRef">,
  routeName: string,
): void {
  const forwardedRef = React.createRef<NSVElement<Page>>();

  // Really complicated overkill TypeScript compiler complaint here; I'll just suppress it with a type assertion.
  const propsWithForwardedRef: T = {
    forwardedRef,
    ...props
  } as T;

  const navKey: string = `${routeName}-${Date.now()}`;

  ReactNativeScript.render(
    (
      <contentView ref={forwardedRef}>
        <PageJSXElement key={navKey} {...propsWithForwardedRef} />
      </contentView>
    ),
    forwardedRef.current,
    () => {
      console.log(`[goToPageReact] top-level render of routeName "${routeName}" completed!`);
    },
    navKey,
  );
}

interface DrawerItem {
  label: string;
  onClick?(router: any, signOut?: Function, openSettings?: Function): void;
  keepState?: boolean;
}

const DrawerItems: DrawerItem[] = [
  {
    label: 'Timeline',
    onClick(router) {
      router.navigate('home')
    }
  },
  {
    label: 'Profile',
    onClick(router) {
      router.navigate(Profile.routeName)
    }
  },
  {
    label: 'Create Page',
    onClick(router) {
      router.navigate(CreatePage.routeName)
    }
  },
  {
    label: 'Dashboard',
    onClick(router) {
      router.navigate(Dashboard.routeName)
    }
  },
  {
    label: 'Institutions',
    onClick(router) {
      router.navigate(Institutions.routeName)
    },
  },
  {
    label: 'GMC',
    onClick(router) {
      router.navigate('gmc');
    }
  },
  {
    label: 'Clubs',
    onClick(router) {
      router.navigate(Clubs.routeName);
    }
  },
  {
    label: 'Teams',
    onClick(router) {
      router.navigate(Teams.routeName);
    }
  },
  {
    label: 'Tournaments',
    onClick(router, signOut) {
      router.navigate(Tournaments.routeName);
    }
  },
  {
    label: 'Settings',
    onClick(router, signOut, openSettings) {
      openSettings()
    },
  },
  {
    label: 'Logout',
    onClick(router, signOut) {
      if (signOut) {
        signOut()
      }
    },
  }
]

interface DrawerCallbacks {
  openDraweCallback(): void
  closeDraweCallback(index?: number): void
  setNavigation(nav: any): void
}

export const DrawerContext = React.createContext({} as DrawerCallbacks);

const Drawer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { openSettings } = useSettingsConext()
  const { signOut } = useContext(AppAuthContext)
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [screenIndex, setScreenIndex] = React.useState<number>(0);
  const [router, setNavigation] = React.useState(undefined)
  const contextTheme = Theme;
  const drawer: React.RefObject<NSVElement<ScrollView>> = React.useRef<NSVElement<ScrollView>>();
  const content: React.RefObject<NSVElement<GridLayout>> = React.useRef<NSVElement<GridLayout>>();

  const openDraweCallback = React.useCallback(() => {
    const cb = () => {
      setOpenDrawer(true)
    };
    cb();
    if (content.current! && drawer.current!) {
      const s: View = drawer.current!.nativeView as View;
      const c: View = content.current!.nativeView as View;
      c.animate({
        translate: {
          x: screen.mainScreen.widthDIPs / 2,
          y: 0
        },
        scale: {
          x: 0.8,
          y: 0.8
        },
        rotate: {
          x: 35,
          y: 0,
          z: 0
        },
        duration: 256
      }).then(() => {

      });

      s.animate({
        translate: {
          x: 0,
          y: 0
        },
        duration: 256
      }).then(() => {

      })
    }
  }, [])

  const closeDraweCallback = React.useCallback((index_?: number) => {
    const cb = () => {
      setOpenDrawer(false)
      if (index_) setScreenIndex(index_)
    };
    if (content.current! && drawer.current!) {
      const s: View = drawer.current!.nativeView as View;
      const c: View = content.current!.nativeView as View;
      c.animate({
        translate: {
          x: 0,
          y: 0
        },
        scale: {
          x: 1,
          y: 1
        },
        rotate: {
          y: 0,
          x: 0,
          z: 0
        },
        duration: 256
      }).then(() => {

      })

      s.animate({
        translate: {
          x: -screen.mainScreen.widthDIPs,
          y: 0
        },
        duration: 256
      }).then(() => {

      })

      cb()
    } else {
      cb();
    }
  }, [])

  return (
    <DrawerContext.Provider value={{
      closeDraweCallback,
      openDraweCallback,
      setNavigation
    }}>
      <gridLayout background={Theme[900]}>
        <scrollView ref={drawer} background={contextTheme[900]}>
          <stackLayout padding={`36 0`}>
            {
              DrawerItems.map((item, index) => {
                return (
                  <label marginBottom={16} padding={`8 36`} onTap={() => {
                    closeDraweCallback(!item.keepState ? index : undefined);
                    if (item.label === 'Settings' && item.onClick) {
                      item.onClick(router, signOut, openSettings)
                    } else if (item.onClick && router) item.onClick(router, signOut)
                  }} color={"#fff"} fontSize="24" text={item.label} key={item.label} style={{
                    background: screenIndex === index ? `linear-gradient(to right,${contextTheme[500]},${contextTheme[900]})` : contextTheme[900]
                  }} />
                )
              })
            }
          </stackLayout>
        </scrollView>
        <gridLayout ref={content} rows="*" translateX={openDrawer ? screen.mainScreen.widthDIPs : 0} translateY={0} background={'#fff'}>
          {typeof children === "function" ? children({
            closeDraweCallback,
            openDraweCallback
          }) : null}
          <stackLayout onTap={() => {
            closeDraweCallback(screenIndex)
          }} visibility={openDrawer ? "visible" : "hidden"} row={1} background={`linear-gradient(rgba(0,0,0,0), #fff)`} />
        </gridLayout>
      </gridLayout>
    </DrawerContext.Provider>
  )
}

StackAppContainer.Stack = StackNavigator

// export default TabsAppContainer;
export default StackAppContainer;
