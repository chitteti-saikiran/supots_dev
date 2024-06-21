import { RouteProp } from '@react-navigation/core'
import { ApplicationSettings, Screen } from '@nativescript/core'
import * as React from 'react'
import { NativeStackNavigationProp } from 'react-nativescript-navigation'
import { MainStackParamList, Route } from '~/components/MainStackParamList'
import { CommonHeader } from "~/ui/common.ui"
import { TextEditField, TextEditFieldProps } from './Events'
import { BubbleBackground } from '~/components/BubbleBackground'
import { Sport, PageAddData } from '~/generated/graphql'
import Modal from '~/ui/Modal'
import { useFormState } from '~/hooks/useFormState'
import { SaveButton } from './Training'
import Methods from './../Methods'
import { useSupotsuMutation } from '~/utils/useSupotsuMutation'
import { DocumentNode } from 'graphql'
import { ADD_CLUB,ADD_INSTITUTION, ADD_TEAM,ADD_TOURN } from './../services/graphql/team'
import { AppAuthContext } from '~/components/Root'

type CreatePageProps = {
  route: RouteProp<MainStackParamList, Route.CreatePage>,
  navigation: NativeStackNavigationProp<MainStackParamList, Route.CreatePage>,
}

interface CreatePageFormItem {
  key: string,
  label: string,
  getter?: (val) => any,
  validator?:(value) => boolean,
  textInputProps: TextEditFieldProps
}

interface CreatePageItem {
  label: string
  key: string
  doc: DocumentNode,
  description: string
  formData: Record<CreatePageFormItem['key'], CreatePageFormItem>
}

const levels = ["Amatuer", "Professional", "Semi-Professional"]
const genders = ['male', 'female', 'mixed']
const tournTypes = ['league', 'group_knockout', 'knockout']

export const CreatePage = ({ navigation }: CreatePageProps) => {
  const [items, setItems] = React.useState<CreatePageItem[]>([])
  const allSports: Sport[] = JSON.parse(ApplicationSettings.getString('sports', '[]'))
  const _users = ApplicationSettings.getString('users', '[]');
  const users = JSON.parse(_users);
  const tourns = tournTypes.map((e) => ({
    _id: e,
    name: e.split('_').map((e) => e.toLocaleUpperCase()).join(' ')
  }))

  const options: Record<CreatePageFormItem['key'], CreatePageFormItem> = {
    name: {
      key: 'name',
      label: 'Name',
      validator(value) {
          return String(value).length <= 2
      },
      textInputProps: {
        type: 'text'
      }
    },
    email: {
      key: 'email',
      label: 'Email',
      validator(value) {
          return !Methods.isEmail(value)
      },
      textInputProps: {
        type: 'text'
      }
    },
    website: {
      key: 'website',
      label: 'Website',
      validator(value) {
        return !Methods.isWebsite(value)
    },
      textInputProps: {
        type: 'text'
      }
    },
    contactMain: {
      key: 'contactMain',
      label: 'Contact No.',
      validator(value) {
        return !Methods.isPhone(value)
    },
      textInputProps: {
        type: 'text'
      }
    },
    contactOther: {
      key: 'contactOther',
      label: 'Contact No.2',
      validator(value) {
        return !Methods.isPhone(value)
    },
      textInputProps: {
        type: 'text'
      }
    },
    'sport': {
      key: 'sport',
      label: 'Sport',
      getter(val) {
          return val?._id
      },
      textInputProps: {
        type: 'select',
        selectOptions: allSports,
      }
    },
    'manager': {
      key: 'manager',
      label: 'Manager',
      getter(val) {
          return val?._id
      },
      textInputProps: {
        type: 'select',
        selectOptions: users,
      }
    },
    'secretary': {
      key: 'secretary',
      label: 'Secretary',
      getter(val) {
          return val?._id
      },
      textInputProps: {
        type: 'select',
        selectOptions: users,
      }
    },
    'captain': {
      key: 'captain',
      label: 'Captain',
      getter(val) {
          return val?._id
      },
      textInputProps: {
        type: 'select',
        selectOptions: users,
      }
    }
  }

  const clubOptions: Record<CreatePageFormItem['key'], CreatePageFormItem> = {
    level: {
      key: 'level',
      label: 'Level',
      textInputProps: {
        type: 'select',
        selectOptions: levels,
        simple: true
      }
    },
  }

  const itemList: CreatePageItem[] = [
    {
      description: 'This team cannot be added to any club or institution, therefore it\'s a standalone team under a certain sport',
      label: 'Create a Team',
      key: 'addTeam',
      doc: ADD_TEAM,
      formData: {
        ...options,
      }
    },
    {
      description: 'A club can have multiple sports and multiple teams',
      label: 'Create a Club',
      key: 'addClub',
      doc: ADD_CLUB,
      formData: {
        ...options,
        ...clubOptions,
      }
    },
    {
      description: '',
      doc: ADD_TOURN,
      key: 'addTournament',
      label: 'Create a Tournament',
      formData: {
        ...options,
        mode: {
          key: 'mode',
          label: 'Type',
          getter(val) {
              return val?._id
          },
          textInputProps: {
            type: 'select',
            selectOptions: tourns,
            // simple: true
          }
        },
        gender: {
          key: 'gender',
          label: 'Gender',
          textInputProps: {
            type: 'select',
            selectOptions: genders,
            simple: true
          }
        },
        ...clubOptions,
      }
    },
    {
      description: 'An institution can be a school, college or a university with multiple sports and multiple teams',
      label: 'Create an Instistution',
      doc: ADD_INSTITUTION,
      key: 'addInstitution',
      formData: {
        ...options,
        ...clubOptions,
      }
    }
  ]

  React.useEffect(() => {
    setItems(itemList)
  }, [])
  return (
    <gridLayout rows="auto, *">
      <CommonHeader user={{
        name: 'Create  a Page'
      }} goBack={() => navigation.goBack()} />
      <gridLayout row={1} background="#eee">
        <scrollView>
          <stackLayout padding={17}>
            {items.map((item) => {
              return (
                <CreatePageListItem key={item.key} onDataAdded={() => {
                  setItems(itemList)
                }} item={item} />
              )
            })}
          </stackLayout>
        </scrollView>
      </gridLayout>
    </gridLayout>
  )
}

interface CreatePageListItemOptions {
  item: CreatePageItem
  onDataAdded(): void
}

const CreatePageListItem = ({
  item,
  onDataAdded
}: CreatePageListItemOptions) => {
  const { user } = React.useContext(AppAuthContext)
  const { formState, handleValueChange, setFormState } = useFormState<PageAddData>({})
  const [errors, setErrors] = React.useState({})
  const [createPage, { loading }] = useSupotsuMutation(item.doc, {})

  const save = () => {
    const newData: PageAddData = {}
    Object.keys(item.formData).forEach((key) => {
      const formProps = item.formData[key]
      const valueFor = formState && formState.values && formState.values[key] ? formState.values[key] : null
      newData[key] = valueFor && formProps.getter ? formProps.getter(valueFor) : valueFor
    })
    const errorList = {}
    Object.keys(newData).map((key) => {
      const formProps = item.formData[key]
      if (!newData[key]) {
        errorList[key] = true
      } else {
        errorList[key] = formProps.validator ? formProps.validator(newData[key]) : false
      }
    })
    const hasErrors = Object.keys(errorList).some((e) => errorList[e])

    if (hasErrors) {
      setErrors(errorList)
      return;
    } else {
      console.log('submit', newData)
      createPage({
        variables: {
          data: {
            ...newData,
            createBy: user._id
          },
        }
      }).then(({ data }) => {
        if (data[item.key]) {
          alert('Data saved successfully')
          onDataAdded()
        }
      }).catch((err) => {
        console.log(err);
        alert(err.message)
      })
    }
  }

  React.useEffect(() => {
    const obj = {}
    Object.keys(item.formData).forEach((key) => {
      obj[key] = undefined
    })
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        ...obj
      }
    })
  }, [item])

  return (
    <gridLayout style={{
      height: 250,
      marginBottom: 16,
    }} clipToBounds>
      <BubbleBackground>

      </BubbleBackground>
      <Modal
        fullscreen
        renderTriggerAction={(ref, open) => (
          <BubbleBackground>
            <flexboxLayout ref={ref} onTap={open} flexDirection='column' style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}>
              <label textAlignment='center' textWrap text={item.label} style={{
                fontSize: 36,
                color: '#fff'
              }} />
              <label textAlignment='center' textWrap text={item.description} style={{
                color: '#fff'
              }} />
            </flexboxLayout>
          </BubbleBackground>
        )}
        renderContent={(open, close) => (
          <gridLayout width={'100%'} height={'100%'} rows='auto, *, auto'>
            <CommonHeader user={{
              name: item.label
            }} goBack={close} />
            <scrollView row={1}>
              <stackLayout padding={17}>
                {Object.keys(item.formData).map((key) => {
                  const formProps = item.formData[key]
                  const valueFor = formState && formState.values && formState.values[key] ? formState.values[key] : null
                  return (
                    <TextEditField
                      {...formProps.textInputProps}
                      labelFor={formProps.label}
                      value={valueFor}
                      key={key}
                      error={errors[key]}
                      errorLabel={errors[key] ? `Invalid ${formProps.label}` : undefined}
                      onChange={(value) => {
                        // @ts-ignore
                        handleValueChange(key, value)
                        const normalizedValue = formProps.getter ? formProps.getter(value) : value
                        const error = formProps.validator ? formProps.validator(normalizedValue) : false
                        setErrors({
                          ...errors,
                          [key]: error
                        })
                      }}
                    />
                  )
                })}
              </stackLayout>
            </scrollView>
            <SaveButton onTap={() => {
              save()
            }} row={2} text='Create' isLoading={loading} />
          </gridLayout>
        )}
      />
    </gridLayout>
  )
}

CreatePage.routeName = 'createPage'
