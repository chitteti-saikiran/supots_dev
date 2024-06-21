import * as React from 'react'
import { MainStackParamList, Route } from '~/components/MainStackParamList'
import { NativeStackNavigationProp } from 'react-nativescript-navigation'
import { RouteProp } from '@react-navigation/core'
import { AppAuthContext } from '~/components/Root'
import * as HttpModule from '@nativescript/core/http';
import { useSupotsuQuery } from '~/utils/useSupotsuMutation'
import { CommonHeader, Empty, LoadingState } from '~/ui/common.ui'
import { Page } from '~/ui/Page'
import { EventFilterSegments } from '../Events'
import Theme, { Theme2 } from '~/Theme'
import { CommonTimeLine } from '~/components/CommonTimeLine'
import { Games } from '../Games'
import { FollowersAndFans, FollowSection, ProfileLabel, ProfilePersonalLabel } from '../Team'
import { SocialIcons, AboutTeam } from '../Team/AboutTeam'
import Modal from '~/ui/Modal'
import { ApplicationSettings } from '@nativescript/core'
import Methods from '~/Methods'
import { SportTeamPicker, SportTeamPickerInputItem, SportTeamPickerViewResponse } from '~/components/SportsTeamPicker'

type ProfileProps = {
  route: RouteProp<MainStackParamList, Route.Profile>,
  navigation: NativeStackNavigationProp<MainStackParamList, Route.Profile>,
}

type ProfileView = 'Timeline' | 'Games' | 'About' | 'Photos' | 'Videos' | 'Sports & Teams';

const ProfileViews: ProfileView[] = [
  'Timeline',
  'About',
  'Photos',
  'Videos',
  'Games',
  'Sports & Teams'
]

export const Profile = ({ navigation, route }: ProfileProps) => {
  const { user: me, signIn } = React.useContext(AppAuthContext)
  const { user: profileUser } = route.params ?? {}

  const [loading, setLoading] = React.useState(true)
  const [userFetched, setUserFetched] = React.useState(false)
  const [active, setActive] = React.useState<ProfileView>('Timeline');


  const [user, setUser] = React.useState(() => profileUser || me);
  const isAdmin = !profileUser
  const textColor = '#fff'

  const getProfile = () => {
    if (userFetched) return
    setLoading(true)
    HttpModule.request({
      url: `https://supotsu.com/api/user/profile/${user._id}`,
      method: 'Post'
    }).then((value) => {
      const data_ = value.content.toJSON();
      if (isAdmin) {
        ApplicationSettings.setString('you', value.content.toString());
        Methods.setData('yoo', data_);
        signIn(data_)
        setUser(data_)
      } else {
        setUser(data_)
      }
      setLoading(false);
      setUserFetched(true)
    }).catch((err) => {
      console.log(err, 'HERE - http user refresh');
      setLoading(false);
    });
  }

  const refetch = () => {
    setUserFetched(false)
    // getProfile()
  }

  React.useEffect(() => {
    getProfile()
  }, [])

  if (loading) {
    return (
      <gridLayout rows="auto, *">
        <CommonHeader user={{
          ...user,
          image: undefined
        }} goBack={navigation.canGoBack ? navigation.goBack : undefined} />
        <flexboxLayout row={1} style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <activityIndicator busy color={Theme[500]} />
        </flexboxLayout>
      </gridLayout>
    )
  }

  return (
    <gridLayout rows="auto, *">
      <CommonHeader user={{
        ...user,
        image: undefined
      }} goBack={navigation.canGoBack ? navigation.goBack : undefined} />
      <scrollView row={1}>
        <stackLayout paddingBottom={16} background={'#eee'}>
          <flexboxLayout style={{
            padding: 16,
            paddingBottom: isAdmin ? 24 : 16,
            justifyContent: 'center',
            alignItems: 'center',
            background: Theme[500],
          }}>
            <image src={user.image} stretch='fill' style={{
              height: 200,
              width: 200,
              borderRadius: 100,
            }} />
          </flexboxLayout>
          <gridLayout visibility={isAdmin ? 'collapse' : 'visible'} rows='auto, auto' style={{
            background: Theme[500],
            paddingBottom: 16
          }}>
            <FollowSection textColor={textColor} refetch={refetch} page={user} />
          </gridLayout>
          <EventFilterSegments background={Theme[500]} stripe scroll options={ProfileViews.map(item => item as string)} active={active} onChange={(item) => {
            setActive(item as ProfileView);
          }} />
          <flexboxLayout visibility={loading ? 'visible' : 'collapse'} style={{
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            <LoadingState style={{
              background: '#eee'
            }} />
          </flexboxLayout>

          <stackLayout visibility={active === 'Timeline' && !loading ? 'visible' : 'collapse'}>
            <CommonTimeLine postUser={{
              _id: user._id,
              type: 'T'
            }} />
          </stackLayout>

          <stackLayout visibility={active === 'Games' && !loading ? 'visible' : 'collapse'}>
            <Games sportFilter user={user} />
          </stackLayout>

          <stackLayout visibility={active === 'Sports & Teams' && !loading ? 'visible' : 'collapse'}>
            <SportTeamList isAdmin={isAdmin} title='Sports followed' list={user.sportsFollowed.map((c) => ({
              id: c._id,
              image: `https://supotsu.com/${c.image.replace("_wht", "").replace('.svg', '.png')}`,
              name: c.name,
            }))} />
            <SportTeamList isAdmin={isAdmin} title='Teams followed' list={user.teamsFollowed.map((c) => ({
              id: Methods.getUser(c)._id,
              image: `https://supotsu.com/${Methods.getUser(c).image.replace("_wht", "").replace('.svg', '.png')}`,
              name: Methods.getUser(c).name,
            }))} />
          </stackLayout>

          <Modal
            fullscreen
            renderTriggerAction={(ref, open) => (
              <stackLayout ref={ref} onTap={isAdmin ? open : undefined} visibility={active === 'About' && !loading ? 'visible' : 'collapse'} marginTop={17}>
                <ProfileLabel text='Overview' />

                <stackLayout style={{
                  marginBottom: 10,
                  backgroundColor: 'white'
                }}>
                  <ProfilePersonalLabel newBanner label={'Name'} value={user.first_name} />
                  <ProfilePersonalLabel newBanner label={'Surname'} value={user.last_name} />
                  <ProfilePersonalLabel newBanner label={'Address'} value={user.address} />
                  <ProfilePersonalLabel newBanner label={'Suburb'} value={user.suburb} />
                  <ProfilePersonalLabel newBanner label={'State/Province'} value={user.state} />
                  <ProfilePersonalLabel newBanner label={'Postal code'} value={user.postal} />
                  <ProfilePersonalLabel newBanner label={'Country'} value={user.country} />
                </stackLayout>
                <ProfileLabel text={'Social'} />
                <SocialIcons isVertical items={user?.contacts?.social} />
              </stackLayout>
            )}
            renderContent={(open, close, isModalOpen) => {
              return (
                <AboutTeam isAdmin={isAdmin} user={user} refresh={refetch} open={open} close={close} />
              )
            }}
          />
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

interface SportTeamListProps {
  title: string
  list: SportTeamPickerInputItem[],
  isAdmin: boolean,
}

const SportTeamList = ({
  title,
  list,
  isAdmin,

}: SportTeamListProps) => {
  const { user } = React.useContext(AppAuthContext)
  const onSave = (data: SportTeamPickerViewResponse) => {

  }
  return (
    <SportTeamPicker
      onApply={onSave}
      renderTriggerAction={(ref, open) => (
        <flexboxLayout flexDirection='column' ref={ref} style={{
          background: '#fff',
          marginTop: 16,
          marginBottom: 16,
        }} onTap={() => {
          if (isAdmin) {
            open()
          }
        }}>
          <label padding={'16 16 0'} style={{
            fontSize: 20,
            color: '#000'
          }}>{title}</label>
          <scrollView orientation='horizontal'>
            <stackLayout orientation='horizontal' style={{
              padding: 16,

            }}>
              {list.map((item) => {
                return (
                  <gridLayout rows='100, auto' key={item.id} style={{
                    width: 100,
                    marginRight: 17,
                    marginBottom: 17,
                  }}>
                    <flexboxLayout alignItems='center' justifyContent='center' key={item.id} style={{
                      height: 80,
                      width: 80,
                      borderRadius: '50%',
                      background: Theme2[100],
                      padding: 12,
                      borderColor: item.selected ? Theme2[500] : Theme2[100],
                      borderWidth: 5,
                    }}>
                      <image width={80} height={80} borderRadius='50%' src={`${item.image}`} />
                    </flexboxLayout>
                    <label row={1} textAlignment='center' textWrap text={item.name} style={{
                      marginTop: 8,
                    }} />
                  </gridLayout>
                )
              })}
              {list.length === 0 && (
                <label style={{
                  color: '#000',
                  width: '100%',
                  textAlignment: 'center',
                }}>No items found</label>
              )}
            </stackLayout>
          </scrollView>
        </flexboxLayout>
      )}
    />
  )
}
Profile.routeName = Route.Profile
