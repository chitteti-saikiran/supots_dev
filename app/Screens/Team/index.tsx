import { useNavigation, useRoute } from '@react-navigation/core';
import * as React from 'react';
import { AppAuthContext } from '~/components/Root';
import { useGameContext } from '~/contexts/GameContext';
import { useStyledContext } from '~/contexts/StyledContext';
import * as ISupotsu from '~/DB/interfaces';
import { CommonHeader, Empty, LoadingState, Modal, ModalActionButon, ModalHeaderSize, ModalProps } from '~/ui/common.ui';
import _ from 'lodash';
import { EventFilterSegments } from '../Events';
import IconSet from '~/font-icons';
import Theme, { Theme2 } from '../../Theme';
import Methods from '~/Methods';
import { Games } from "~/Screens/Games";
import { useQuery } from '@apollo/react-hooks';
import { PlayerQL, TEAM } from '../../components/GQL';
import { Photos, PhotoSementItem } from '../Photos';
import { CommonTimeLine } from '~/components/CommonTimeLine';
import { GridLayoutAttributes, ListView } from 'react-nativescript';
import { SaveButton } from '../Training';
import { screen } from 'tns-core-modules/platform';
import { Frame, isIOS } from 'tns-core-modules/ui/frame';
import { Videos } from '../Videos';
import { client, onTouch } from '~/app';
import { goToPageReact } from '~/components/AppContainer';
import { PlayerPickerModal } from '~/gmc/gmx-react';
import { Modal as NativeModal } from '~/ui/Modal'
import { AboutTeam, SocialIcons } from './AboutTeam';
import { FAN_PAGE, FOLLOW_PAGE, LIKE_PAGE } from '~/services/graphql/team';
import { UnionUser } from '~/utils/types';
//@ts-ignore

type TeamView = 'Timeline' | 'Games' | 'Teams' | 'Squads' | 'About' | 'Photos' | 'Videos' | 'Training' | 'Sports' | 'Fans';

const teamViews: TeamView[] = [
  'Timeline',
  'Squads',
  'Games',
  'About',
  'Fans',
  'Photos',
  'Videos'
]

const Team = () => {
  const navigator = useNavigation();
  const { fonts } = useStyledContext();
  const { setFavTeam, setGame } = useGameContext();
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const route = useRoute();
  const { team: initTeam } = (route.params || {}) as { team: ISupotsu.Team };

  const { data, refetch, loading: isTeamLoading } = useQuery(TEAM, {
    variables: {
      _id: initTeam?._id
    },
    onCompleted(data) {
        console.log(data)
    },
  })

  const team: ISupotsu.Team = React.useMemo(() => {
    return data && data.team ? data.team : initTeam
  }, [data, initTeam])

  // const color = team.color : Theme2[500];

  const color = '#00458F';

  const [active, setActive] = React.useState<TeamView>('Timeline');
  const [isLiked, setIsLiked] = React.useState(false);
  const [isFollewed, setIsFollewed] = React.useState(false);
  const [loading, setLoading] = React.useState({
    follow: false,
    like: false
  })

  const isLight = Methods.luminance_get(color) > 180 ? false : true;
  const textColor = '#fff' // isLight ? '#000' : '#fff'

  const isSmallScreen = screen.mainScreen.widthDIPs < 400;

  const follow = () => {
    // setIsFollewed(!isFollewed);
    setLoading({
      ...loading,
      follow: true
    })
    const data = {
      user: {
        id: me._id,
        _id: me._id,
        type: me.type
      },
      like: 'profile',
      userTo: {
        type: 'T',
        id: team._id,
        _id: team._id
      },
      reqOwner: {
        id: me._id,
        _id: me._id,
        type: me.type
      }
    }

    client.mutate({
      mutation: FOLLOW_PAGE,
      variables: {
        data
      }
    }).then(({ data }) => {
      setLoading({
        ...loading,
        follow: false
      })
      refetch()
    }).catch((error) => {
      setLoading({
        ...loading,
        follow: false
      })
    })
  }

  const like = () => {
    const data = {
      user: {
        id: me._id,
        _id: me._id,
        type: me.type
      },
      like: 'profile',
      userTo: {
        type: 'T',
        id: team._id,
        _id: team._id
      },
      reqOwner: {
        id: me._id,
        _id: me._id,
        type: me.type
      }
    }
    setLoading({
      ...loading,
      like: true
    })

    client.mutate({
      mutation: LIKE_PAGE,
      variables: {
        data
      }
    }).then(({ data }) => {
      setLoading({
        ...loading,
        follow: false
      })
      refetch()
    }).catch((error) => {
      setLoading({
        ...loading,
        follow: false
      })
    })
  }

  const fan = () => {
    const data = {
      user: {
        id: me._id,
        _id: me._id,
        type: me.type
      },
      like: 'profile',
      userTo: {
        type: 'T',
        id: team._id,
        _id: team._id
      },
      reqOwner: {
        id: me._id,
        _id: me._id,
        type: me.type
      }
    }
    setLoading({
      ...loading,
      like: true
    })

    client.mutate({
      mutation: FAN_PAGE,
      variables: {
        data
      }
    }).then(({ data }) => {
      setLoading({
        ...loading,
        follow: false
      })
      refetch()
    }).catch((error) => {
      setLoading({
        ...loading,
        follow: false
      })
    })
  }

  const followers = [Methods.you()]

  // if (isTeamLoading) {
  //   return (
  //     <gridLayout rows="auto, *">
  //       <CommonHeader user={{
  //         ...team,
  //         image: undefined
  //       }} goBack={navigator.canGoBack ? navigator.goBack : undefined} />
  //       <flexboxLayout row={1} style={{
  //         alignItems: 'center',
  //         justifyContent: 'center'
  //       }}>
  //         <activityIndicator busy color={Theme[500]} />
  //       </flexboxLayout>
  //     </gridLayout>
  //   )
  // }

  return (
    <gridLayout rows="auto, *">
      <CommonHeader search user={{
        name: 'Team Details'
      }} goBack={() => navigator.goBack()} background={color} color={textColor} />

      <scrollView row={1}>
        <stackLayout paddingBottom={16} background={'#eee'}>
          <gridLayout rows='*, 60' style={{
            background: '#000',
            height: 200,
          }}>
            <image row={0} rowSpan={2} stretch={"aspectFill"} src="https://supotsu.com/images/player_profile_cover.jpg" />
            <stackLayout row={0} rowSpan={2} className='clip' style={{
              background: color,
            }}>

            </stackLayout>
            <gridLayout row={1}>
              <gridLayout columns='*, auto'>
                <flexboxLayout col={1} style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  marginBottom: 8,
                }}>
                  <label text='1,533 Fans' style={{
                    background: color,
                    padding: '4 8',
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: textColor
                  }} />
                </flexboxLayout>
              </gridLayout>
            </gridLayout>
          </gridLayout>
          <gridLayout rows='*, auto' style={{
            background: color,
            height: 250,
            marginBottom: 8
          }}>
            <gridLayout paddingLeft={30} columns='100, *'>
              <flexboxLayout style={{
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: 10,
                marginRight: 10
              }}>
                <image style={{
                  width: 70,
                  height: 70,
                  borderRadius: 70 / 2,
                }} src={team?.image} stretch='aspectFit' />
              </flexboxLayout>
              <flexboxLayout col={1} justifyContent='center' flexDirection='column'>
                <label text={team?.name} style={{
                  color: textColor,
                  fontSize: 26,
                  marginBottom: 8,
                }} />
                <OverviewContact textColor={textColor} value={team.email || 'no email set'} image={isLight ? 'website_icon' : 'website_icon_wht'} />
                <OverviewContact iconName='smartphone' textColor={textColor} value={team.contactMain || 'no contact set'} image={isLight ? 'mobile_icon' : 'mobile_icon_wht'} />
                <OverviewContact iconType='Octicons' iconName='globe' textColor={textColor} value={team.website || 'not website set'} image={isLight ? 'email_icon' : 'email_icon_wht'} />

                <flexboxLayout>
                  <label style={{
                    height: 3,
                    width: 90,
                    background: textColor,
                    marginTop: 20,
                    marginLeft: 20,
                  }} />
                </flexboxLayout>
              </flexboxLayout>
            </gridLayout>
            <FollowSection textColor={textColor} refetch={refetch} page={team} />
          </gridLayout>
          <EventFilterSegments stripe color={textColor} background={color} scroll options={teamViews.map(item => item as string)} active={active} onChange={(item) => {
            setActive(item as TeamView);
          }} />
          <flexboxLayout visibility={isTeamLoading ? 'visible' : 'collapse'} style={{
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            <LoadingState style={{
              background: '#eee'
            }} />
          </flexboxLayout>
          <stackLayout visibility={active === 'Timeline' && !isTeamLoading ? 'visible' : 'collapse'}>
            <CommonTimeLine postUser={{
              _id: team._id,
              type: 'T'
            }} />
          </stackLayout>
          <flexboxLayout visibility={active === 'Fans' && !isTeamLoading ? 'visible' : 'collapse'} style={{
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            background: '#eee'
          }}>
            <Empty text='No fans found for this team!' style={{
              background: '#eee'
            }} />
          </flexboxLayout>
          <stackLayout visibility={active === 'Games' && !isTeamLoading ? 'visible' : 'collapse'}>
            <Games sportFilter user={team} />
          </stackLayout>
          <stackLayout visibility={active === 'Fans' && !isTeamLoading ? 'visible' : 'collapse'}>
            <FollowersAndFans likes={team.likes} fans={team.fans} followers={team.followers} teamColor={color} textColor={textColor} />
          </stackLayout>
          <stackLayout visibility={active === 'Squads' && !isTeamLoading ? 'visible' : 'collapse'}>
            <SquadTabs team={data?.team} teamColor={color} textColor={textColor} />
          </stackLayout>
          <NativeModal
            fullscreen
            renderTriggerAction={(ref, open) => (
              <stackLayout ref={ref} onTap={open} visibility={active === 'About' && !isTeamLoading ? 'visible' : 'collapse'} marginTop={17}>
                <ProfileLabel text='Overview' />

                <stackLayout style={{
                  marginBottom: 10,
                  backgroundColor: 'white'
                }}>
                  {team.manager && <ProfilePersonalLabel newBanner label={'Manager'} value={team.manager.name} />}
                  <ProfilePersonalLabel newBanner label={'Location'} value={team.address ? team.address : 'Not set'} />
                  {/* <ProfilePersonalLabel newBanner label={'Suburb'} value={team.suburb} />
                  <ProfilePersonalLabel newBanner label={'State/Province'} value={team.state} />
                  <ProfilePersonalLabel newBanner label={'Postal code'} value={team.postal} />
                  <ProfilePersonalLabel newBanner label={'Country'} value={team.country} /> */}
                </stackLayout>
                <ProfileLabel text={'Social'} />
                <SocialIcons isVertical items={team.socials} />
              </stackLayout>
            )}
            renderContent={(open, close, isModalOpen) => {
              return (
                <AboutTeam team={team} refresh={refetch} open={open} close={close} />
              )
            }}
          />
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

Team.routeName = 'teamDetails';

interface FollowSectionProps {
  page: UnionUser,
  refetch?(): void
  textColor: string
}

export const FollowSection = ({
  page,
  refetch = () => { },
  textColor
}: FollowSectionProps) => {
  const { user: me } = React.useContext(AppAuthContext)
  const [isLiked, setIsLiked] = React.useState(false);
  const [isFollewed, setIsFollewed] = React.useState(false);
  const [loading, setLoading] = React.useState({
    follow: false,
    like: false
  })
  const follow = () => {
    // setIsFollewed(!isFollewed);
    setLoading({
      ...loading,
      follow: true
    })

    const data = {
      user: {
        id: me._id,
        _id: me._id,
        type: me.type
      },
      like: 'profile',
      userTo: {
        type: page.type,
        id: page._id,
        _id: page._id
      },
      reqOwner: {
        id: me._id,
        _id: me._id,
        type: me.type
      }
    }

    client.mutate({
      mutation: FOLLOW_PAGE,
      variables: {
        data
      }
    }).then(({ data }) => {
      setLoading({
        ...loading,
        follow: false
      })
      refetch()
    }).catch((error) => {
      setLoading({
        ...loading,
        follow: false
      })
    })
  }

  const like = () => {
    const data = {
      user: {
        id: me._id,
        _id: me._id,
        type: me.type
      },
      like: 'profile',
      userTo: {
        type: page.type,
        id: page._id,
        _id: page._id
      },
      reqOwner: {
        id: me._id,
        _id: me._id,
        type: me.type
      }
    }
    setLoading({
      ...loading,
      like: true
    })

    client.mutate({
      mutation: LIKE_PAGE,
      variables: {
        data
      }
    }).then(({ data }) => {
      setLoading({
        ...loading,
        follow: false
      })
      refetch()
    }).catch((error) => {
      setLoading({
        ...loading,
        follow: false
      })
    })
  }

  const fan = () => {
    const data = {
      user: {
        id: me._id,
        _id: me._id,
        type: me.type
      },
      like: 'profile',
      userTo: {
        type: page.type,
        id: page._id,
        _id: page._id
      },
      reqOwner: {
        id: me._id,
        _id: me._id,
        type: me.type
      }
    }
    setLoading({
      ...loading,
      like: true
    })

    client.mutate({
      mutation: FAN_PAGE,
      variables: {
        data
      }
    }).then(({ data }) => {
      setLoading({
        ...loading,
        follow: false
      })
    }).catch((error) => {
      setLoading({
        ...loading,
        follow: false
      })
    })
  }

  const icons = [
    { name: "Favourite", icon: "star", loading: 'like', iconType: "MaterialIcons" },
    { name: "Unfavour", icon: "star", loading: 'like', iconType: "MaterialIcons" },
    { name: "Follow", icon: "rss-feed", loading: 'follow', iconType: "MaterialIcons" },
    { name: "Unfollow", icon: "rss-feed", loading: 'follow', iconType: "MaterialIcons" },
    { name: "Contact", icon: "facebook-messenger", loading: 'contact', iconType: "MaterialCommunityIcons" },
  ];

  const isSmallScreen = screen.mainScreen.widthDIPs < 400;

  const followers = []
  const likes = []

  return (
    <flexboxLayout justifyContent='center' row={1} padding={isSmallScreen ? '0 8 8' : '0 16 16'}>
      {icons.map((btn, index) => {
        if (btn.name === "Follow" && isFollewed) return null;
        if (btn.name === "Unfollow" && !isFollewed) return null;
        if (btn.name === "Favourite" && isLiked) return null;
        if (btn.name === "Unfavour" && !isLiked) return null;
        return (
          <flexboxLayout key={index} onTap={() => {
            if (loading[btn.loading]) return false;
            setLoading({
              ...loading,
              [btn.loading]: true
            })
            if (btn.loading === "like") {
              like();
            } else {
              follow();
              fan()
            }
          }} flexDirection={isSmallScreen ? 'column' : 'row'} style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: isSmallScreen ? 70 : 50,
            padding: 10,
            marginRight: 8,
          }}>
            <label visibility={!loading[btn.loading] ? 'visible' : 'collapse'} style={{
              color: textColor,
            }} className={`${btn.iconType} size30`} text={IconSet[btn.iconType][btn.icon]} />

            <activityIndicator visibility={loading[btn.loading] ? 'visible' : 'collapse'} color={textColor} width={15} height={15} busy />

            <label text={btn.name} style={{
              marginLeft: isSmallScreen ? 0 : 4,
              color: textColor,
            }} />
          </flexboxLayout>
        )
      })}
    </flexboxLayout>
  )
}

interface FollowersAndFansProps {
  followers: ISupotsu.Follower[]
  fans: ISupotsu.Fan[]
  likes: ISupotsu.Like[]
  teamColor: string
  textColor: string
}

export const FollowersAndFans = ({
  fans,
  followers,
  teamColor,
  textColor,
  likes
}: FollowersAndFansProps) => {
  const [active, setActive] = React.useState('Followers')
  return (
    <stackLayout>
      <gridLayout marginTop={16} marginBottom={8} columns='*, *, *'>
        {['Followers', 'Fans', 'Likes'].map((p, i) => {
          return (
            <PhotoSementItem color={teamColor} key={i} active={active === p} col={i} item={p} onSelect={() => setActive(p)} />
          )
        })}
      </gridLayout>
      <stackLayout visibility={active === 'Followers' ? 'visible' : 'collapse'}>
        <FollowerFanList background={teamColor} color={textColor} list={followers} />
      </stackLayout>

      <stackLayout visibility={active === 'Fans' ? 'visible' : 'collapse'}>
        <FollowerFanList background={teamColor} color={textColor} list={fans} />
      </stackLayout>

      <stackLayout visibility={active === 'Likes' ? 'visible' : 'collapse'}>
        <FollowerFanList background={teamColor} color={textColor} list={likes} />
      </stackLayout>
    </stackLayout>
  )
}

interface FollowerFanListProps {
  list: ISupotsu.Follower[] | ISupotsu.Fan[] | ISupotsu.Like[]
  color: string
  background: string
}
const FollowerFanList = ({
  list,
  background,
  color
}: FollowerFanListProps) => {
  const chunks: ISupotsu.Follower[][] = Methods.arrayChunks(list, 2)
  return (
    <>
    {chunks.map((items, index) => {
        const [s1, s2] = items;
        return (
          <gridLayout key={index} style={{
            padding: '0 17'
          }} columns='*, 8, *'>
            <FollowerFanItem background={background} color={color} item={s1} col={0} />
            <FollowerFanItem background={background} color={color} item={s2} col={2} />
          </gridLayout>
        )
      })}
    </>
  )
}

interface FollowerFanItemProps extends GridLayoutAttributes {
  item: ISupotsu.Follower,
  background: string
  color: string
}

const FollowerFanItem = ({
  background,
  color,
  item,
  ...rest
}: FollowerFanItemProps) => {
  if (!item) {
    return (
      <gridLayout style={{
        height: 200,
      }} {...rest} rows="*, auto" />
    )
  }
  return (
    <gridLayout style={{
      height: 190,
      background: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
    }} {...rest} rows="*, auto">
      <gridLayout rows='*, auto'>
        <flexboxLayout style={{
          width: '100%',
          // height: 100,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <image width={80} height={80} borderRadius='50%' stretch='aspectFill' src={Methods.getUser(item.user).image}/>
        </flexboxLayout>
        <ProfilePersonalLabel row={1} label='Name' value={Methods.getUser(item.user).name} />
      </gridLayout>
      <SaveButton backgroundColor={background} color={color} text='VIEW' row={1} />
    </gridLayout>
  )
}

interface SquadTabs {
  team: ISupotsu.Team,
  teamColor: string,
  textColor?: string;
}

const SquadTabs: React.FC<SquadTabs> = ({
  team,
  teamColor,
  textColor
}) => {
  const [active, setActive] = React.useState('Current')
  const { current, past } = team ? team.squads : { current: [], past: [] };
  return (
    <>
      <gridLayout marginTop={16} marginBottom={8} columns='*, *'>
        {['Current', 'Past'].map((p, i) => {
          return (
            <PhotoSementItem color={teamColor} key={i} active={active === p} col={i} item={p} onSelect={() => setActive(p)} />
          )
        })}
      </gridLayout>
      <stackLayout visibility={active === 'Current' ? 'visible' : 'collapse'}>
        <SquadListView background={teamColor} color={textColor} squads={current} />
      </stackLayout>

      <stackLayout visibility={active === 'Past' ? 'visible' : 'collapse'}>
        <SquadListView background={teamColor} color={textColor} squads={past} />
      </stackLayout>
    </>
  )
}

interface SquadListViewProps {
  background?: string;
  color?: string;
  squads: ISupotsu.Squad[]
}
const SquadListView: React.FC<SquadListViewProps> = ({
  squads,
  background,
  color
}) => {
  const chunks: ISupotsu.Squad[][] = Methods.arrayChunks(squads, 2)
  return (
    <>
      {chunks.map((items, index) => {
        const [s1, s2] = items;
        return (
          <gridLayout key={index} style={{
            padding: '0 17'
          }} columns='*, 8, *'>
            <SquadListViewItem background={background} color={color} squad={s1} col={0} />
            <SquadListViewItem background={background} color={color} squad={s2} col={2} />
          </gridLayout>
        )
      })}
    </>
  )
}

interface SquadListViewItemProps extends GridLayoutAttributes {
  background?: string;
  color?: string;
  squad: ISupotsu.Squad
}

const SquadListViewItem: React.FC<SquadListViewItemProps> = ({
  squad,
  background,
  color,
  ...rest
}) => {
  const navigator = useNavigation();
  if (!squad) {
    return (
      <gridLayout style={{
        height: 200,
      }} {...rest} rows="*, auto" />
    )
  }
  return (
    <gridLayout style={{
      height: 182,
      background: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
    }} {...rest} rows="*, auto" onTap={() => {
      navigator.navigate(SquadPlayers.routeName, {
        squad
      })
    }}>
      <stackLayout>
        <ProfilePersonalLabel label='Name' value={squad.name} />
        <ProfilePersonalLabel label='Gender' value={squad.gender} />
        <ProfilePersonalLabel label='Players' value={squad?.players?.length.toString()} />
      </stackLayout>
      <SaveButton backgroundColor={background} color={color} text='VIEW' row={1} />
    </gridLayout>
  )
}

interface OverviewContactProps {
  value: string;
  image: string;
  textColor?: string;
  iconType?: string;
  iconName?: string;
}
export const OverviewContact: React.FC<OverviewContactProps> = ({
  image: src,
  value,
  textColor = '#fff',
  iconType = 'MaterialIcons',
  iconName = 'email'
}) => {
  return (
    <flexboxLayout style={{
      marginBottom: 8,
      alignItems: 'center',
    }}>
      <label className={`${iconType} size16`} text={IconSet[iconType][iconName]} style={{
        color: textColor
      }} />
      <label text={value} style={{
        fontSize: 12,
        margin: `0 10`,
        color: textColor
      }} />
    </flexboxLayout>
  )
}

export const ProfileLabel = ({ text = "" }) => {
  return (
    <flexboxLayout style={{
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 10',
      height: 40,
      marginBottom: 10,
      backgroundColor: "#fff"
    }}>
      <label style={{
        color: '#000',
        fontSize: 17,
        fontWeight: 'bold'
      }}>{text}</label>
    </flexboxLayout>
  )
}

export const ProfilePersonalLabel = ({ borderBottomWidth = 1, labelStyle = {}, valueStyle = {}, borderTopWidth = 0, label = "", value = "", ...props }) => {
  return (
    <gridLayout {...props} style={{
      height: 45,
      borderColor: '#eee',
      borderBottomWidth,
      borderTopWidth,
      padding: '0 15'
    }} columns='auto, *, auto'>
      <label verticalAlignment='middle' style={{
        fontSize: 14,
        color: props.newBanner ? '#999' : Theme2['500'],
        fontWeight: props.newBanner ? 'normal' : 'bold',
        ...labelStyle
      }}
      >{label}</label>

      <label col={2} verticalAlignment='middle' style={{
        fontSize: 14,
        color: Theme['500'],
        textAlignment: 'right',
        fontWeight: !props.newBanner ? 'normal' : 'bold',
        ...valueStyle
      }}
      >{`${value}`}</label>
    </gridLayout>
  )
}

export const SquadPlayers = () => {
  const navigator = useNavigation();
  const route = useRoute()
  const modalRef = React.useRef<Modal>()
  const { squad } = (route.params || {}) as { squad: ISupotsu.Squad };
  const { fonts } = useStyledContext();
  const { setFavTeam, setGame } = useGameContext();
  const [search, setSearch] = React.useState('');
  const [player, setPlayer] = React.useState(undefined)
  const [isAdding, setIsAdding] = React.useState(false);
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const { data, loading, refetch } = useQuery(PlayerQL, {
    variables: {
      _id: squad._id
    }
  });

  const playerList: ISupotsu.Player[] = React.useMemo(() => {
    if (data && data.squadPlayers) return data.squadPlayers;
    return []
  }, [data])

  const players = React.useMemo(() => {
    return playerList?.filter((p) => p.name.toLowerCase().indexOf(search.toLowerCase()) > -1)
  }, [playerList, search])

  const icons = [
    {
      className: "MaterialIcons",
      icon: "add",
      onPress() {
        const render = () => {
          return (
            <PlayerPickerModal {...{}} selected={[]} otherSelected={[]} getSelection={() => []} getOtherSelection={() => []}
              onPlayerPicked={(p) => {
                setPlayer(p)
              }}
              savePlayer={(p) => {
                setPlayer(p)
              }}
              isModal={false}
              color='#000'
            />
          )
        };
        if (isAdding) return;
        setIsAdding(true)

        const opts: ModalProps = {
          title: "Select User",
          onDoneTitle: 'Add Player',
          size: ModalHeaderSize.mini,
          render,
          onDoneButton: ModalActionButon.blue,
          onClose: () => {
            setIsAdding(false)
          },
          onDone: (_modal: Modal) => {
            setIsAdding(false)
          },
          ref: (mod) => {
            modalRef.current = mod
          }
        }

        goToPageReact(Modal, opts, 'ComboModal')
      }
    },
    {
      className: "MaterialIcons",
      icon: "edit",
      onPress() {

      }
    },
  ]

  React.useEffect(() => {
    if (modalRef.current && player) {
      modalRef.current.closeCallback()
      setIsAdding(false)
    }
  }, [player, modalRef])

  return (
    <gridLayout rows='auto, auto, *'>
      <CommonHeader user={{
        name: 'Squad Players'
      }} goBack={navigator.goBack} icons={icons} />
      <flexboxLayout row={1} style={{
        padding: 10
      }}>
        <gridLayout columns='*, auto' style={{
          borderColor: '#eee',
          borderWidth: 1,
          borderRadius: 4,
          padding: '0 8'
        }}>
          <textField borderColor='#fff' background='#fff' hint='Search Player' onTextChange={(args) => {
            setSearch(args.value)
          }} />
          <flexboxLayout width={40} alignItems='center' justifyContent='center' col={1}>
            <label className='MaterialIcons size26' color='#ddd' text={IconSet.MaterialIcons.search} />
          </flexboxLayout>
        </gridLayout>
      </flexboxLayout>
      {loading && (
        <flexboxLayout alignItems='center' justifyContent='center' row={2}>
          <LoadingState />
        </flexboxLayout>
      )}
      {!loading && players?.length === 0 && (
        <flexboxLayout alignItems='center' justifyContent='center' row={2}>
          <Empty />
        </flexboxLayout>
      )}
      {!loading && players?.length > 0 && (
        <scrollView row={2}>
          <stackLayout>
            {players.map((player) => {
              return (
                <gridLayout key={player._id} onTouch={onTouch} padding={10} columns='50, *' borderBottomColor={'#eee'} borderBottomWidth={1}>
                  <flexboxLayout alignItems='center' justifyContent='center'>
                    <image borderRadius={45 / 2} width={45} height={45} stretch='aspectFit' src={player.user.image.replace('.svg', '.png')} />
                  </flexboxLayout>
                  <stackLayout marginLeft={10} col={1}>
                    <label fontWeight="bold" fontSize={14} text={player.name} />
                    <label fontSize={12} text={player.position} />
                  </stackLayout>
                </gridLayout>
              )
            })}
          </stackLayout>
        </scrollView>
      )}
    </gridLayout>
  )
}

SquadPlayers.routeName = 'squadPlayers'

export default Team;
