import { useNavigation, useRoute } from '@react-navigation/core';
import * as React from 'react';
import { AppAuthContext } from '~/components/Root';
import { useGameContext } from '~/contexts/GameContext';
import { useStyledContext } from '~/contexts/StyledContext';
import * as ISupotsu from '~/DB/interfaces';
import Methods from '~/Methods';
import { Modal as NativeModal } from '~/ui/Modal'
import { screen } from 'tns-core-modules/platform';
import IconSet from '~/font-icons';
import { EventFilterSegments, TextEditField } from '../Events';
import { FollowersAndFans, FollowSection, OverviewContact, ProfileLabel, ProfilePersonalLabel } from '../Team';
import { CommonTimeLine } from '~/components/CommonTimeLine';
import { ComboModalHeaderSize, ComboSelector, CommonHeader, Empty, LoadingState, TrainingAddButtonIcon } from '~/ui/common.ui';
import { Games } from '../Games';
import { AboutTeam, SocialIcons } from '../Team/AboutTeam';
import { useSupotsuMutation, useSupotsuQuery } from '~/utils/useSupotsuMutation';
import { SEASONS, TOURNAMENT } from '~/services/graphql/tournament';
import { FAN_PAGE, FOLLOW_PAGE, LIKE_PAGE } from '~/services/graphql/team';
import { client } from '~/app';
import { ClubTeamAdd, ClubTeams } from '../Club';
import { PhotoSementItem } from '../Photos';
import { Season, SeasonGameInput, SeasonGroup, SeasonGroupTeam, SeasonInput, Team, Tournament as ITournament } from '~/generated/graphql';
import { SaveButton } from '../Training';
import { CREATE_SEASON } from '~/apollo/mutations/createSeason';
import Theme, { Theme2 } from '~/Theme';
import { ApplicationSettings } from '@nativescript/core';
import { confirm } from '@nativescript/core/ui/dialogs'
import { TEAMS, user } from '~/components/GQL';
import { ADD_TEAM_TO_SEASON } from '~/apollo/mutations/addTeamToSeasonGroup';
import icons from '~/components/Icon/icons';
import { REMOVE_TEAM_FROM_SEASON } from '~/apollo/mutations/removeTeamFromSeasonGroup';
import { useSeasonContext } from '~/contexts/SeasonContext';
import { CREATE_SEASON_GAMES } from '~/apollo/mutations/createSeasonGames';
import { ARCHIVE_SEASON } from '~/apollo/mutations/archiveSeason';
import { SEASON_GAMES } from '~/apollo/queries/seasonGames';


type TournamentView = 'Timeline' | 'Games' | 'Teams' | 'Sports' | 'About' | 'Photos' | 'Videos' | 'Training' | 'Sports' | 'Fans' | 'Seasons';

const tournamentViews: TournamentView[] = [
  'Timeline',
  'Seasons',
  'Games',
  'About',
  'Fans',
  'Photos',
  'Videos'
]

export const Tournament = () => {
  const navigator = useNavigation();
  const { fonts } = useStyledContext();
  const { setCurrentSeasonId, games, currentSeasonId } = useSeasonContext()
  const { setFavTeam, setGame } = useGameContext();
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const route = useRoute();

  const { tournament: initTournament } = (route.params || {}) as { tournament: ISupotsu.Tournament };

  const { data, refetch, loading: isTournLoading } = useSupotsuQuery(TOURNAMENT, {
    variables: {
      _id: initTournament._id
    }
  })

  const { data: seasonData } = useSupotsuQuery(SEASONS, {
    variables: {
      _id: initTournament._id
    }
  })

  const tournament: ISupotsu.Tournament = React.useMemo(() => {
    return data && data.tournament ? data.tournament : initTournament
  }, [data, initTournament])

  const seasons: Season[] = React.useMemo(() => {
    return seasonData && seasonData.seasons ? seasonData.seasons : []
  }, [seasonData])

  const color = '#00458F';

  const [active, setActive] = React.useState<TournamentView>('Timeline');
  const [isLiked, setIsLiked] = React.useState(false);
  const [isFollewed, setIsFollewed] = React.useState(false);
  const [loading, setLoading] = React.useState({
    follow: false,
    like: false
  })

  const icons = [
    { name: "Favourite", icon: "star", loading: 'like', iconType: "MaterialIcons" },
    { name: "Unfavour", icon: "star", loading: 'like', iconType: "MaterialIcons" },
    { name: "Follow", icon: "rss-feed", loading: 'follow', iconType: "MaterialIcons" },
    { name: "Unfollow", icon: "rss-feed", loading: 'follow', iconType: "MaterialIcons" },
    { name: "Contact Us", icon: "facebook-messenger", loading: 'contact', iconType: "MaterialCommunityIcons" },
  ];

  const isLight = Methods.luminance_get(color) > 180 ? false : true;
  const textColor = '#fff' // isLight ? '#000' : '#fff'

  const isSmallScreen = screen.mainScreen.widthDIPs < 400;

  React.useEffect(() => {
    const season = seasons.find((c) => !c.finished)
    if (season && (!currentSeasonId || currentSeasonId === "")) {
      setCurrentSeasonId(season._id)
    }
  }, [seasons])

  React.useEffect(() => {
    client.query({
      query: TEAMS
    }).then(({ data }) => {
      if (data.teams) {
        ApplicationSettings.setString('teams', JSON.stringify(data.teams));
      }
    }).catch((_err) => {
      console.log(_err, 'HERE - teams')
    })

    return () => {
      setCurrentSeasonId(undefined)
    }
  }, [])

  const gameIds = games.map((c) => c.game?._id)

  // if (isTournLoading) {
  //   return (
  //     <gridLayout rows="auto, *">
  //       <CommonHeader user={{
  //         ...tournament,
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

  const isAdmin = tournament?.roles?.some((r) => r.role.toLowerCase() === 'admin')

  return (
    <gridLayout rows='auto, *'>
      <CommonHeader search user={{
        name: 'Tournament Details'
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
                }} src={tournament?.image} stretch='aspectFit' />
              </flexboxLayout>
              <flexboxLayout col={1} justifyContent='center' flexDirection='column'>
                <label text={tournament?.name} style={{
                  color: textColor,
                  fontSize: 26,
                  marginBottom: 8,
                }} />
                <OverviewContact textColor={textColor} value={tournament.email || 'no email set'} image={isLight ? 'website_icon' : 'website_icon_wht'} />
                <OverviewContact iconName='smartphone' textColor={textColor} value={tournament.contactMain || 'no contact set'} image={isLight ? 'mobile_icon' : 'mobile_icon_wht'} />
                <OverviewContact iconType='Octicons' iconName='globe' textColor={textColor} value={tournament.website || 'not website set'} image={isLight ? 'email_icon' : 'email_icon_wht'} />

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
            <FollowSection textColor={textColor} refetch={refetch} page={tournament} />
          </gridLayout>
          <EventFilterSegments stripe color={textColor} background={color} scroll options={tournamentViews.map(item => item as string)} active={active} onChange={(item) => {
            setActive(item as TournamentView);
          }} />

          <stackLayout visibility={active === 'Timeline' && !isTournLoading ? 'visible' : 'collapse'}>
            <CommonTimeLine postUser={{
              _id: tournament._id,
              type: 'L'
            }} />
          </stackLayout>
          <stackLayout visibility={active === 'Fans' && !isTournLoading ? 'visible' : 'collapse'}>
            <FollowersAndFans likes={tournament.likes} fans={tournament.fans} followers={tournament.followers} teamColor={color} textColor={textColor} />
          </stackLayout>
          <stackLayout visibility={active === 'Games' && !isTournLoading ? 'visible' : 'collapse'}>
            <Games gameIds={gameIds} sportFilter user={tournament} />
          </stackLayout>
          <stackLayout visibility={active === 'Sports' && !isTournLoading ? 'visible' : 'collapse'}>

          </stackLayout>
          <stackLayout visibility={active === 'Teams' && !isTournLoading ? 'visible' : 'collapse'}>
            {isAdmin && <ClubTeamAdd page={tournament} refetch={refetch} isAdmin={isAdmin} />}
          </stackLayout>
          <stackLayout visibility={active === 'Seasons' && !isTournLoading ? 'visible' : 'collapse'}>
            <SeasonsList isAdmin={isAdmin} league={tournament} seasons={seasonData ? seasonData.seasons : []} refetch={refetch} teamColor={color} textColor={textColor} />
          </stackLayout>
          <NativeModal
            fullscreen
            renderTriggerAction={(ref, open) => (
              <stackLayout ref={ref} onTap={open} visibility={active === 'About' && !isTournLoading ? 'visible' : 'collapse'} marginTop={17}>
                <ProfileLabel text='Overview' />

                <stackLayout style={{
                  marginBottom: 10,
                  backgroundColor: 'white'
                }}>
                  {tournament.manager && <ProfilePersonalLabel newBanner label={'Manager'} value={tournament.manager.name} />}
                  <ProfilePersonalLabel newBanner label={'Location'} value={tournament.address ? tournament.address : 'Not set'} />
                  {/* <ProfilePersonalLabel newBanner label={'Suburb'} value={tournament.suburb} />
                  <ProfilePersonalLabel newBanner label={'State/Province'} value={tournament.state} />
                  <ProfilePersonalLabel newBanner label={'Postal code'} value={tournament.postal} />
                  <ProfilePersonalLabel newBanner label={'Country'} value={tournament.country} /> */}
                </stackLayout>
                <ProfileLabel text={'Social'} />
                <SocialIcons isVertical items={tournament.socials} />
              </stackLayout>
            )}
            renderContent={(open, close, isModalOpen) => {
              return (
                <AboutTeam refresh={refetch} team={tournament} open={open} close={close} />
              )
            }}
          />
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

Tournament.routeName = 'tournament'

interface SeasonsListProps {
  refetch(): void
  league: ITournament
  isAdmin?: boolean
  teamColor: string,
  textColor?: string;
  seasons: Season[]
}

const SeasonsList = ({
  refetch,
  teamColor,
  isAdmin,
  textColor,
  seasons,
  league
}: SeasonsListProps) => {
  const [active, setActive] = React.useState('Current')
  const list = seasons.filter((c) => {
    if (active === "Current") return !c.finished
    return c.finished
  })
  return (
    <>
      <gridLayout marginTop={16} marginBottom={8} columns='*, *'>
        {['Current', 'Past'].map((p, i) => {
          return (
            <PhotoSementItem color={teamColor} key={i} active={active === p} col={i} item={p} onSelect={() => setActive(p)} />
          )
        })}
      </gridLayout>
      <NativeModal
        fullscreen
        renderTriggerAction={(_ref, open) => (
          <gridLayout visibility={isAdmin ? 'visible' : 'collapse'} padding={16} background='#fff' marginBottom={16} marginTop={16} columns='*, auto'>
            <label style={{
              color: '#000',
              fontWeight: 'bold'
            }} text='Create a new season' />
            <TrainingAddButtonIcon onPress={open} col={1} icon="md-add" size={30} />
          </gridLayout>
        )}
        renderContent={(open, close, isModalOpen) => (
          <CreateSeason close={close} refetch={refetch} />
        )}
      />

      {list?.map((season, index) => {
        return <SeasonListItem past={season.finished} key={index} season={season} refetch={refetch} isAdmin={isAdmin} />
      })}
      <label marginBottom={16} />
    </>
  )
}

interface SeasonListItemProps extends Partial<SeasonsListProps> {
  season: Season
  past?: boolean
}
const SeasonListItem = ({
  refetch,
  season,
  isAdmin,
  past
}: SeasonListItemProps) => {
  const navigation = useNavigation()
  const [archiveSeason, { loading: archiving }] = useSupotsuMutation(ARCHIVE_SEASON, {
    update() {
      refetch()
    }
  })
  return (
    <stackLayout padding={16} borderBottomColor='#eee' borderBottomWidth={1} background='#fff'>
      <gridLayout columns='40, *, 40, 8, 40'>
        <flexboxLayout alignItems='center' justifyContent='center'>
          <flexboxLayout width={40} height={40} alignItems='center' justifyContent='center' col={0} borderRadius='50%' background={Theme2[500]}>

          </flexboxLayout>
        </flexboxLayout>
        <stackLayout col={1} marginLeft={8}>
          <label text={season.name ?? 'Season'} />
          <label fontSize={12} textTransform='capitalize' text={season.type ?? 'League'} />
        </stackLayout>
        <flexboxLayout onTap={async () => {
          const yes = await confirm('Are you sure you want to move this season from the list?')
          if (yes) {
            archiveSeason({
              variables: {
                _id: season._id,
                value: false
              }
            })
          }
        }} visibility={isAdmin && !past ? 'visible' : 'collapse'} col={2} alignItems='center' justifyContent='center'>
          <flexboxLayout width={30} height={30} alignItems='center' justifyContent='center' col={0} borderRadius='50%' background={Theme.red}>
            <label color={'#fff'} fontSize={18} className='MaterialIcons' text={IconSet.MaterialIcons.archive} />
          </flexboxLayout>
        </flexboxLayout>
        <flexboxLayout onTap={() => {
          navigation.navigate(ViewEditSeason.routeName, {
            season,
            isAdmin
          })
        }} visibility={isAdmin && !past ? 'visible' : 'collapse'} col={4} alignItems='center' justifyContent='center'>
          <flexboxLayout width={30} height={30} alignItems='center' justifyContent='center' col={0} borderRadius='50%' background={Theme[500]}>
            <label color={'#fff'} fontSize={18} className='MaterialIcons' text={IconSet.MaterialIcons.edit} />
          </flexboxLayout>
        </flexboxLayout>
        <flexboxLayout onTap={() => {
          navigation.navigate(ViewEditSeason.routeName, {
            season,
            isAdmin
          })
        }} visibility={isAdmin && past ? 'visible' : 'collapse'} col={4} alignItems='center' justifyContent='center'>
          <flexboxLayout width={30} height={30} alignItems='center' justifyContent='center' col={0} borderRadius='50%' background={Theme[500]}>
            <label color={'#fff'} fontSize={18} className='MaterialIcons' text={IconSet.MaterialIcons['remove-red-eye']} />
          </flexboxLayout>
        </flexboxLayout>
      </gridLayout>
    </stackLayout>
  )
}

interface CreateSeasonProps extends Partial<SeasonsListProps> {
  close?(args?: any): void
  isEdit?: boolean
  season?: Season
}
const CreateSeason = ({
  close,
  league,
  season,
  isEdit,
  refetch
}: CreateSeasonProps) => {
  const { user } = React.useContext(AppAuthContext)
  const [input, setInput] = React.useState<SeasonInput>({
    league: league?._id || season?.league?._id,
    user: user._id,
    legs: league ? Number(league.noOfLegs) : 1,
    name: season?.name || '',
    type: season?.type || league?.type || '',
    noOfTeams: season?.noOfTeams || league?.noOfTeams || 0
  })
  const [createSeason] = useSupotsuMutation<any, any>(CREATE_SEASON, {})

  const save = () => {
    if (input.name.length < 2) {
      alert('Invalid name!')
      return
    }
    if (input.type.length < 2) {
      alert('Invalid type!')
      return
    }

    if (input.legs < 1 || input.legs > 2) {
      alert('Invalid number of legs!')
      return
    }

    if (input.noOfTeams < 4) {
      alert('Invalid number of teams!')
      return
    }
    if (!isEdit) {
      createSeason({
        variables: {
          data: {
            ...input
          }
        },
        update(_cache, { data: { createSeason } }) {
          console.log(createSeason)
          if (createSeason) {
            refetch()
          }
        },
      })
    }
  }

  const options = [
    {
      name: 'League',
      type: 'league'
    },
    {
      name: 'Knockout',
      type: 'knockout',
      noOfTeams: 16
    },
    {
      name: '32 Teams',
      type: '32',
      noOfTeams: 32
    },
    {
      name: '64 Teams',
      type: '64',
      noOfTeams: 64
    }
  ]
  return (
    <gridLayout rows='auto, *, auto' width='100%' height='100%'>
      <CommonHeader user={{ name: 'Add season' }} goBack={close} />
      <scrollView row={1}>
        <stackLayout padding={'16 16'}>
          <TextEditField value={input.name} type='text' labelFor='Name' onChange={(val: string) => {
            setInput({
              ...input,
              name: val
            })
          }} />
          {
            // @ts-ignore
            <TextEditField keyboardType='number' value={input.legs} type='text' labelFor='Legs' onChange={(val: string) => {
              setInput({
                ...input,
                legs: Number(val)
              })
            }} />
          }

          <TextEditField type='select' value={{
            name: input.type
          }} labelFor='Type' selectOptions={options} onChange={(val: any) => {
            const { type, noOfTeams } = val
            if (noOfTeams) {
              setInput({
                ...input,
                noOfTeams,
                type
              })
            } else {
              setInput({
                ...input,
                type,
                noOfTeams: 0
              })
            }
          }} />

          {['league'].includes(input.type) && (
            // @ts-ignore
            <TextEditField keyboardType='number' value={input.noOfTeams} type='text' labelFor='No of Teams' onChange={(val: string) => {
              setInput({
                ...input,
                noOfTeams: Number(val)
              })
            }} />
          )}

          <SaveButton onTap={save} text='Save' />
        </stackLayout>
      </scrollView>

    </gridLayout>
  )
}


interface ViewEditSeasonProps extends Partial<SeasonsListProps> {
  close?(args?: any): void
  isEdit?: boolean
  season?: Season
}

export const ViewEditSeason = () => {
  const { goBack } = useNavigation()
  const { groups, setSeasonId, season, loading: dataLoading, refetch } = useSeasonContext()
  const route = useRoute();
  const [createSeasonGameList, { loading: isCreatingGames }] = useSupotsuMutation<any, any>(CREATE_SEASON_GAMES, {})
  const [archiveSeason, { loading: archiving }] = useSupotsuMutation<any, any>(ARCHIVE_SEASON, {
    update() {
      refetch()
    }
  })
  const [fixtures, setFixtures] = React.useState<Record<number | string, SeasonGameInput[]>>({})
  const { season: initSeason } = (route.params || {}) as ViewEditSeasonProps;

  const canStartSeason = season && (season.hasGames || season.started )? false : groups.some((g) => {
    return g.noOfTeams === g.teams.length
  })

  const loading = dataLoading || archiving

  const startSeason = () => {
    const values = Object.values(fixtures)
    let games = []
    values.forEach((v) => {
      games = [...games, ...v]
    })
    if (games.length > 0) {
      createSeasonGameList({
        variables: {
          games,
          seasonId: season._id
        },
        update(_cache, { data: { createSeasonGames } }) {
          if (createSeasonGames) {
            console.log(createSeasonGames)
            alert('Season is ready to start, please edit games data on the games tab!')
            refetch()
          }
        }
      })
    }
  }

  const archive = () => {
    archiveSeason({
      variables: {
        _id: season._id,
        value: true
      }
    })
  }

  React.useEffect(() => {
    setSeasonId(initSeason._id)
    return () => {
      setSeasonId(undefined)
    }
  }, [])

  return (
    <gridLayout rows='auto, *, auto' width='100%' height='100%'>
      <CommonHeader user={{ name: 'View season' }} goBack={goBack} />
      <flexboxLayout row={1} alignItems='center' justifyContent='center'>
        {loading && <LoadingState />}
        {!loading && groups.length === 0 && <Empty />}
      </flexboxLayout>
      <scrollView visibility={!loading && groups.length > 0 ? 'visible' : 'collapse'} row={1}>
        <stackLayout padding={17} background='#fff'>
          {groups?.map((groupItem, index) => <ViewEditSeasonGroup onFixturesGenerate={(list) => {
            setFixtures({
              ...fixtures,
              [index]: list
            })
          }} editable={!loading} refetch={refetch} key={`${groupItem.teams.length}-${index}`} group={groupItem} isSingle={groups.length === 1}/>)}
        </stackLayout>
      </scrollView>
      <gridLayout visibility={canStartSeason ? 'visible' : 'collapse'} row={2} padding={17}>
        <SaveButton text='Start Season' isLoading={isCreatingGames} onTap={isCreatingGames ? undefined : startSeason}/>
      </gridLayout>
      <gridLayout visibility={season && !season.isPast && !canStartSeason ? 'visible' : 'collapse'} row={2} padding={17}>
        <SaveButton text='Archive Season' isLoading={archiving} onTap={archiving ? undefined : archive}/>
      </gridLayout>
    </gridLayout>
  )
}

ViewEditSeason.routeName = 'viewSeason'

interface ViewEditSeasonGroupProps extends Partial<SeasonsListProps> {
  group: SeasonGroup,
  isSingle: Boolean
  editable?: boolean,
  onFixturesGenerate(fixtures: SeasonGameInput[]): void
}

const ViewEditSeasonGroup = ({
  group,
  isSingle,
  editable: canEdit = false,
  refetch,
  onFixturesGenerate
}: ViewEditSeasonGroupProps) => {
  const [addTeam, { loading }] = useSupotsuMutation<any, any>(ADD_TEAM_TO_SEASON, {})
  const [removeTeam, { loading: deleting }] = useSupotsuMutation<any, any>(REMOVE_TEAM_FROM_SEASON, {})
  const { season } = useSeasonContext()
  const { user } = React.useContext(AppAuthContext)
  const { teams, legs, _id } = group;
  const [selectedTeams, setSelectedTeams] = React.useState<Team[]>(() => teams?.filter((t) => t.team).map((t) => t.team))
  const dummyTeams = Methods.getDummy(group?.noOfTeams - (teams?.length ?? 0))

  const nullTeams = teams.filter((t) => !t.team)

  const fixtures = React.useMemo(() => {
    const games: SeasonGameInput[] = []
    for (let index = 0; index < legs; index++) {
      const leg = index + 1;
      const isOdd = leg % 2 === 1
      teams.forEach((team) => {
        const otherTeams = teams.filter((t) => t.team._id !== team.team._id)
        otherTeams.forEach((ot) => {
          games.push({
            group: _id,
            homeTeam: isOdd ? team.team._id : ot.team._id,
            teamOne: isOdd ? team.team._id : ot.team._id,
            teamTwo: !isOdd ? team.team._id : ot.team._id,
            leg,
            season: season?._id,
            owner: user._id,
            sport: season?.league?.sport?._id
          })
        })
      })
    }

    return games
  }, [teams, legs, _id, user, season])

  const addTeamToSeason = (team: Team) => {
    addTeam({
      variables: {
        _id: group._id,
        teamID: team._id
      },
      update(_cache, { data: { addTeamToSeasonGroup } }) {
        if (addTeamToSeasonGroup) {
          refetch()
        }
      },
    })
  }

  const removeTeamFromSeason = (team: Team) => {
    removeTeam({
      variables: {
        group: group._id,
        teamID: team._id
      },
      update(_cache, { data: { removeTeamFromSeasonGroup } }) {
        if (removeTeamFromSeasonGroup) {
          refetch()
        } else {
          refetch()
        }
      },
    })
  }

  const removeSeasonTeam = (team: SeasonGroupTeam) => {
    removeTeam({
      variables: {
        _id: team._id,
      },
      update(_cache, { data: { removeTeamFromSeasonGroup } }) {
        if (removeTeamFromSeasonGroup) {
          refetch()
        } else {
          refetch()
        }
      },
    })
  }

  const cleanUp = () => {
    nullTeams.forEach((t) => {
      removeSeasonTeam(t)
    })
  }

  const editable = canEdit || !loading || !deleting

  React.useEffect(() => {
    if (fixtures.length) {
      onFixturesGenerate(fixtures)
    }
  }, [fixtures])
  return (
    <stackLayout>
      <label fontSize={20} marginBottom={20} fontWeight='400' color={Theme[500]} text={`${isSingle ? 'Standings' : 'Group'} ${editable ? '' : ' - Loading...'}`} />
      {teams.map((team) => {
        return (
          <ViewEditSeasonGroupTeam item={team} editable={editable} removeTeam={() => {
            removeTeamFromSeason(team.team)
          }} selectedTeams={selectedTeams} key={team._id} />
        )
      })}
      {dummyTeams.map((_dummy, index) => {
        return (
          <ViewEditSeasonGroupTeam editable={editable} setSelectedTeams={(team) => {
            const ids = teams.map((t) => t.team?._id)
            if (ids.includes(team._id)) return
            setSelectedTeams([...selectedTeams, team])
            addTeamToSeason(team)
          }} selectedTeams={selectedTeams} key={`${teams.length}-${index}`} />
        )
      })}
    </stackLayout>
  )
}

interface ViewEditSeasonGroupTeamProps extends Partial<SeasonsListProps> {
  item?: SeasonGroupTeam,
  selectedTeams: Team[]
  setSelectedTeams?(team: Team): void
  editable?: boolean
  removeTeam?(): void
}

const ViewEditSeasonGroupTeam = ({
  refetch,
  item,
  selectedTeams,
  setSelectedTeams,
  editable,
  removeTeam
}: ViewEditSeasonGroupTeamProps) => {
  const [team, setTeam] = React.useState<Team | undefined>(() => item?.team)
  const teams = React.useMemo(() => {
    const teamList: Team[] = JSON.parse(ApplicationSettings.getString('teams', '[]'))
    const selectedTeamIds = selectedTeams.map((t) => t._id)
    const teams = teamList.filter((t) => {
      return !selectedTeamIds.includes(t._id)
    })
    return teams
  }, [selectedTeams, item])

  if (team) {
    return (
      <gridLayout columns='30, 100, *, auto' style={{
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 17,
        marginBottom: 17,
        borderRadius: 10,
      }}>
        <image style={{
          height: 30,
          width: 30
        }} src={team?.image?.replace(".svg", ".png")} />
        <flexboxLayout height={30} alignItems='center' col={1} marginLeft={8} marginRight={8}>
          <label textWrap color='black' fontSize={15} text={team.name}/>
        </flexboxLayout>
        <scrollView borderLeftColor={'#ddd'} borderLeftWidth={1} col={2} orientation='horizontal' height={30}>
          <stackLayout />
        </scrollView>
        <flexboxLayout visibility={editable ? 'visible' : 'collapse'} onTap={!editable ? undefined : async () => {

          const canDelete = await confirm("Are you sure you want to remove this team?")
          if (canDelete) {
            if (removeTeam) {
              removeTeam()
            } else {
              setTeam(undefined)
            }
          }
        }} height={30} alignItems='center' paddingLeft={16} borderLeftColor={'#ddd'} borderLeftWidth={1} col={3}>
          <label className="Feather size18" text={IconSet.Feather.delete} />
        </flexboxLayout>
      </gridLayout>
    )
  }

  return (
    <ComboSelector
      renderTrigger={(ref, open) => (
        <flexboxLayout ref={ref} onTap={!editable ? undefined : open} style={{
          borderColor: '#ddd',
          borderWidth: 1,
          background: '#eee',
          padding: 17,
          marginBottom: 17,
          borderRadius: 10,
        }}>
          <label text='Select a team'/>
        </flexboxLayout>
      )}
      items={teams}
      onDone={(selectedTeam) => {
        if (selectedTeam) {
          setTeam(selectedTeam)
          if (setSelectedTeams) setSelectedTeams(selectedTeam)
        }
      }}
      complex
      withImage
      title='Select a team'
      size={ComboModalHeaderSize.normal}
    />
  )
}
