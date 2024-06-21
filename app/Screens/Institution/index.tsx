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
import { EventFilterSegments } from '../Events';
import { FollowersAndFans, FollowSection, OverviewContact, ProfileLabel, ProfilePersonalLabel } from '../Team';
import { CommonTimeLine } from '~/components/CommonTimeLine';
import { CommonHeader, Empty } from '~/ui/common.ui';
import { Games } from '../Games';
import { AboutTeam, SocialIcons } from '../Team/AboutTeam';
import { useSupotsuQuery } from '~/utils/useSupotsuMutation';
import { INSTITUTION } from '~/components/GQL';
import { ClubSportAdd, ClubSportItem, ClubTeamAdd, ClubTeams } from '../Club';
import Theme from '~/Theme';


type InstitutionView = 'Timeline' | 'Games' | 'Teams' | 'Sports' | 'About' | 'Photos' | 'Videos' | 'Training' | 'Sports' | 'Fans';

const institutionViews: InstitutionView[] = [
  'Timeline',
  'Sports',
  'Teams',
  'Games',
  'About',
  'Fans',
  'Photos',
  'Videos'
]

export const Institution = () => {
  const navigator = useNavigation();
  const { fonts } = useStyledContext();
  const { setFavTeam, setGame } = useGameContext();
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const route = useRoute();
  const { institution: initInstitution } = (route.params || {}) as { institution: ISupotsu.Institution };
  const { data, refetch, loading: isInstitutionLoading } = useSupotsuQuery(INSTITUTION, {
    variables: {
      _id: initInstitution._id
    }
  })

  const institution = React.useMemo(() => {
    return data && data.institution ? data.institution : initInstitution
  }, [data, initInstitution])
  const color = '#00458F';

  const [active, setActive] = React.useState<InstitutionView>('Timeline');
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

  // if (isInstitutionLoading) {
  //   return (
  //     <gridLayout rows="auto, *">
  //       <CommonHeader user={{
  //         ...institution,
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

  const isAdmin = institution?.roles?.some((r) => r.role.toLowerCase() === 'admin')

  return (
    <gridLayout rows='auto, *'>
      <CommonHeader search user={{
        name: 'Institution Details'
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
                }} src={institution?.image} stretch='aspectFit' />
              </flexboxLayout>
              <flexboxLayout col={1} justifyContent='center' flexDirection='column'>
                <label text={institution?.name} style={{
                  color: textColor,
                  fontSize: 26,
                  marginBottom: 8,
                }} />
                <OverviewContact textColor={textColor} value={institution.email || 'no email set'} image={isLight ? 'website_icon' : 'website_icon_wht'} />
                <OverviewContact iconName='smartphone' textColor={textColor} value={institution.contactMain || 'no contact set'} image={isLight ? 'mobile_icon' : 'mobile_icon_wht'} />
                <OverviewContact iconType='Octicons' iconName='globe' textColor={textColor} value={institution.website || 'not website set'} image={isLight ? 'email_icon' : 'email_icon_wht'} />

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
            <FollowSection textColor={textColor} refetch={refetch} page={institution} />
          </gridLayout>
          <EventFilterSegments stripe color={textColor} background={color} scroll options={institutionViews.map(item => item as string)} active={active} onChange={(item) => {
            setActive(item as InstitutionView);
          }} />

          <stackLayout visibility={active === 'Timeline' && !isInstitutionLoading ? 'visible' : 'collapse'}>
            <CommonTimeLine postUser={{
              _id: institution._id,
              type: 'I'
            }} />
          </stackLayout>
          <stackLayout visibility={active === 'Fans' && !isInstitutionLoading ? 'visible' : 'collapse'}>
            <FollowersAndFans likes={institution.likes}  fans={institution.fans} followers={institution.followers} teamColor={color} textColor={textColor} />
          </stackLayout>
          <stackLayout visibility={active === 'Games' && !isInstitutionLoading ? 'visible' : 'collapse'}>
            <Games sportFilter user={institution} />
          </stackLayout>
          <stackLayout visibility={active === 'Sports' && !isInstitutionLoading ? 'visible' : 'collapse'}>
            <ClubSportAdd page={institution} refetch={refetch} isAdmin={isAdmin} />
            {institution?.sports?.map((cs) => <ClubSportItem item={cs} refetch={refetch} isAdmin={isAdmin} />)}
          </stackLayout>
          <stackLayout visibility={active === 'Teams' && !isInstitutionLoading ? 'visible' : 'collapse'}>
          {isAdmin && <ClubTeamAdd page={institution} refetch={refetch} isAdmin={isAdmin} />}
            <ClubTeams teamColor={color} textColor={textColor} teams={institution.teams} refetch={refetch} />
          </stackLayout>
          <NativeModal
            fullscreen
            renderTriggerAction={(ref, open) => (
              <stackLayout ref={ref} onTap={open} visibility={active === 'About' && !isInstitutionLoading ? 'visible' : 'collapse'} marginTop={17}>
                <ProfileLabel text='Overview' />

                <stackLayout style={{
                  marginBottom: 10,
                  backgroundColor: 'white'
                }}>
                  {institution.manager && <ProfilePersonalLabel newBanner label={'Manager'} value={institution.manager.name} />}
                  <ProfilePersonalLabel newBanner label={'Location'} value={institution.address ? institution.address : 'Not set'} />
                  {/* <ProfilePersonalLabel newBanner label={'Suburb'} value={institution.suburb} />
                  <ProfilePersonalLabel newBanner label={'State/Province'} value={institution.state} />
                  <ProfilePersonalLabel newBanner label={'Postal code'} value={institution.postal} />
                  <ProfilePersonalLabel newBanner label={'Country'} value={institution.country} /> */}
                </stackLayout>
                <ProfileLabel text={'Social'} />
                <SocialIcons isVertical items={institution.socials} />
              </stackLayout>
            )}
            renderContent={(open, close, isModalOpen) => {
              return (
                <AboutTeam refresh={refetch} team={institution} open={open} close={close} />
              )
            }}
          />
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

Institution.routeName = 'institution'
