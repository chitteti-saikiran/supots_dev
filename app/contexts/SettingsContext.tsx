import * as React from 'react'
import { LabelItem } from '~/components/LabelItem'
import { AppAuthContext } from '~/components/Root'
import Modal from '~/ui/Modal'
import { CommonHeader } from '~/ui/common.ui'
import { IconType } from '~/utils/icons'
import { UnionUser } from '~/utils/types'
import { SettingsJson, SettingsKey } from './SettingsJson'
import { SaveButton } from '~/Screens/Training'
import { TextEditField } from '~/Screens/Events'
import { useSupotsuMutation, useSupotsuQuery } from '~/utils/useSupotsuMutation'
import { GET_SETTINGS } from '~/apollo/queries/getSettings'
import { GetSettingsQueryHookResult, GetSettingsQueryVariables, SaveSettingMutationResult, SaveSettingMutationVariables, SettingItem as ServerSettingItem } from '~/generated/graphql'
import { SAVE_SETTING } from '~/apollo/mutations/saveSetting'
import { ApplicationSettings } from '@nativescript/core'

interface SettingsContextData {
  canPerformAction(key?: string): boolean
  get(key: string): SettingItem
  set(key: string, value: SettingItem): void;
  openSettings(): void
}

type AppSettingItem = {
  type: 'checked'
  key: string
  desc: string
  default: boolean
} | {
  type: 'select'
  key: string
  desc: string
  default: string
  options: string[]
} | {
  type: 'switch'
  key: string
  desc: string
  default: boolean
} | {
  type: 'text' | 'field'
  key: string
  desc: string
  default: string
}

type SettingItem = AppSettingItem & Partial<Omit<ServerSettingItem, 'type'>>
interface SettingCatgory {
  label: string
  desc: string
  iconType?: IconType
  iconName?: string
  subCatogories?: SettingCatgory[],
  settings?: SettingItem[]
}

const SettingsContext = React.createContext({} as SettingsContextData)

export const SettingsProvider: React.FC = ({ children }) => {
  const { user } = React.useContext(AppAuthContext)
  const [settings, setSettings] = React.useState<SettingItem[]>(() => {
    const list: SettingItem[] = JSON.parse(ApplicationSettings.getString('Settings','[]'))
    return list
  })
  const { data, refetch, loading } = useSupotsuQuery<GetSettingsQueryHookResult, GetSettingsQueryVariables>(GET_SETTINGS, {
    variables: {
      _id: user._id
    },
    onCompleted(data) {
        const list: SettingItem = data?.getSettings.map((s) => {
          const elem = settings.find((c) => c.key === s.key)
          return {
            ...elem,
            ...s,
          }
        })
        // @ts-ignore
        setSettings(list)
        ApplicationSettings.setString('Settings', JSON.stringify(list))
    },
  })
  const [saveSetting] = useSupotsuMutation<SaveSettingMutationResult, SaveSettingMutationVariables>(SAVE_SETTING, {})
  const [activeSetting, setActiveSetting] = React.useState<SettingCatgory>()
  const openSettingsModalRef = React.useRef<Function>();
  function openSettings() {
    if (openSettingsModalRef.current) {
      openSettingsModalRef.current()
    }
  }
  function canPerformAction(key = 'can_send_friend_request', friendsList = []): boolean {
    const setting = settings.find(c => c.key === key)
    if (!setting) return false
    if (['checked', 'switch'].includes(setting.type)) {
      return setting.default === 'Yes' ? true : false
  } else if (['select'].includes(setting.type)) {
      return ['public'].includes(setting.default) ? true : ['friends'].includes(setting.default) ? true : false
  }
  return true;
    return true
  }
  function set(key:string, value: SettingItem) {
    const elem = settings.find((c) => c.key === key)
    if (!elem) {
      setSettings([...settings, value])
      saveSetting({
        variables: {
          data: {
            user_id: user._id,
            key: value.key,
            desc: value.desc,
            type: value.type,
            ...typeof value.default === 'boolean'  ? {
              default: value.default || value.default === 'Yes' ? 'Yes' : 'No'
            } : {
              default: value.default,
            }
          }
        },
        update() {
          refetch({
            _id: user._id
          })
        }
      })
    }  else {
      const index = settings.findIndex((c) => c.key === key)
      const list = settings
      list[index] = value
      setSettings(list)
      saveSetting({
        variables: {
          _id: value._id,
          data: {
            user_id: user._id,
            key: value.key,
            desc: value.desc,
            type: value.type,
            ...typeof value.default === 'boolean'  ? {
              default: value.default || value.default === 'Yes' ? 'Yes' : 'No'
            } : {
              default: value.default,
            }
          }
        },
        update() {
          refetch({
            _id: user._id
          })
        }
      })
    }
  }

  function get(key: string) {
    const elem = settings.find((c) => c.key === key)
    return elem
  }

  React.useEffect(() => {
    if (data?.data?.getSettings) {
      // @ts-ignore
      const list: SettingItem = data?.data?.getSettings.map((s) => {
        const elem = settings.find((c) => c.key === s.key)
        return {
          ...elem,
          ...s,
        }
      })
      // @ts-ignore
      setSettings(list)
      ApplicationSettings.setString('Settings', JSON.stringify(list))
    }
  }, [data, settings])

  return (
    <SettingsContext.Provider value={{
      canPerformAction,
      openSettings,
      get,
      set
    }}>
      <Modal
     fullscreen
     onModalMounted={(open, close) => {
      openSettingsModalRef.current = open
     }
    }
    renderContent={(open, close) => {
      if (loading) {
        return (
          <flexboxLayout style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <activityIndicator />
          </flexboxLayout>
        )
      }
      return (
        <gridLayout width={'100%'} height={'100%'}>
          {!activeSetting ? (
            <SettingsView set={set} get={get} onSettingSelect={(s) => setActiveSetting(s)} userType={'F'} user={user} goBack={close} />
          ) : (
            <SettingDetails set={set} get={get} settingCategory={activeSetting} goBack={() => setActiveSetting(undefined)}/>
          )}
        </gridLayout>
      )
    }}
     renderTriggerAction={(_ref, open) => {
      return (
        <>
        {children}
        </>
      )
     }}
    />
    </SettingsContext.Provider>
  )
}

interface SettingsViewProps extends Partial<SettingsContextData> {
  goBack: () => void
  user: UnionUser
  userType: SettingsKey
  onSettingSelect(setting: SettingCatgory): void
}
const SettingsView: React.FC<SettingsViewProps> = ({
  goBack,
  user,
  userType,
  onSettingSelect,
  get,
}) => {
  const selectedSettings = SettingsJson[userType]
  const settings: SettingCatgory[] = Object.keys(selectedSettings).map((key) => {
    const desc = (selectedSettings[key] ?? []).map((e) => e.name).join('. ')
    const subCatogories: SettingCatgory[] = (selectedSettings[key] ?? []).map((sub) => {
      const settings: SettingItem[] = []

      sub.config.forEach((con: any) => {
        con?.settings?.forEach((s) => {
          const sett: SettingItem = get(s.tag) ?? {
            type: s.action,
            key: s.tag,
            desc: s.desc,
            default: s.default,
            options: s.options,
          }
          if (s.desc !== "") settings.push(sett)
        })
      })
      const _desc = sub.config.map((e) => e.desc).join('. ')
      return {
        desc: _desc,
        label: sub.name,
        settings,
      }
    });
    return {
      desc,
      label: key,
      subCatogories
    }
  })
  return (
    <gridLayout width={'100%'} height={'100%'} rows='auto, *'>
      <CommonHeader goBack={goBack} user={{
        name: 'Settings'
      }} />
      <scrollView background='#ddd' row={1}>
        <stackLayout padding={16}>
          {settings.map((setting, index) => (
            <LabelItem key={index} onTap={() => {
              onSettingSelect(setting)
            }} name={setting.label} username={setting.desc} />
          ))}
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

interface SettingDetailsProps extends Partial<SettingsContextData> {
  goBack: () => void
  settingCategory: SettingCatgory
}

const SettingDetails: React.FC<SettingDetailsProps> = ({
  goBack,
  settingCategory,
  get,
  set,
}) => {
  const [activeSettingItem, setActiveSettingItem] = React.useState<SettingCatgory>()
  const [edit, setEdit] = React.useState<SettingItem>()
  return (
    <gridLayout width={'100%'} height={'100%'} rows='auto, *'>
      <CommonHeader goBack={edit ? () => setEdit(undefined) : activeSettingItem ? () => setActiveSettingItem(undefined) : goBack} user={{
        name: activeSettingItem ? `${activeSettingItem.label} - ${settingCategory.label}` : settingCategory.label
      }} />
      {!edit ? (
        <scrollView background='#ddd' row={1}>
        <stackLayout padding={16}>
          {!activeSettingItem && settingCategory.subCatogories?.map((setting, index) => (
            <LabelItem key={`setting_details_${index}`} onTap={() => {
              setActiveSettingItem(setting)
            }} name={setting.label} username={setting.desc} />
          ))}
          {activeSettingItem && activeSettingItem.settings?.map((item, index) => {
            const setting = get(item.key) ?? item
            const value = typeof setting.default === 'boolean' ?
              (setting.default ? 'Yes' : 'No') :
              setting.default
            return (
              <LabelItem key={`setting_details_change_${index}`} onTap={() => {
                setEdit(setting)
              }} name={setting.desc} username={value} />
            )
          })}
        </stackLayout>
      </scrollView>
      ) : (
        <gridLayout background='#ddd' row={1} rows='auto, 50, auto, *' padding={16}>
          <stackLayout borderRadius={10} background='#fff' padding={16}>
            <label textAlignment='center' horizontalAlignment='center' textWrap style={{
              fontSize: 18,
              color: '#000',
              marginBottom: 24,
            }}>{edit.desc}</label>
            {edit.type === 'select' && (
              <TextEditField.Select
                type='select'
                labelFor='Select option:'
                multiple={false}
                simple
                onTap={(e) => {
                  console.log(e)
                  setEdit({
                    ...edit,
                    default: e as string
                  })
                }}
                items={edit.options}
                value={edit.default}
              />
            )}
            {(edit.type === 'field' || edit.type === 'text') && (
              <TextEditField.Text
                type='text'
                labelFor='Select option:'
                onChange={(e) => {
                  setEdit({
                    ...edit,
                    default: e as string
                  })
                }}
                value={edit.default}
              />
            )}
            {((edit as AppSettingItem).type === 'checked' || (edit as AppSettingItem).type === 'switch') && (
              <TextEditField.Select
                type='select'
                labelFor='Select option:'
                multiple={false}
                simple
                onTap={(e) => {
                  setEdit({
                    ...edit,
                    default: e
                  })
                }}
                items={['Yes', 'No']}
                value={edit.default || edit.default === 'Yes' ? 'Yes' : 'No'}
              />
            )}
          </stackLayout>
          <SaveButton style={{
            borderRadius: 10
          }} text='Save' onTap={() => {
            set(edit.key, edit)
            setEdit(undefined)
          }} isLoading={false} row={2} />
        </gridLayout>
      )}
    </gridLayout>
  )
}

export const useSettingsConext = () => React.useContext(SettingsContext)
