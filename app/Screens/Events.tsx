import * as React from "react";
import { alert } from "tns-core-modules/ui/dialogs";
import { useNavigation } from '@react-navigation/core';
import IconSet from '~/font-icons';
import { Color } from "tns-core-modules/color";
import { format, isValid } from 'date-fns'
import Theme, { Theme2 } from "~/Theme";
import * as ISupotsu from '~/DB/interfaces';
//@ts-ignore
import { client } from "~/app";
import * as AppSettings from "@nativescript/core/application-settings";
import Methods from "~/Methods";
import { EVENTS } from '../components/GQL';
import { getItemSpec } from "~/helpers";
import { Props, goToPageReact } from "~/components/AppContainer";
import { LoadingState, Empty, CommonHeader, DateModalProps, ComboModalHeaderSize, DateModal, LocationModalProps, LocationModal, ComboModal, ComboModalProps, ComboSelector, LocationSelector, DatePickerType } from "~/ui/common.ui";
import { useState } from 'react';
import { PropertyChangeData } from 'tns-core-modules/ui/editable-text-base';
import { File } from '@nativescript/core/file-system'
import { SaveButton } from "./Training";
import { openFilePicker } from '@nativescript-community/ui-document-picker'
import { Request, ErrorEventData, ProgressEventData, ResultEventData, Task, session } from 'nativescript-background-http'
import { AppAuthContext } from '../components/Root';
import { CalendarFilterProvider, useCalendarFilterContext } from '../contexts/CalenderFilterContext';

interface EventsState {
  active: string;
  date: Date;
  activeDate: Date;
  weekAhead: Date;
  monthAhead: Date;
  currentMonth: number;
  currentYear: number;
  currentDate: number;
  events: ISupotsu.EventItem[];
  isLoading: boolean;
  activeSport: ISupotsu.Sport | null;
  showSportFilter: boolean;
}

const Events: React.FC<any & Props> = ({ ...props }) => {
  const {
    monthAhead } = useCalendarFilterContext();

  const [state, updateState] = React.useState<EventsState>(() => {
    const date = new Date();
    const aheadDate = new Date();

    return {
      events: [],
      activeSport: null,
      showSportFilter: false,
      isLoading: true,
      active: 'Meeting',
      date,
      activeDate: date,
      currentMonth: date.getMonth(),
      currentYear: date.getFullYear(),
      currentDate: date.getDate(),
      weekAhead: new Date(+date + 12096e5),
      monthAhead: new Date(aheadDate.setMonth(aheadDate.getMonth() + 3))
    };
  });

  const setState = (newState: Partial<EventsState>, cb = () => { }) => {
    updateState({
      ...state,
      ...newState
    })
    if (cb) cb()
  }

  const getData = () => {
    const dateFrom = Math.floor(Date.now() / 1000);
    client.query({
      query: EVENTS,
      variables: {
        _id: props.user._id,
        type: props.user.type
      }
    }).then(({ data }) => {
      const dateTo = Math.floor(Date.now() / 1000);
      console.log(`[EVENTS] Time taken : ${dateTo - dateFrom}s`)
      setState({
        events: data.events,
        isLoading: false
      })
    }).catch(() => {
      setState({
        isLoading: false
      })
    })
  }

  React.useEffect(() => {
    // getData();
  }, []);

  React.useEffect(() => {
    getData();
  }, [props.user]);

  const { active, date, activeSport, isLoading, events: data } = state;
  const daysDummy = Methods.getDates(date, monthAhead);
  const events = data // .filter((item) => item.event_type.toLowerCase() === active.toLowerCase())

  return (
    <>
      <EventFilterSegments active={active} options={['Practice', 'Meeting', 'Social', 'Games']} onChange={(value) => {
        setState({
          active: value
        })
      }} />
      {!isLoading && events.length > 0 &&
        events.map((item: ISupotsu.EventItem) => {
          return (
            <EventItem item={item} key={item._id} />
          )
        })
      }
      {isLoading &&
        <flexboxLayout style={{
          height: 140,
          margin: '16 16',
          borderColor: new Color('#ddd'),
          borderWidth: 1,
          borderRadius: 8,
          background: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <LoadingState style={{
            width: '100%',
            height: '100%',
            borderRadius: 8,
          }} />
        </flexboxLayout>
      }
      {!isLoading && events.length === 0 &&

        <flexboxLayout style={{
          height: 140,
          margin: '16 16',
          borderColor: new Color('#ddd'),
          borderWidth: 1,
          borderRadius: 8,
          background: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Empty style={{
            width: '100%'
          }} />
        </flexboxLayout>
      }
    </>
  );
}

const EventsWithContext: React.FC<any & Props> = ({ ...props }) => {
  const { isShown = true, row = 1 } = props;
  return (
    <scrollView visibility={isShown ? "visible" : "collapse"} row={row} background={'#eee'}>
      <stackLayout padding={'0 0 16'}>
        <CalendarFilterProvider {...props} renderActions={() => {
          return (
            <flexboxLayout col={4} style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 4
            }}>
              {
                [{
                  icon: 'add',
                  targetScreen: 'createEvent'
                },
                  // {
                  //   icon: 'people',
                  //   targetScreen: 'eventAvailability'
                  // }
                ].map((item) => {
                  return (
                    <EventButton icon={item.icon} targetScreen={item.targetScreen} restProps={props} key={item.icon} />
                  )
                })
              }
            </flexboxLayout>
          )
        }} sportFilter>

          <Events {...props} />
        </CalendarFilterProvider>
      </stackLayout>
    </scrollView>
  )
}

interface EventFilterSegmentsProps {
  active: string;
  onChange(newValue: string): void;
  options: string[];
  scroll?: boolean;
  color?: string;
  background?: string;
  stripe?: boolean;
}

export const EventFilterSegments: React.FC<EventFilterSegmentsProps> = ({
  active,
  onChange,
  options,
  scroll,
  background = Theme2[500],
  color = '#fff',
  stripe = false
}) => {
  if (options.length < 2) return null;
  const items = options.map((item, i) => {
    return (
      <flexboxLayout onTap={() => {
        onChange(item);
      }} key={item} style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        ...scroll ? {
          paddingLeft: 16,
          paddingRight: 16,
        } : {},
        ...stripe ? {
          borderBottomColor: active === item ? color : background,
          borderBottomWidth: 4,
        } : {}
      }} col={i}>
        <label color={color} fontSize={16} text={item} verticalAlignment={'middle'} textAlignment={'center'} marginBottom={4} />
        {!stripe && (
          <label style={{
            height: 6,
            width: 6,
            borderRadius: 6 / 2,
            background: active === item ? color : background
          }} />
        )}
      </flexboxLayout>
    )
  });
  if (scroll) {
    return (
      <scrollView scrollBarIndicatorVisible={false} orientation="horizontal" height={50} background={background}>
        <stackLayout orientation="horizontal">{items}</stackLayout>
      </scrollView>
    )
  }
  return (
    <gridLayout height={50} background={background} columns={getItemSpec(Methods.getDummy(options.length).map(() => '*'))}>
      {items}
    </gridLayout>
  )
}

interface EventButtonProps {
  icon: string
  targetScreen?: string
  restProps: Record<string, any>
}

export const EventButton = ({
  icon,
  targetScreen,
  restProps
}: EventButtonProps): JSX.Element => {
  const navigation = useNavigation();
  return (
    <flexboxLayout key={icon} style={{
      marginLeft: 8,
      color: new Color('#fff'),
      height: 24,
      width: 24,
      borderRadius: 24 / 2,
      background: Theme2[500],
      alignItems: 'center',
      justifyContent: 'center'
    }} onTap={() => {
      if (targetScreen) {
        navigation.navigate(targetScreen, restProps)
      }
    }}>
      <label className={"MaterialIcons size12"} verticalAlignment={'middle'} textAlignment={'center'} text={IconSet.MaterialIcons[icon]} style={{
        color: new Color('#fff')
      }} />
    </flexboxLayout>
  )
}


interface EventTimelineSliderItemProps {
  active?: boolean
  value: string
}

const EventTimelineSliderItem = ({
  active,
  value
}: EventTimelineSliderItemProps) => {
  return (
    <label style={{
      fontSize: 12,
      margin: '4 8',
      padding: '0 4',
      borderRadius: 5,
      background: active ? Theme2[300] : '#ddd',
      color: active ? '#fff' : '#000'
    }} text={value} />
  )
}

interface EventItemProps {
  item: ISupotsu.EventItem
}

type EventItemAttendState = "Yes" | "Maybe" | "No";
const EventItemAttendStateColors: Record<EventItemAttendState, string> = {
  "Maybe": Theme2[500],
  "Yes": "green",
  "No": "red"
}
export const EventItem = ({
  item
}: EventItemProps): JSX.Element => {
  const [attendState, setAttendState] = useState<EventItemAttendState>("Maybe");
  const { team, fullTimestamp, place, invites } = item;
  return (
    <gridLayout style={{
      // height: 140,
      margin: '16 0', // 16 16 0 16
      borderColor: new Color('#ddd'),
      // borderWidth: 1, height: height || 50,
      // borderRadius: 8,
      background: '#fff',
    }} rows="auto, auto, 50">
      <gridLayout columns={'auto, *, auto'} row={0} style={{
        padding: '0 8'
      }}>
        <stackLayout verticalAlignment="middle" horizontalAlignment="center" col={0} style={{
          padding: '0 8'
        }}>
          {team && team._id &&
            <image height={{
              value: 30,
              unit: 'dip'
            }} width={{
              value: 30,
              unit: 'dip'
            }} borderRadius={30 / 2} src={team.image} />
          }
        </stackLayout>
        <flexboxLayout col={1} style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
          <label text={team.name} textAlignment="center" style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: Theme[500]
          }} />
        </flexboxLayout>
        <flexboxLayout col={2} style={{
          padding: '0 8',
          marginTop: 12,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <label textAlignment="center" verticalAlignment="middle" text={Methods.moment(fullTimestamp).format('HH:mm')} style={{
            fontSize: 16,
            padding: 0,
            fontWeight: 'bold',
            color: Theme[500]
          }} />
          <label textAlignment="center" verticalAlignment="middle" text={Methods.moment(fullTimestamp).format('DD MMM YYYY')} style={{
            fontSize: 10,
            marginTop: -4,
            padding: 0,
            color: Theme[500]
          }} />
        </flexboxLayout>
      </gridLayout>
      <gridLayout row={1} columns={'50, *, 50'} style={{
        padding: '0 8'
      }}>
        <flexboxLayout col={1} style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <label text={item.name} textAlignment="center" style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: Theme2[500]
          }} />
          {place &&
            <label text={place.name} textAlignment="center" style={{
              fontSize: 10,
              marginTop: -4,
            }} />
          }
        </flexboxLayout>
      </gridLayout>
      <gridLayout row={2} columns={'75, *, 30, 8'} style={{
        padding: '0 8'
      }}>
        <absoluteLayout col={0} height={30} borderRadius={15}>
          {invites.filter((_i, i) => i < 3).map((i, index) => {
            return (
              <EventItemClip key={index} src={i.user.image} index={index} />
            )
          })}
          {invites.length > 4 &&
            <flexboxLayout left={90 * 0.5} height={30} borderRadius={15} background={Theme2[500]} width={30}>

            </flexboxLayout>
          }
        </absoluteLayout>
        <gridLayout col={1} columns={"*,auto,*,auto,*"} margin="0 16">
          {
            ['Yes', false, 'Maybe', false, 'No'].map((item: string | boolean, index: number) => {
              if (!item) {
                return (
                  <label height={25} width={0.5} background={'#ddd'} key={index} textAlignment={'center'} verticalAlignment={'middle'} col={index} text={''} />
                )
              }
              const isActive = (item as EventItemAttendState) === attendState;
              return (
                <label onTap={() => {
                  setAttendState(item as EventItemAttendState)
                }} fontSize={14} borderRadius={5} padding="0 8" margin="0 8" color={isActive ? "#fff" : new Color('#555')} background={isActive ? EventItemAttendStateColors[item as EventItemAttendState] : ""} textAlignment={'center'} key={index} verticalAlignment={'middle'} col={index} text={item as string} />
              )
            })
          }
        </gridLayout>
        <label col={2} color={new Color('#ddd')} textAlignment={'center'} verticalAlignment={'middle'} className={'MaterialIcons size26'} text={IconSet.MaterialIcons.event} />
      </gridLayout>
    </gridLayout>
  )
}

interface EventItemClip {
  index: number
  src?: string
}

const EventItemClip = ({
  index,
  src,
}: EventItemClip) => {
  const size = 30;
  const left = (size * index);
  return (
    <image src={src} stretch={'fill'} left={left * 0.5} height={size} borderRadius={size / 2} width={size} style={{
      borderColor: Theme2[500],
      borderWidth: 1,
      background: 'black',
    }} />
  )
}

interface CreateEventState {
  event: Partial<ISupotsu.EventItem>
  audienceKey: string
  error: {}
  isTaggingAudience: boolean
  isEditting: boolean
  isDeleting: false
  itemToDelete: any
  isAdminDeleting: boolean
  adminToDelete: any
  isLoading: boolean
  single: boolean,
  recurrences: Record<string, boolean>
}

export const CreateEvent = (props: Record<string, any>): JSX.Element => {
  const _users = AppSettings.getString('users', '[]');
  const users = JSON.parse(_users);
  const _teams = AppSettings.getString('teams', '[]');
  const teams = JSON.parse(_teams);

  const [state, updateState] = useState<CreateEventState>({
    single: true,
    audienceKey: "F",
    error: {},
    isTaggingAudience: false,
    isEditting: props.isEditting ? true : false,
    isDeleting: false,
    itemToDelete: null,
    isAdminDeleting: false,
    adminToDelete: null,
    isLoading: false,
    recurrences: {
      Sun: false,
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false
    },
    event: props && props.event ? props.event : { name: "", desc: "", type: (props.user && props.user.type) === "T" ? "Training" : "Social", team: { name: "" }, managers: [], place: "", invites: [], endTime: "", startTime: "", date: "" }
  });

  const setState = (newState: Partial<CreateEventState>) => {
    updateState({
      ...state,
      ...newState
    })
  }

  const navigation = useNavigation();
  const { goBack } = navigation;
  const { event, isLoading } = state;
  if (isLoading) {
    return (
      <LoadingState text={props.isEditting ? "Saving..." : "Adding event..."} />
    )
  }
  return (
    <gridLayout rows="auto, *" background="#fff">
      <CommonHeader {...props} titleOnly user={{
        name: 'Create Event'
      }} goBack={goBack} />
      <scrollView row={1}>
        <stackLayout padding={16}>
          <TextEditField type="select" selectOptions={[
            'Meeting',
            'Practice',
            'Social',
            'Games'
          ]} simple value={event && event.type ? event.type : "Select Type"} labelFor={"Type"} />
          <TextEditField type="select" selectOptions={teams} onChange={(team) => {
            setState({
              event: {
                ...event,
                team: team as ISupotsu.Team
              }
            })
          }} value={event && event.team ? event.team : "Select team"} labelFor={"Team"} />
          <TextEditField type="select" multiple selectOptions={users} onChange={(_users) => {
            setState({
              event: {
                ...event,
                managers: _users as ISupotsu.User[]
              }
            })
          }} value={event && event.managers ? event.managers : "Select managers"} labelFor={"Managers"} />
          <TextEditField type="tagged" value={event && event.invites ? event.type : "Invite Members"} labelFor={"Invite Members"} />
          <TextEditField type="text" value={event && event.name ? event.name : "Event Name"} labelFor={"Name"} />
          <gridLayout padding={"0 0 8 0"} columns={"*, auto"}>
            <label row={0} verticalAlignment={'middle'} padding="0" text="Is this a recurring event" />
            <flexboxLayout col={1} style={{
              marginLeft: 8,
              color: new Color('#fff'),
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              <switch checked={!state.single} onCheckedChange={(event: PropertyChangeData) => {
                setState({
                  single: !event.value
                })
              }} />
            </flexboxLayout>
          </gridLayout>
          {state.single &&
            <>
              <TextEditField type="date-time" value={"DateAndTime"} labelFor={"Date"} />
            </>
          }
          {!state.single &&
            <>
              <TextEditField type="date-time" value={"DateAndTime"} labelFor={"From"} />
              <TextEditField type="date-time" value={"DateAndTime"} labelFor={"To"} />
              <TextEditField type="custom" value={"DateAndTime"} labelFor={"Recurrences"}>
                <gridLayout marginRight={4} marginLeft={4} borderRadius={4} columns="*,*,*,*,*,*,*">
                  {
                    Object.keys(state.recurrences).map((key, i) => {
                      return (
                        <flexboxLayout onTap={() => {
                          setState({
                            recurrences: {
                              ...state.recurrences,
                              [key]: !state.recurrences[key]
                            }
                          })
                        }} key={key} col={i} style={{
                          borderColor: Theme2['500'],
                          borderWidth: 0.5,
                          height: 45,
                          padding: '0 8',
                          alignItems: 'center',
                          justifyContent: 'center',
                          ...i === 0 ? {
                            borderTopLeftRadius: 2,
                            borderBottomLeftRadius: 2
                          } : i === 6 ? {
                            borderTopRightRadius: 2,
                            borderBottomRightRadius: 2
                          } : {},
                          ...state.recurrences[key] ? {
                            color: '#fff',
                            background: Theme2['500'],
                          } : {}
                        }}>
                          <label text={key} textAlignment={'center'} verticalAlignment={'middle'} fontSize={14} />
                        </flexboxLayout>
                      )
                    })
                  }
                </gridLayout>
              </TextEditField>
            </>
          }
          <TextEditField type="location" value={event.place || "Select place"} onChange={(value: Record<string, any>) => {
            setState({
              event: {
                ...event,
                place: value as ISupotsu.Place
              }
            })
          }} labelFor={"Location"} />
          <flexboxLayout style={{
            background: Theme2['500'],
            height: 45,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <label text={'Save Event'} textAlignment={'center'} verticalAlignment={'middle'} color={'#fff'} fontSize={16} />
          </flexboxLayout>
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

export const EventsAvailability = (props: Record<string, any>): JSX.Element => {
  const navigation = useNavigation();
  const { goBack } = navigation;
  return (
    <gridLayout rows="auto, *" background="#fff">
      <CommonHeader {...props} titleOnly user={{
        name: 'Attendence'
      }} goBack={goBack} />
      <scrollView row={1}>
        <stackLayout padding={16}>

        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

type TextEditFieldValue = string | Record<string, any>
type TextEditFieldOption = string[] | Record<string, any>[]
export interface TextEditFieldProps {
  type: "text" | "textArea" | "select" | "date" | "time" | "date-time" | "tagged" | "location" | "custom" | "upload"
  labelFor?: string
  value?: TextEditFieldValue
  col?: number
  row?: number,
  children?: React.ReactNode,
  onChange?(value: TextEditFieldValue, event?: PropertyChangeData): void,
  selectOptions?: TextEditFieldOption
  multiple?: boolean
  simple?: boolean
  withImage?: boolean
  error?: boolean
  errorLabel?: string
  plain?: boolean
  toggle?: boolean
  extensions?: string[],
  editMode?: boolean,
  isDark?: boolean;
  disabled?: boolean;
  border?: boolean;
  noCustomWrapper?: boolean;
  secure?: boolean
  keyboardType?: "number" | "datetime" | "phone" | "url" | "email" | "integer"
}

const TEXT_FIELD_CONTAINER_BORDER_RADIUS = 4;
const TEXT_CONTAINER_BG = "rgb(244, 244, 244)"
const TEXT_EDIT_FIELD_SIZE = "size14"

export const TextEditField = ({
  type,
  labelFor,
  value,
  children,
  onChange,
  selectOptions = [],
  simple = false,
  error,
  errorLabel = 'Invalid field input',
  plain,
  toggle,
  extensions,
  editMode,
  isDark,
  disabled,
  border,
  noCustomWrapper,
  col,
  multiple,
  row,
  withImage,
  keyboardType,
  secure
}: TextEditFieldProps) => {
  const { user } = React.useContext(AppAuthContext)
  const [isOpen, setIsOpen] = useState(true)
  const datePicker = () => {
    if (disabled) return;
    const opts: DateModalProps = {
      title: "Set Date & Time",
      orientation: "portrait",
      type: type as DatePickerType,
      size: ComboModalHeaderSize.mini,
      onChange: (date: Date) => {
        if (date && onChange) {
          onChange(date)
        }
      },
      onDone: (date: Date) => {
        if (date && onChange) {
          onChange(date)
        }
      }
    }

    goToPageReact(DateModal, opts, 'ComboModal')
  }

  const openLocation = () => {
    if (disabled) return;
    const test: LocationModalProps = {
      size: ComboModalHeaderSize.mini,
      //ground: true,
      title: "Set Location",
      value: "",
      onDone: (place) => {
        if (place && onChange) {
          onChange(place)
        }
      }
    }

    goToPageReact(LocationModal, test, 'LocationModal')
  }

  const openComboPicker = () => {
    if (disabled) return;
    const opts: ComboModalProps = {
      items: selectOptions,
      withImage: !simple,
      complex: true,
      selected: value,
      title: `Select ${labelFor}`,
      size: ComboModalHeaderSize.mini,
      onDone: (value?: any) => {
        if (value && onChange) {
          onChange(value)
        }
      }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
  }

  return (
    <>
      <stackLayout marginBottom={16}>
        {labelFor ? (
          <gridLayout columns="*, auto">
            <label text={labelFor} style={{
              fontSize: 12,
              marginBottom: 4,
              fontWeight: 'bold',
              color: isDark ? "#fff" : "#000"
            }} />
            {toggle && (
              <label onTap={() => setIsOpen(!isOpen)} paddingRight={16} paddingLeft={16} col={1} className="MaterialIcons size20">{IconSet.MaterialIcons[isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down']}</label>
            )}
          </gridLayout>
        ) : <></>}
        {isOpen ? (
          <>
            {type === "custom" && (
              <>
                {!noCustomWrapper ? <TextEditField.Custom border={border} disabled={disabled} plain={plain}>{children}</TextEditField.Custom> : children}
              </>
            )}
            {type === "upload" && (
              <TextEditField.Upload border={border} disabled={disabled} isDark={isDark} plain={plain} onChange={onChange} extensions={extensions}>{children}</TextEditField.Upload>
            )}
            {type === "text" && (
              <TextEditField.Text secure={secure} keyboardType={keyboardType} border={border} disabled={disabled} plain={plain} onChange={onChange} value={value} editMode={editMode} />
            )}
            {type === "textArea" && (
              <TextEditField.TextArea border={border} disabled={disabled} plain={plain} onChange={onChange} value={value} editMode={editMode} />
            )}
            {type === "select" && (
              <TextEditField.Select simple={simple} multiple={multiple} withImage={withImage} border={border} items={selectOptions} disabled={disabled} plain={plain} onTap={(value?: any) => {
                if (value && onChange) {
                  onChange(value)
                }
              }} value={value} />
            )}
            {type === "tagged" && (
              <TextEditField.Tagged border={border} disabled={disabled} plain={plain} value={value} />
            )}
            {type === "date" && (
              <TextEditField.Date onTap={datePicker} border={border} disabled={disabled} plain={plain} value={value} />
            )}
            {type === "time" && (
              <TextEditField.Time onTap={datePicker} border={border} disabled={disabled} plain={plain} value={value} />
            )}
            {type === "date-time" && (
              <gridLayout onTap={datePicker} columns={"*,16,*"}>
                <TextEditField.Date disabled={disabled} plain={plain} col={0} value={value} />
                <TextEditField.Time disabled={disabled} plain={plain} col={2} value={value} />
              </gridLayout>
            )}
            {type === "location" && (
              <LocationSelector
                renderTrigger={(ref, open) => (
                  <stackLayout onTap={open}>
                    <TextEditField.Location border={border} disabled={disabled} plain={plain} value={value} />
                  </stackLayout>
                )}
                size={ComboModalHeaderSize.normal}
                title="Set Location"
                onChange={(place) => {
                  if (place && onChange) {
                    onChange(place.name)
                  }
                }}
                onDone={(place) => {
                  if (place && onChange) {
                    onChange(place.name)
                  }
                }}
                places={user.placesLived.others}
              />
            )}

            {error && (
              <label className="size12" text={errorLabel} color="crimson" />
            )}
          </>
        ) : <></>}
      </stackLayout>
    </>
  )
}

interface TextEditFieldOptions extends Partial<TextEditFieldProps> {
  value?: string | Record<string, any>;
  col?: number;
  row?: number;
  children?: React.ReactNode;
  onTap?(args?: any): void;
  onChange?(args?: any, e?: PropertyChangeData): void;
  plain?: boolean;
  extensions?: string[];
  editMode?: boolean;
  isDark?: boolean;
  disabled?: boolean;
  hint?: string;
  border?: boolean;
  items?: any[];
  multiple?: boolean;
  simple?: boolean;
  withImage?: boolean;
  height?: number
  secure?: boolean
  keyboardType?: "number" | "datetime" | "phone" | "url" | "email" | "integer"
}

TextEditField.Custom = ({ children, row, col, plain, border, height }: TextEditFieldOptions) => {
  return (
    <gridLayout {...col ? { col } : {}} {...row ? { row } : {}} padding={"0 8"} columns={"*, auto"} background={TEXT_CONTAINER_BG} borderRadius={TEXT_FIELD_CONTAINER_BORDER_RADIUS} {...border ? {
      borderColor: '#ddd',
      borderWidth: 1, height: height || 50
    } : {}}>
      {children}
    </gridLayout>
  )
}

TextEditField.Location = ({
  value,
  row,
  col,
  plain,
  border,
  height
}: TextEditFieldOptions) => {
  return (
    <gridLayout {...col ? { col } : {}} {...row ? { row } : {}} padding={"8 0 8 0"} columns={"*, auto"} background={TEXT_CONTAINER_BG} borderRadius={TEXT_FIELD_CONTAINER_BORDER_RADIUS} {...border ? {
      borderColor: '#ddd',
      borderWidth: 1, height: height || 50
    } : {}}>
      <label className={TEXT_EDIT_FIELD_SIZE} row={0} verticalAlignment={'middle'} padding="0 16" text={getComputedValue(value)} />
      <flexboxLayout col={1} style={{
        marginLeft: 8,
        marginRight: 8,
        color: new Color('#fff'),
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <label verticalAlignment={'middle'} textAlignment={'center'} className={"MaterialIcons size26"} text={IconSet.MaterialIcons["place"]} style={{
          color: Theme2[500],
        }} />
      </flexboxLayout>
    </gridLayout>
  )
}

TextEditField.Text = ({
  value,
  row,
  col,
  onChange,
  plain,
  editMode,
  disabled,
  border,
  keyboardType,
  height,
  secure,
  hint,
}: TextEditFieldOptions) => {
  const [text, setText] = useState<string>(editMode ? value as string : "")
  return (
    <gridLayout {...col ? { col } : {}} {...row ? { row } : {}} padding={"0 8"} columns={"*, auto"} background={TEXT_CONTAINER_BG} borderRadius={TEXT_FIELD_CONTAINER_BORDER_RADIUS} {...border ? {
      borderColor: '#ddd',
      borderWidth: 1, height: height || 50
    } : {}}>
      <textField secure={secure} keyboardType={keyboardType} editable={!disabled} className={TEXT_EDIT_FIELD_SIZE} hint={hint ?? value as string} text={text} onTextChange={(args: PropertyChangeData) => {
        if (onChange) {
          onChange(args.value, args)
        }
        setText(args.value)
      }} style={{
        borderBottomColor: 'rgba(0,0,0,0)',
        background: TEXT_CONTAINER_BG
      }} />
    </gridLayout>
  )
}

TextEditField.TextArea = ({
  value,
  row,
  col,
  onChange,
  plain,
  editMode,
  disabled,
  border,
  height,
  hint
}: TextEditFieldOptions) => {
  const [text, setText] = useState<string>(editMode ? value as string : "")
  return (
    <gridLayout {...col ? { col } : {}} {...row ? { row } : {}} padding={"0 8"} columns={"*, auto"} background={TEXT_CONTAINER_BG} borderRadius={TEXT_FIELD_CONTAINER_BORDER_RADIUS} {...border ? {
      borderColor: '#ddd',
      borderWidth: 1, height: height || 50
    } : {}}>
      <textView editable={!disabled} className={TEXT_EDIT_FIELD_SIZE} hint={hint ?? value as string} text={text} onTextChange={(args: PropertyChangeData) => {
        if (onChange) {
          onChange(args.value, args)
        }
        setText(args.value)
      }} style={{
        minHeight: 60,
        borderBottomColor: 'rgba(0,0,0,0)',
        background: TEXT_CONTAINER_BG
      }} />
    </gridLayout>
  )
}

const getComputedValue = (value: string | { name?: string, title?: string }): string => {
  if (typeof value === "string") return value;
  if (value && value.name) return value.name;
  if (value && value.title) return value.title;
  return ""
}

TextEditField.Select = ({
  value: initValue,
  row,
  col,
  onTap: propOnTap,
  plain,
  disabled,
  border,
  items,
  multiple,
  simple,
  withImage,
  height
}: TextEditFieldOptions) => {
  const [value, setValue] = React.useState(initValue)
  const onTap = (v) => {
    if (propOnTap) {
      propOnTap(v)
    }
    setValue(v)
  }
  React.useEffect(() => {
    if (initValue) {
      setValue(initValue)
    }
  }, [initValue])
  return (
    <ComboSelector
      renderTrigger={(ref, open) => (
        <gridLayout onTap={disabled ? undefined : open} {...col ? { col } : {}} {...row ? { row } : {}} padding={"8 0 8 0"} columns={"*, auto"} background={TEXT_CONTAINER_BG} borderRadius={TEXT_FIELD_CONTAINER_BORDER_RADIUS} {...border ? {
          borderColor: '#ddd',
          borderWidth: 1, height: height || 50
        } : {}}>
          <label className={TEXT_EDIT_FIELD_SIZE} row={0} verticalAlignment={'middle'} padding="0 16" text={typeof value === "undefined" ? "" : getComputedValue(value)} />
          <flexboxLayout col={1} style={{
            marginLeft: 8,
            marginRight: 8,
            color: new Color('#fff'),
            width: 30,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <label verticalAlignment={'middle'} textAlignment={'center'} className={"MaterialIcons size26"} text={IconSet.MaterialIcons["keyboard-arrow-down"]} style={{
              color: Theme2[500],
            }} />
          </flexboxLayout>
        </gridLayout>
      )}
      items={items}
      title="Select"
      size={ComboModalHeaderSize.normal}
      complex={!simple}
      withImage={withImage}
      selected={value}
      onDone={onTap}
    />
  )
}

TextEditField.Date = ({
  row,
  col,
  plain,
  border,
  onTap,
  height,
  value
}: TextEditFieldOptions) => {
  const date = new Date(value as string)
  const formatted = isValid(date) ? format(new Date(date), 'dd/MM/yyyy') : ''
  return (
    <gridLayout {...col ? { col } : {}} {...row ? { row } : {}} padding={"8 0"} columns={"auto, *, auto"} background={TEXT_CONTAINER_BG} borderRadius={TEXT_FIELD_CONTAINER_BORDER_RADIUS} {...border ? {
      borderColor: '#ddd',
      borderWidth: 1, height: height || 50
    } : {}} onTap={onTap}>
      <flexboxLayout col={0} style={{
        marginLeft: 8,
        marginRight: 8,
        color: new Color('#fff'),
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <label verticalAlignment={'middle'} textAlignment={'center'} className={"MaterialIcons size26"} text={IconSet.MaterialIcons["event"]} style={{
          color: Theme2[500],
        }} />
      </flexboxLayout>
      <flexboxLayout col={1} style={{
        alignItems: 'center',
      }}>
        <label verticalAlignment={'middle'} color='black' className={"size16"} text={formatted} />
      </flexboxLayout>
      <flexboxLayout col={2} style={{
        marginLeft: 8,
        marginRight: 8,
        color: new Color('#fff'),
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <label verticalAlignment={'middle'} textAlignment={'center'} className={"MaterialIcons size26"} text={IconSet.MaterialIcons["keyboard-arrow-down"]} style={{
          color: Theme2[500],
        }} />
      </flexboxLayout>
    </gridLayout>
  )
}

TextEditField.Time = ({
  row,
  col,
  plain,
  border,
  onTap,
  height,
  value
}: TextEditFieldOptions) => {
  const date = new Date(value as string)
  const formatted = isValid(date) ? format(new Date(date), 'HH:MM') : ''
  return (
    <gridLayout {...col ? { col } : {}} {...row ? { row } : {}} padding={"8 0"} columns={"auto, *, auto"} background={TEXT_CONTAINER_BG} borderRadius={TEXT_FIELD_CONTAINER_BORDER_RADIUS} {...border ? {
      borderColor: '#ddd',
      borderWidth: 1, height: height || 50
    } : {}} onTap={onTap}>
      <flexboxLayout col={0} style={{
        marginLeft: 8,
        marginRight: 8,
        color: new Color('#fff'),
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <label verticalAlignment={'middle'} textAlignment={'center'} className={"MaterialIcons size26"} text={IconSet.MaterialIcons["access-time"]} style={{
          color: Theme2[500],
        }} />
      </flexboxLayout>

      <flexboxLayout col={1} style={{
        alignItems: 'center',
      }}>
        <label verticalAlignment={'middle'} color='black' className={"size16"} text={formatted} />
      </flexboxLayout>

      <flexboxLayout col={2} style={{
        marginLeft: 8,
        marginRight: 8,
        color: new Color('#fff'),
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <label verticalAlignment={'middle'} textAlignment={'center'} className={"MaterialIcons size26"} text={IconSet.MaterialIcons["keyboard-arrow-down"]} style={{
          color: Theme2[500],
        }} />
      </flexboxLayout>
    </gridLayout>
  )
}

TextEditField.Tagged = ({
  row,
  col,
  plain,
  border,
  height
}: TextEditFieldOptions) => {
  return (
    <gridLayout {...col ? { col } : {}} {...row ? { row } : {}} padding={"8 0 8 0"} columns={"*, auto"} background={TEXT_CONTAINER_BG} borderRadius={TEXT_FIELD_CONTAINER_BORDER_RADIUS} {...border ? {
      borderColor: '#ddd',
      borderWidth: 1, height: height || 50
    } : {}}>
      <scrollView col={0} orientation="horizontal">
        <stackLayout orientation="horizontal" />
      </scrollView>
      <flexboxLayout col={1} style={{
        marginLeft: 8,
        marginRight: 8,
        color: new Color('#fff'),
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <label verticalAlignment={'middle'} textAlignment={'center'} className={"MaterialIcons size26"} text={IconSet.MaterialIcons["keyboard-arrow-down"]} style={{
          color: Theme2[500],
        }} />
      </flexboxLayout>
    </gridLayout>
  )
}

export interface UploadMeta {
  progress: number,
  total: number
}

export interface UploadContextProps {
  isUploading: boolean
  meta: UploadMeta,
  file?: ISupotsu.IFile,
  openPicker(): void
}
const UploadContext = React.createContext({
  isUploading: false
} as UploadContextProps)

TextEditField.Upload = ({ extensions, row, col, plain, isDark, onChange, children, disabled, border }: TextEditFieldOptions) => {
  const {
    user
  } = React.useContext(AppAuthContext);
  const taskRef = React.useRef<Task>(null)
  const [file, setFile] = useState<ISupotsu.IFile>(null)
  const [isUpload, setIsUpload] = useState(false)
  const [uploadMeta, setUploadMeta] = useState<UploadMeta>({
    progress: 0,
    total: 0
  })

  React.useEffect(() => {
    const currentTaskRef = taskRef?.current
    if (currentTaskRef) {

    }

    return () => {
      if (currentTaskRef) {
        currentTaskRef.cancel();
      }
    }
  }, [taskRef])

  const onTap = React.useCallback(() => {
    if (disabled) return;
    if (isUpload) return;
    console.log(extensions)
    openFilePicker({
      multipleSelection: false,
      extensions: extensions
    }).then((value) => {
      const { files, android, ios } = value;
      if (files[0]) {
        const fileObj = File.fromPath(files[0])
        console.log('uploading...');
        const run = () => {
          const url = "https://supotsu.com/api/file/upload"

          var request: Request = {
            url: url,
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
              "File-Name": fileObj.name
            },
            description: "Uploading file...",
            androidAutoClearNotification: true,
            androidDisplayNotificationProgress: true,
            androidNotificationTitle: `Supotsu Upload`,
            //androidAutoDeleteAfterUpload:
          };

          var re = /(?:\.([^.]+))?$/;
          const ext = (filename: string) => {
            const _ = re.exec(filename)[1] || "*";
            return _;
          }

          var params = [
            { name: "location", value: "" },
            { name: "albumId", value: "" },
            { name: "tags", value: "[]" },
            { name: "objType", value: "profile" },
            { name: "fromId", value: Methods.you()._id },
            { name: "fromType", value: Methods.you().type },
            { name: "toId", value: user._id },
            { name: "toType", value: user.type },
            { name: "file", filename: fileObj.path, mimeType: `image/${ext(fileObj.name)}` }
          ];

          const session_ = session(fileObj.name)
          var task: Task = session_.multipartUpload(params, request);
          task.on('complete', () => {
            //_modal.closeCallback(false);
            //task.cancel();
            //console.log(args)
          })
          task.on('progress', (args: ProgressEventData) => {
            console.log(args.currentBytes, "/", args.totalBytes);
            const progress = args.currentBytes / args.totalBytes * 100
            const total = args.totalBytes / args.totalBytes * 100
            setIsUpload(true)
            setUploadMeta({
              progress,
              total
            })
          })

          task.on('error', (args: ErrorEventData) => {
            console.log('error', args)
            setIsUpload(false)
            taskRef.current = null;
            alert("Error while uploading file, please try again!")
          });

          task.on('responded', (args: ResultEventData) => {
            const _data = JSON.parse(args.data);
            console.log(_data);
            setFile(_data)
            onChange(_data);
            setIsUpload(false)
            taskRef.current = null;
          });

          taskRef.current = task;
        }
        run();
      }
      console.log(files, android, ios)

    }).catch((err) => {
      console.log(err)
    })
  }, [taskRef])

  if (children) {
    return (
      <UploadContext.Provider value={{
        isUploading: isUpload,
        file,
        meta: uploadMeta,
        openPicker: onTap
      }}>
        {children}
      </UploadContext.Provider>
    )
  }

  return (
    <gridLayout {...col ? { col } : {}} {...row ? { row } : {}} padding={"0 8"} columns={"*, auto"} background={isDark ? "transparent" : TEXT_CONTAINER_BG} borderRadius={TEXT_FIELD_CONTAINER_BORDER_RADIUS} {...border ? {
      borderColor: '#ddd',
      borderWidth: 1
    } : {}}>
      <SaveButton isDark={isDark} onTap={onTap} text={isUpload ? `Uploading: ${((uploadMeta.progress / uploadMeta.total) * 100).toFixed(0)}/100` : 'Choose File'} />
    </gridLayout>
  )
}

export const EventsTab = React.memo(EventsWithContext);
