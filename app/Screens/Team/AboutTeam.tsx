import { ApplicationSettings } from '@nativescript/core'
import moment from 'moment'
import * as React from 'react'
import { confirm } from 'tns-core-modules/ui/dialogs'
import { client } from '~/app'
import { AppAuthContext } from '~/components/Root'
import { useStyledContext } from '~/contexts/StyledContext'
import { Club, Institution, Role, Social, Team, Tournament, User } from '~/DB/interfaces'
import IconSet from '~/font-icons'
import Methods from '~/Methods'
import { ADD_ROLE, ADD_SOCIAL, REMOVER_SOCIAL, REMOVE_ROLE, UPDATE_ROLE, UPDATE_SOCIAL, UPDATE_TBL_FIELD, UPDATE_TBL_FIELDS } from '~/services/graphql/team'
import Theme from '~/Theme'
import { CommonHeader, Empty, SaveButton } from '~/ui/common.ui'
import { UnionUser } from '~/utils/types'
import { OverviewContact } from '.'
import { TextEditField, TextEditFieldProps } from '../Events'

interface AboutTeamProps {
  team?: Team | Club | Institution | Tournament,
  open?(args?: any): void,
  close?(args?: any): void,
  isAdmin?: boolean,
  user?: User,
  refresh?(): void
}

export const AboutTeam: React.FC<AboutTeamProps> = ({
  team: profile,
  user,
  close,
  open,
  refresh,
  isAdmin: initIsAdmin
}) => {
  const isAdmin = user ? initIsAdmin : initIsAdmin || profile?.roles?.some((r) => r.role.toLowerCase() === 'admin')
  const [active, setActive] = React.useState(0)
  const [isAddingNew, setIsAddingNew] = React.useState(false)
  const [isAddingSoc, setIsAddingSoc] = React.useState(false)

  const users: User[] = JSON.parse(ApplicationSettings.getString('users', '[]'))

  const getTable = () => {
    let tableName = 'users';
    if (!user) {
      switch (profile.type) {
        case 'T':
          tableName = 'teams'
          break;
        case 'C':
          tableName = 'clubs'
          break;
        case 'I':
          tableName = 'institutions'
          break;
        case 'L':
          tableName = 'tournaments'
          break;
        default:
          tableName = 'users'
          break;
      }
    }

    return tableName
  }
  const icons = active === 0 ? [] : active === 2 ? [
    {
      className: "MaterialIcons",
      icon: isAddingNew ? 'close' : "add",
      onPress() {
        setIsAddingNew((v) => !v)
      }
    }
  ] : [
    {
      className: "MaterialIcons",
      icon: isAddingSoc ? 'close' : "add",
      onPress() {
        setIsAddingSoc((v) => !v)
      }
    }
  ]

  React.useEffect(() => {
    if (refresh) refresh()
  }, [])
  return (
    <gridLayout width='100%' height={'100%'} rows="auto, *">
      <CommonHeader user={{
        name: `About ${user ? '' : profile.name}`
      }} goBack={close} icons={isAdmin ? icons : []} />
      {!user ? (
        <tabs
          row={1}
          style={{ width: "100%", height: "100%", }}
          swipeEnabled={false}
          selectedIndex={active}
          onSelectedIndexChange={(args) => setActive(args.value)}
        >
          <tabStrip nodeRole="tabStrip">
            <tabStripItem nodeRole="items">
              <label nodeRole="label" text={"Overview"} />
            </tabStripItem>
            <tabStripItem nodeRole="items">
              <label nodeRole="label" text={"Contacts"} />
            </tabStripItem>
            <tabStripItem nodeRole="items">
              <label nodeRole="label" text={"People"} />
            </tabStripItem>
          </tabStrip>

          <tabContentItem nodeRole="items">
            <scrollView height={'100%'} width={'100%'}>
              <stackLayout>
                <OverviewLabel
                  isAdmin={isAdmin}
                  title={'Manager'}
                  field={'manager'}
                  table={getTable()}
                  _id={profile._id}
                  subtitle={profile.manager}
                  initValue={profile.manager?.name}
                  prefix={null}
                  hidePrefix
                  onDataSaved={refresh}
                  textEditProps={{
                    type: 'select',
                    simple: false,
                    labelFor: 'Manager',
                    selectOptions: (users ?? []).map((u) => ({
                      _id: u._id,
                      image: u.image,
                      name: u.name
                    })),
                    withImage: true
                  }}
                />

                <OverviewLabel
                  title={'Founded'}
                  field={'establishMonth'}
                  table={getTable()}
                  _id={profile._id}
                  onDataSaved={refresh}
                  isAdmin={isAdmin}
                  subtitle={profile.establishMonth && profile.establishYear ? `${profile.establishMonth} ${profile.establishYear}` : 'Not set'}
                  initValue={profile.establishMonth && profile.establishYear ? `${profile.establishMonth} ${profile.establishYear}` : 'Not set'}
                  prefix={null}
                  hidePrefix
                  textEditProps={{
                    type: 'date',
                    editMode: true,
                    labelFor: 'Founded',
                    keyboardType: "number"
                  }}
                />

                <OverviewLabel
                  title={'Location'}
                  isAdmin={isAdmin}
                  field={'address'}
                  onDataSaved={refresh}
                  table={getTable()}
                  _id={profile._id}
                  subtitle={profile.address}
                  initValue={profile.address}
                  prefix={null}
                  hidePrefix
                  textEditProps={{
                    type: 'location',
                    editMode: true,
                    labelFor: 'Location',
                  }}
                />

                <stackLayout padding={16}>

                  <OverviewContact textColor={Theme[500]} image={"website_icon"} value={profile.contactMain} iconName='smartphone' />

                  <OverviewContact textColor={Theme[500]} value={profile.contactOther ?? 'Not set'} iconName='smartphone' image={"landline_icon"} />

                  <OverviewContact textColor={Theme[500]} value={profile.email} image={"website_icon"} />

                  <OverviewContact textColor={Theme[500]} iconType='Octicons' iconName='globe' value={profile.website} image={"website_icon"} />

                  <SocialIcons items={Methods.listify(profile.socials)} />
                </stackLayout>

              </stackLayout>
            </scrollView>
          </tabContentItem>

          <tabContentItem nodeRole="items">
            <scrollView height={'100%'} width={'100%'}>
              <stackLayout>
                {isAddingSoc && (
                  <AboutLabel title='Add Social Link'>
                    <SocialLabelEdit onDataSaved={() => {
                      if (refresh) {
                        refresh()
                      }
                      setIsAddingSoc(false)
                    }} profile={profile} isAdmin isNew item={{
                      _id: "",
                      date: "",
                      icon: "facebook",
                      key: "facebook",
                      status: "",
                      value: "Not set"
                    }} />
                  </AboutLabel>
                )}
                {!isAddingSoc && (
                  <>
                    <AboutLabel title='Contacts'>
                      <OverviewLabel
                        title={'Contact No.'}
                        field={'contactMain'}
                        table={getTable()}
                        _id={profile._id}
                        onDataSaved={refresh}
                        isAdmin={isAdmin}
                        subtitle={profile.contactMain}
                        initValue={profile.contactMain}
                        prefix={null}
                        plain
                        hidePrefix
                        textEditProps={{
                          type: 'text',
                          editMode: true,
                          labelFor: 'Contact No.',
                          keyboardType: "number"
                        }}
                      />

                      <OverviewLabel
                        title={'Alt. Contact No.'}
                        field={'contactOther'}
                        table={getTable()}
                        _id={profile._id}
                        onDataSaved={refresh}
                        plain
                        isAdmin={isAdmin}
                        subtitle={profile.contactOther}
                        initValue={profile.contactOther}
                        prefix={null}
                        hidePrefix
                        textEditProps={{
                          type: 'text',
                          editMode: true,
                          labelFor: 'Alt. Contact No.',
                          keyboardType: "number"
                        }}
                      />

                      <OverviewLabel
                        title={'Email'}
                        field={'email'}
                        table={getTable()}
                        _id={profile._id}
                        onDataSaved={refresh}
                        plain
                        isAdmin={isAdmin}
                        subtitle={profile.email}
                        initValue={profile.email}
                        prefix={null}
                        hidePrefix
                        textEditProps={{
                          type: 'text',
                          editMode: true,
                          labelFor: 'Email',
                          keyboardType: "email"
                        }}
                      />

                      <OverviewLabel
                        title={'Website'}
                        field={'website'}
                        table={getTable()}
                        plain
                        _id={profile._id}
                        onDataSaved={refresh}
                        isAdmin={isAdmin}
                        subtitle={profile.website}
                        initValue={profile.website}
                        prefix={null}
                        hidePrefix
                        textEditProps={{
                          type: 'text',
                          editMode: true,
                          labelFor: 'Website',
                          keyboardType: "url"
                        }}
                      />
                    </AboutLabel>
                    <AboutLabel title='Social Links'>
                      {profile?.socials?.map((soc) => {
                        return (
                          <SocialLabelEdit onDataSaved={() => {
                            if (refresh) {
                              refresh()
                            }
                            setIsAddingSoc(false)
                          }} profile={profile} key={soc._id} isAdmin={isAdmin} item={soc} />
                        )
                      })}
                    </AboutLabel>

                    <AboutLabel title='About'>
                      <OverviewLabel
                        title={'Overview'}
                        field={'about'}
                        plain
                        table={getTable()}
                        _id={profile._id}
                        onDataSaved={refresh}
                        isAdmin={isAdmin}
                        subtitle={profile.about}
                        initValue={profile.about}
                        prefix={null}
                        hidePrefix
                        textEditProps={{
                          type: 'textArea',
                          editMode: true,
                          labelFor: 'Overview',
                        }}
                      />
                    </AboutLabel>
                  </>
                )}
              </stackLayout>
            </scrollView>
          </tabContentItem>

          <tabContentItem nodeRole="items">
            <AboutPeopleList onSave={() => {
              if (refresh) {
                refresh()
              }
              setIsAddingNew(false)
            }} isAddingNew={isAddingNew} isAdmin={isAdmin} page={profile} roles={profile.roles} />
          </tabContentItem>
        </tabs>
      ) : (
        <tabs
          row={1}
          style={{ width: "100%", height: "100%", }}
          swipeEnabled={false}
          selectedIndex={active}
          onSelectedIndexChange={(args) => setActive(args.value)}
        >
          <tabStrip nodeRole="tabStrip">
            <tabStripItem nodeRole="items">
              <label nodeRole="label" text={"Overview"} />
            </tabStripItem>
            <tabStripItem nodeRole="items">
              <label nodeRole="label" text={"Contacts"} />
            </tabStripItem>
          </tabStrip>

          <tabContentItem nodeRole="items">
            <scrollView height={'100%'} width={'100%'}>
              <stackLayout>
                <OverviewLabel
                  isAdmin={isAdmin}
                  title={'Name'}
                  field={'first_name'}
                  table={getTable()}
                  _id={user._id}
                  subtitle={user.first_name}
                  initValue={user.first_name}
                  prefix={null}
                  hidePrefix
                  onDataSaved={refresh}
                  textEditProps={{
                    type: 'text',
                    labelFor: 'Name',
                    editMode: true,
                    keyboardType: "number"
                  }}
                />

                <OverviewLabel
                  title={'Surname'}
                  field={'last_name'}
                  table={getTable()}
                  _id={user._id}
                  onDataSaved={refresh}
                  isAdmin={isAdmin}
                  subtitle={user.last_name}
                  initValue={user.last_name}
                  prefix={null}
                  hidePrefix
                  textEditProps={{
                    type: 'text',
                    editMode: true,
                    labelFor: 'Surname',
                    keyboardType: "number"
                  }}
                />

                <OverviewLabel
                  title={'Location'}
                  isAdmin={isAdmin}
                  field={'address'}
                  onDataSaved={refresh}
                  table={getTable()}
                  _id={user._id}
                  subtitle={user.address}
                  initValue={user.address}
                  prefix={null}
                  hidePrefix
                  textEditProps={{
                    type: 'location',
                    editMode: true,
                    labelFor: 'Location',
                  }}
                />

                <stackLayout padding={16}>

                  <SocialIcons items={Methods.listify(user.contacts?.social)} />
                </stackLayout>

              </stackLayout>
            </scrollView>
          </tabContentItem>

          <tabContentItem nodeRole="items">
            <scrollView height={'100%'} width={'100%'}>
              <stackLayout>
                {isAddingSoc && (
                  <AboutLabel title='Add Social Link'>
                    <SocialLabelEdit onDataSaved={() => {
                      if (refresh) {
                        refresh()
                      }
                      setIsAddingSoc(false)
                    }} profile={user} isAdmin={isAdmin} isNew item={{
                      _id: "",
                      date: "",
                      icon: "facebook",
                      key: "facebook",
                      status: "",
                      value: "Not set"
                    }} />
                  </AboutLabel>
                )}
                {!isAddingSoc && (
                  <>
                    <AboutLabel title='About'>
                      <OverviewLabel
                        title={'Overview'}
                        field={'about'}
                        plain
                        stack
                        table={getTable()}
                        _id={user._id}
                        onDataSaved={refresh}
                        isAdmin={isAdmin}
                        subtitle={user.about}
                        initValue={user.about}
                        prefix={null}
                        hidePrefix
                        textEditProps={{
                          type: 'textArea',
                          editMode: true,
                          labelFor: 'Overview',
                        }}
                      />
                    </AboutLabel>
                  </>
                )}
              </stackLayout>
            </scrollView>
          </tabContentItem>
        </tabs>
      )}
    </gridLayout>
  )
}

interface AboutLabelProps {
  title: string
}
const AboutLabel: React.FC<AboutLabelProps> = ({ title, children }) => {
  return (
    <stackLayout marginBottom={16}>
      <label style={{
        fontSize: 20,
        color: Theme[500],
        margin: '8 16',
        fontWeight: 'bold'
      }} text={title} />
      <stackLayout>
        {children}
      </stackLayout>
    </stackLayout>
  )
}

interface AboutPeopleListProps {
  roles: Role[],
  page: UnionUser,
  isAdmin: boolean,
  isAddingNew: boolean
  onSave(): void
}

const AboutPeopleList: React.FC<AboutPeopleListProps> = ({
  page,
  roles,
  isAdmin,
  isAddingNew = false,
  onSave
}) => {
  if ((roles ?? []).length <= 0 && !isAddingNew) {
    return (
      <flexboxLayout style={{
        width: '100%',
        alignItems: 'center',
      }}>
        <Empty style={{ width: '100%' }} />
      </flexboxLayout>
    )
  }
  return (
    <scrollView>
      <stackLayout>
        {isAddingNew && (
          <AboutRoleItem onSave={onSave} isAdmin isNew role={{ role: 'Admin', _id: null, content: null, user: null, date: null, status: null }} page={page} />
        )}
        {!isAddingNew && roles?.map((r) => (
          <AboutRoleItem onSave={onSave} page={page} key={r._id} isAdmin={isAdmin} role={r} />
        ))}
      </stackLayout>
    </scrollView>
  )
}

interface AboutRoleItemProps {
  role: Role,
  isAdmin: boolean,
  page: UnionUser,
  isNew?: boolean
  onSave(): void
}

const AboutRoleItem: React.FC<AboutRoleItemProps> = ({
  isAdmin,
  role: r,
  page: user,
  isNew = false,
  onSave: onDataSaved,
}) => {
  const { user: me } = React.useContext(AppAuthContext)

  const [role, setRole] = React.useState(r ?? { user: undefined, role: 'Admin' })

  const users: User[] = JSON.parse(ApplicationSettings.getString('users', '[]'))

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState({
    role: false,
    user: false
  })
  const [isEdit, setIsEdit] = React.useState(false)

  const addRole = () => {
    const dataTo = {
      role: role.role,
      userId: role.user._id,
      toId: user._id,
      toType: user.type
    }

    if (user._id) {
      if (user._id === null) {
        setError({
          ...error,
          user: true
        })
        return;
      }

      if (role.role === null || role.role === "") {
        setError({
          ...error,
          role: true
        })
        return;
      }

      setLoading(true)

      client.mutate({
        mutation: ADD_ROLE,
        variables: {
          role: dataTo
        }
      }).then(({ data }) => {
        if (!data.addRole) {
          setLoading(false)
          alert('Error while adding role! Please try again')
        } else {
          setLoading(false)
          onDataSaved()
        }
      }).catch((e) => {
        setLoading(false)
        alert(e.message)
      })
      return;
    }
  }

  const onSave = () => {
    const dataTo = {
      _id: r._id,
      role: role.role,
      // userId: user._id,
      // u: {
      //   id: me._id,
      //   type: "F"
      // }
    }

    if (user._id) {
      if (user._id === null) {
        setError({
          ...error,
          user: true
        })
        return;
      }

      if (role.role === null || role.role === "") {
        setError({
          ...error,
          role: true
        })
        return;
      }

      setLoading(true)

      client.mutate({
        mutation: UPDATE_ROLE,
        variables: {
          _id: r._id,
          role: role.role,
        }
      }).then(({ data }) => {
        if (!data.updateRole) {
          setLoading(false)
          alert('Error while updating role! Please try again')
        } else {
          setLoading(false)
          setIsEdit(false)
          onDataSaved()
        }
      }).catch((e) => {
        setLoading(false)
        alert(e.message)
      })
      return;
    }
  }

  const onDelete = (id = "") => {
    const dataTo = {
      _id: r._id,
    }

    if (r._id) {

      setLoading(true)

      client.mutate({
        mutation: REMOVE_ROLE,
        variables: {
          ...dataTo
        }
      }).then((data) => {
        onDataSaved()
        setLoading(false)
      }).catch((e) => {
        setLoading(false)
        alert(e.message)
      })
    }
  }

  const roles = Methods.getRole(user.type)

  return (
    <stackLayout>
      <gridLayout key={r._id} columns='40, 10, *, 8, auto, 8' padding={16} borderBottomColor='#ddd' borderBottomWidth={isEdit ? 0 : 1} onTap={() => {

      }}>
        <flexboxLayout style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {role.user && (
            <image stretch='aspectFill' src={role.user.image} style={{
              height: 40,
              width: 40,
              borderRadius: '50%'
            }} />
          )}
          {!role.user && (
            <image stretch='aspectFill' src="https://supotsu.com:8080/default_avatar.svg" style={{
              height: 40,
              width: 40,
              borderRadius: '50%'
            }} />
          )}
        </flexboxLayout>
        <stackLayout col={2} style={{

        }}>
          <label text={role.user ? role.user.name : 'select user'} style={{
            color: '#000'
          }} />
          <label text={`Role: ${role ? role.role : 'not set'}`} style={{
            fontSize: 12,
            color: '#000'
          }} />
        </stackLayout>
        {isAdmin && (
          <flexboxLayout onTap={() => setIsEdit((val) => !val)} col={4} style={{
            alignItems: 'flex-end',
            justifyContent: 'center',
            width: 40,
            height: '100%'
          }}>
            <label className='MaterialIcons size20' text={isEdit ? IconSet.MaterialIcons.close : IconSet.MaterialIcons.edit} />
          </flexboxLayout>
        )}
      </gridLayout>
      {isEdit && (
        <stackLayout borderBottomColor='#ddd' borderBottomWidth={1} padding="8 16 16">
          {isNew && (
            <TextEditField
              type='select'
              value={role?.user ?? { name: 'Select user' }}
              selectOptions={users.map((u) => ({
                _id: u._id,
                image: u.image,
                name: u.name
              }))}
              withImage
              onChange={(value: User) => {
                setRole({
                  ...role,
                  user: value
                })
              }}
            />
          )}
          <TextEditField
            type='select'
            simple
            value={role.role}
            selectOptions={roles}
            onChange={(value: string) => {
              setRole({
                ...role,
                role: value
              })
            }}
          />
          <gridLayout columns='*, 8, *'>
            <SaveButton danger isLoading={loading} col={0} label='Delete' onPress={async () => {
              const yes = await confirm('Are you sure you want to remove this role?');
              if (yes) {
                onDelete()
              }
            }} />
            <SaveButton col={2} isLoading={loading} label='Save' onPress={isNew ? addRole : onSave} />
          </gridLayout>
        </stackLayout>
      )}
    </stackLayout>
  )
}

interface OverviewLabelProps {
  textEditProps?: TextEditFieldProps,
  title: string,
  subtitle?: any,
  prefix?: string,
  hidePrefix?: boolean,
  isAdmin?: boolean,
  field?: string,
  table?: string,
  _id?: string,
  onDataSaved?(): void,
  initValue?: string
  plain?: boolean
  withSave?: boolean
  stack?: boolean
}

export const OverviewLabel = ({ title, stack, onDataSaved, initValue, subtitle, prefix = null, hidePrefix = false, textEditProps, field, table, _id, plain = false, withSave = true, ...props }: OverviewLabelProps) => {
  const [edit, setEdit] = React.useState(false)
  const [value, setValue] = React.useState(() => initValue)
  const [loading, setLoading] = React.useState(false)
  const onSave = async () => {
    if (!value) {
      alert('Please enter or select value')
      return
    }

    if (moment.isDate(value)) {
      const data = {
        data: [
          {
            key: 'establishMonth',
            value: moment(value).format('D MMMM')
          },
          {
            key: 'establishYear',
            value: moment(value).format('YYYY')
          }
        ],
        table,
        _id
      }

      setLoading(true)

      client.mutate({
        mutation: UPDATE_TBL_FIELDS,
        variables: {
          ...data
        }
      }).then(({ data }) => {
        setEdit(false)
        setLoading(false)
        if (onDataSaved) onDataSaved()
      }).catch((e) => {
        setLoading(false)
        alert(e.message)
      })
    } else {
      const data = {
        field,
        // @ts-ignore
        value: typeof value === 'object' ? value._id : value,
        table,
        _id
      }
      setLoading(true)

      client.mutate({
        mutation: UPDATE_TBL_FIELD,
        variables: {
          ...data
        }
      }).then(({ data }) => {
        setEdit(false)
        setLoading(false)
        if (onDataSaved) onDataSaved()
      }).catch((e) => {
        setLoading(false)
        alert(e.message)
      })
    }
  }

  return (
    <stackLayout style={{
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    }}>
      <gridLayout columns='auto, *, auto, 8, auto' style={{
        marginTop: 10,
        paddingBottom: 15,
        paddingLeft: 16,
        paddingRight: 16,
        height: 50,
      }}>
        {!edit && <label verticalAlignment="middle" style={{
          fontSize: 18,
          fontWeight: plain ? 'normal' : 'bold',
          color: Theme['500'],
        }}>{title ?? 'Not set'}</label>}
        <flexboxLayout col={2} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {!hidePrefix &&
            <label style={{
              fontSize: 14,
              color: Theme['500'],
            }}>
              {`Past : ${prefix ? prefix : ''}`}
            </label>
          }
          {!stack ? (
            <>{moment.isDate(value) ? (
              <label style={{
                fontSize: 14,
                fontWeight: plain ? 'normal' : 'bold',
                color: Theme['500'],
              }}>
                {moment(value).format('LL')}
              </label>
            ) : (
              <label style={{
                fontSize: 14,
                fontWeight: plain ? 'normal' : 'bold',
                color: Theme['500'],
              }}>
                {
                  // @ts-ignore
                  (value && typeof value === 'object' && value._id ? value.name : value) ?? 'Not set'
                }
              </label>
            )}</>
          ) : <></>}
        </flexboxLayout>
        {props.isAdmin && (
          <flexboxLayout onTap={() => setEdit(!edit)} col={4} style={{
            width: 40,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <label className='MaterialIcons size18' text={edit ? IconSet.MaterialIcons.close : IconSet.MaterialIcons.edit} />
          </flexboxLayout>
        )}
      </gridLayout>
      {stack && !edit ? (
        <stackLayout style={{
          marginTop: 10,
          marginBottom: 10,
          paddingBottom: 15,
          paddingLeft: 16,
          paddingRight: 16,
        }}>{moment.isDate(value) ? (
          <label textWrap style={{
            fontSize: 14,
            fontWeight: plain ? 'normal' : 'bold',
            color: Theme['500'],
          }}>
            {moment(value).format('LL')}
          </label>
        ) : (
          <label textWrap style={{
            fontSize: 14,
            fontWeight: plain ? 'normal' : 'bold',
            color: Theme['500'],
          }}>
            {
              // @ts-ignore
              (value && typeof value === 'object' && value._id ? value.name : value) ?? 'Not set'
            }
          </label>
        )}</stackLayout>
      ) : <></>}
      <stackLayout visibility={edit ? 'visible' : 'collapse'} style={{
        marginTop: 10,
        marginBottom: 10,
        paddingBottom: 15,
        paddingLeft: 16,
        paddingRight: 16,
      }}>
        {textEditProps && (
          <>
            <TextEditField value={value} {...textEditProps} onChange={(val) => {
              // @ts-ignore
              setValue(val)
            }} />
            {withSave && <SaveButton isLoading={loading} label="Save" onPress={onSave} />}
          </>
        )}
      </stackLayout>
    </stackLayout>
  )
}

interface SocialIconsProps {
  items: Social[],
  isVertical?: boolean
}

const isSocialIconSquare = (name = '') => ['facebook', 'linkedin'].includes(name)

export const SocialIcons: React.FC<SocialIconsProps> = ({
  items,
  isVertical = false
}) => {
  const { socialColors, onTouch } = useStyledContext()
  const renderIcons = () => (
    <>
      {(items ?? []).map((item) => {
        return (
          <flexboxLayout onTouch={onTouch} key={item._id} style={{
            marginRight: isVertical ? 0 : 10,
            height: isVertical ? 50 : 30,
            borderBottomColor: isVertical ? '#eee' : '',
            borderBottomWidth: isVertical ? 1 : 0,
            alignItems: 'center',
            ...isVertical ? {
              paddingLeft: 16,
              paddingRight: 16,
            } : {}
          }}>
            <label color={socialColors[item.key.toLowerCase()]} className='AntDesign size16' text={IconSet.AntDesign[`${item.key}${isSocialIconSquare(item.key) ? '-square' : ''}`]} />
            <label text={item.value} style={{
              fontSize: 12,
              marginLeft: 4,
            }} />
          </flexboxLayout>
        )
      })}
    </>
  )
  if (isVertical) {
    return (
      <stackLayout style={{
        background: '#fff'
      }}>
        {renderIcons()}
      </stackLayout>
    )
  }
  return (
    <wrapLayout orientation='horizontal'>
      {renderIcons()}
    </wrapLayout>
  )
}

interface SocialLabelEditProps {
  item: Social
  isNew?: boolean
  isAdmin: boolean
  profile: UnionUser,
  onDataSaved(): void
}

export const SocialLabelEdit: React.FC<SocialLabelEditProps> = ({
  item,
  isNew,
  isAdmin,
  profile,
  onDataSaved
}) => {
  const { socialColors, onTouch } = useStyledContext()
  const [social, setSocial] = React.useState(() => item)
  const [edit, setEdit] = React.useState(() => isNew ? true : false)
  const [loading, setLoading] = React.useState(false)

  const onSave = () => {
    const keys = ['key', 'value', 'icon'];
    const isValid = keys.some((k) => {
      const val = social[k];
      return val !== ''
    })
    const dataTo = {
      social: {
        key: social.key,
        icon: social.icon,
        value: social.value
      },
      _id: social._id
    }

    if (!isValid) {
      alert('Please fill in all the fields')
      return
    } else {
      setLoading(true)
      client.mutate({
        mutation: UPDATE_SOCIAL,
        variables: dataTo,
      }).then(({ data }) => {
        if (!data.updateSocial) {
          setLoading(false)
          setEdit(false)
          alert('Error while updating social contact! Please try again')
        } else {
          setLoading(false)
          onDataSaved()
        }
      }).catch((e) => {
        setLoading(false)
        alert(e.message)
      })
    }
  }

  const addSocial = () => {
    const keys = ['key', 'value', 'icon'];
    const isValid = keys.some((k) => {
      const val = social[k];
      return val !== ''
    })
    const dataTo = {
      social: {
        key: social.key,
        icon: social.icon,
        value: social.value
      },
      toId: profile._id,
      toType: profile.type
    }

    if (!isValid) {
      alert('Please fill in all the fields')
      return
    } else {
      setLoading(true)
      client.mutate({
        mutation: ADD_SOCIAL,
        variables: dataTo,
      }).then(({ data }) => {
        if (!data.addSocial) {
          setLoading(false)
          setEdit(false)
          alert('Error while adding social contact! Please try again')
        } else {
          setLoading(false)
          onDataSaved()
        }
      }).catch((e) => {
        setLoading(false)
        alert(e.message)
      })
    }
  }

  const onDelete = () => {
    setLoading(true)

    client.mutate({
      mutation: REMOVER_SOCIAL,
      variables: {
        _id: social._id
      }
    }).then((data) => {
      onDataSaved()
      setLoading(false)
    }).catch((e) => {
      setLoading(false)
      alert(e.message)
    })
  }

  const socials = Object.keys(socialColors);

  return (
    <stackLayout padding="0 17" style={{
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    }}>
      <gridLayout columns='40, *, 40'>
        <flexboxLayout style={{
          width: 40,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <label color={socialColors[social.key.toLowerCase()]} className='AntDesign size16' text={IconSet.AntDesign[`${social.key}${isSocialIconSquare(social.key) ? '-square' : ''}`]} />
        </flexboxLayout>

        <label verticalAlignment='middle' col={1} text={social.value ?? "Not set"} style={{
          fontSize: 12,
          color: Theme[500],
          marginLeft: 4,
          marginRight: 4,
        }} />
        {isAdmin && (
          <flexboxLayout onTap={() => setEdit(!edit)} col={4} style={{
            width: 40,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <label className='MaterialIcons size18' text={edit ? IconSet.MaterialIcons.close : IconSet.MaterialIcons.edit} />
          </flexboxLayout>
        )}
      </gridLayout>
      <stackLayout marginBottom={17} visibility={edit ? "visible" : "collapse"}>
        <TextEditField
          type='select'
          value={social.key}
          simple
          selectOptions={socials}
          onChange={(value: string) => {
            setSocial({
              ...social,
              key: value,
              icon: value,
            })
          }}
        />
        <TextEditField
          type='text'
          editMode
          value={social.value}
          onChange={(value: string) => {
            setSocial({
              ...social,
              value
            })
          }}
        />
        <gridLayout columns='*, 8, *'>
          <SaveButton danger isLoading={loading} col={0} label='Delete' onPress={async () => {
            const yes = await confirm('Are you sure you want to remove this role?');
            if (yes) {
              onDelete()
            }
          }} />
          <SaveButton col={2} isLoading={loading} label='Save' onPress={isNew ? addSocial : onSave} />
        </gridLayout>
      </stackLayout>
    </stackLayout>
  )
}
