import * as React from 'react'
import { BubbleBackground } from './BubbleBackground'
import { SignUpMutationVariables, UserCreateInput } from '~/generated/graphql'
import { useFormState } from '~/hooks/useFormState'
import { TextEditField } from '~/Screens/Events'
import { useContext } from 'react';
import { AppAuthContext } from './Root';
import * as AppSettings from 'tns-core-modules/application-settings';
import { SaveButton } from '~/Screens/Training'
import { useSupotsuMutation } from '~/utils/useSupotsuMutation'
import { SIGN_UP } from '~/apollo/mutations/signUp'
import { format, isValid } from 'date-fns'
import Methods from '~/Methods'
import * as HttpModule from '@nativescript/core/http';

export const AuthSignUp = () => {
  const {
    signIn
  } = useContext(AppAuthContext);
  const [signUp, { loading }] = useSupotsuMutation<any, SignUpMutationVariables>(SIGN_UP, {})
  const [signingUp, setSigningUp] = React.useState(false)
  const { formState, handleChange, get, set, hasError, touch, validate } = useFormState<UserCreateInput>({
    initialState: {
      values: {
        isSocialAuth: false,
        address: '',
        bday: '',
        country: '',
        displayName: '',
        email: '',
        gender: 'male',
        isParent: false,
        isUnderAge: false,
        mySport: [],
        name: '',
        pass: '',
        photoUrl: '',
        postalCode: '',
        provider: '',
        sportsFollowed: [],
        state: '',
        suburbs: '',
        surname: '',
        uid: ''
      }
    },
    schema: {
      address: {
        length: {
          minimum: 2
        }
      },
      country: {
        length: {
          minimum: 2
        }
      },
      state: {
        length: {
          minimum: 2
        }
      },
      suburbs: {
        length: {
          minimum: 2
        }
      },
      pass: {
        length: {
          minimum: 4,
          maximum: 7
        }
      },
      name: {
        length: {
          minimum: 2
        }
      },
      surname: {
        length: {
          minimum: 2
        }
      },
      email: {
        email: {}
      },
      bday: {
        length: {
          minimum: 2
        }
      },
      gender: {
        length: {
          minimum: 1
        }
      }
    }
  })

  const onSave = () => {
    const keys = Object.keys(formState.errors).filter((k) => !!formState.errors[k])

    console.log(keys)

    if (keys.length > 0) {
      validate()
    } else {
      const user = formState.values
      delete user.undefined
      setSigningUp(true)
      signUp({
        variables: {
          user
        },
      }).then(({ data }) => {
        console.log(data)
        if (data && data.signUp) {
          HttpModule.request({
            url: `https://supotsu.com/api/user/profile/${data.signUp._id}`,
            method: 'Post'
          }).then((value) => {
            const data_ = value.content.toJSON();
            AppSettings.setString('you', value.content.toString());
            Methods.setData('yoo', data_);
            signIn(data_);
            setSigningUp(false)
          }).catch((err) => {
            alert(err.message)
            console.log(err, 'HERE - http user');
            setSigningUp(false)
          });
        } else {
          setSigningUp(false)
        }
      }).catch((error) => {
        setSigningUp(false)
        alert(error.message)
      })
    }
  }
  return (
    <BubbleBackground>
      <gridLayout rows='auto, *, 17, auto, 17'>
        <label row={0} text="Sign Up" style={{
          fontSize: 36,
          color: '#fff',
          margin: '50 30 8'
        }} />
        <scrollView row={1} style={{
          backgroundColor: 'rgba(255,255,255,0.4)',
          borderRadius: 20
        }}>
          <stackLayout padding={17}>
            <TextEditField
              value={get('name') as string}
              error={hasError('name')}
              errorLabel={formState.errors['name'] && formState.errors['name'][0]}
              labelFor="Name"
              row={0}
              disabled={signingUp || loading}
              type='text'
              onChange={(value, e) => {
                if (e) handleChange(e)
                set('name', value);
              }} />

            <TextEditField
              value={get('surname') as string}
              error={hasError('surname')}
              errorLabel={formState.errors['surname'] && formState.errors['surname'][0]}
              labelFor="Surname"
              row={0}
              disabled={signingUp || loading}
              type='text'
              onChange={(value, e) => {
                if (e) handleChange(e)
                set('surname', value);
              }} />

            <TextEditField
              value={get('email') as string}
              error={hasError('email')}
              errorLabel={formState.errors['email'] && formState.errors['email'][0]}
              labelFor="Email"
              row={0}
              disabled={signingUp || loading}
              type='text'
              onChange={(value, e) => {
                if (e) handleChange(e)
                set('email', value);
              }} />

            <TextEditField
              value={get('pass') as string}
              error={hasError('pass')}
              errorLabel={formState.errors['pass'] && formState.errors['pass'][0]}
              labelFor="Password"
              secure
              row={0}
              disabled={signingUp || loading}
              type='text'
              onChange={(value, e) => {
                if (e) handleChange(e)
                set('pass', value);
              }} />

            <TextEditField
              value={get('bday') as string}
              error={hasError('bday')}
              errorLabel={formState.errors['bday'] && formState.errors['bday'][0]}
              labelFor="Date Of Birth"
              row={0}
              disabled={signingUp || loading}
              type='date'
              onChange={(value: string, e) => {
                if (e) handleChange(e)
                console.log(value)
                const date = new Date(value)
                const formatted = isValid(date) ? format(date, 'yyyy-MM-dd hh:mm:ss') : ''
                set('bday', formatted);
              }} />

            <TextEditField
              value={get('address') as string}
              error={hasError('address')}
              errorLabel={formState.errors['address'] && formState.errors['address'][0]}
              labelFor="Address"
              row={0}
              disabled={signingUp || loading}
              type='text'
              onChange={(value, e) => {
                if (e) handleChange(e)
                set('address', value);
              }} />

            <TextEditField
              value={get('suburbs') as string}
              error={hasError('suburbs')}
              errorLabel={formState.errors['suburbs'] && formState.errors['suburbs'][0]}
              labelFor="Suburbs"
              row={0}
              disabled={signingUp || loading}
              type='text'
              onChange={(value, e) => {
                if (e) handleChange(e)
                set('suburbs', value);
              }} />


            <TextEditField
              value={get('state') as string}
              error={hasError('state')}
              errorLabel={formState.errors['state'] && formState.errors['state'][0]}
              labelFor="State/Province"
              row={0}
              disabled={signingUp || loading}
              type='text'
              onChange={(value, e) => {
                if (e) handleChange(e)
                set('state', value);
              }} />

            <TextEditField
              value={get('country') as string}
              error={hasError('country')}
              errorLabel={formState.errors['country'] && formState.errors['country'][0]}
              labelFor="Country"
              row={0}
              disabled={signingUp || loading}
              type='text'
              onChange={(value, e) => {
                if (e) handleChange(e)
                set('country', value);
              }} />
          </stackLayout>
        </scrollView>
        <SaveButton isLoading={signingUp || loading} row={3} style={{
          borderRadius: 20
        }} text='Save' onTap={onSave}/>
      </gridLayout>
    </BubbleBackground>
  )
}
