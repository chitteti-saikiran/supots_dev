import * as React from 'react';
import { useContext } from 'react';
import * as AppSettings from 'tns-core-modules/application-settings';
import Theme from '~/Theme';
import Methods from '../Methods';
import * as HttpModule from '@nativescript/core/http';
import { TextEditField } from '~/Screens/Events';
import { SaveButton } from '~/Screens/Training';
import { BubbleBackground } from './BubbleBackground';
import { useFormState } from '~/hooks/useFormState';
import { client } from '~/app';
import { AUTH } from '~/apollo/queries/auth';
import { AppAuthContext } from './Root';
import { useNavigation } from '@react-navigation/core';

export const AuthSignIn = () => {
  const navigator = useNavigation()
  const [loading, setLoading] = React.useState(false);
  const { formState, handleValueChange } = useFormState({
    initialState: {
      values: {
        email: '',
        password: ''
      }
    },
    schema: {
      email: {
        email: {
          message: 'Invalid email address'
        }
      },
    }
  });
  const {
    signIn
  } = useContext(AppAuthContext);
  const fakeLogin = () => {
    if (formState.values.email.length === 0) {
      alert('Invalid email or username');
      return;
    }

    if (formState.values.password.length === 0) {
      alert('Please enter password!');
      return;
    }

    setLoading(true);

    client.query({
      query: AUTH,
      variables: {
        username: formState.values.email,
        password: formState.values.password
      }
    }).then(({ data }) => {
      console.log(data.auth);
      if (data.auth) {
        HttpModule.request({
          url: `https://supotsu.com/api/user/profile/${data.auth._id}`,
          method: 'Post'
        }).then((value) => {
          const data_ = value.content.toJSON();
          AppSettings.setString('you', value.content.toString());
          Methods.setData('yoo', data_);
          signIn(data_);
          setLoading(false);
        }).catch((err) => {
          console.log(err, 'HERE - http user');
          setLoading(false);
        });
      }
    }).catch((err) => {
      console.log(err);
      alert(err.message);
      setLoading(false);
    });
  };
  return (
    <BubbleBackground>
      <gridLayout height="100%" width="100%" padding={16} rows="*, auto, 250">
        <gridLayout rows='auto, *'>
          <label row={0} text="Sign In" style={{
            fontSize: 36,
            color: '#fff',
            margin: '50 30'
          }} />
          <gridLayout row={1} paddingLeft={30} paddingRight={30} rows='50, 8, 50, *, auto'>
            <TextEditField.Text
              value={formState.values.email}
              keyboardType='email'
              row={0}
              hint='Email'
              editMode={!loading}
              onChange={(value) => {
                handleValueChange('email', value);
              }} />
            <TextEditField.Text
              value={formState.values.password}
              row={2}
              secure
              hint='Password'
              editMode={!loading}
              onChange={(value) => {
                handleValueChange('password', value);
              }} />
            <gridLayout row={4} columns='*, 8, *'>
              <SaveButton onTap={() => {
                if (loading) return
                navigator.navigate('signUp', {})
              }} color={Theme[500]} style={{
                borderRadius: 10,
                color: Theme[500],
                backgroundColor: '#fff'
              }} text='Sign Up' />
              <SaveButton style={{
                borderRadius: 10
              }} col={2} isLoading={loading} onTap={fakeLogin} text='Sign In' />
            </gridLayout>
          </gridLayout>
        </gridLayout>
        <stackLayout paddingLeft={30} paddingRight={30} marginTop={16} row={1}>
          <label verticalAlignment='middle' horizontalAlignment='center' textAlignment='center' row={1} style={{}}>or login with</label>
          <SaveButton onTap={() => {
            if (loading) return
            navigator.navigate('recover', {})
          }} color={Theme[500]} style={{
            borderRadius: 10,
            height: 50,
            color: Theme[500],
            backgroundColor: '#fff',
            marginTop: 8,
          }} text='Forgot password?' />
        </stackLayout>
        <flexboxLayout row={2}>

        </flexboxLayout>
      </gridLayout>
    </BubbleBackground>
  );
};
