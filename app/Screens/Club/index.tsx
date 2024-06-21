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
import { CommonHeader, Empty, TrainingAddButtonIcon } from '~/ui/common.ui';
import { Games } from '../Games';
import { AboutTeam, OverviewLabel, SocialIcons } from '../Team/AboutTeam';
import { useQuery } from '@apollo/react-hooks';
import { CLUB } from '~/components/GQL';
import Theme, { Theme2 } from '~/Theme';
import { SaveButton } from '../Training';
import { ApplicationSettings } from '@nativescript/core';
import { PhotoSementItem } from '../Photos';
import { UnionUser } from '~/utils/types';
import { useSupotsuMutation, useSupotsuQuery } from '~/utils/useSupotsuMutation';
import { ADD_TEAM, UPDATE_TEAM } from '~/services/graphql/team';


type ClubView = 'Timeline' | 'Games' | 'Teams' | 'Sports' | 'About' | 'Photos' | 'Videos' | 'Training' | 'Sports' | 'Fans';

const clubViews: ClubView[] = [
  'Timeline',
  'Sports',
  'Teams',
  'Games',
  'About',
  'Fans',
  'Photos',
  'Videos'
]

export const Club = () => {
  const navigator = useNavigation();
  const { fonts } = useStyledContext();
  const { setFavTeam, setGame } = useGameContext();
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const route = useRoute();
  const { club: initClub } = (route.params || {}) as { club: ISupotsu.Club };
  const { data, refetch, loading: isClubLoading } = useSupotsuQuery(CLUB, {
    variables: {
      _id: initClub._id
    }
  })

  const club: ISupotsu.Club = React.useMemo(() => {
    return data && data.club ? data.club : initClub
  }, [data, initClub])

  const color = '#00458F';

  const [active, setActive] = React.useState<ClubView>('Timeline');
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

  // if (isClubLoading) {
  //   return (
  //     <gridLayout rows="auto, *">
  //       <CommonHeader user={{
  //         ...club,
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
  const isAdmin = club?.roles?.some((r) => r.role.toLowerCase() === 'admin')

  return (
    <gridLayout rows='auto, *'>
      <CommonHeader search user={{
        name: 'Club Details'
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
                }} src={club?.image} stretch='aspectFit' />
              </flexboxLayout>
              <flexboxLayout col={1} justifyContent='center' flexDirection='column'>
                <label text={club?.name} style={{
                  color: textColor,
                  fontSize: 26,
                  marginBottom: 8,
                }} />
                <OverviewContact textColor={textColor} value={club.email || 'no email set'} image={isLight ? 'website_icon' : 'website_icon_wht'} />
                <OverviewContact iconName='smartphone' textColor={textColor} value={club.contactMain || 'no contact set'} image={isLight ? 'mobile_icon' : 'mobile_icon_wht'} />
                <OverviewContact iconType='Octicons' iconName='globe' textColor={textColor} value={club.website || 'not website set'} image={isLight ? 'email_icon' : 'email_icon_wht'} />

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
            <FollowSection textColor={textColor} refetch={refetch} page={club} />
          </gridLayout>
          <EventFilterSegments stripe color={textColor} background={color} scroll options={clubViews.map(item => item as string)} active={active} onChange={(item) => {
            setActive(item as ClubView);
          }} />

          <stackLayout visibility={active === 'Timeline' && !isClubLoading ? 'visible' : 'collapse'}>
            <CommonTimeLine postUser={{
              _id: club._id,
              type: 'C'
            }} />
          </stackLayout>
          <stackLayout visibility={active === 'Sports' && !isClubLoading ? 'visible' : 'collapse'}>
            <ClubSportAdd page={club} refetch={refetch} isAdmin={isAdmin} />
            {club?.sports?.map((cs) => <ClubSportItem key={cs._id} item={cs} refetch={refetch} />)}
          </stackLayout>
          <stackLayout visibility={active === 'Teams' && !isClubLoading ? 'visible' : 'collapse'}>
            {isAdmin && <ClubTeamAdd page={club} refetch={refetch} isAdmin={isAdmin} />}
            <ClubTeams teamColor={color} textColor={textColor} teams={club.teams} refetch={refetch} />
          </stackLayout>
          <stackLayout visibility={active === 'Fans' && !isClubLoading ? 'visible' : 'collapse'}>
            <FollowersAndFans likes={club.likes} fans={club.fans} followers={club.followers} teamColor={color} textColor={textColor} />
          </stackLayout>
          <stackLayout visibility={active === 'Games' && !isClubLoading ? 'visible' : 'collapse'}>
            <Games sportFilter user={club} />
          </stackLayout>
          <NativeModal
            fullscreen
            renderTriggerAction={(ref, open) => (
              <stackLayout ref={ref} onTap={open} visibility={active === 'About' && !isClubLoading ? 'visible' : 'collapse'} marginTop={17}>
                <ProfileLabel text='Overview' />

                <stackLayout style={{
                  marginBottom: 10,
                  backgroundColor: 'white'
                }}>
                  {club.manager && <ProfilePersonalLabel newBanner label={'Manager'} value={club.manager.name} />}
                  <ProfilePersonalLabel newBanner label={'Location'} value={club.address ? club.address : 'Not set'} />
                  {/* <ProfilePersonalLabel newBanner label={'Suburb'} value={club.suburb} />
                  <ProfilePersonalLabel newBanner label={'State/Province'} value={club.state} />
                  <ProfilePersonalLabel newBanner label={'Postal code'} value={club.postal} />
                  <ProfilePersonalLabel newBanner label={'Country'} value={club.country} /> */}
                </stackLayout>
                <ProfileLabel text={'Social'} />
                <SocialIcons isVertical items={club.socials} />
              </stackLayout>
            )}
            renderContent={(open, close, isModalOpen) => {
              return (
                <AboutTeam refresh={refetch} team={club} open={open} close={close} />
              )
            }}
          />
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

Club.routeName = 'club'

interface ClubSportAddProps {
  page: UnionUser
  refetch(): void
  isAdmin?: boolean
}
export const ClubSportAdd = ({
  page,
  refetch,
  isAdmin
}: ClubSportAddProps) => {
  return (
    <NativeModal
      fullscreen
      renderTriggerAction={(_ref, open) => (
        <gridLayout padding={16} background='#fff' marginBottom={16} marginTop={16} columns='*, auto'>
          <label style={{
            color: '#000',
            fontWeight: 'bold'
          }} text='Add Sport' />
          <TrainingAddButtonIcon onPress={open} col={1} icon="md-add" size={30} />
        </gridLayout>
      )}
      renderContent={(open, close, isModalOpen) => (
        <SportEditor close={close} refetch={refetch} page={page} item={undefined} isAdmin={isAdmin} />
      )}
    />
  )
}

interface ClubSportAddProps {
  page: UnionUser
  refetch(): void
  isAdmin?: boolean
}
export const ClubTeamAdd = ({
  page,
  refetch,
  isAdmin
}: ClubSportAddProps) => {
  return (
    <NativeModal
      fullscreen
      renderTriggerAction={(_ref, open) => (
        <gridLayout padding={16} background='#fff' marginBottom={16} marginTop={16} columns='*, auto'>
          <label style={{
            color: '#000',
            fontWeight: 'bold'
          }} text='Add Team' />
          <TrainingAddButtonIcon onPress={open} col={1} icon="md-add" size={30} />
        </gridLayout>
      )}
      renderContent={(open, close, isModalOpen) => (
        <ClubTeamAddScreen close={close} page={page} refetch={refetch}></ClubTeamAddScreen>
      )}
    />
  )
}

interface ClubSportItemProps {
  item: ISupotsu.ClubSport,
  refetch(): void
  isAdmin?: boolean
  page?: UnionUser
}
export const ClubSportItem = ({
  item,
  refetch,
  isAdmin = true
}: ClubSportItemProps) => {
  return (
    <stackLayout padding={16} borderBottomColor='#eee' borderBottomWidth={1} background='#fff'>
      <gridLayout columns='40, *, 40, 8, 40'>
        <flexboxLayout alignItems='center' justifyContent='center'>
          <flexboxLayout width={40} height={40} alignItems='center' justifyContent='center' col={0} borderRadius='50%' background={Theme2[500]}>
            <image width={26} height={26} borderRadius='50%' src={`https://supotsu.com/${item.sport.image.replace('.svg', '.png')}`} />
          </flexboxLayout>
        </flexboxLayout>
        <stackLayout col={1} marginLeft={8}>
          <label text={item.sport.name} />
          <label fontSize={12} text={item.headCoach.name} />
        </stackLayout>
        <flexboxLayout visibility={isAdmin ? 'visible' : 'collapse'} col={2} alignItems='center' justifyContent='center'>
          <flexboxLayout width={30} height={30} alignItems='center' justifyContent='center' col={0} borderRadius='50%' background={Theme.red}>
            <label color={'#fff'} fontSize={18} className='MaterialIcons' text={IconSet.MaterialIcons.remove} />
          </flexboxLayout>
        </flexboxLayout>
        <NativeModal
          fullscreen
          renderTriggerAction={(ref, open) => (
            <flexboxLayout onTap={open} visibility={isAdmin ? 'visible' : 'collapse'} col={4} alignItems='center' justifyContent='center'>
              <flexboxLayout width={30} height={30} alignItems='center' justifyContent='center' col={0} borderRadius='50%' background={Theme[500]}>
                <label color={'#fff'} fontSize={18} className='MaterialIcons' text={IconSet.MaterialIcons.edit} />
              </flexboxLayout>
            </flexboxLayout>
          )}
          renderContent={(open, close, isModalOpen) => (
            <SportEditor close={close} refetch={refetch} item={item} isAdmin={isAdmin} />
          )}
        />
      </gridLayout>
    </stackLayout>
  )
}

interface SportEditorProps extends ClubSportItemProps {
  close(): void
}

const SportEditor = ({
  close,
  item: initItem,
  refetch,
  isAdmin
}: SportEditorProps) => {
  const [item, setItem] = React.useState<Partial<ISupotsu.ClubSport>>(() => {
    if (initItem) {
      return initItem
    }
    return {
      sport: {
        _id: null,
        color: 'red',
        name: 'Add New Sport',
        date: '',
        halves: 4,
        image: null,
        id: null,
        positions: [],
        status: 'active'
      }
    }
  })
  const users: ISupotsu.User[] = JSON.parse(ApplicationSettings.getString('users', '[]'))
  return (
    <gridLayout rows='auto, *, auto' width='100%' height='100%'>
      <CommonHeader user={{ name: !isAdmin ? item.sport.name : 'Edit Sport' }} goBack={close} />
      <scrollView row={1}>
        <stackLayout padding={'16 0'}>
          <OverviewLabel
            title='Head of Dept'
            initValue={item.headOfDept ? item.headOfDept.name : undefined}
            subtitle={item.headOfDept}
            isAdmin={isAdmin}
            prefix={null}
            hidePrefix
            _id={item._id}
            table={'club_sports'}
            field={'headOfDept'}
            onDataSaved={refetch}
            textEditProps={{
              type: 'select',
              simple: false,
              labelFor: 'Head of Dept',
              selectOptions: users.map((u) => ({
                _id: u._id,
                image: u.image,
                name: u.name
              })),
              onChange(value) {
                console.log(value)
              },
              withImage: true
            }}
          />
          <OverviewLabel
            title='Ass. Head of Dept.'
            initValue={item.assHeadOfDept ? item.assHeadOfDept.name : undefined}
            subtitle={item.assHeadOfDept}
            isAdmin={isAdmin}
            prefix={null}
            hidePrefix
            _id={item._id}
            table={'club_sports'}
            field={'assHeadOfDept'}
            onDataSaved={refetch}
            textEditProps={{
              type: 'select',
              simple: false,
              labelFor: 'Ass. Head of Dept.',
              selectOptions: users.map((u) => ({
                _id: u._id,
                image: u.image,
                name: u.name
              })),
              onChange(value) {
                console.log(value)
              },
              withImage: true
            }}
          />
          <OverviewLabel
            title='Head Coach'
            initValue={item.headCoach ? item.headCoach.name : undefined}
            subtitle={item.headCoach}
            isAdmin={isAdmin}
            _id={item._id}
            table={'club_sports'}
            field={'headCoach'}
            prefix={null}
            hidePrefix
            onDataSaved={refetch}
            textEditProps={{
              type: 'select',
              simple: false,
              labelFor: 'Head Coach',
              selectOptions: users.map((u) => ({
                _id: u._id,
                image: u.image,
                name: u.name
              })),
              onChange(value) {
                console.log(value)
              },
              withImage: true
            }}
          />
          <OverviewLabel
            title='Ass. Head Coach'
            initValue={item.assCoach ? item.assCoach.name : undefined}
            subtitle={item.assCoach}
            isAdmin={isAdmin}
            _id={item._id}
            table={'club_sports'}
            field={'assCoach'}
            prefix={null}
            hidePrefix
            onDataSaved={refetch}
            textEditProps={{
              type: 'select',
              simple: false,
              labelFor: 'Ass. Head Coach',
              selectOptions: users.map((u) => ({
                _id: u._id,
                image: u.image,
                name: u.name
              })),
              onChange(value) {
                console.log(value)
              },
              withImage: true
            }}
          />
        </stackLayout>
      </scrollView>
      <gridLayout row={2} padding={16}>
        <SaveButton text='Close' onTap={close} />
      </gridLayout>
    </gridLayout>
  )
}

interface ClubTeamsProps {
  teams: ISupotsu.ClubTeams,
  refetch(): void
  isAdmin?: boolean
  teamColor: string,
  textColor?: string;
}
export const ClubTeams = ({ ...rest }: ClubTeamsProps) => {
  return (
    <>
      <ClubTeamTabs {...rest} />
    </>
  )
}


interface ClubTeamTabs extends ClubTeamsProps {

}

const ClubTeamTabs: React.FC<ClubTeamTabs> = ({
  teamColor,
  textColor,
  teams
}) => {
  const [active, setActive] = React.useState('Current')
  const { current, past } = teams ? teams : { current: [], past: [] };
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
        <TeamListView background={teamColor} color={textColor} teams={current} />
      </stackLayout>

      <stackLayout visibility={active === 'Past' ? 'visible' : 'collapse'}>
        <TeamListView background={teamColor} color={textColor} teams={past} />
      </stackLayout>
    </>
  )
}


interface TeamListViewProps {
  background?: string;
  color?: string;
  teams: ISupotsu.Team[]
}
const TeamListView: React.FC<TeamListViewProps> = ({
  teams,
  background,
  color
}) => {
  const chunks: ISupotsu.Squad[][] = Methods.arrayChunks(teams, 2)
  console.log(chunks)
  return <></>
}

interface ClubTeamAddScreenProps extends Partial<ClubSportItemProps> {
  close(): void
  team?: ISupotsu.Team
}

const ClubTeamAddScreen = ({
  close,
  team: initTeam,
  refetch
}: ClubTeamAddScreenProps) => {
  const [updateTeam, { loading: isUpdating }] = useSupotsuMutation(UPDATE_TEAM, {})
  const [addTeam, { loading: isAdding }] = useSupotsuMutation(ADD_TEAM, {})
  const [team, setTeam] = React.useState<Partial<ISupotsu.Team>>(initTeam || {})
  // @ts-ignore
  const [errors, setErrors] = React.useState<Record<keyof ISupotsu.Team, boolean>>({})

  const handleChange = (key: keyof ISupotsu.Team, value: any) => {
    setTeam({
      ...team,
      [key]: value
    })
  }

  const handleErrorChange = (key: keyof ISupotsu.Team, value: boolean) => {
    setErrors({
      ...errors,
      [key]: value
    })
  }

  const save = () => {
    if (!team.name || team.name === '') {
      setErrors({
        ...errors,
        name: true
      })

      return;
    }

    if (!team.manager) {
      setErrors({
        ...errors,
        manager: true
      })

      return;
    }

    if (!team.secretary) {
      setErrors({
        ...errors,
        secretary: true
      })

      return;
    }

    if (!team.captain) {
      setErrors({
        ...errors,
        captain: true
      })

      return;
    }

    const data = {
      name: team.name,
      manager: team.manager?._id,
      secretary: team.secretary?._id,
      captain: team.captain?._id
    }

    console.log(data)

    if (team._id) {
      updateTeam({
        variables: {
          data,
          _id: team._id
        },
        update(p, res) {
          refetch()
        }
      })
    } else {
      addTeam({
        variables: {
          data
        },
        update(p, res) {
          refetch()
        }
      })
    }
  }

  const archive = () => {

  }

  const unarchive = () => {

  }

  const remove = () => {

  }

  const users: ISupotsu.User[] = JSON.parse(ApplicationSettings.getString('users', '[]'))

  return (
    <gridLayout width={'100%'} height={'100%'} rows='auto, *, auto'>
      <CommonHeader goBack={close} user={{
        name: team?._id ? 'Edit Team' : 'Add Team'
      }} />
      <scrollView row={1}>
        <stackLayout padding={16}>
          <TextEditField
            type='text'
            labelFor='Name'
            value={team?.name}
            onChange={(value: string) => {
              handleChange('name', value)
              handleErrorChange('name', value.length > 0 ? false : true)
            }}
          />
          <TextEditField
            type='select'
            labelFor='Coach'
            selectOptions={users.map((u) => ({
              _id: u._id,
              image: u.image,
              name: u.name
            }))}
            onChange={(value: ISupotsu.User) => {
              handleChange('manager', value)
              handleErrorChange('manager', value._id ? false : true)
            }}
            withImage
            value={team?.manager}
          />
          <TextEditField
            type='select'
            labelFor='Ass. Coach'
            selectOptions={users.map((u) => ({
              _id: u._id,
              image: u.image,
              name: u.name
            }))}
            onChange={(value: ISupotsu.User) => {
              handleChange('secretary', value)
              handleErrorChange('secretary', value._id ? false : true)
            }}
            withImage
            value={team?.secretary}
          />

          <TextEditField
            type='select'
            labelFor='Captain'
            selectOptions={users.map((u) => ({
              _id: u._id,
              image: u.image,
              name: u.name
            }))}
            onChange={(value: ISupotsu.User) => {
              handleChange('captain', value)
              handleErrorChange('captain', value._id ? false : true)
            }}
            withImage
            value={team?.captain}
          />
        </stackLayout>
      </scrollView>
      <gridLayout padding={16} row={2} columns='*, 8, *, 8, *'>
        <SaveButton text='Archive' col={2} onTap={archive} backgroundColor='green' />
        <SaveButton text='Save' onTap={save} />
        <SaveButton text='Remove' backgroundColor={Theme.red} onTap={remove} col={4} />
      </gridLayout>
    </gridLayout>
  )
}
