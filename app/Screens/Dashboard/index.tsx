import { useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { AppAuthContext } from '~/components/Root';
import { CommonHeader, Empty, LoadingState } from '~/ui/common.ui';
import IconSet from '~/font-icons';
import Theme from '~/Theme';
import { RNSStyle } from 'react-nativescript';
import { DrawerContext } from '../../components/AppContainer';
import * as ISupotsu from '~/DB/interfaces';
import { EventsTab } from '../Events';
import { Games } from '../Games';
import { UnionUser } from '~/utils/types';
import { useQuery } from '@apollo/react-hooks';
import { GET_ROLES } from '~/services/graphql/dashboard';
import Methods from '~/Methods';
import { DocumentsView } from '../Documents';
import { ApplicationsView } from '../Applications';
import { ChatScreenMini } from '../Chats';

type DashboardRoute = 'Children' | 'Teams' | 'Clubs' | 'Institutions' | 'Tournaments';
const ROUTES: DashboardRoute[] = [
  'Children',
  'Teams',
  'Clubs',
  'Institutions',
  'Tournaments'
];

type DashboardViews = 'Games' | 'Events' | 'Documents' | 'Messages' | 'Applications'

const Dashboard = (): JSX.Element => {
  const {
    user
  } = React.useContext(AppAuthContext)
  const {
    closeDraweCallback,
    openDraweCallback,
  } = React.useContext(DrawerContext);
  const [active, setActive] = React.useState<DashboardRoute>('Children');
  const [activeRole, setActiveRole] = React.useState<ISupotsu.Role>(() => {
    const _default: ISupotsu.Role =  {
      _id: user._id,
      user,
      date: "",
      content: {
        C: null,
        E: null,
        T: null,
        L: null,
        I: null,
        Q: null,
        G: null,
        posts: [],
        type: 'F',
        status: '',
        __type: 'CommonUser',
        __schema: '',
        F: user,
        _id: user._id,

      },
      status: "active",
      role: "Admin"
    }

    return _default;
  });
  const [isOpenRoutes, setIsOpenRoutes] = React.useState<boolean>(false);
  const [isOpenSubContents, setIsOpenSubContents] = React.useState<boolean>(false);
  const { data, loading } = useQuery(GET_ROLES, {
    variables: {
      _id: user._id
    }
  });

  const getData = (): ISupotsu.Role[] => {
    if (!data) return [];
    let items = [];
    const {getRoles = []} = data;
    switch (active) {
      case 'Teams':
        items = (getRoles as ISupotsu.Role[]).filter((item) => {
          if (!item.content) return false;
          return item.content.type === "T"
        });
        break;
      case 'Tournaments':
        items = (getRoles as ISupotsu.Role[]).filter((item) => {
          if (!item.content) return false;
          return item.content.type === "L"
        });
        break;
      case 'Institutions':
        items = (getRoles as ISupotsu.Role[]).filter((item) => {
          if (!item.content) return false;
          return item.content.type === "I"
        });
        break;
      case 'Clubs':
        items = (getRoles as ISupotsu.Role[]).filter((item) => {
          if (!item.content) return false;
          return item.content.type === "C"
        });
        break;
      case 'Children':
      default:
        items = (getRoles as ISupotsu.Role[]).filter((item) => {
          if (!item.content) return false;
          return item.content.type === "F"
        })
        break;
    }
    const filterIds = [];
    const list = [];
    items.forEach((item) => {
      if (!filterIds.includes(item.content._id)) {
        list.push(item);
        filterIds.push(item.content._id)
      }
    })
    return list;
  };

  console.log(getData());

  const { navigate, goBack, isFocused } = useNavigation();

  const activeUser = Methods.getUser(activeRole.content)

  return (
    <gridLayout rows="auto, auto, *">
      <CommonHeader goBack={openDraweCallback} user={{
        name: "Dashboard"
      }} icons={[]} />
      <stackLayout row={1} style={{
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
      }}>
        <gridLayout columns="auto, auto, *, auto" style={{
          height: 60,
          paddingLeft: 12,
          paddingRight: 12
        }}>
          <flexboxLayout style={{
            height: 40,
            width: 40
          }} col={0}>
            <image style={{
              height: '100%',
              width: '100%',
              borderRadius: 20
            }} stretch="fill" src={activeUser ? activeUser.image :  user.image}/>
          </flexboxLayout>
          <flexboxLayout onTap={() => {
            setIsOpenRoutes(false)
            setIsOpenSubContents((isOpen) => !isOpen);
          }} col={1} style={{
            alignItems: 'center',
            marginLeft: 8,
            marginRight: 8,
          }}>
            <label style={{
              fontSize: 15,
              marginRight: 0
            }}>{activeUser ? activeUser.name :  user.name}</label>
            <label className={'MaterialIcons size25'} text={isOpenSubContents ? IconSet['MaterialIcons']['arrow-drop-up'] : IconSet['MaterialIcons']['arrow-drop-down']}/>
          </flexboxLayout>
          <flexboxLayout onTap={() => {
            setIsOpenRoutes((isOpen) => !isOpen)
            setIsOpenSubContents(false);
          }} col={3} style={{
            alignItems: 'center',
            marginLeft: 8,
            marginRight: 8,
          }}>
            <label style={{
              fontSize: 15,
              marginRight: 0
            }}>{active}</label>
            <label className={'MaterialIcons size25'} text={isOpenRoutes ? IconSet['MaterialIcons']['arrow-drop-up'] : IconSet['MaterialIcons']['arrow-drop-down']}/>
          </flexboxLayout>
        </gridLayout>
        {isOpenRoutes && (
          <scrollView marginBottom={8} scrollBarIndicatorVisible={false} orientation="horizontal">
            <stackLayout orientation="horizontal" style={{
              paddingLeft: 12,
              paddingRight: 12,
            }}>
              {ROUTES.map((route) => {
                return (
                  <flexboxLayout key={route} onTap={() => {
                    setActive(route);
                    setIsOpenRoutes(false)
                    setIsOpenSubContents((isOpen) => !isOpen);
                  }} style={{
                    padding: '4 8',
                    marginRight: 8,
                    borderRadius: 20,
                    background: active === route ? Theme[500] : '#eee',
                    color:  active === route ? '#fff' : '#000',
                  }}>
                    <label style={{
                      fontSize: 12
                    }} text={route}/>
                  </flexboxLayout>
                )
              })}
            </stackLayout>
          </scrollView>
        )}
        {isOpenSubContents && (
          <scrollView marginBottom={8} scrollBarIndicatorVisible={false} orientation="horizontal">
            <stackLayout orientation="horizontal" style={{
              paddingLeft: 12,
              paddingRight: 12,
            }}>
              {getData().map((item) => {
                const _user = Methods.getUser(item.content);
                return (
                  <flexboxLayout key={item._id} onTap={() => {
                    setIsOpenRoutes(false)
                    setIsOpenSubContents(false);
                    setActiveRole(item)
                  }} style={{
                    padding: '4 8',
                    marginRight: 8,
                    borderRadius: 20,
                    background: activeRole && activeRole._id === item._id ? Theme[500] : '#eee',
                    color:  activeRole && activeRole._id === item._id ? '#fff' : '#000',
                  }}>
                    <label style={{
                      fontSize: 12
                    }} text={_user.name}/>
                  </flexboxLayout>
                )
              })}
            </stackLayout>
          </scrollView>
        )}
      </stackLayout>
      {active === 'Children' && (
        <ChildrenDashboard key={`user-${activeUser._id}`} user={{
          ...activeUser,
          type: "F"
        }} views={['Games', 'Events', 'Documents']} isShown={!loading ? true : active === 'Children' ? true : false} />
      )}
      {active === 'Teams' && (
        <TeamsDashboard key={`team-${activeUser._id}`} user={{
          ...activeUser,
          type: "T"
        }} views={['Games', 'Events', 'Documents', 'Messages', 'Applications']} isShown={!loading ? true : active === 'Teams' ? true : false} />
      )}
      {active === 'Clubs' && (
        <ClubsDashboard key={`club-${activeUser._id}`} user={{
          ...activeUser,
          type: "C"
        }} views={['Games', 'Events', 'Documents', 'Messages']} isShown={!loading ? true : active === 'Clubs' ? true : false} />
      )}
      {active === 'Institutions' && (
        <InstitutionDashboard key={`institute-${activeUser._id}`} user={{
          ...activeUser,
          type: "I"
        }} views={['Games', 'Events', 'Documents', 'Messages']} isShown={!loading ? true : active === 'Institutions' ? true : false} />
      )}
      {active === 'Tournaments' && (
        <TournamentsDashboard key={`tourn-${activeUser._id}`} user={{
          ...activeUser,
          type: "T"
        }} views={['Games', 'Events', 'Documents', 'Messages']} isShown={!loading ? true : active === 'Tournaments' ? true : false} />
      )}
      <flexboxLayout row={2} visibility={loading ? "visible" : "collapse"} style={{
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff'
      }}>
        <LoadingState />
      </flexboxLayout>
    </gridLayout>
  )
}

const centerStyle: RNSStyle = {
  alignItems: 'center',
  justifyContent: 'center',
}

interface DashboardSubProps {
  isShown?: boolean;
  views?: DashboardViews[];
  user: UnionUser
}

interface ChildrenDashboard extends DashboardSubProps {

}

const ChildrenDashboard = ({
  isShown,
  views = [],
  user
} : ChildrenDashboard) => {
  const [activeView, setActiveView] = React.useState<DashboardViews>('Games');
  return (
    <gridLayout row={2} rows="auto, *" visibility={isShown ? 'visible' : 'collapse'}>
      <scrollView row={0} marginBottom={8} marginTop={8} scrollBarIndicatorVisible={false} orientation="horizontal">
        <stackLayout orientation="horizontal" style={{
          paddingLeft: 12,
          paddingRight: 12,
        }}>
          {views.map((view) => {
            return (
              <flexboxLayout key={view} onTap={() => {
                setActiveView(view)
              }} style={{
                padding: '4 8',
                marginRight: 8,
                borderRadius: 20,
                background: activeView === view ? Theme[500] : '#eee',
                color: activeView === view ? '#fff' : '#000',
              }}>
                <label style={{
                  fontSize: 12
                }} text={view} />
              </flexboxLayout>
            )
          })}
        </stackLayout>
      </scrollView>
      <EventsTab isShown={activeView === "Events" ? true : false} user={user} row={1} sportFilter={true} />
      <Games isShown={activeView === "Games" ? true : false} user={user} row={1} sportFilter={true} />
      <DocumentsView isShown={activeView === "Documents" ? true : false} user={user} row={1} sportFilter={true}  />
    </gridLayout>
  )
}

interface TeamsDashboard extends DashboardSubProps {

}

const TeamsDashboard = ({
  isShown,
  views = [],
  user
} : TeamsDashboard) => {
  const [activeView, setActiveView] = React.useState<DashboardViews>('Games');
  return (
    <gridLayout row={2} rows="auto, *" visibility={isShown ? 'visible' : 'collapse'}>
      <scrollView row={0} marginBottom={8} marginTop={8} scrollBarIndicatorVisible={false} orientation="horizontal">
        <stackLayout orientation="horizontal" style={{
          paddingLeft: 12,
          paddingRight: 12,
        }}>
          {views.map((view) => {
            return (
              <flexboxLayout key={view} onTap={() => setActiveView(view)} style={{
                padding: '4 8',
                marginRight: 8,
                borderRadius: 20,
                background: activeView === view ? Theme[500] : '#eee',
                color: activeView === view ? '#fff' : '#000',
              }}>
                <label style={{
                  fontSize: 12
                }} text={view} />
              </flexboxLayout>
            )
          })}
        </stackLayout>
      </scrollView>
      <EventsTab isShown={activeView === "Events" ? true : false} user={user} row={1} />
      <Games isShown={activeView === "Games" ? true : false} user={user} row={1} />
      <DocumentsView isShown={activeView === "Documents" ? true : false} user={user} row={1} sportFilter={true}  />
      <ChatScreenMini isShown={activeView === "Messages" ? true : false} query={{
        $or: [
          {
            team: user._id,
            isPage: true
          }
        ]
      }} emailsQuery={{
        $or:[
          {
              users: {
                  $in: [user._id]
              }
          }
      ]
      }} user={user} row={1} />
      <ApplicationsView isShown={activeView === "Applications" ? true : false} user={user} row={1} sportFilter={true} />
    </gridLayout>
  )
}

interface ClubsDashboard extends DashboardSubProps {

}

const ClubsDashboard = ({
  isShown,
  views = [],
  user
} : ClubsDashboard) => {
  const [activeView, setActiveView] = React.useState<DashboardViews>('Games');
  return (
    <gridLayout row={2} rows="auto, *" visibility={isShown ? 'visible' : 'collapse'}>
      <scrollView row={0} marginBottom={8} marginTop={8} scrollBarIndicatorVisible={false} orientation="horizontal">
        <stackLayout orientation="horizontal" style={{
          paddingLeft: 12,
          paddingRight: 12,
        }}>
          {views.map((view) => {
            return (
              <flexboxLayout key={view} onTap={() => setActiveView(view)} style={{
                padding: '4 8',
                marginRight: 8,
                borderRadius: 20,
                background: activeView === view ? Theme[500] : '#eee',
                color: activeView === view ? '#fff' : '#000',
              }}>
                <label style={{
                  fontSize: 12
                }} text={view} />
              </flexboxLayout>
            )
          })}
        </stackLayout>
      </scrollView>
      <EventsTab isShown={activeView === "Events" ? true : false} user={user} row={1} />
      <Games isShown={activeView === "Games" ? true : false} user={user} row={1} />
    </gridLayout>
  )
}

const InstitutionDashboard = ({
  isShown,
  views = [],
  user
} : ClubsDashboard) => {
  const [activeView, setActiveView] = React.useState<DashboardViews>('Games');
  return (
    <gridLayout row={2} rows="auto, *" visibility={isShown ? 'visible' : 'collapse'}>
      <scrollView row={0} marginBottom={8} marginTop={8} scrollBarIndicatorVisible={false} orientation="horizontal">
        <stackLayout orientation="horizontal" style={{
          paddingLeft: 12,
          paddingRight: 12,
        }}>
          {views.map((view) => {
            return (
              <flexboxLayout key={view} onTap={() => setActiveView(view)} style={{
                padding: '4 8',
                marginRight: 8,
                borderRadius: 20,
                background: activeView === view ? Theme[500] : '#eee',
                color: activeView === view ? '#fff' : '#000',
              }}>
                <label style={{
                  fontSize: 12
                }} text={view} />
              </flexboxLayout>
            )
          })}
        </stackLayout>
      </scrollView>
      <EventsTab isShown={activeView === "Events" ? true : false} user={user} row={1} />
      <Games isShown={activeView === "Games" ? true : false} user={user} row={1} />
    </gridLayout>
  )
}

interface TournamentsDashboard extends DashboardSubProps {

}

const TournamentsDashboard = ({
  isShown,
  views = [],
  user
} : TournamentsDashboard) => {
  const [activeView, setActiveView] = React.useState<DashboardViews>('Games');
  return (
    <gridLayout row={2} rows="auto, *" visibility={isShown ? 'visible' : 'collapse'}>
      <scrollView row={0} marginBottom={8} marginTop={8} scrollBarIndicatorVisible={false} orientation="horizontal">
        <stackLayout orientation="horizontal" style={{
          paddingLeft: 12,
          paddingRight: 12,
        }}>
          {views.map((view) => {
            return (
              <flexboxLayout key={view} onTap={() => setActiveView(view)} style={{
                padding: '4 8',
                marginRight: 8,
                borderRadius: 20,
                background: activeView === view ? Theme[500] : '#eee',
                color: activeView === view ? '#fff' : '#000',
              }}>
                <label style={{
                  fontSize: 12
                }} text={view} />
              </flexboxLayout>
            )
          })}
        </stackLayout>
      </scrollView>
      <EventsTab isShown={activeView === "Events" ? true : false} user={user} row={1} />
      <Games isShown={activeView === "Games" ? true : false} user={user} row={1} />
    </gridLayout>
  )
}

Dashboard.routeName = 'dashboard';

export default Dashboard;
