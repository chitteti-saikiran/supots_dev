import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import MainApp from './AppContainer';
import * as AppSettings from 'tns-core-modules/application-settings';
import { BaseNavigationContainer } from '@react-navigation/core';
import * as ISupotsu from '~/DB/interfaces';
import { GuestUser } from '../DummyData';
import { stackNavigatorFactory } from 'react-nativescript-navigation';
import { Theme2 } from '~/Theme';
import { SupotsuApolloProvider } from '~/contexts/SupotsuApolloContext';
import { NotificationProvider } from '~/contexts/NotificationContext';
import { useSupotsuApolloContext } from '../contexts/SupotsuApolloContext';
import { StyleContextProvider } from '~/contexts/StyledContext';
import { Screen } from '@nativescript/core';
import { NSVElement } from 'react-nativescript';
import { GameContextProvider } from '../contexts/GameContext';
import { SeasonProvider } from '~/contexts/SeasonContext';
import { AuthSignIn } from './AuthSignIn';
import { AuthSignUp } from './AuthSignUp';
import { SportTeamPicker } from './SportsTeamPicker';
import { FriendsProvider } from '~/contexts/FriendsContext';
import { SettingsProvider } from '~/contexts/SettingsContext';
import { AuthRecoverPWD } from './AuthRecoverPWD';

interface AppAuthContextProps {
  isAuth: boolean
  signIn(user: ISupotsu.User): void
  signOut(): void
  user: ISupotsu.User,
  appRef: React.RefObject<any>
}

export const AppAuthContext = React.createContext({
  isAuth: false
} as AppAuthContextProps);

type AuthAction = {
  type: 'SIGN_OUT',
} | {
  type: 'SIGN_IN',
  value: {
    username: string;
    password: string;
    user?: ISupotsu.User
  }
}

interface AppAuthState {
  isAuth: boolean
  user: ISupotsu.User
}

const reducer = (prevState: AppAuthState, action: AuthAction): AppAuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...prevState,
        isAuth: true,
        ...action.value.user ? {
          user: action.value.user
        } : {}
      }
    case 'SIGN_OUT':
      return {
        ...prevState,
        isAuth: false,
      }
  }
}

const initState = (args: AppAuthState): AppAuthState => {
  const _user: ISupotsu.User = JSON.parse(AppSettings.getString('you', JSON.stringify(GuestUser)))
  return {
    ...args,
    user: _user
  }
}

const AppRoutes = () => {
  const { isAuth, user, signOut } = React.useContext(AppAuthContext);
  const [isPickingSports, setIsPickingSports] = React.useState(true)
  React.useEffect(() => {
    if (user.username === "__GUEST__") {
      signOut();
    }
  }, [user])
  return (
    <gridLayout>
      <BaseNavigationContainer>
        {isAuth && (
          <MainApp />
        )}
        {!isAuth && (
          <AuthRouter />
        )}
      </BaseNavigationContainer>
    </gridLayout>
  )
}

const AppAuth = () => {
  const containerRef = React.useRef(null)
  const [state, dispatch] = React.useReducer(reducer, {
    isAuth: true,
    user: null
  }, initState);

  const signIn = (user: ISupotsu.User) => {
    dispatch({
      type: 'SIGN_IN',
      value: {
        password: '',
        username: '',
        user
      }
    })
  }

  const signOut = () => {
    AppSettings.clear()
    dispatch({
      type: 'SIGN_OUT'
    })
  }

  return (
    <gridLayout rows="*" columns="*" style={{
      width: '100%',
      height: '100%',
      background: 'white'
    }} ref={containerRef}>

<SupotsuApolloProvider>
      <AppAuthContext.Provider value={{ isAuth: state.isAuth, signIn, signOut, user: state.user, appRef: containerRef }}>
        <SettingsProvider>
          <NotificationProvider>
              <StyleContextProvider>
                <GameContextProvider>
                  <SeasonProvider>
                    <FriendsProvider>
                      <AppRoutes />
                    </FriendsProvider>
                  </SeasonProvider>
                </GameContextProvider>
              </StyleContextProvider>
          </NotificationProvider>
        </SettingsProvider>
      </AppAuthContext.Provider>
            </SupotsuApolloProvider>
    </gridLayout>
  )
}



const AuthStackNavigator = stackNavigatorFactory();

const AuthRouter = () => {
  return (
    <AuthStackNavigator.Navigator initialRouteName='signIn'>
      <AuthStackNavigator.Screen name="signIn" component={AuthSignIn} />
      <AuthStackNavigator.Screen name="signUp" component={AuthSignUp} />
      <AuthStackNavigator.Screen name="recover" component={AuthRecoverPWD} />
    </AuthStackNavigator.Navigator>
  )
}

export default AppAuth;
