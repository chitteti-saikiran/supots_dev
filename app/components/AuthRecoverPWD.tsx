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
import { RECOVER_PWD } from '~/apollo/mutations/recover';

export const AuthRecoverPWD = () => {
  const navigator = useNavigation()
  const [loading, setLoading] = React.useState(false);
  const { formState, handleValueChange } = useFormState({
    initialState: {
      values: {
        email: 'time.over@gmail.com',
        password: '',
        passwordTwo: '',
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

    if (formState.values.passwordTwo !== formState.values.password) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    client.mutate({
      mutation: RECOVER_PWD,
      variables: {
        data: {
          email: formState.values.email,
          password: formState.values.password
        }
      }
    }).then(({ data }) => {
      console.log(data.recover);
      if (data.recover) {
        setLoading(false);
        alert('Password reset successfully!')
        navigator.goBack()
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
          <label textWrap row={0} text="Forgot Password?" style={{
            fontSize: 36,
            color: '#fff',
            margin: '50 30'
          }} />
          <gridLayout row={1} paddingLeft={30} paddingRight={30} rows='50, 8, 50, 8, 50, *, auto'>
            <TextEditField.Text
              value={formState.values.email}
              keyboardType='email'
              row={0}
              hint='Email address'
              editMode={!loading}
              onChange={(value) => {
                handleValueChange('email', value);
              }} />
            <TextEditField.Text
              value={formState.values.password}
              row={2}
              secure
              hint='New password'
              editMode={!loading}
              onChange={(value) => {
                handleValueChange('password', value);
              }} />


            <TextEditField.Text
              value={formState.values.password}
              row={4}
              secure
              hint='Confirm password'
              editMode={!loading}
              onChange={(value) => {
                handleValueChange('passwordTwo', value);
              }} />
            <gridLayout row={5} columns='*, 8, *'>
              <SaveButton onTap={() => {
                if (loading) return
                navigator.navigate('signIn', {})
              }} color={Theme[500]} style={{
                borderRadius: 10,
                color: Theme[500],
                backgroundColor: '#fff'
              }} text='Cancel' />
              <SaveButton style={{
                borderRadius: 10
              }} col={2} isLoading={loading} onTap={fakeLogin} text='Save' />
            </gridLayout>
          </gridLayout>
        </gridLayout>
        <flexboxLayout row={2}>

        </flexboxLayout>
      </gridLayout>
    </BubbleBackground>
  );
};
