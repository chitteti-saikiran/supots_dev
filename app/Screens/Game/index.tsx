import { useNavigation, useRoute } from '@react-navigation/core';
import * as React from 'react';
import { EventData, GridLayout, Screen, Color, ScrollView } from '@nativescript/core';
import { AppAuthContext } from '~/components/Root';
import { GameContext, useGameContext } from '~/contexts/GameContext';
import { useStyledContext } from '~/contexts/StyledContext';
import * as ISupotsu from '~/DB/interfaces';
import { CommonHeader, Empty, LoadingState, PostItemButton, RichTextView } from '~/ui/common.ui';
import Methods from '~/Methods';
import { GridLayoutAttributes, RNSStyle } from 'react-nativescript';
import { isGameUpcoming, isGamePast, getComments } from './helpers';
import { EventFilterSegments } from '../Events';
import { useSubscription } from '@apollo/react-hooks';
import { GMC_STATUS_SUBSCRIPTION } from '~/components/GQL';
import { SaveButton } from '../Training';
import { PhotoSementItem } from '~/Screens/Photos';
import { GameComments } from './Comments/index';
import { ActionIcon, isActionIconNeedBG } from '~/gmc/gmx-react';
import * as AppSettings from 'tns-core-modules/application-settings';
import _ from 'lodash';
import { TimelineFormIcon } from '../../components/AppContainer';
import { Theme2 } from '../../Theme';
import IconSet from '~/font-icons';
import Theme from '~/Theme';
import { create, ImagePickerMediaType } from 'nativescript-imagepicker'
import Icon from '~/components/Icon';
import Modal from '~/ui/Modal';
import { GamePostComposer } from './GamePostComposer';
import { GAME_POSTS } from '../../services/graphql/games';
//@ts-ignore
import { onTouch, client } from '~/app';
import { useSupotsuApolloContext } from '~/contexts/SupotsuApolloContext';
import { LIKE_POST } from '~/services/graphql/post';
import { getItemSpec } from '~/helpers';
import { CommentsThread } from '~/components/CommentsThread';
import { FlexboxLayout } from '@nativescript/core/ui/layouts/flexbox-layout/flexbox-layout';
import { Video } from 'nativescript-videoplayer';
import { FullScreenVideoScreen } from './FullScreenVideoScreen';
import { AddPhotos } from './AddPhotos';
import { FileUploaderProvider, useFileUploads } from '~/services/File.uploads';
import { CreatePostProvider } from '../PostScreen';

const GAME_SUMMERY_ACT_HEIGHT = 155;

type GameView = 'Timeline' | 'Summary' | 'Stats' | 'Squads' | 'Photos' | 'Videos';

const gameViews: GameView[] = [
  'Timeline',
  'Summary',
  'Stats',
  'Squads',
  'Photos',
  // 'Videos'
]
export const Game = () => {
  const navigator = useNavigation();
  const { fonts } = useStyledContext();
  const { setFavTeam, setGame } = useGameContext();
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const route = useRoute();
  const { game: initGame } = (route.params || {}) as { game: ISupotsu.Game };
  const [isVideo, setIsVideo] = React.useState(true);
  const [showScore, setShowScore] = React.useState(false);
  const [posts, setPosts] = React.useState<string[]>([])
  const [showTimes, toggleTimes] = React.useState(false);
  const [active, setActive] = React.useState<GameView>('Stats');
  const [index, setIndex] = React.useState<number>(undefined);
  const [game, updateGame] = React.useState<ISupotsu.Game>(() => initGame);
  const scrollRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const timeOutRef = React.useRef<NodeJS.Timeout>(null);
  const [favoriteTeam, setFavoriteTeam] = React.useState(() => {
    const _team: ISupotsu.Team = JSON.parse(AppSettings.getString(`team${initGame._id}`, '{}'))
    return _team._id ? _team : null;
  });

  const { data } = useSubscription(GMC_STATUS_SUBSCRIPTION, {
    variables: {
      _id: initGame._id
    },
  });

  const goalsOne: ISupotsu.GameAction[] = Methods.listify(game.teamOneActs).filter((_item) => _item.type === 'goal');
  const goalsTwo: ISupotsu.GameAction[] = Methods.listify(game.teamTwoActs).filter((_item) => _item.type === 'goal');
  const isUpcoming = isGameUpcoming(game);

  const _icons = [
    {
      icon: isVideo ? 'videocam-off' : 'videocam',
      className: 'MaterialIcons',
      size: 10,
      onPress() {
        setIsVideo(!isVideo)
      }
    }
  ]

  const onVideoTap = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }

    setShowScore(true);

    const tm = setTimeout(() => {
      setShowScore(false)
    }, 3000);

    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    }
  }

  const onVideoDoubleTap = () => {
    const current = videoRef.current;
    if (current) {
      const video = videoRef.current.nativeView as Video;
      console.log("Video timing: ", video.getCurrentTime())
      const params = {
        game,
        currentTime: video.getCurrentTime(),
        videoSrc: video.src
      }
      video.pause();
      navigator.navigate(FullScreenVideoScreen.routeName, params);
    }
  }

  React.useEffect(() => {
    const followings = me.teamsFollowed.map((t) => t.T);
  }, [game])

  React.useEffect(() => {
    if (data && data.gameUpdate) {

    }
  }, [data])

  React.useEffect(() => {
    const current = scrollRef.current;
    if (current && index) {
      const sv = scrollRef.current.nativeView as ScrollView;
      const itemToScrollTo = sv.getViewById(`action-${index}`) as FlexboxLayout;
      if (itemToScrollTo) {
        const itemIndex = itemToScrollTo.getLocationOnScreen().y;
        sv.scrollToVerticalOffset(itemIndex, true)
        setIndex(undefined)
      }
      console.log('scroll to ', index);
    }
  }, [scrollRef, index]);
  React.useEffect(() => {
    const current = videoRef.current;
    if (current) {
      const video = videoRef.current.nativeView as Video;
      video.play();
      console.log("Video timing: ", video.getCurrentTime())
    }
  }, [videoRef])

  return (
    <CreatePostProvider>
      <FileUploaderProvider _id={`game-photo-${game._id}`}>
        <gridLayout background={active === "Timeline" ? "#eee" : "#fff"} rows="auto, *, auto">
          <CommonHeader user={{
            name: "Game Details"
          }} goBack={() => {
            navigator.goBack();
          }} icons={_icons} />
          <scrollView ref={scrollRef} row={1} scrollBarIndicatorVisible={false}>
            <stackLayout>
              <gridLayout onTap={onVideoTap} onDoubleTap={onVideoDoubleTap} visibility={isVideo ? 'visible' : 'collapse'} style={{
                height: isVideo ? Screen.mainScreen.widthDIPs / 2 : 0,
                width: Screen.mainScreen.widthDIPs,
                background: '#000'
              }}>
                <videoPlayer ref={videoRef} autoPlay={true} src='http://supotsu.com:8000/live/test/index.m3u8' width={'100%'} height={'100%'} />
                <gridLayout visibility={showScore ? 'visible' : 'collapse'} columns='*, auto, 100, auto, *' rows='40, *' padding={17}>
                  <image col={1} height={35} width={35} src={game.teamOne.image} />
                  <label col={2} text={isUpcoming ? `VS` : `${goalsOne.length} - ${goalsTwo.length}`} style={GameBannerScoreStyles.goals} horizontalAlignment='center' />
                  <image height={35} width={35} col={3} src={game.teamTwo.image} />
                </gridLayout>
              </gridLayout>
              <GameBanner isVideo={isVideo} onFavoriteTeamSelect={(team: ISupotsu.Team) => {
                if (!favoriteTeam) {
                  setFavoriteTeam(team);
                  setFavTeam(team);
                  AppSettings.setString(`team${initGame._id}`, JSON.stringify(team))
                }
              }} />
              {!favoriteTeam && (
                <flexboxLayout style={{
                  background: '#D23242',
                  padding: 8,
                }}>
                  <label textWrap color="#fff" text="Please select a team that you follow by clicking on the team's logo above" />
                </flexboxLayout>
              )}
              <EventFilterSegments scroll options={gameViews.map(item => item as string)} active={active} onChange={(item) => {
                setActive(item as GameView);
              }} />
              {active === "Timeline" && (
                <GameTimeline onPostUpdated={(posts) => {
                  setPosts(Object.keys(posts));
                }} />
              )}
              {active === "Summary" && (
                <GameSummary />
              )}
              {active === "Stats" && (
                <GameStats />
              )}
              {active === "Squads" && (
                <GameSquads />
              )}
              {active === "Photos" && (
                <GamePhotos />
              )}
            </stackLayout>
          </scrollView>
          <flexboxLayout row={1} alignItems="flex-end" justifyContent="center" padding={16}>
            <Modal
              renderTriggerAction={(ref, open) => (
                <flexboxLayout ref={ref} visibility={active === 'Timeline' ? 'visible' : 'collapse'} onTap={open} style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  background: Theme2[500],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <label className={"MaterialIcons size25"} color="#fff" text={IconSet.MaterialIcons["chat-bubble"]} />
                </flexboxLayout>
              )}
              fullscreen
              renderContent={(open, close) => (
                <GamePostComposer active={icons[0]} close={close} />
              )}
            />
          </flexboxLayout>

          <AddGamePhotos active={active === 'Photos'} />

          <flexboxLayout visibility={active === 'Timeline' ? 'visible' : 'collapse'} row={1} alignItems="flex-end" justifyContent="flex-end" padding={16}>
            <flexboxLayout onTap={() => {
              toggleTimes(!showTimes)
            }} style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              background: Theme2[500],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <label className={"MaterialIcons size25"} color="#fff" text={!showTimes ? IconSet.MaterialIcons["timelapse"] : IconSet.MaterialIcons.close} />
            </flexboxLayout>
          </flexboxLayout>
          <flexboxLayout visibility={showTimes && active === 'Timeline'  ? 'visible' : 'hidden'} row={1} alignItems="flex-end" justifyContent="flex-end" padding={16} paddingBottom={80}>
            <scrollView scrollBarIndicatorVisible={false} width={60} height="80%" background='#ddd' borderRadius={30}>
              <stackLayout marginTop={16} marginBottom={8}>
                {posts.map((p) => (
                  <flexboxLayout key={p} style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: Theme2[500],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16
                  }} onTap={() => {
                    toggleTimes(false);
                    setIndex(Number(p))
                  }}>
                    <label text={`${p}'`} style={{
                      color: '#fff',
                      fontSize: 18
                    }} />
                  </flexboxLayout>
                ))}
              </stackLayout>
            </scrollView>
          </flexboxLayout>
        </gridLayout>
      </FileUploaderProvider>
    </CreatePostProvider>
  );
}

Game.routeName = 'game';

interface AddGamePhotosProps {
  active: boolean
}
const AddGamePhotos: React.FC<AddGamePhotosProps> = ({
  active
}) => {
  const {
    user
  } = React.useContext(AppAuthContext);
  const { game } = useGameContext();
  const { pickAFile, files, clearFiles, isRawFile } = useFileUploads();
  const key = Object.keys(files)[0];
  const file = files[key];

  const post = (fileId: string) => {
    const finalCB = () => {

    }

    const _that = this;
    const _user = {
      ...user,
      id: user._id,
    }

    const _userTo = {
        name: 'Game',
        image: '',
        id: game._id,
        type: 'G'
      }

    const successCB = (res) => {
      clearFiles();
    }

    const failCB = (err) => {
      clearFiles();
    }

    const linkImages = [];


    const newPost = {
      user: _user,
      userTo: _userTo,
      type: 1,
      postType: "normal",
      sport: undefined,
      isError: false,
      isEvent: false,
      content: '',
      rawContent: '',
      media: [fileId],
      timeAgo: new Date(),
      isLiked: false,
      likes: [],
      links: [],
      linkImages: linkImages,
      place: undefined,
      shares: [],
      audience: "friends",
      tagged: [],
      audienceList: [],
      tagsLen: 0,
      comments: [],
      commentType: 'photo',
      file: fileId,
      pages: ['timeline', 'photos']
    };

    Methods.post(`https://supotsu.com/api/feed/create`, newPost, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if(res.error) {
          failCB(res)
        } else {
          successCB(res)
        }
      },
      error(err) {
        failCB(err);
      }
    })
  }

  React.useEffect(() => {
    const key = Object.keys(files)[0];
    const file = files[key];
    console.log(file)
    if (file && !isRawFile(file.file)) {
      // @ts-ignore
      if (file.file._id) post(file.file._id)
    }
  }, [files])
  return (
    <flexboxLayout row={1} alignItems="flex-end" justifyContent="center" padding={16}>
      <flexboxLayout visibility={active ? 'visible' : 'collapse'} onTap={async () => {
        if (file) return;
        pickAFile(true)
      }} style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        background: Theme2[500],
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {!file && <label className={"MaterialIcons size25"} color="#fff" text={IconSet.MaterialIcons["camera-alt"]} />}
        {file && <activityIndicator width={20} height={20} color='white' busy/>}
      </flexboxLayout>
    </flexboxLayout>
  )
}

const GamePhotos = () => {
  return (
    <Empty text='No photos yet!' />
  )
}

interface GameBannerProps {
  onFavoriteTeamSelect?(team: ISupotsu.Team): void;
  isVideo?: boolean;
}

const GameBanner: React.FC<GameBannerProps> = ({
  onFavoriteTeamSelect,
  isVideo,
}) => {
  const { theme } = useStyledContext();
  const { game } = useGameContext();
  const goalsOne: ISupotsu.GameAction[] = Methods.listify(game.teamOneActs).filter((_item) => _item.type === 'goal');
  const goalsTwo: ISupotsu.GameAction[] = Methods.listify(game.teamTwoActs).filter((_item) => _item.type === 'goal');
  return (
    <gridLayout visibility={isVideo ? 'collapse' : 'visible'} columns="*" rows="*" style={{
      height: isVideo ? 80 : Screen.mainScreen.widthDIPs / 1.5,
      width: Screen.mainScreen.widthDIPs,
      background: theme.secondary[500]
    }}>
      <image col={0} row={0} stretch={"aspectFill"} src="https://supotsu.com/images/player_profile_cover.jpg" />
      <gridLayout padding={16} col={0} row={0} columns={`*, ${Screen.mainScreen.widthDIPs / 4}, *`}>
        <GameBannerTeam isVideo={isVideo} onTeamSelect={onFavoriteTeamSelect} goals={goalsOne} col={0} team={game.teamOne} squad={game.squadOne} />
        <GameBannerScore isVideo={isVideo} />
        <GameBannerTeam isVideo={isVideo} onTeamSelect={onFavoriteTeamSelect} goals={goalsTwo} col={2} team={game.teamTwo} squad={game.squadTwo} />
      </gridLayout>
    </gridLayout>
  )
}

interface GameBannerTeamProps extends GameBannerProps {
  col: number;
  team: ISupotsu.Team;
  squad: ISupotsu.Squad;
  goals: ISupotsu.GameAction[];
  onTeamSelect(team: ISupotsu.Team): void;
}

const GameBannerTeam: React.FC<GameBannerTeamProps> = ({
  col,
  squad,
  team,
  goals,
  onTeamSelect,
  isVideo,
}) => {
  const goalList = goals.map((goal) => {
    return {
      time: Math.floor(goal.time / 60),
      name: goal.player.name
    }
  })
  return (
    <gridLayout rows={isVideo ? "40, auto, auto" : "60, auto, *"} col={col} style={{
      padding: '8 12 0'
    }}>
      <image onTap={() => onTeamSelect(team)} row={0} src={team.image} width={isVideo ? 40 : 60} height={isVideo ? 40 : 60} />
      <label visibility={isVideo ? "hidden" : "visible"} textWrap row={1} text={squad.name} style={{
        color: '#fff',
        fontSize: 18,
        textAlignment: 'center',
        marginBottom: 16,
        marginTop: 8,
      }} />
      <scrollView visibility={isVideo ? "hidden" : "visible"} row={2}>
        <stackLayout>
          {goalList.map((goal, index) => {
            return (
              <gridLayout key={index} columns="15, auto, auto" marginLeft={16} >
                <label text={`${goal.time}'`} fontSize={9} color="#fff" />
                <label col={2} text={goal.name} fontSize={9} color="#fff" />
              </gridLayout>
            )
          })}
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

interface GameBannerScoreProps {
  isVideo?: boolean
}

const GameBannerScore: React.FC<GameBannerScoreProps> = ({
  isVideo
}) => {
  return (
    <gridLayout col={1} rows="60, 30, *">
      <GameBannerScores />
      {!isVideo && <GameBannerTimer />}
      {!isVideo && <GameBannerVenue />}
    </gridLayout>
  )
}

const GameBannerScores = () => {
  const { game } = useGameContext();
  const goalsOne: ISupotsu.GameAction[] = Methods.listify(game.teamOneActs).filter((_item) => _item.type === 'goal');
  const goalsTwo: ISupotsu.GameAction[] = Methods.listify(game.teamTwoActs).filter((_item) => _item.type === 'goal');
  const isUpcoming = isGameUpcoming(game);
  if (isUpcoming) {
    return (
      <flexboxLayout alignItems="flex-start" justifyContent="center" row={0} borderBottomColor="#fff" borderBottomWidth={1}>
        <label horizontalAlignment="center" verticalAlignment="middle" col={1} text="VS" style={GameBannerScoreStyles.goals} />
      </flexboxLayout>
    )
  }
  return (
    <flexboxLayout paddingTop={8} alignItems="flex-start" justifyContent="center" row={0} borderBottomColor="#fff" borderBottomWidth={1}>
      <gridLayout columns="*, auto, 30, auto, *">
        <label horizontalAlignment="center" verticalAlignment="middle" col={1} text={`${goalsOne.length}`} style={GameBannerScoreStyles.goals} />
        <label horizontalAlignment="center" verticalAlignment="middle" col={2} text={' - '} style={GameBannerScoreStyles.goals} />
        <label horizontalAlignment="center" verticalAlignment="middle" col={3} text={`${goalsTwo.length}`} style={GameBannerScoreStyles.goals} />
      </gridLayout>
    </flexboxLayout>
  )
}

const GameBannerScoreStyles: Record<string, RNSStyle> = {
  goals: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlignment: 'center',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlignment: 'center',
  },
  place: {
    color: '#fff',
    textAlignment: 'center',
    fontSize: 10
  }
}

const GameBannerTimer: React.FC<{}> = () => {
  const { game } = useGameContext();
  const time = isGameUpcoming(game) ? 'Upcoming' : isGamePast(game) ? 'FT' : `${Math.floor(game.currentTime / 60)}'`;
  return (
    <flexboxLayout row={1} justifyContent="center" alignItems="center" borderBottomColor="#fff" borderBottomWidth={1}>
      <label horizontalAlignment="center" text={time} style={GameBannerScoreStyles.timer} />
    </flexboxLayout>
  )
}

const GameBannerVenue: React.FC<{}> = () => {
  const { game } = useGameContext();
  return (
    <flexboxLayout row={2} justifyContent="center" alignItems="flex-start">
      <label text={!game.matchPlace ? 'TBA' : game.matchPlace.name} style={GameBannerScoreStyles.place} margin='4 0' />
    </flexboxLayout>
  )
}

type GamePostReactionIconType = 'player' | 'moment' | 'reaction';
export interface GamePostReactionIcon {
  name: string;
  label: string;
  type?: string;
  key: GamePostReactionIconType
}

export const icons: GamePostReactionIcon[] = [
  {
    name: 'people',
    label: 'Player',
    key: 'player'
  },
  {
    name: 'soccer',
    type: 'MaterialCommunityIcons',
    label: 'Key Moment',
    key: 'moment'
  },
  {
    name: 'thumbs-up-down',
    label: 'React',
    key: 'reaction'
  }
]

type GameTimelinePostTypeID = 'post' | 'action'

interface GameTimelinePost extends ISupotsu.GamePost {
  objectType: GameTimelinePostTypeID
}

interface GameTimelineAction extends ISupotsu.GameAction {
  objectType: GameTimelinePostTypeID
}

type GameTimelinePostType = GameTimelineAction | GameTimelinePost;

interface GameTimelineProps {
  onPostUpdated?(posts: any): void;
}

const GameTimeline: React.FC<GameTimelineProps> = ({ onPostUpdated }) => {
  const { game } = React.useContext(GameContext);
  const { user } = React.useContext(AppAuthContext);

  const postsStr = AppSettings.getString(`game_posts_${game._id}`, '[]');
  const posts_: ISupotsu.GamePost[] = JSON.parse(postsStr);

  const [posts, setPosts] = React.useState<ISupotsu.GamePost[]>(posts_);
  const [loading, setLoading] = React.useState(true);

  const [active, setActive] = React.useState(icons[0]);

  const getPosts = () => {
    client.query({
      query: GAME_POSTS,
      variables: {
        _id: game._id,
      }
    }).then(({ data }) => {
      setLoading(false);
      if (data.gamePosts) {
        const { gamePosts } = data;
        setPosts(gamePosts);
        AppSettings.setString(`game_posts_${game._id}`, JSON.stringify(gamePosts))
      }
    }).catch((e) => {
      setLoading(false);
    })
  };

  const allPosts = React.useMemo(() => {
    const items: Record<string, GameTimelinePostType[]> = {};
    posts.forEach((p) => {
      const key = Math.floor(p.min / 60)
      if (items[key]) {
        items[key] = [...items[key], {
          ...p,
          objectType: 'post'
        }];
      } else {
        items[key] = [{
          ...p,
          objectType: 'post'
        }];
      }
    });

    [...game.teamOneActs.map((a) => ({
      ...a,
      team: game.teamOne,
    })), ...game.teamTwoActs.map((a) => ({
      ...a,
      team: game.teamTwo,
    }))].forEach((p) => {
      const key = Math.floor(p.time / 60)
      if (items[key]) {
        items[key] = [...items[key], {
          ...p,
          objectType: 'action'
        }];
      } else {
        items[key] = [{
          ...p,
          objectType: 'action'
        }];
      }
    });

    return items;
  }, [posts, game.teamOneActs, game.teamTwoActs])

  React.useEffect(() => {
    getPosts();
  }, []);

  React.useEffect(() => {
    if (onPostUpdated) onPostUpdated(allPosts)
  }, [allPosts])

  const isAction = (item: GameTimelinePostType): item is GameTimelineAction  => {
    return item.objectType === 'action';
  }

  return (
    <>
      <gridLayout style={{
        background: 'white',
        margin: '16 0',
        padding: '16 0',
      }} rows="auto, 50, auto">
        <label padding='0 16' style={{
          fontSize: 16,
          verticalAlignment: 'middle',
          color: '#345'
        }} row={1} text={'Write something...'} />

        <Modal
          renderTriggerAction={(ref, open) => (
            <gridLayout ref={ref} padding='0 0' row={2} columns={'*,*,*'} height={40} col={0} rows={'40'}>
              {
                icons.map((icon, i) => {
                  return (
                    <flexboxLayout key={i} justifyContent={'center'} alignItems={'center'} style={{

                    }} col={i}>
                      <flexboxLayout justifyContent={'center'} onTap={() => {
                        setActive(icon);
                        open();
                      }} alignItems={'center'} style={{
                        background: Theme[500],
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                      }}>
                        <Icon type={icon.type ? icon.type : 'MaterialIcons'} name={icon.name} style={{
                          color: '#fff',
                          fontSize: 25,
                        }} />
                      </flexboxLayout>
                    </flexboxLayout>
                  )
                })
              }
            </gridLayout>
          )}
          fullscreen
          renderContent={(open, close) => (
            <GamePostComposer active={active} close={close} />
          )}
        />
      </gridLayout>
      {Object.keys(allPosts).map((i) => {
        const items = allPosts[i]
        return (
          <gridLayout key={i} margin={"0 4 0 0"} columns="*, 4, auto">
            <stackLayout col={0}>
              {
                allPosts[i].map((u, i) => {
                  const action = isAction(u);
                  if (action) return <GameTimeActionCell item={u} key={i} />;
                  return <GameTimelineCell item={u} key={i} />
                })
              }
            </stackLayout>
            <absoluteLayout key={i} col={2} style={{
              width: 40,
              height: 'auto'
            }}>
              <stackLayout left={20} top={0} style={{
                background: '#e5e5e5',
                width: 8,
                height: GAME_SUMMERY_ACT_HEIGHT * items.length,
              }} />
              <flexboxLayout id={`action-${i}`} left={8} top={0} style={{
                height: 30,
                width: 30,
                borderRadius: 30 / 2,
                background: Theme2[500],
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <label text={`${i}'`} style={{
                  color: '#fff',
                  fontSize: 16,
                }} />
              </flexboxLayout>
            </absoluteLayout>
          </gridLayout>
        )
      })}
    </>
  )
}

interface GameTimeActionCellProps {
  item: GameTimelineAction
}

function getScoreBeforeTime(item: GameTimelineAction, game: ISupotsu.Game) {
  const actionOne = game.teamOneActs.filter((a) => a.time <= item.time && a.type === 'goal');
  const actionTwo = game.teamTwoActs.filter((a) => a.time <= item.time && a.type === 'goal');
  return item.team._id === game.teamOne._id ? `${actionOne.length} - ${actionTwo.length}` : `${actionTwo.length} - ${actionOne.length}`
}

const GameTimeActionCell: React.FC<GameTimeActionCellProps> = ({
  item
}) => {
  const { game } = useGameContext();
  const navigator = useNavigation();
  const onTap = () => {
    navigator.navigate('gamePostDetails', {
      item
    })
  }

  const scoreBeforeTime = getScoreBeforeTime(item, game);

  return (
    <stackLayout padding={16} paddingRight={0} style={{
      background: Theme['500'],
      marginBottom: 16,
      padding: '16 16 16 16'
    }}>
      <gridLayout columns='0,40, 0, *, 30, 16'>
        <flexboxLayout col={1}>
          <image decodeHeight={40} decodeWidth={40} src={item?.team?.image} loadMode={'async'} col={0} borderRadius={20} height={{ value: 40, unit: 'dip' }} width={{ value: 40, unit: 'dip' }} />
        </flexboxLayout>
        <flexboxLayout justifyContent='center' col={3}>
          <label text={scoreBeforeTime} style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: '#fff'
          }}/>
        </flexboxLayout>
        <flexboxLayout col={4} justifyContent='flex-end' paddingTop={10} alignItems='center'>
          <image width={20} height={20} src={ActionIcon[item.type]} />
        </flexboxLayout>
      </gridLayout>
      <gridLayout marginTop={16} borderTopColor='#ddd' borderTopWidth={1} paddingTop={16} columns='auto, auto, auto, *'>
        <flexboxLayout justifyContent='center' col={0} marginRight={4}>
          <GameSummaryGraphicItemFilterItem embed act={item as ISupotsu.GameAction} item='Friends' />
        </flexboxLayout>
        <flexboxLayout justifyContent='center' col={1} marginRight={4}>
          <GameSummaryGraphicItemFilterItem embed act={item as ISupotsu.GameAction} item='Fans' />
        </flexboxLayout>
        <flexboxLayout justifyContent='center' col={2} marginRight={4}>
          <GameSummaryGraphicItemFilterItem embed act={item as ISupotsu.GameAction} item='Rivals' />
        </flexboxLayout>
      </gridLayout>
    </stackLayout>
  )
}

interface GameTimelineCellProps {
  item: GameTimelinePost;
}

const GameTimelineCell: React.FC<GameTimelineCellProps> = ({
  item
}) => {
  const navigator = useNavigation();
  const onTap = () => {
    navigator.navigate('gamePostDetails', {
      item
    })
  }
  return (
    <stackLayout onTap={onTap} padding={16} paddingRight={0} style={{
      background: 'white',
      marginBottom: 16,
      borderBottomRightRadius: 10,
      borderTopRightRadius: 10,
    }}>
      <gridLayout columns={`40, auto, *, auto`} row={1}>
        <image decodeHeight={40} decodeWidth={40} src={item?.user?.image} loadMode={'async'} col={0} borderRadius={20} height={{ value: 40, unit: 'dip' }} width={{ value: 40, unit: 'dip' }} />
        <gridLayout rows={`auto, auto`} col={1} marginLeft={15} marginTop={-2} marginRight={15}>
          <label row={0} style={{
            fontSize: 16,
            fontWeight: '500',
          }} text={Methods.nullify(item.user.name).toLowerCase()} />
          <label row={1} textWrap style={{
            fontSize: 10,
            marginTop: -3,
            color: new Color("#888"),
            verticalAlignment: 'middle',
            textAlignment: 'left'
          }} text={Methods.getDateFrom(parseInt(item.date), true).toUpperCase()} />
        </gridLayout>
      </gridLayout>
      <stackLayout paddingRight={15} padding={0} marginBottom={15} marginTop={15}>
        <gridLayout columns={'*, auto'} style={{
          flexDirection: 'column',
        }}>
          <RichTextView col={0} style={{
            padding: `0 0`,
            marginBottom: 0,
            fontSize: 15,
          }}
            onUserPress={(user) => {

            }} users={[]} content={item.content.trim()} userStyle={{}} hashStyle={{}} skillStyle={{}} linkStyle={{}} />
        </gridLayout>
      </stackLayout>
      <GameTimelineCellControls item={item} />
    </stackLayout>
  )
}

const GameTimelineCellControls: React.FC<GameTimelineCellProps>  = (args) => {
  const { appRef, user:me } = React.useContext(AppAuthContext);
  const { client } = useSupotsuApolloContext();
  const [isLiking, setIsLiking] = React.useState(false)
  const item = args.item;

  const ICON_SIZE = 22;

  const like = () => {
    if (isLiking) return;
    const variables = {
      likeData: {
        _id: me._id,
        type: 'F',
        contentId: item._id,
        contentType: 'gamePost',
      }
    }
    setIsLiking(true);
    client.mutate({
      variables,
      mutation: LIKE_POST
    }).then(({ data }) => {
      setIsLiking(false);
    }).catch((err) => {
      setIsLiking(false)
    })
  }

  return (
    <React.Fragment>
      <gridLayout columns={getItemSpec(['*', 'auto', 'auto', 'auto', 'auto'])} style={{
        //height: 45,
        paddingRight: 15,

        background: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <flexboxLayout col={0} style={{
          flexDirection: 'row',
          paddingLeft: 0,
          paddingRight: 0,
          alignItems: 'center'
        }}>
          {item.likes.length === -1 && <label style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={Methods.shortDigit(item.likes.length, "Like").data} />}
          {Methods.listify(item.comments).length > 0 && <label onTap={() => {

          }} style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={`View all ${Methods.shortDigit(Methods.listify(item.comments).length, "Comment").data}`} />}

        </flexboxLayout>
        <PostItemButton col={1} style={{
          paddingLeft: 3,
          paddingRight: 3,
          opacity: isLiking ? 0.5 : 1
        }} onPress={() => {
          like();
        }} Icon={<Methods.LikeIcon liked={false} size={ICON_SIZE + 2} />
        } Label={Methods.shortDigit(item.likes.length, "Like").data} count={Methods.shortDigit(item.likes.length, "Like").text} LabelColor={"#000"} />
        <PostItemButton col={2} style={{
          paddingHorizontal: 3
        }} countColor={Theme2['500']} onPress={() => {

        }} Icon={
          <Methods.CommentIcon commented={false} size={ICON_SIZE} />
        } count={Methods.shortDigit(item.comments.length, "Comment").text} Label={Methods.shortDigit(item.comments.length, "Comment").data} />
      </gridLayout>
    </React.Fragment>
  )
}

interface GameTimelineCellDummyProps {
  width?: string | number;
  height?: string | number;
}

const GameTimelineCellDummy: React.FC<GameTimelineCellDummyProps> = ({
  width = '50%',
  height = 45
}) => {
  return (
    <gridLayout columns={`${width}, *`} marginBottom={8} rows={`${height}`}>
      <label col={0} row={0} style={{
        background: '#eee'
      }} />
    </gridLayout>
  )
}

export const GamePostDetails = () => {
  const navigator = useNavigation();
  const { fonts } = useStyledContext();
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const route = useRoute();
  const { item } = (route.params || {}) as { item: ISupotsu.GamePost };
  const [loading, setLoading] = React.useState(false);
  return (
    <gridLayout background="#fff" rows="auto, auto, auto, *, auto">
      <CommonHeader user={{
        name: `Comments`
      }} goBack={() => {
        navigator.goBack();
      }} />
      <stackLayout row={1}>
        {
          // @ts-ignore
          <GameTimelineCell item={item} />
        }
      </stackLayout>
      <label row={2} style={{
        height: 1,
        background: '#ddd'
      }}/>
      {!loading && (
        <CommentsThread
          comments={item.comments}
          postCommentType="gamePost"
          postId={item._id}
          row={3}
          path="gamePost"
        />
      )}
      {loading && (
        <flexboxLayout row={3} style={{
          width: '100%',
          padding: 20,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <LoadingState />
        </flexboxLayout>
      )}
    </gridLayout>
  )
}

GamePostDetails.routeName = 'gamePostDetails';

const GameSummary: React.FC = () => {
  const { game } = React.useContext(GameContext);
  const [active, setActive] = React.useState('Graphic')
  return (
    <stackLayout>
      <gridLayout marginBottom={16} columns="*,*">
        {['Graphic', 'Text'].map((item, i) => {
          return (
            <PhotoSementItem key={item} onSelect={() => {
              setActive(item)
            }} active={Boolean(active === item)} col={i} item={item} />
          )
        })}
      </gridLayout>
      {active == "Graphic" && (
        <GameSummaryGraphic />
      )}
      {active === "Text" && (
        <TextualSummary />
      )}
    </stackLayout>
  )
}

const TextualSummary: React.FC = () => {
  const { game } = React.useContext(GameContext);
  const acts = [...game.teamOneActs.map((item) => ({
    ...item,
    team: game.teamOne
  })), ...game.teamTwoActs.map((item) => ({
    ...item,
    team: game.teamTwo
  }))];
  return (
    <>
      {acts.sort((a, b) => {
        return a.time > b.time ? 1 : -1
      }).map((act, index) => {
        return (
          <TextualSummaryItem key={index} item={act} isOdd={index % 2 !== 0} />
        )
      })}
    </>
  )
}

interface TextualSummaryItemProps {
  item: ISupotsu.GameAction,
  isOdd: boolean;
  embedded?: boolean;
  col?: number;
  row?: number;
}

export const TextualSummaryItem: React.FC<TextualSummaryItemProps> = ({
  isOdd,
  item,
  embedded,
  col,
  row,
}) => {
  const { theme } = useStyledContext();
  return (
    <stackLayout {...col ? { col } : {}} {...row ? { row } : {}} style={{
      background: isOdd ? theme.secondary[100] : '#fff',
      padding: 16,
      ...embedded ? {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
      } : {},
    }}>
      <gridLayout columns="*, auto">
        <stackLayout col={0}>
          <label text={`${Math.floor(item.time / 60)}' ${item.team.name}`} style={{
            fontWeight: '500',
            color: theme.secondary[500],
            fontSize: 20,
          }} />
          <label style={{
            fontWeight: '500',
            color: '#000',
          }} text={`${item.player.name}`} />
        </stackLayout>
        {isActionIconNeedBG(item.type) && (
          <flexboxLayout style={{
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            background: theme.primary[500]
          }} col={1}>
            <image width={15} height={15} src={ActionIcon[item.type]} />
          </flexboxLayout>
        )}
        {!isActionIconNeedBG(item.type) && (
          <image width={20} height={20} src={ActionIcon[item.type]} col={1} />
        )}
      </gridLayout>
      {!embedded && (
        <flexboxLayout marginBottom={8}>
          <GameSummaryGraphicItemAction count={0} icon="thumb-up" />
          <GameSummaryGraphicItemAction count={0} icon="thumb-down" />
        </flexboxLayout>
      )}
      {!embedded && GameSummaryGraphicItemFilters.map((i) => <GameSummaryGraphicItemFilterItem act={item} item={i} key={i} />)}
    </stackLayout>
  )
}

interface GraphicGameActData {
  team: number;
  act: ISupotsu.GameAction;
}

type GraphicGameAct = Record<number, GraphicGameActData[]>

const GameSummaryGraphic = () => {
  const { theme } = useStyledContext();
  const { game } = React.useContext(GameContext);
  const getActs = (): GraphicGameAct => {
    const acts = {};
    game.teamOneActs.forEach((act) => {
      const key = Math.floor(act.time / 60)
      if (!acts[key]) {
        acts[key] = [
          {
            team: 1,
            act: {
              ...act,
              team: game.teamOne,
            }
          }
        ]
      } else {
        acts[key].push({
          team: 1,
          act: {
            ...act,
            team: game.teamOne,
          }
        })
      }
    })
    game.teamTwoActs.forEach((act) => {
      const key = Math.floor(act.time / 60)
      if (!acts[key]) {
        acts[key] = [
          {
            team: 2,
            act: {
              ...act,
              team: game.teamTwo,
            }
          }
        ]
      } else {
        acts[key].push({
          team: 2,
          act: {
            ...act,
            team: game.teamTwo,
          }
        })
      }
    })
    return acts
  }
  return (
    <>
      <gridLayout columns="*, auto, *">
        <GameSummaryAvatar col={0} team={game.teamOne} squad={game.squadOne} />
        <stackLayout col={1}>

        </stackLayout>
        <GameSummaryAvatar col={2} team={game.teamTwo} squad={game.squadTwo} />
      </gridLayout>
      {Object.keys(getActs()).map((key, index) => {
        const actData: GraphicGameActData[] = getActs()[key];
        const teamOne = actData.filter((i) => i.team === 1);
        const teamTwo = actData.filter((i) => i.team === 2);
        return (
          <GameSummaryActs keyFor={`${key}`} key={index} teamOne={teamOne} teamTwo={teamTwo} />
        )
      })}
    </>
  )
}

interface GameSummaryActsProps {
  teamOne: GraphicGameActData[],
  teamTwo: GraphicGameActData[],
  keyFor: string;
}

const GameSummaryActs = ({
  keyFor: key,
  teamOne,
  teamTwo
}: GameSummaryActsProps) => {
  const { theme } = useStyledContext();
  const factor = teamOne.length > teamTwo.length ? teamOne.length : teamTwo.length;
  return (
    <gridLayout height={"auto"} columns="*, auto, *">
      <stackLayout col={0}>
        {teamOne.map((item) => <GameSummaryGraphicItem key={item.act._id} item={item} />)}
      </stackLayout>
      <absoluteLayout key={key} col={1} style={{
        width: 60,
        height: 'auto'
      }}>
        <stackLayout left={20} top={0} style={{
          background: '#ccc',
          width: 8,
          height: GAME_SUMMERY_ACT_HEIGHT * factor,
        }} />
        <flexboxLayout left={2} top={0} style={{
          height: 45,
          width: 45,
          borderRadius: 45 / 2,
          background: theme.secondary[500],
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <label text={`${key}'`} style={{
            color: '#fff',
            fontSize: 16,
          }} />
        </flexboxLayout>
      </absoluteLayout>
      <stackLayout col={2}>
        {teamTwo.map((item) => <GameSummaryGraphicItem right key={item.act._id} item={item} />)}
      </stackLayout>
    </gridLayout>
  )
}

interface GameSummaryGraphicItemProps {
  item: GraphicGameActData;
  right?: boolean
}

export type GameSummaryGraphicItemFilter = "Friends" | "Fans" | "Rivals"

const GameSummaryGraphicItemFilters: GameSummaryGraphicItemFilter[] = ["Friends", "Fans", "Rivals"]

const GameSummaryGraphicItem = ({
  item: { act },
  right,
}: GameSummaryGraphicItemProps) => {
  const { theme } = useStyledContext();
  return (
    <stackLayout padding="4 8" marginBottom={8}>
      <gridLayout columns={right ? "auto, *" : "*, auto"}>
        <stackLayout col={right ? 1 : 0}>
          <label textAlignment={right ? "right" : "left"} style={{
            fontWeight: '500',
            color: theme.primary[500],
          }} text={`${act.player.name}`} />
          <label textAlignment={right ? "right" : "left"} style={{
            color: '#888',
          }} text={""} />
        </stackLayout>
        {isActionIconNeedBG(act.type) && (
          <flexboxLayout style={{
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            background: theme.primary[500]
          }} col={right ? 0 : 1}>
            <image width={15} height={15} src={ActionIcon[act.type]} />
          </flexboxLayout>
        )}
        {!isActionIconNeedBG(act.type) && (
          <image width={20} height={20} src={ActionIcon[act.type]} col={right ? 0 : 1} />
        )}
      </gridLayout>
      <flexboxLayout marginBottom={8} flexDirection={right ? "row-reverse" : "row"}>
        <GameSummaryGraphicItemAction count={0} icon="thumb-up" />
        <GameSummaryGraphicItemAction count={0} icon="thumb-down" />
      </flexboxLayout>
      {GameSummaryGraphicItemFilters.map((i, index) => <GameSummaryGraphicItemFilterItem act={act} right={right} item={i} key={index} />)}
    </stackLayout>
  )
}
interface GameSummaryGraphicItemAction {
  icon: 'thumb-down' | 'thumb-up';
  count: number;
}

const GameSummaryGraphicItemAction = ({
  icon,
  count,
}: GameSummaryGraphicItemAction) => {
  const { fonts, theme, onTouch } = useStyledContext();
  return (
    <flexboxLayout onTouch={onTouch} margin="4 8 0 0" color={theme.secondary[500]}>
      <label marginRight={5} className="MaterialIcons size10" text={fonts.MaterialIcons[icon]} />
      <label text={`${count}`} color="#888" fontSize={10.5} />
    </flexboxLayout>
  )
}

interface GameSummaryGraphicItemFilterItemProps extends GridLayoutAttributes {
  item: GameSummaryGraphicItemFilter,
  right?: boolean,
  embed?: boolean,
  act: ISupotsu.GameAction,
}

const GameSummaryGraphicItemFilterItem = ({
  item,
  right,
  act,
  embed,
  ...rest
}: GameSummaryGraphicItemFilterItemProps) => {
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const { onTouch } = useStyledContext();
  const { navigator, game, favoriteTeam } = useGameContext();

  const gameComments = getComments({
    comments: act.comments,
    yourTeam: favoriteTeam ? favoriteTeam._id : "",
    yourId: me._id,
  })

  return (
    <gridLayout marginBottom={4} onTouch={onTouch} onTap={() => {
      if (!favoriteTeam) {
        alert('Please select a team you\'re supporting in this game')
        return;
      }

      if (!act) return;
      navigator.navigate(GameComments.routeName, {
        game,
        filter: item,
        action: act,
      })
    }} columns={embed ? 'auto, auto, auto' : right ? "*, auto, auto" : "100, auto, *"} {...rest}>
      <label col={right ? 1 : 0} verticalAlignment="middle" style={{
        color: '#888',
        fontSize: 10.5,
        ...right ? {
          marginRight: 4
        } : {}
      }} text={`${item} ${embed ? '' : 'comments'}`} />
      <flexboxLayout col={right ? 2 : 1} style={{
        height: 15,
        width: 15,
        borderRadius: 5,
        background: '#D23242',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <label style={{
          color: '#fff',
          fontSize: 8
        }} text={gameComments[item.toLocaleLowerCase()].length} />
      </flexboxLayout>
    </gridLayout>
  )
}

interface GameSummaryAvatarProps {
  col: number;
  team: ISupotsu.Team;
  squad: ISupotsu.Squad
}

const GameSummaryAvatar = ({
  col,
  squad,
  team
}: GameSummaryAvatarProps) => {
  return (
    <gridLayout col={col} rows="60, auto">
      <image row={0} src={team.image} width={60} height={60} />
      <label textWrap row={1} text={squad.name} style={{
        color: '#000',
        fontSize: 18,
        textAlignment: 'center',
        marginBottom: 16,
        marginTop: 8,
      }} />
    </gridLayout>
  )
}

const GameStats: React.FC = () => {
  return (
    <stackLayout padding={16}>
      <GameStatsMeter labelFor="Possession" left={50} right={50} />
      <GameStatsMeter labelFor="Shots at Goals" left={12} right={9} />
      <GameStatsMeter labelFor="Fouls" left={8} right={50} />
      <GameStatsMeter labelFor="Corners" left={4} right={2} />
      <GameStatsMeter labelFor="Offsides" left={2} right={0} />
      <GameStatsMeter labelFor="Red Cards" left={0} right={0} />
      <GameStatsMeter labelFor="Yellow Cards" left={1} right={2} />
    </stackLayout>
  )
}

interface GameStatsMeterProps {
  labelFor: string;
  left: number;
  right: number;
  prefix?: string
}

const GameStatsMeter: React.FC<GameStatsMeterProps> = ({
  labelFor,
  left,
  right,
  prefix = ''
}) => {
  const total = left + right;
  return (
    <stackLayout>
      <gridLayout columns="auto, *, auto">
        <label horizontalAlignment="center" col={0} text={`${left}${prefix}`} />
        <label horizontalAlignment="center" col={1} text={labelFor} />
        <label horizontalAlignment="center" col={2} text={`${right}${prefix}`} />
      </gridLayout>
      <gridLayout height={20} margin="8 0 16" columns="*, *">
        <GameStatsMeterBar progress={total === 0 ? 0 : left / total * 100} total={total} col={0} />
        <GameStatsMeterBar secondary progress={total === 0 ? 0 : right / total * 100} total={total} col={1} />
      </gridLayout>
    </stackLayout>
  )
};

interface GameStatsMeterBarProps {
  total: number;
  progress: number;
  col: number;
  secondary?: boolean;
}

const GameStatsMeterBar: React.FC<GameStatsMeterBarProps> = ({
  progress,
  col,
  secondary
}) => {
  const { theme } = useStyledContext();
  return (
    <flexboxLayout flexDirection={secondary ? 'row' : 'row-reverse'} backgroundColor="#eee" col={col}>
      <stackLayout width={`${progress}%`} style={{
        background: secondary ? theme.primary[500] : theme.secondary[500],
      }} />
    </flexboxLayout>
  )
}

const GameSquads: React.FC = () => {
  const { game } = React.useContext(GameContext);
  const [active, setActive] = React.useState(0);
  return (
    <>
      <gridLayout marginBottom={16} columns="*,*">
        {[game.teamOne.name, game.teamTwo.name].map((item, i) => {
          return (
            <PhotoSementItem key={item} onSelect={() => {
              setActive(i)
            }} active={Boolean(active === i)} col={i} item={item} />
          )
        })}
      </gridLayout>
      <gridLayout columns="*, *">
        <GameSquad col={0} lineup={active === 0 ? game.players.teamOne.lineup : game.players.teamTwo.lineup} labelFor="Lineup" />
        <GameSquad col={1} lineup={active === 0 ? game.players.teamOne.subs : game.players.teamTwo.subs} labelFor="Subs" />
      </gridLayout>
    </>
  )
}

interface GameSquadProps {
  col: number;
  lineup: ISupotsu.Player[];
  labelFor: string;
};

const GameSquad: React.FC<GameSquadProps> = ({
  col,
  lineup,
  labelFor,
}) => {
  const labelStyle: RNSStyle = {
    fontSize: 20,
    color: 'black',
    horizontalAlignment: 'center',
    marginBottom: 8,
    marginTop: 8,
  }
  return (
    <scrollView col={col}>
      <stackLayout>
        <label style={labelStyle} text={labelFor} />
        {lineup.map((p) => {
          return (
            <GameSquadPlayer key={p._id} item={p} />
          )
        })}
      </stackLayout>
    </scrollView>
  )
}

interface GameSquadPlayer {
  item: ISupotsu.Player
}

const GameSquadPlayer: React.FC<GameSquadPlayer> = ({
  item
}) => {
  return (
    <gridLayout rows="auto, auto, auto, auto" style={{
      background: '#EFEFEF',
      borderWidth: 1,
      borderColor: '#ccc',
      width: '80%',
      marginBottom: 16,
      paddingTop: 9,
    }}>
      <flexboxLayout row={0} flexDirection="column" justifyContent="center" alignItems="center">
        <image stretch="fill" src={String(item.user.image).replace('default_avatar.svg', 'default_avatar.png')} style={{
          height: 70,
          width: 70,
          borderRadius: 70 / 2,
          marginBottom: 2,
        }} />
      </flexboxLayout>
      <stackLayout row={1} padding={8}>
        <label text={item.number} style={{
          color: '#555',
          fontSize: 14,
          fontWeight: '600'
        }} />
        <label text={item.name} style={{
          color: '#555',
          fontSize: 14,
          fontWeight: '600'
        }} />
      </stackLayout>
      <stackLayout row={2} padding={8} background='#fff'>
        <GameSquadPlayerLabel labelFor="Appearences" value={`${item?.acts?.length ?? 0}`} />
        <GameSquadPlayerLabel labelFor="Golas" value={`${item?.shootouts?.length ?? 0}`} />
        <SaveButton row={3} text="VIEW" />
      </stackLayout>
    </gridLayout>
  )
}

interface GameSquadPlayerLabelProps {
  labelFor: string;
  value: string
}

const GameSquadPlayerLabel = ({
  labelFor,
  value
}: GameSquadPlayerLabelProps) => {
  return (
    <gridLayout columns="*, auto" style={{
      marginBottom: 4,
    }}>
      <label text={labelFor} col={0} style={{
        color: '#555',
        fontSize: 12,
      }} />
      <label text={value} col={1} style={{
        color: '#555',
        fontSize: 12,
      }} />
    </gridLayout>
  )
}
