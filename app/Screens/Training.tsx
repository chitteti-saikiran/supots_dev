import React, { useRef } from "react"
import { alert } from "tns-core-modules/ui/dialogs";
import { useNavigation, useRoute } from '@react-navigation/core';
import { StackLayout, GestureTypes, GestureEventData, EventData, Application, PropertyChangeData } from "@nativescript/core";
import IconSet from '~/font-icons';
import { Color } from "tns-core-modules/color";
import Theme, { Theme2 } from "~/Theme";
import * as ISupotsu from '~/DB/interfaces';
import { File } from '@nativescript/core/file-system'
import { FilePickerOptions, openFilePicker } from '@nativescript-community/ui-document-picker'
import { Request, CompleteEventData, ErrorEventData, ProgressEventData, ResultEventData, Session, Task, session as uploadSession } from 'nativescript-background-http'
//@ts-ignore
import { onTouch, client } from '~/app';
import * as AppSettings from "@nativescript/core/application-settings";
import Methods from "~/Methods";
import { getItemSpec } from "~/helpers";
import { LoadingState, Empty, CommonHeader, FullScreenLoader, PostItemButton } from "~/ui/common.ui";
import { useState, useEffect, useContext } from 'react';
import { PhotoSementItem } from "./Photos";
import { VideoItemStyle } from "./Videos";
import { ListView as $ListView, NSVElement, RNSStyle } from 'react-nativescript';
import { screen } from '@nativescript/core/platform/platform';
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout/grid-layout';
import { TextEditField, UploadMeta } from './Events';
import { ScrollView } from 'tns-core-modules/ui/scroll-view';
import * as dialogs from '@nativescript/core/ui/dialogs';
import { AppAuthContext } from '../components/Root';
import { CommentsThread } from '~/components/CommentsThread';
import PresentsAModal, { Modal } from "~/ui/Modal";
import { useStyledContext } from "~/contexts/StyledContext";
import { SESSIONS } from '~/services/graphql/sessions'

const getMyPages = () => {
  const { friends, myTeams, ownTeams } = Methods.you();
  const list = [];
  Methods.listify(friends).forEach((item) => {
    if (!Methods.inArray(item._id + "^F", list)) {
      list.push(item._id + "^F")
    }
  })

  Methods.listify(myTeams).forEach((item) => {
    if (!Methods.inArray(item._id + "^T", list)) {
      list.push(item._id + "^T")
    }
  })

  Methods.listify(ownTeams).forEach((item) => {
    if (!Methods.inArray(item._id + "^T", list)) {
      list.push(item._id + "^T")
    }
  })

  return list;
}

type SessionFilterType = "Favoured" | "Suggested" | "Mine" | "Teams" | "Groups" | "Friends"

interface SessionFilter {
  sessions: ISupotsu.Session[],
  suggestions: any[],
  type: SessionFilterType
}

const getFilteredSessions = (props: SessionFilter): ISupotsu.Session[] => {
  const { sessions, type, suggestions } = props;
  if (type === "Favoured") {
    const list = [];
    return list;
  } else if (type === "Suggested") {
    const list = [];
    Methods.listify(suggestions).forEach((item) => {
      if (item.type === "session") {
        item.content.suggestedBy = item.from;
        item.content.type = "Suggested";
        list.push(item.content);
      }
    })
    return list;
  } else {
    const _type = type === "Mine" ? "You" : type === "Teams" ? "Team" : type === "Groups" ? "Group" : "Friend";
    const list = Methods.listify(sessions).filter((item) => {
      return item.type === _type;
    });

    return list;
  }
}

const Filters: SessionFilterType[] = [
  "Mine",
  "Friends",
  "Teams",
  "Groups",
  "Favoured",
  "Suggested"
]

export const Training = (props: any): JSX.Element => {
  const sessionsStr = AppSettings.getString('sessions', '[]');
  const sessions_: ISupotsu.Session[] = JSON.parse(sessionsStr);

  const newMaterialStr = AppSettings.getString('new-material', '[]');
  const newMaterial_: ISupotsu.NewMaterial[] = JSON.parse(newMaterialStr);

  const [isFilterShown, setIsFilterShown] = useState<boolean>(false)

  const [state, updateState] = useState<Record<string, any>>({
    sessions: sessions_,
    isLoading: sessions_.length > 0 ? false : true,
    newMaterial: newMaterial_,
  })
  const router = useNavigation()
  const setState = (newState: Partial<Record<string, any>>, cb = () => { }) => {
    updateState({
      ...state,
      ...newState
    })
    if (cb) cb()
  }

  const getSessions = () => {
    const dataTo = {
      user: Methods.you(),
      userTo: {
        id: props['user']._id,
        type: props['user'].type
      }
    };

    client.query({
      query: SESSIONS,
      variables: {
        _id: props['user']._id,
        type: props['user'].type
      }
    }).then(({ data }) => {
      if (data.sessions) {
        const { sessions } = data;
        setState({
          sessions,
          isLoading: false,
          res: sessions
        }, () => {
          AppSettings.setString('sessions', JSON.stringify(sessions))
        });
      }
    }).catch((e) => {
      setState({
        isLoading: false,
        res: e
      });
    })
  };

  const getFiles = () => {
    const list = [];
    Methods.listify(state.sessions).filter((item) => {
      return item.files.length > 0;
    }).forEach((item) => {
      Methods.listify(item.files).forEach((_item, _i) => {
        if (!Methods.inArray(_item, list) && Boolean(_item.file)) {
          list.push(_item)
        } else if (!Methods.inArray(_item, list) && _item.isLink) {
          list.push(_item)
        }
      })
    })

    return list;
  }

  const getNewContent = () => {
    const data = {
      user: {
        id: Methods.you()._id,
        type: "F"
      },
      userTo: {
        type: props['user'].type,
        id: props['user']._id
      },
      array: getMyPages()
    }

    Methods.post(`https://supotsu.com/api/session/new-files`, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        setState({ newMaterial: res })
        console.log(res.length)
        AppSettings.setString('new-material', JSON.stringify(res))
      },
      error() {
        setTimeout(() => {
          getNewContent()
        }, 5000)
      }
    })

    return;
  }

  useEffect(() => {
    router.addListener('focus', () => {
      getSessions();
      getNewContent();
      console.log('IM HERE')
    })

    return () => {
      router.removeListener('focus', () => {

      })
    }
  }, [props['user']])

  const { sessions = [], newMaterial = [], activeTab = 'Sessions', isLoading = true } = state;

  return (
    <scrollView background={'#eee'}>
      <stackLayout padding={'16 0'}>
        <gridLayout marginBottom={16} background="#fff" padding="8 16" columns={getItemSpec(['auto', '*', 'auto'])}>
          <TrainingButton col={0} labelFor={'Add Material'} onTap={() => {
            router.navigate('trainingMaterialCreate', { ...props, sessions, newMaterial })
          }} icon={'add'} />
          <TrainingButton col={2} labelFor={'Notifications'} onTap={() => {
            router.navigate('trainingNotifications', { sessions, newMaterial, ...props })
          }} icon={'notifications'} />
        </gridLayout>

        <TrainingHeader
          title={"Sessions"}
          onTabChange={(tab: string) => {
            setState({
              activeTab: tab
            })
          }}
          controls={
            <>
              <TrainingButton onTap={() => {
                router.navigate('trainingSessionCreate', { ...props })
              }} col={0} icon={'add'} />
              {/* <TrainingButton col={0} icon={'settings'} /> */}
              <TrainingButton col={0} icon={'reply'} />
            </>
          }
          categories={
            <>
              <TrainingButton onTap={() => {
                setIsFilterShown(!isFilterShown)
              }} col={0} icon={'search'} />
            </>
          }
        />

        {activeTab === "Sessions" && (
          <>
            {!isLoading && sessions.length > 0 &&
              Filters.map((filter) => {
                const sessionsFor = getFilteredSessions({
                  sessions,
                  suggestions: [],
                  type: filter
                })
                if (sessionsFor.length < 1) return null
                return (
                  <TrainingListView key={filter} items={sessionsFor} title={filter as string} />
                )
              })
            }
            {!isLoading && sessions.length === 0 && (
              <flexboxLayout style={{
                width: '100%',
                padding: 20,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Empty text={'No Sessions found'} />
              </flexboxLayout>

            )}
            {isLoading && (
              <flexboxLayout style={{
                width: '100%',
                padding: 20,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <LoadingState />
              </flexboxLayout>
            )}
          </>
        )}
        {activeTab !== "Sessions" && (
          <>

            {!isLoading && getFiles().length === 0 && (
              <flexboxLayout style={{
                width: '100%',
                padding: 20,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Empty text={'No files found'} />
              </flexboxLayout>
            )}
            {isLoading && (
              <flexboxLayout style={{
                width: '100%',
                padding: 20,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <LoadingState />
              </flexboxLayout>
            )}
            {!isLoading && getFiles().length > 0 && (
              <TrainingCategories
                files={getFiles()}
                isFilterShown={isFilterShown}
              />
            )}
          </>
        )}
      </stackLayout>
    </scrollView>
  )
}

interface TrainingCategoriesProps {
  files: ISupotsu.SessionFile[],
  isFilterShown: boolean;
}

const TrainingCategories = ({
  files,
  isFilterShown
}: TrainingCategoriesProps) => {
  const [filters, setFilters] = useState([]);
  const chunks: ISupotsu.SessionFile[][] = Methods.arrayChunks(files, 3);
  const images: ISupotsu.SessionFile[] = Methods.arrayChunks(files.filter((i) => i.type === "image"), 3);
  const videos: ISupotsu.SessionFile[] = Methods.arrayChunks(files.filter((i) => i.type === "video"), 3);
  const documents: ISupotsu.SessionFile[] = Methods.arrayChunks(files.filter((i) => i.type === "document"), 3);
  const { widthPixels } = screen.mainScreen;
  const widthOf = widthPixels / 6 - 2;
  const filters_ = TMFilters['Rugby']
  const chunkedFilters = Methods.arrayChunks(filters_, 2);
  return (
    <>
      <stackLayout visibility={isFilterShown ? "visible" : "collapse"} padding={16}>
        {chunkedFilters.map((filterArr, index) => {
          return (
            <gridLayout key={String(index)} columns="*, *">
              {filterArr[0] && <FilterSelect onUpdate={(newFilters) => {
                setFilters(newFilters)
              }} filters={filters} item={filterArr[0]} col={0} />}
              {filterArr[1] && <FilterSelect onUpdate={(newFilters) => {
                setFilters(newFilters)
              }} filters={filters} item={filterArr[1]} col={1} />}
            </gridLayout>
          )
        })}
      </stackLayout>
      <gridLayout padding={'0 16'} marginBottom={8} columns={'auto, *'}>
        <flexboxLayout col={0} style={{
          background: Theme2['500'],
          borderBottomRightRadius: 16,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 8,
          paddingLeft: 16,
          paddingRight: 16,
        }}>
          <label text={"Images"} className={'size16'} color={'#fff'} />
        </flexboxLayout>
      </gridLayout>
      {chunks.map((chunk, i) => {
        return (
          <gridLayout columns="*, *, *" background="transparent" margin={"0 16 16"} height={widthOf} key={i}>
            {chunk.map((file) => {
              return (
                <TrainingSessionFile isGrid file={file} />
              )
            })}
          </gridLayout>
        )
      })}
    </>
  )
}

export const TrainingButton = ({
  col,
  icon = 'add',
  labelFor,
  onTap,
  size = 25,
  ref
}: {
  col?: number;
  icon: string;
  labelFor?: string;
  onTap?(args?: any): void;
  count?: number;
  size?: number;
  ref?: React.MutableRefObject<any>
}) => {
  return (
    <gridLayout ref={ref} onTouch={onTouch} onTap={onTap} columns={`${size}, 4, auto`} style={{
      ...labelFor ? {} : {
        marginLeft: 8
      }
    }} col={col}>
      <flexboxLayout style={{
        backgroundColor: Theme2['500'],
        borderRadius: size / 2,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff'
      }} col={0}>
        <label textAlignment="center" color={'#fff'} className={'MaterialIcons size16'} text={IconSet.MaterialIcons[icon]} />
      </flexboxLayout>
      {labelFor && (
        <label col={2} text={labelFor} />
      )}
    </gridLayout>
  )
}

const TrainingHeader = ({
  controls = null,
  categories = null,
  onTabChange,
}: {
  title: string,
  controls?: React.ReactNode,
  categories?: React.ReactNode,
  onTabChange(tab: string): void
}) => {
  const [active, setActive] = useState<string>('Sessions')
  const ref = useRef<NSVElement<GridLayout>>()

  return (
    <>
      <gridLayout ref={ref} padding={'0 16'} marginBottom={16} columns={'auto, auto, *, auto'}>
        <flexboxLayout col={0} style={{
          borderColor: Theme2[500],
          borderWidth: 1,
        }}>
          {['Sessions', 'Categories'].map((item) => {
            return (
              <label onTouch={onTouch} onTap={() => {
                setActive(item)
                onTabChange(item)
              }} col={0} text={item} key={item} className="size14" style={{
                fontWeight: 'bold',
                padding: '4 8',
                ...active === item ? {
                  color: '#fff',
                  background: Theme2[500]
                } : {
                  color: Theme2[500],
                  background: '#fff',
                }
              }} />
            )
          })}
        </flexboxLayout>
        <flexboxLayout col={3}>
          {active === 'Sessions' && controls}
          {active === 'Categories' && categories}
        </flexboxLayout>
      </gridLayout>
    </>
  )
}

const TrainingListView = ({
  title,
  items,
}: {
  title: string,
  items: ISupotsu.Session[],
}) => {
  return (
    <>
      <gridLayout padding={'0 16'} marginBottom={8} columns={'auto, *'}>
        <flexboxLayout col={0} style={{
          background: Theme2['500'],
          borderBottomRightRadius: 16,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 8,
          paddingLeft: 16,
          paddingRight: 16,
        }}>
          <label text={title} className={'size16'} color={'#fff'} />
        </flexboxLayout>
      </gridLayout>
      <scrollView scrollBarIndicatorVisible={false} marginBottom={16} orientation="horizontal">
        <stackLayout orientation="horizontal" padding={'0 16'}>
          {
            items.map((item, index) => {
              return (
                <TrainingListViewItem session={item} key={index} />
              )
            })
          }
          {items.length > 10 && (
            <TrainingListViewItem isMore />
          )}
          {items.length === 0 && (
            <TrainingListViewItem isMore moreLabel={`No sessions for ${title}`} />
          )}
        </stackLayout>
      </scrollView>
    </>
  );
}

const TrainingListViewItem = ({
  isMore,
  session,
  moreLabel = "MORE",
  onTap
}: {
  isMore?: boolean,
  moreLabel?: string,
  session?: ISupotsu.Session,
  onTap?(): void
}) => {
  const { widthPixels } = screen.mainScreen;
  const widthOf = widthPixels / 6 - 2;
  const router = useNavigation()
  if (isMore) {
    return (
      <flexboxLayout onTap={onTap} width={widthOf} height={widthOf} style={{
        background: Theme[500],
        borderRadius: 16,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}>
        <label textWrap textAlignment="center" verticalAlignment="middle" text={moreLabel} color="#fff" />
      </flexboxLayout>
    )
  }

  const src = getImgSrc(session.image);

  return (
    <gridLayout onTap={() => {
      router.navigate('trainingDetails', {
        session
      })
    }} width={widthOf} height={widthOf} style={{
      background: '#000',
      borderRadius: 16,
      marginRight: 16,
    }}>

      {session.image && (
        <image src={src} style={{
          backgroundColor: Theme[500],
          width: '100%',
          height: '100%',
          borderRadius: 16,
        }} />
      )}
      <flexboxLayout alignItems="center" justifyContent="center" style={{
        width: '100%',
        height: '100%',
        padding: 8,
      }}>
        <label textWrap textAlignment="center" verticalAlignment="middle" color="#fff">{session.name}</label>
      </flexboxLayout>
    </gridLayout>
  )
}

interface TrainingDetailsState {
  isEdit: boolean,
  session: ISupotsu.Session,
  error: Record<string, {
    error: boolean,
    msg: string
  }>,
  isLoading: boolean,
  message: string,
  filesRemoved: ISupotsu.SessionFile[],
  image?: ISupotsu.IFile,
  isUploading: boolean
}

export const TrainingDetails = () => {
  const {
    user
  } = useContext(AppAuthContext)
  const router = useNavigation()
  const route = useRoute();
  const { session: propSession } = route.params as { session: ISupotsu.Session }
  const taskRef = React.useRef<Task>(null)
  const [state, updateState] = useState<TrainingDetailsState>(() => {
    return {
      isEdit: false,
      session: propSession,
      error: {},
      isLoading: false,
      message: '',
      filesRemoved: [],
      isUploading: false,
    }
  })

  const [uploadMeta, setUploadMeta] = useState<UploadMeta>({
    progress: 0,
    total: 0
  })


  const setState = (newState: Partial<TrainingDetailsState>, cb = () => { }) => {
    updateState({
      ...state,
      ...newState
    })
    if (cb) cb()
  }

  const { isEdit, error, session } = state;

  const isAdmin = session.user._id === user._id;

  const save = () => {
    if (state.session.name && state.session.name.length < 3) {
      alert("Enter session name!");
      setState({
        error: {
          ...error,
          name: {
            msg: 'Invalid session name',
            error: true
          }
        }
      })
      return;
    }

    if (state.session.description && state.session.description.length < 3) {
      alert("Enter session description!");
      setState({
        error: {
          ...error,
          description: {
            msg: 'Invalid session description',
            error: true
          }
        }
      })
      return;
    }

    const firstStep = () => {
      //Save Session;
      const removed = state.filesRemoved.map((item) => item._id)
      setState({ isLoading: true, message: 'Saving session..' });
      const dataTo = {
        user: {
          id: user._id,
          type: user.type
        },
        session: {
          ...state.session,
          files: state.session.files.filter((item) => !removed.includes(item._id))
        },
        file: state.image
      }

      //console.log(dataTo)
      Methods.post(`https://supotsu.com/api/session/edit`, dataTo, {
        headers: {
          'Content-Type': 'application/json'
        },
        success(res) {
          setState({ isLoading: false, isEdit: false, filesRemoved: [] });
          alert('Session Saved!')
        },
        error(err) {
          setState({ isLoading: false });
        }
      })
    };

    firstStep()
  }

  const remove = () => {
    const { session: currentSession } = state;
    const firstStep = () => {
      //Delete Session;
      setState({ isLoading: true, message: 'Removing session..' });

      const dataTo = {
        user: {
          id: user._id,
          type: user.type
        },
        session: currentSession
      }

      Methods.post(`https://supotsu.com/api/session/delete`, dataTo, {
        headers: {
          'Content-Type': 'application/json'
        },
        success(res) {
          if (res.error) {
            setState({ isLoading: false });
            alert(res.message)
          } else {
            setState({ isLoading: false, isEdit: false, message: '' });
            router.goBack()
            alert('Session Deleted!');
          }
        },
        error(err) {
          setState({ isLoading: false });
        }
      })
    };

    firstStep()
  }

  const onFileRemove = (file: ISupotsu.SessionFile) => {
    const { filesRemoved } = state;
    const files = filesRemoved.filter((item) => item._id !== file._id);
    setState({
      filesRemoved: [...files, file]
    })
  }

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

  const icons = !isAdmin ? [] : isEdit ? [
    {
      className: "MaterialIcons",
      icon: "camera-alt",
      onPress() {
        openFilePicker({
          pickerMode: 0,
          extensions: [".png", ".jpg"],
          multipleSelection: false
        }).then(({ files }) => {
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

              const session_ = uploadSession(fileObj.name)
              var task: Task = session_.multipartUpload(params, request);
              task.on('complete', (args: CompleteEventData) => {
                //_modal.closeCallback(false);
                //task.cancel();
                //console.log(args)
              })
              task.on('progress', (args: ProgressEventData) => {
                console.log(args.currentBytes, "/", args.totalBytes);
                const progress = args.currentBytes / args.totalBytes * 100
                const total = args.totalBytes / args.totalBytes * 100
                setState({
                  isUploading: false,
                })
                setUploadMeta({
                  progress,
                  total
                })
              })

              task.on('error', (args: ErrorEventData) => {
                console.log('error', args)
                setState({
                  isUploading: false,
                })
                taskRef.current = null;
                alert("Error while uploading file, please try again!")
              });

              task.on('responded', (args: ResultEventData) => {
                const _data = JSON.parse(args.data);
                console.log(_data);
                setState({
                  isUploading: false,
                  image: _data
                })
                taskRef.current = null;
              });

              taskRef.current = task;
            }
            run();
          }
        }).catch(err => {
          alert(err)
        })
      }
    },
  ] : [
    {
      className: "MaterialIcons",
      icon: "add",
      onPress() {

      }
    },
    {
      className: "MaterialIcons",
      icon: "edit",
      onPress() {
        setState({
          isEdit: true
        })
      }
    },
    {
      className: "MaterialIcons",
      icon: "delete",
      onPress() {
        dialogs.confirm(`Are you sure you want to delete session ${session.name}`).then((val) => {
          if (val) {
            remove()
          }
        }).catch(() => {

        })
      }
    }
  ]

  const src = getImgSrc(session.image);

  return (
    <gridLayout rows={'*, auto'} background={'#fff'}>
      {!state.isUploading &&
        (
          <>
            <scrollView row={0} visibility={state.isLoading ? "hidden" : "visible"}>
              <stackLayout>
                <absoluteLayout style={{
                  backgroundColor: Theme2[500],
                  height: 258
                }}>
                  {session.image && (
                    <image top={0} width="100%" left={0} src={src} style={{
                      backgroundColor: "#000",
                      height: 258
                    }} />
                  )}
                  <gridLayout top={0} left={0} height={258} width="100%" rows="*, auto">
                    {!isEdit && (
                      <>
                        <flexboxLayout row={0} alignItems={"flex-end"} padding="16 16 0 16">
                          <label style={{
                            fontSize: 24,
                            color: '#fff',
                            fontWeight: 'bold'
                          }}>{session.name}</label>
                        </flexboxLayout>
                        <TrainingDetailStats fileCount={session.files.length} date={Methods.moment(session.date).format("DD MMM YYYY")} />
                      </>
                    )}
                  </gridLayout>
                </absoluteLayout>
                <flexboxLayout flexDirection="column" padding={16}>
                  {!isEdit && (
                    <>
                      {session.description.length > 1 && (
                        <>
                          <TrainingDetailsLabel text="About" />
                          <flexboxLayout>
                            <label textWrap>{session.description}</label>
                          </flexboxLayout>
                        </>
                      )}
                      <TrainingDetailsLabel text={"Material"} />
                      {session.files.map((file: ISupotsu.SessionFile) => {
                        const removed = (state.filesRemoved as ISupotsu.SessionFile[]).map((item) => item._id)
                        if (removed.includes(file._id)) return null;
                        return (
                          <TrainingSessionFile session={session} isEdit={isEdit} file={file} key={file._id} />
                        )
                      })}
                      {session.files.length < 1 && (
                        <Empty text={'No files found'} />
                      )}
                    </>
                  )}
                  {isEdit && (
                    <>
                      <TrainingDetailsLabel text="Edit Session" />
                      <TextEditField type="text" value={state.session.name || "Session name"} error={error.name?.error} errorLabel={error.name?.msg} onChange={(text) => {
                        const val = text as string;
                        setState({
                          session: {
                            ...session,
                            name: val
                          },
                          error: {
                            ...error,
                            name: {
                              msg: val.length < 3 ? 'Invalid session name' : '',
                              error: val.length < 3 ? true : false
                            }
                          }
                        })
                      }} editMode />
                      <TextEditField type="textArea" value={session.description || "Session description"} error={error.description?.error} errorLabel={error.description?.msg} onChange={(text) => {
                        const val = text as string;
                        setState({
                          session: {
                            ...session,
                            description: val
                          },
                          error: {
                            ...error,
                            description: {
                              msg: val.length < 5 ? 'Invalid session description' : '',
                              error: val.length < 5 ? true : false
                            }
                          }
                        })
                      }} editMode />

                      <TrainingDetailsLabel text={"Edit Session Material"} />
                      {session.files.map((file) => {
                        const removed = state.filesRemoved.map((item) => item._id)
                        if (removed.includes(file._id)) return null;
                        return (
                          <TrainingSessionFile session={session} onRemove={onFileRemove} isEdit={isEdit} file={file} key={file._id} />
                        )
                      })}
                    </>
                  )}
                </flexboxLayout>
              </stackLayout>
            </scrollView>
            {state.isLoading && (
              <flexboxLayout row={0} style={{
                width: '100%',
                padding: 20,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <LoadingState text={state.message} />
              </flexboxLayout>
            )}
            {isEdit && (
              <gridLayout row={1} borderTopColor="#eee" borderTopWidth={1} columns="*, 16, *" padding={16}>
                <stackLayout col={0}>
                  <SaveButton onTap={() => {
                    if (state.isLoading) return;
                    setState({
                      isEdit: false,
                      filesRemoved: []
                    })
                  }} text="Cancel" />
                </stackLayout>
                <stackLayout col={2}>
                  <SaveButton onTap={() => {
                    if (state.isLoading) return;
                    save()
                  }} text="Save" />
                </stackLayout>
              </gridLayout>
            )}
          </>
        )
      }
      {state.isUploading && (
        <flexboxLayout row={0} style={{
          width: '100%',
          padding: 20,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <LoadingState text={`Uploading file: ${uploadMeta.progress} of ${uploadMeta.total}`} />
        </flexboxLayout>
      )}
      <CommonHeader transparent={!state.isLoading} titleOnly user={{
        name: ""
      }} goBack={() => {
        if (isEdit) {
          setState({
            isEdit: false
          })
          return;
        }
        router.goBack()
      }} icons={icons} />
    </gridLayout>
  )
}

interface TouchableProps {
  children: React.ReactNode,
  col?: number,
  row?: number
}

const Touchable = ({ children, col, row }: TouchableProps) => {
  const onLongPress = (args: GestureEventData) => {
    console.log("long tap on")
  }
  return (
    <stackLayout onLoaded={(args: EventData) => {
      const view = args.object as StackLayout;
      view.on(GestureTypes.longPress, onLongPress)
    }} {...row ? { row } : {}} {...col ? { col } : {}}>
      {children}
    </stackLayout>
  )
}

const TrainingDetailStats = ({
  fileCount,
  date
}: {
  date: string,
  fileCount: number
}) => {
  return (
    <flexboxLayout alignItems="center" color="#fff" padding="0 16 16 16" row={1}>
      <flexboxLayout alignItems="center" marginRight={8}>
        <label col={0} className="MaterialIcons size14" text={IconSet.MaterialIcons.event} />
        <label fontSize={12} paddingLeft={2} text={date} />
      </flexboxLayout>
      <label verticalAlignment="middle">{"•"}</label>
      <flexboxLayout alignItems="center" marginLeft={8}>
        <label col={0} className="MaterialIcons size14" text={IconSet.MaterialIcons['attach-file']} />
        <label fontSize={12} paddingLeft={2} text={`${Methods.shortDigit(fileCount).text} file${fileCount === 0 ? '' : 's'}`} />
      </flexboxLayout>
    </flexboxLayout>
  )
}

const TrainingDetailsLabel = ({
  text = "Label"
}: {
  text: string
}) => {
  return (
    <flexboxLayout marginBottom={16} marginTop={16}>
      <label style={{
        fontSize: 24,
        color: Theme[500],
        fontWeight: 'bold'
      }}>{text}</label>
    </flexboxLayout>
  )
}

const images = {
  pdf: "~/images/assets/pdf__.png",
  xls: "~/images/assets/xls__.png",
  ppt: "~/images/assets/ppt__.png",
  doc: "~/images/assets/doc__.png"
};

export const getImgSrc = (file: ISupotsu.IFile): string => {
  if (!file) return ""
  if (file.type === "image") {
    return `http://supotsu.com:9000/files/${Methods.getThumbFolder(file.user)}/${file.url}?w=70&h=70`
  } else if (file.type === "document") {
    return images[file.type];
  } else {
    return ""
  }
}

interface TrainingSessionFileProps {
  file: ISupotsu.SessionFile,
  session?: ISupotsu.Session,
  isGrid?: boolean,
  isEdit?: boolean,
  onRemove?(file: ISupotsu.SessionFile): void,
  row?: number,
  col?: number
}

const TrainingSessionFile = ({
  file,
  session,
  isEdit,
  onRemove,
  isGrid,
  col,
  row
}: TrainingSessionFileProps): JSX.Element => {
  const router = useNavigation()
  const {
    user
  } = useContext(AppAuthContext)
  const canEdit = file.user._id === user._id && isEdit;
  const src = getImgSrc(file.file);

  if (isGrid) {
    // console.log(file.file.url, src)

    return (
      <flexboxLayout {...col ? { col } : {}} {...row ? { row } : {}} style={{
        borderRadius: 8,
        background: '#000',
        height: "100%",
      }} onTap={() => {
        if (!isEdit) {
          router.navigate("trainingSessionFileDetails", {
            file: file._id,
            session: ""
          })
        }
      }}>
        <image style={{
          width: "100%",
          height: "100%",
          borderRadius: 8,
        }} src={src} />
      </flexboxLayout>
    )
  }

  return (
    <Touchable>
      <gridLayout background="#fff" columns="120, *, auto" style={{
        marginBottom: 8,
        paddingBottom: 16,
        marginTop: 8,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
      }} onTap={() => {
        if (!isEdit) {
          router.navigate("trainingSessionFileDetails", {
            file: file._id,
            session: session._id
          })
        }
      }}>
        <flexboxLayout style={{
          height: 70,
          borderRadius: 16,
          background: '#000',
        }} col={0}>
          <image style={{
            width: "100%",
            height: "100%",
            borderRadius: 16,
          }} src={src} />
        </flexboxLayout>

        <gridLayout style={{
          padding: '2 16',
          height: 70,
        }} col={1} rows="auto, *, auto">
          <label row={0} text={file.title} style={VideoItemStyle.title} />
          <label row={1} textWrap={!canEdit} text={file.description} style={VideoItemStyle.desc} />
          <label row={3} text={`${Methods.shortDigit(file.comments.length).text} ${file.comments.length === 1 ? 'Comment' : 'Comments'} - ${Methods.moment(file.date).format('DD MMM YYYY').toUpperCase()}`} style={VideoItemStyle.footer} />
        </gridLayout>

        {canEdit && (
          <flexboxLayout alignItems="center" col={2}>
            <IconButton
              icon={{
                icon: "delete",
                className: "MaterialIcons",
                onPress() {
                  onRemove(file)
                }
              }}
            />
          </flexboxLayout>
        )}
      </gridLayout>
    </Touchable>
  )
}

interface TrainingSessionFileDetailsState {
  isEdit: boolean,
  session?: ISupotsu.Session,
  file?: ISupotsu.SessionFile,
  error: Record<string, {
    error: boolean,
    msg: string
  }>,
  isLoading: boolean,
  message: string,
}

export const TrainingSessionFileDetails = () => {
  const {
    user
  } = useContext(AppAuthContext)
  const { theme } = useStyledContext();
  const router = useNavigation()
  const route = useRoute();
  const { session: session_id, file: file_id } = route.params as { session: ISupotsu.Session, file: ISupotsu.SessionFile }
  const [state, updateState] = useState<TrainingSessionFileDetailsState>(() => {
    const fileString = AppSettings.getString(`session-file-${file_id}`, '');
    const file: ISupotsu.SessionFile | undefined = fileString.length === 0 ? undefined : JSON.parse(fileString);
    console.log(file)

    return {
      isEdit: false,
      error: {},
      message: 'Loading Content',
      ...file ? {
        file,
        isLoading: false
      } : {
        isLoading: true
      }
    }
  })

  const setState = (newState: Partial<TrainingSessionFileDetailsState>, cb = () => { }) => {
    updateState({
      ...state,
      ...newState
    })
    if (cb) cb()
  }

  useEffect(() => {
    getSessionFile();
  }, []);

  const getSessionFile = () => {
    const dataTo = {
      _id: file_id
    };

    Methods.post(`https://supotsu.com/api/session/file`, dataTo, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        setState({
          file: res,
          isLoading: false,
        }, () => {
          AppSettings.getString(`session-file-${file_id}`, JSON.stringify(res));
        });
      },
      error: res => {
        setState({
          isLoading: false,
        });
      }
    })
  };

  const save = () => {
    if (state.file.title && state.file.title.length < 3) {
      alert("Enter file name!");
      setState({
        error: {
          ...error,
          name: {
            msg: 'Invalid file name',
            error: true
          }
        }
      })
      return;
    }

    if (state.file.description && state.file.description.length < 3) {
      alert("Enter file description!");
      setState({
        error: {
          ...error,
          description: {
            msg: 'Invalid file description',
            error: true
          }
        }
      })
      return;
    }

    const firstStep = () => {
      //Save Session;
      setState({ isLoading: true, message: 'Saving file..' });
      const dataTo = {
        user: {
          id: user._id,
          type: user.type
        },
        file: state.file,
        session: state.session
      }
      //console.log(dataTo)
      Methods.post(`https://supotsu.com/api/session/edit-file`, dataTo, {
        success(res) {
          console.log(res)
          setState({ isLoading: false, isEdit: false, message: null, file: res });
          Methods.alert('File Saved!')
        },
        error(err) {
          setState({ isLoading: false });
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
    };

    firstStep()
  }

  const remove = () => {
    const { session, isEdit, file } = state;
    const firstStep = () => {
      //Save Session;
      setState({ isLoading: true, message: 'Removing file from session' });

      const dataTo = {
        user: {
          id: user._id,
          type: user.type
        },
        file,
        session
      }

      Methods.post(`https://supotsu.com/api/session/delete-file`, dataTo, {
        success(res) {
          setState({ isLoading: false, isEdit: false, message: null });
          Methods.alert('File Deleted!')
          router.goBack();
        },
        error(err) {
          setState({ isLoading: false });
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    };

    firstStep()
  }

  const { isEdit, isLoading, file, error } = state;

  const src = file ? getImgSrc(file.file) : '';

  const ICON_SIZE = 22;

  const icons = !file ? [] : (!(user._id === file.user._id) || isEdit) ? [] : [
    {
      className: "MaterialIcons",
      icon: "edit",
      onPress() {
        setState({
          isEdit: true
        })
      }
    },
    {
      className: "MaterialIcons",
      icon: "delete",
      onPress() {
        dialogs.confirm(`Are you sure you want to delete session fie ${file.title}`).then((val) => {
          if (val) {
            remove()
          }
        }).catch(() => {

        })
      }
    }
  ]
  return (
    <gridLayout rows={'250, auto, *, auto'} background={'#fff'}>
      <gridLayout row={0} background="#000" />
      <flexboxLayout row={0} justifyContent="center" alignItems="center" style={{
        height: '100%',
        width: '100%',
      }}>
        <image src={src} stretch="none" />
      </flexboxLayout>
      {!isEdit && !state.isLoading && state.file && (
        <stackLayout row={1} background={theme.primary[500]}>
          <gridLayout columns="40, *" padding={8}>
            <flexboxLayout height={40} width={40} col={0} alignItems="flex-start" paddingTop={4} marginRight={8} justifyContent="center">
              <image stretch="fill" src={state.file.user.image} style={{
                width: 40,
                height: 40,
                borderRadius: 20
              }}/>
            </flexboxLayout>
            <stackLayout col={1}>
              <label text={state.file.title} color="#fff" />
              <label text={state.file.description} textWrap color="#ddd" />
            </stackLayout>
          </gridLayout>
          <gridLayout background={theme.secondary[500]} padding="4 8" columns="auto, *">
          <flexboxLayout col={0}>
            <PostItemButton
              col={1}
              style={{
                paddingLeft: 3,
                paddingRight: 3,
              }} onPress={() => {

              }}
              Icon={
                <Methods.LikeIcon liked={Methods.listify(state.file.likes).filter((like) => Methods.getUser(like.user)._id === Methods.you()._id).length > 0} size={ICON_SIZE + 2} />
              }
              Label={Methods.shortDigit(Methods.listify(state.file.likes).length, "Like").data}
              count={Methods.shortDigit(Methods.listify(state.file.likes).length, "Like").text}
              LabelColor={Methods.listify(state.file.likes).filter((like) => Methods.getUser(like.user)._id === Methods.you()._id).length > 0 ? Theme2['500'] : "#000"}
            />
            <PostItemButton col={2} style={{
              paddingLeft: 5
            }} countColor={Theme2['500']} onPress={() => {}} Icon={() => {
              return null;
            }} count={Methods.shortDigit(Methods.listify(state.file.comments).length, "Comment").text} Label={Methods.shortDigit(Methods.listify(state.file.comments).length, "Comment").data} />

          </flexboxLayout>
        </gridLayout>
        </stackLayout>
      )}
      {!isEdit && !state.isLoading && state.file && (
        <CommentsThread path="session_file" refreshParentData={() => getSessionFile()} row={2} isEdit={isEdit} comments={file.comments} postId={file._id} postCommentType={file.commentType} />
      )}
      {state.isLoading && (
        <flexboxLayout row={2} style={{
          width: '100%',
          padding: 20,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <LoadingState text={state.message} />
        </flexboxLayout>
      )}
      {isEdit && (
        <scrollView row={2}>
          <stackLayout padding={16}>
            <TrainingDetailsLabel text="Edit File" />
            <TextEditField type="text" labelFor="File Name" value={file.title || "File name"} error={error.title?.error} errorLabel={error.title?.msg} onChange={(text) => {
              const val = text as string;
              setState({
                file: {
                  ...file,
                  title: val
                },
                error: {
                  ...error,
                  title: {
                    msg: val.length < 3 ? 'Invalid file name' : '',
                    error: val.length < 3 ? true : false
                  }
                }
              })
            }} editMode />
            <TextEditField type="textArea" labelFor="File Description" value={file.description || "File description"} error={error.description?.error} errorLabel={error.description?.msg} onChange={(text) => {
              const val = text as string;
              setState({
                file: {
                  ...file,
                  description: val
                },
                error: {
                  ...error,
                  description: {
                    msg: val.length < 5 ? 'Invalid file description' : '',
                    error: val.length < 5 ? true : false
                  }
                }
              })
            }} editMode />
          </stackLayout>
        </scrollView>
      )}
      {isEdit && (
        <gridLayout row={3} borderTopColor="#eee" borderTopWidth={1} columns="*, 16, *" padding={16}>
          <stackLayout col={0}>
            <SaveButton onTap={() => {
              if (state.isLoading) return;
              setState({
                isEdit: false,
              })
            }} text="Cancel" />
          </stackLayout>
          <stackLayout col={2}>
            <SaveButton onTap={() => {
              if (state.isLoading) return;
              save()
            }} text="Save" />
          </stackLayout>
        </gridLayout>
      )}
      <CommonHeader transparent titleOnly user={{
        name: ""
      }} goBack={() => {
        if (isEdit) {
          setState({
            isEdit: false
          })
          return;
        }
        router.goBack()
      }} icons={icons} />
    </gridLayout>
  )
}

interface IconButtonProps {
  col?: number,
  row?: number,
  transparent?: boolean,
  size?: number,
  icon: {
    className?: string,
    icon: string,
    size?: number,
    onPress?(): void,
    count?: number
  }
}

const IconButton = ({
  col,
  row,
  icon,
  transparent,
  size = 40
}: IconButtonProps) => {
  return (
    <absoluteLayout onTouch={onTouch} {...row ? { row } : {}} {...col ? { col } : {}} marginLeft={8} onTap={() => {
      if (icon.onPress) {
        icon.onPress()
      }
    }}>
      <flexboxLayout top={0} left={0} justifyContent="center" alignItems="center" style={{
        height: size,
        width: size,
        borderRadius: size / 2,
        background: transparent ? 'rgba(0, 0, 0, 0.4)' : '#283542',
      }}>
        <image src={icon.className ? `font://${IconSet[icon.className][icon.icon]}` : `font://${IconSet.Ionicons[icon.icon]}`} tintColor={new Color("#fff")} className={icon.className ? `${icon.className} size14` : 'Ionicons size14'} stretch="none" />
      </flexboxLayout>
    </absoluteLayout>
  )
}

export const TrainingSessionCreate = () => {
  const ref = useRef<NSVElement<ScrollView>>()
  const router = useNavigation()
  const route = useRoute();
  const props = route.params as Record<string, any>
  const [state, updateState] = useState<Record<string, any>>({
    session: {
      name: '',
      description: ''
    },
    image: undefined,
    message: 'Creating session...',
    files: [],
    tags: [],
    isLoading: false,
    error: {
      name: {
        msg: '',
        error: false
      },
      description: {
        msg: '',
        error: false
      }
    }
  })

  const setState = (newState: Partial<Record<string, any>>) => {
    updateState({
      ...state,
      ...newState
    })
  }

  const save = () => {
    const { session, files = [], tags = [], file } = state;
    const { isEdit = false } = props as Record<string, any>

    if (isEdit) {

      if (session.name && session.name.length === 0) {
        alert("Enter session name!");
        return;
      }

      if (session.description && session.description.length === 0) {
        alert("Enter session description!");
        return;
      }

      const firstStep = () => {
        //Save Session;
        setState({ isLoading: true, message: 'Saving session..' });
        const dataTo = {
          user: {
            id: props['user']._id,
            type: props['user'].type
          },
          session,
          file
        }

        Methods.post(`https://supotsu.com/api/session/edit`, dataTo, {
          headers: {
            'Content-Type': 'application/json'
          },
          success() {
            setState({ isLoading: false });
            alert('Session Saved!')
            router.goBack()
          },
          error() {
            setState({ isLoading: false });
          }
        })
      };

      firstStep()
    } else {

      if (session.name === "" || session.name.length < 3) {
        alert("Enter session name!");
        const val = session.name;
        setState({
          error: {
            ...error,
            name: {
              msg: val.length < 3 ? 'Invalid session name' : '',
              error: val.length < 3 ? true : false
            }
          }
        })

        if (ref.current?.nativeView) {
          ref.current?.nativeView?.scrollToVerticalOffset(0, true)
        }
        return;
      }

      if (session.description === "" || session.description.length < 5) {
        alert("Enter session description!");
        const val = session.name;
        setState({
          error: {
            ...error,
            name: {
              msg: val.length < 3 ? 'Invalid session description' : '',
              error: val.length < 3 ? true : false
            }
          }
        })

        if (ref.current?.nativeView) {
          ref.current?.nativeView?.scrollToVerticalOffset(0, true)
        }
        return;
      }

      if (files.length === 0) {
        // alert("Add material to this session!");
        // return;
      }

      const firstStep = () => {
        // RegisterSession;
        setState({ isLoading: true, message: 'Creating session..' });
        const dataTo = {
          userTo: {
            id: props['user']._id,
            type: props['user'].type
          },
          name: session.name,
          timeAgo: new Date(),
          files: [],
          description: session.description,
          tags: tags
        }

        Methods.post(`https://supotsu.com/api/session/create`, dataTo, {
          headers: {
            'Content-Type': 'application/json'
          },
          success(res) {
            setState({ isLoading: false })
            if (res.error) {
              alert(res.message)
            } else {
              alert('Session created successfully!')
              setState({ session: {}, error: {}, files: [], tags: [] });
              router.goBack()
            }
          },
          error(err) {
            alert(err.message)
            setState({ isLoading: false })
          }
        })
      };

      firstStep();
    }
  }

  const { session, error, isLoading, message } = state;
  return (
    <gridLayout rows={'auto, *'} background={'#fff'}>
      <CommonHeader titleOnly user={{
        name: 'Add Session'
      }} goBack={() => {
        router.goBack()
      }} />
      <scrollView visibility={isLoading ? 'collapse' : 'visible'} row={1}>
        <stackLayout padding={16}>
          <TrainingSessionCreateCard
            title="STEP 1"
            subtitle="CREATE SESSION"
            img="~/images/document_icon_drk.png"
          >
            <TrainingSessionCreateCardPoint>
              <>
                <label textWrap text={"Click "} />
                <label style={{
                  fontWeight: 'bold',
                  fontStyle: 'italic'
                }} text="Create/Manage Session " textWrap />
                <label textWrap text={"below to add a session."} />
              </>
            </TrainingSessionCreateCardPoint>
            <TrainingSessionCreateCardPoint>
              <label textWrap marginBottom={16}>
                Select your session from the drop down list below.
              </label>
            </TrainingSessionCreateCardPoint>
            <TextEditField extensions={["image/*", "video/*"]} plain isDark type="upload" value={""} labelFor={"Upload File"} onChange={(args: ISupotsu.IFile) => {
              setState({
                image: args
              })
            }} />
            <TextEditField type="text" value={session.name || "Session name"} error={error.name?.error} errorLabel={error.name?.msg} onChange={(text) => {
              const val = text as string;
              setState({
                session: {
                  ...session,
                  name: val
                },
                error: {
                  ...error,
                  name: {
                    msg: val.length < 3 ? 'Invalid session name' : '',
                    error: val.length < 3 ? true : false
                  }
                }
              })
            }} />
            <TextEditField type="textArea" value={session.description || "Session description"} error={error.description?.error} errorLabel={error.description?.msg} onChange={(text) => {
              const val = text as string;
              setState({
                session: {
                  ...session,
                  description: val
                },
                error: {
                  ...error,
                  description: {
                    msg: val.length < 5 ? 'Invalid session description' : '',
                    error: val.length < 5 ? true : false
                  }
                }
              })
            }} />
          </TrainingSessionCreateCard>

          <TrainingSessionCreateCard
            title="STEP 2"
            subtitle="ADD MATERIAL"
            img="~/images/add_photo_icon_drk.png"
          >
            <TrainingSessionCreateCardPoint>
              <>
                <label textWrap text={"Select the training material type below for your session. Then select the video/image/document by clicking the "} />
                <label style={{
                  fontWeight: 'bold',
                  fontStyle: 'italic'
                }} text="+Add " textWrap />
                <label textWrap text={"buttons."} />
              </>
            </TrainingSessionCreateCardPoint>
            <SaveButton text="Add material" isDark />
          </TrainingSessionCreateCard>

          <TrainingSessionCreateCard
            title="STEP 3"
            subtitle="SHARE SESSION"
            img="~/images/document_icon_drk.png"
            icon="md-share-alt"
          >
            <TrainingSessionCreateCardPoint>
              <>
                <label textWrap text={"Share your training session with friends, team mates or teams."} />
              </>
            </TrainingSessionCreateCardPoint>
            <SaveButton text="Share" isDark />
          </TrainingSessionCreateCard>

          <TrainingSessionCreateCard
            title="STEP 4"
            subtitle="COMPLETE SESSION"
            img="~/images/document_icon_drk.png"
            icon="md-checkmark-circle"
          >
            <SaveButton text="Save session" isDark isLoading={isLoading} onTap={() => save()} />
          </TrainingSessionCreateCard>
        </stackLayout>
      </scrollView>
      <flexboxLayout flexDirection="row" alignItems="center" justifyContent="center" visibility={!isLoading ? 'collapse' : 'visible'} row={1}>
        <FullScreenLoader text={message || "Please wait... Saving Sesssion"} />
      </flexboxLayout>
    </gridLayout>
  )
}

interface TrainingSessionCreateCard {
  title: string,
  subtitle: string,
  img?: string
  icon?: string
  children?: React.ReactNode
}

const TrainingSessionCreateCard = ({
  title,
  subtitle,
  img,
  icon = "md-add-circle",
  children
}: TrainingSessionCreateCard) => {
  return (
    <stackLayout style={{
      background: Theme2[500],
      marginBottom: 16,
      // borderRadius: 8,
      padding: 16
    }}>
      <gridLayout columns="auto, 8, *">
        <absoluteLayout paddingTop={8} marginBottom={16}>
          <flexboxLayout style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <image width={35} height={35} src={img} />
          </flexboxLayout>
          <label top={0} padding={0} className="Ionicons size14" color="#fff" text={IconSet.Ionicons[icon]} fontWeight="900" />
        </absoluteLayout>
        <label col={2} text={title} style={{
          fontSize: 35,
          color: '#fff',
        }} />
      </gridLayout>
      {subtitle && (
        <label text={subtitle} style={{
          fontSize: 18,
          color: '#fff',
          marginBottom: 16
        }} />
      )}
      {children}
    </stackLayout>
  )
}

const TrainingSessionCreateCardPoint = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <gridLayout columns="auto, 8, *">
      <label paddingTop="4" className="Octicons size18" color="#fff" col={0} text={IconSet.Octicons["primitive-dot"]} />
      <wrapLayout col={2} color="#fff">
        {children}
      </wrapLayout>
    </gridLayout>
  )
}

type MaterialType = "File" | "Document"

const MaterialTypes: MaterialType[] = ['File', 'Document']

const checkLinkSource = (val): { from?: string, link?: string } => {
  var obj = {
    from: "",
    like: ""
  };

  if ((val.indexOf('youtube') != -1)) {
    obj = {
      from: "YouTube",
      like: "https://youtube.com/watch?v=wvZ6nB3cl1w"
    };
  } else if ((val.indexOf('vimeo') != -1)) {
    obj = {
      from: "Vimeo",
      like: "https://vimeo.com/212692070"
    };
  } else if ((val.indexOf('dailymotion') != -1)) {
    obj = {
      from: "Dailymotion",
      like: "http://www.dailymotion.com/video/xwr14q"
    };
  } else if ((val.indexOf('vine') != -1)) {
    obj = {
      from: "Vine",
      like: "https://vine.co/v/Ml16lZVTTxe"
    };
  } else {
    obj = {
      from: "",
      like: ""
    };
  }

  return obj;
}

export const TrainingMaterialCreate = () => {
  const router = useNavigation()
  const route = useRoute()
  const { sessions = [] } = route.params as Record<string, any>
  const [active, setActive] = useState<MaterialType>('File')
  const [isDeleting, setIsDeleting] = useState(false);
  const [state, updateState] = useState<Record<string, any>>({
    file: {
      title: '',
      id: null,
      user: Methods.you(),
      commentType: "file",
      description: "",
      link: "",
      sport: { id: null, name: "" },
      sportToSee: [],
      teamToSee: [],
      friendsToSee: [],
      tags: [],
      type: "file",
      isFile: true,
      comments: [],
      likes: [],
      isReadable: !false,
      shares: [],
      file: { id: null, name: "" },
      sessison: { id: null, name: "" }
    },
    isLoading: false,
    filters: [],
    error: {
      title: {
        msg: '',
        error: false
      },
      url: {
        msg: '',
        error: false
      },
      description: {
        msg: '',
        error: false
      },
      file: {
        msg: '',
        error: false
      },
      sport: {
        msg: '',
        error: false
      },
      tag: {
        msg: '',
        error: false
      },
      session: {
        msg: '',
        error: false
      },
      sportToSee: {
        msg: '',
        error: false
      },
      teamToSee: {
        msg: '',
        error: false
      },
      friendsToSee: {
        msg: '',
        error: false
      }
    }
  })

  const _sports: ISupotsu.Sport[] = JSON.parse(AppSettings.getString('sports', '[]'));

  const setState = (newState: Partial<Record<string, any>>) => {
    updateState({
      ...state,
      ...newState
    })
  }

  const { file, error, filters, isLoading } = state

  const onUrlFieldChange = (val: string) => {
    setState({
      file: {
        ...file,
        url: val,
        link: val,
        isFile: false
      },
      error: {
        ...error,
        url: {
          error: !Methods.isWebsite(val) ? true : false,
          msg: val.length < 4 ? 'Invalid video link' : '',
        }
      },
      source: checkLinkSource(val),
    });
  }

  const removeFile = (_id) => {
    const dataTo = {
      _id,
      user: {
        _id: Methods.you()._id,
        type: Methods.you().type
      },
      img: file.file,
      tags: []
    };

    Methods.post(`https://supotsu.com/api/file/remove`, dataTo, {
      headers: {
        'Content-Type': 'application/json'
      },
      success() {
        setIsDeleting(false)
        setState({
          file: {
            ...file,
            file: { id: null, name: "" }
          }
        });
      },
      error() {
        alert("File not deleletd")
        setIsDeleting(false)
      }
    })
  }

  const save = () => {
    if (String(file.title).length < 3) {
      setState({
        error: {
          ...error,
          title: {
            error: true,
            msg: 'Invalid title',
          }
        }
      })
      return;
    }

    if (!file.sport._id) {
      setState({
        error: {
          ...error,
          sport: {
            msg: 'Please select a sport for this material',
            error: true
          }
        }
      })

      return;
    }

    if (String(file.description).length < 3) {
      setState({
        error: {
          ...error,
          description: {
            error: true,
            msg: 'Invalid description',
          }
        }
      })
      return;
    }

    if (!file.session || !file.session._id) {
      setState({
        error: {
          ...error,
          session: {
            msg: 'Please select a session for this material',
            error: true
          }
        }
      })

      return;
    }

    setState({
      isLoading: true
    })

    Methods.post(`https://supotsu.com/api/session/create-file`, file, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(e) {
        setState({ isLoading: false, e });
        console.log(e);
        router.goBack();
      },
      error(e) {
        setState({ isLoading: false, e });
        console.log(e);
        alert("Error: " + e.message)
      }
    })

    if (!file.isFile && !file.link) {
      alert("Please enter file link or select file to upload");
      return;
    }

    if (file.isFile && !file.file._id) {
      alert("Please enter file link or select file to upload");
      return;
    }
  }

  const filters_ = TMFilters['Rugby']
  const chunkedFilters = Methods.arrayChunks(filters_, 2);

  return (
    <gridLayout rows={'auto, auto, *'} background={'#fff'}>
      <CommonHeader titleOnly user={{
        name: 'Add Training Material'
      }} goBack={() => {
        if (isLoading) {
          alert("Can't navigate back, please wait...")
          return;
        }
        router.goBack()
      }} />
      {!isLoading && (
        <gridLayout row={1} marginBottom={16} columns="*,*">
          {MaterialTypes.map((item, i) => {
            return (
              <PhotoSementItem key={item} onSelect={() => {
                setActive(item)
              }} active={Boolean(active === item)} col={i} item={item} />
            )
          })}
        </gridLayout>
      )}
      <scrollView row={2} visibility={isLoading ? "hidden" : "visible"}>
        <stackLayout padding={16}>
          <TextEditField type="text" error={error['title']['error']} errorLabel={error['title']['msg']} value={file.title ? file.title : "File Name"} labelFor={"Title"} onChange={(args: string) => {
            setState({
              file: {
                ...file,
                title: args
              },
              error: {
                ...error,
                title: {
                  error: args.length < 4 ? true : false,
                  msg: args.length < 4 ? 'Invalid title' : '',
                }
              }
            })
          }} />
          {!file.file._id && (
            <>
              {active === "File" && (
                <TextEditField type="text" value={"Video/Image URL"} error={error['url']['error']} errorLabel={error['url']['msg']} labelFor={"File URL"} onChange={(args: string) => {
                  onUrlFieldChange(args)
                }} />
              )}
              <TextEditField key={active} extensions={active === "File" ? ["image/*", "video/*"] : ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"]} plain type="upload" value={""} labelFor={active === "File" ? "Or Upload File" : "Upload File"} onChange={(args: ISupotsu.IFile) => {
                setState({
                  file: {
                    ...file,
                    file: args,
                    isFile: true
                  }
                })
              }} />
            </>
          )}
          {file.file._id && (
            <gridLayout columns="*, 50" background={Theme2[500]} style={{
              borderColor: Theme2[500],
              borderWidth: 1,
              height: 50,
              marginBottom: 8,
            }}>
              <label verticalAlignment="middle" horizontalAlignment="center" color="#fff" col={0}>{(file.file as ISupotsu.IFile).name}</label>
              <flexboxLayout background="#fff" height={50} col={1} alignItems="center" justifyContent="center">
                {isDeleting && (
                  <activityIndicator busy color={Theme2[500]} width={20} height={20} />
                )}
                {!isDeleting && (
                  <label verticalAlignment="middle" horizontalAlignment="center" className={"MaterialIcons size24"} color={Theme2[500]} onTap={() => {
                    setIsDeleting(true)
                    removeFile(file.file._id)
                  }} col={1}>{IconSet.MaterialIcons.close}</label>
                )}
              </flexboxLayout>
            </gridLayout>
          )}
          <TextEditField type="select" selectOptions={_sports} simple value={file.sport && file.sport.name ? file.sport.name : "Select Sport"} labelFor={"Sport"} onChange={(sport: ISupotsu.Sport) => {
            setState({
              file: {
                ...file,
                sport,
              },
              error: {
                ...error,
                sport: {
                  msg: sport._id ? '' : 'Please select a sport for this material',
                  error: sport._id ? false : true
                }
              }
            })
          }} />

          <TextEditField type="textArea" error={error['description']['error']} errorLabel={error['description']['msg']} onChange={(args: string) => {
            setState({
              file: {
                ...file,
                description: args
              },
              error: {
                ...error,
                description: {
                  error: args.length < 10 ? true : false,
                  msg: args.length < 4 ? 'Invalid description' : '',
                }
              }
            })
          }} value={file.description ? file.description : "File Description"} labelFor={"Description"} />

          <TextEditField toggle type="custom" value={""} labelFor={"Categories"}>
            <stackLayout padding={16}>
              {chunkedFilters.map((filterArr, index) => {
                return (
                  <gridLayout key={String(index)} columns="*, *">
                    {filterArr[0] && <FilterSelect onUpdate={(newFilters) => {
                      setState({
                        filters: newFilters
                      })
                    }} filters={filters} item={filterArr[0]} col={0} />}
                    {filterArr[1] && <FilterSelect onUpdate={(newFilters) => {
                      setState({
                        filters: newFilters
                      })
                    }} filters={filters} item={filterArr[1]} col={1} />}
                  </gridLayout>
                )
              })}
            </stackLayout>
          </TextEditField>

          <TextEditField type="select" error={error['session']['error']} errorLabel={error['session']['msg']} selectOptions={sessions} simple value={file && file.session ? file.session.title : "Select Session"} labelFor={"Training Session"} onChange={(item: ISupotsu.Session) => {
            console.log(item)
            setState({
              file: {
                ...file,
                session: item
              },
              error: {
                ...error,
                session: {
                  msg: item._id ? '' : 'Please select a session for this material',
                  error: item._id ? false : true
                }
              }
            })
          }} />

          <SaveButton onTap={save} text={'Save File'} />
        </stackLayout>
      </scrollView>
      <flexboxLayout flexDirection="column" alignItems={"center"} justifyContent="center" row={2} visibility={!isLoading ? "hidden" : "visible"}>
        <activityIndicator busy color={Theme2[500]} />
        <label textWrap>Creating session material, please wait...</label>
      </flexboxLayout>
    </gridLayout>
  )
}

interface FilterSelectProp {
  item: TMFilter,
  col: number,
  filters: string[],
  onUpdate(filters: string[]): void
}

const FilterSelect = ({
  item,
  col,
  filters,
  onUpdate
}: FilterSelectProp) => {
  const [isSelected, setIsSelected] = useState(false)
  const _array = filters.filter((_filter) => {
    return _filter === item.name;
  });
  const _isSet = _array.length > 0 ? true : false;

  const tagSearch = `${item.name}^`;

  const _selection = filters.filter((__item) => {
    const _index = Methods.nullify(__item).toLowerCase().indexOf(tagSearch.toLowerCase()) > -1;
    return _index;
  });

  return (
    <stackLayout col={col}>
      <gridLayout onTap={() => {
        setIsSelected(!isSelected)
        if (!item.value) {
          if (_isSet) {
            const _filters = filters.filter((_filter) => _filter !== item.name);
            onUpdate(_filters)
          } else {
            filters.push(item.name);
            onUpdate(filters)
          }
        }
      }} padding={4} columns="auto, *, auto">
        {!item.value && (
          <label col={0} verticalAlignment="middle" color={Theme2[500]} className="AntDesign size20">{IconSet.AntDesign[_isSet ? 'checksquare' : 'checksquareo']}</label>
        )}
        {item.value && (
          <label col={0} verticalAlignment="middle" color={Theme2[500]} className="MaterialIcons size20">{IconSet.MaterialIcons['keyboard-arrow-down']}</label>
        )}
        <label col={1} marginLeft={4}>{item.name}</label>
        {item.value && _selection.length > 0 && (
          <stackLayout col={2}>
            <flexboxLayout background={Theme2[500]} borderRadius={8} alignItems="center" justifyContent="center" padding="4 8">
              <label fontSize={10} color="#fff">{_selection.length}</label>
            </flexboxLayout>
          </stackLayout>
        )}
      </gridLayout>
      {(item.value && isSelected && (
        <stackLayout paddingLeft={16}>
          {Methods.listify(item.value).map((value) => {
            const _stringFor = `${item.name}^${value}`;

            const __array = filters.filter((_fil) => {
              return _fil === _stringFor;
            });

            const __isSet = __array.length > 0 ? true : false;
            return (
              <gridLayout key={value} onTap={() => {
                if (__isSet) {
                  const _filters = filters.filter((_filter) => _filter !== _stringFor);
                  onUpdate(_filters)
                } else {
                  filters.push(_stringFor);
                  onUpdate(filters)
                }
              }} padding={4} columns="auto, *">
                <label col={0} verticalAlignment="middle" color={Theme2[500]} className="AntDesign size20">{IconSet.AntDesign[__isSet ? 'checksquare' : 'checksquareo']}</label>
                <label col={1} marginLeft={4}>{value}</label>
              </gridLayout>
            )
          })}
        </stackLayout>
      ))}
    </stackLayout>
  )
}

interface TMFilter {
  name: string,
  value?: string[] | number[]
}
const TMFilters: Record<string, TMFilter[]> = {
  "Soccer": [],
  "Rugby": [
    { name: "Attack" },
    { name: "Conditioning" },
    { name: "Defence" },
    { name: "Passing" },
    { name: "Ruck" },
    {
      name: "Difficulty",
      value: [
        "Advanced",
        "Intermediate",
        "Beginner"
      ]
    },
    {
      name: "Player",
      value: [
        "All",
        "Forwards",
        "Backs"
      ]
    },
    {
      name: "Location",
      value: [
        "Gym",
        "Field"
      ]
    },
    {
      name: "Intensity rating",
      value: [
        "Intensity 1",
        "Intensity 2",
        "Intensity 3",
        "Intensity 4",
        "Intensity 5"
      ]
    },
    {
      name: "Size",
      value: [
        "Individual",
        "Small group",
        "Large group"
      ]
    },
    {
      name: "Position",
      value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    }
  ],
  "Cricket": []
}

type TMNoticeType = "Sessions" | "Material" | 'Suggested'
const TMNoticeTypes: TMNoticeType[] = [
  'Sessions',
  'Material',
  'Suggested'
]

const getNoticationItems = ({
  key,
  newMaterial,
  suggestions,
  typeFilter
}: {
  key: TMNoticeType,
  newMaterial: ISupotsu.NewMaterial[],
  suggestions: any[],
  typeFilter: "All" | "Documents" | "Videos" | "Images"
}): ISupotsu.NewMaterial[] => {
  const _active = key;
  if (_active === "Sessions") {
    const list: ISupotsu.NewMaterial[] = Methods.listify(newMaterial).filter((item) => {
      return item.type === "session";
    });

    return list;
  } else if (_active === "Material") {
    const list: ISupotsu.NewMaterial[] = Methods.listify(newMaterial).filter((item) => {
      return item.type === "material";
    });

    const _files = list.filter((item, i) => {
      if (typeFilter !== "All" && typeFilter === "Documents") {
        return item.content.type === "document";
      } else if (typeFilter !== "All" && typeFilter === "Images") {
        return item.content.type === "image";
      } else if (typeFilter !== "All" && typeFilter === "Videos") {
        return item.content.type === "video";
      } else {
        return true;
      }
    });

    return _files;
  } else {
    const list = Methods.listify(suggestions).filter((item) => {
      return item.type === "material";
    });

    const _files = list.filter((item, i) => {
      if (typeFilter !== "All" && typeFilter === "Documents") {
        return item.content.type === "document";
      } else if (typeFilter !== "All" && typeFilter === "Images") {
        return item.content.type === "image";
      } else if (typeFilter !== "All" && typeFilter === "Videos") {
        return item.content.type === "video";
      } else {
        return true;
      }
    });

    return _files;
  }
}

export const TrainingNotifications = () => {
  const router = useNavigation()
  const route = useRoute();
  const newMaterial: ISupotsu.NewMaterial[] = (route.params as Record<string, any>).newMaterial || []
  const [active, setActive] = useState<TMNoticeType>('Sessions')
  const [state, updateState] = useState<Record<string, any>>({})

  const items = getNoticationItems({
    key: active,
    newMaterial,
    suggestions: [],
    typeFilter: "All"
  })

  const _sports: ISupotsu.Sport[] = JSON.parse(AppSettings.getString('sports', '[]'));

  const setState = (newState: Partial<Record<string, any>>) => {
    updateState({
      ...state,
      ...newState
    })
  }

  return (
    <gridLayout rows={'auto, auto, *'} background={'#fff'}>
      <CommonHeader titleOnly user={{
        name: 'Notifications'
      }} goBack={() => {
        router.goBack()
      }} />
      <gridLayout row={1} marginBottom={16} columns="*,*,*">
        {TMNoticeTypes.map((item, i) => {
          const count = getNoticationItems({
            key: item,
            newMaterial,
            suggestions: [],
            typeFilter: "All"
          }).length;
          return (
            <PhotoSementItem key={item} onSelect={() => {
              setActive(item)
            }} active={Boolean(active === item)} count={count} col={i} item={item} />
          )
        })}
      </gridLayout>

      {items.length < 1 && (
        <flexboxLayout row={2} style={{
          width: '100%',
          padding: 20,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Empty text={`No ${active} Content Found!`} />
        </flexboxLayout>
      )}

      <$ListView
        row={2}
        visibility={active === "Sessions" && items.length > 0 ? "visible" : "hidden"}
        items={items}
        separatorColor={'#fff'}
        onItemTap={() => {

        }}
        cellFactory={(item) => {
          const index = items.findIndex(_item => _item.content._id === item.content._id)
          const isOdd = index % 2 == 0 ? true : false
          return <TrainingNotificationItem item={item} isOdd={isOdd} />
        }}
      />

      <$ListView
        row={2}
        visibility={active === "Material" && items.length > 0 ? "visible" : "hidden"}
        items={items}
        separatorColor={'#fff'}
        onItemTap={() => {

        }}
        cellFactory={(item) => {
          const index = items.findIndex(_item => _item.content._id === item.content._id)
          const isOdd = index % 2 == 0 ? true : false
          return <TrainingNotificationItem item={item} isOdd={isOdd} />
        }}
      />

      <$ListView
        row={2}
        visibility={active === "Suggested" && items.length > 0 ? "visible" : "hidden"}
        items={items}
        separatorColor={'#fff'}
        onItemTap={() => {

        }}
        cellFactory={(item) => {
          const index = items.findIndex(_item => _item.content._id === item.content._id)
          const isOdd = index % 2 == 0 ? true : false
          return <TrainingNotificationItem item={item} isOdd={isOdd} />
        }}
      />
    </gridLayout>
  )
}

interface TrainingNotificationItemProps {
  item: ISupotsu.NewMaterial;
  isOdd: boolean;
}
const TrainingNotificationItem = ({ item, isOdd }: TrainingNotificationItemProps) => {
  const [isEdit, setIsEdit] = useState(false)
  const [added] = useState(false)
  if (added) return null;
  const name = String(item.from.name).split(' ')[0];
  return (
    <stackLayout padding={16}>
      <stackLayout background={!isOdd ? '#ffff' : '#EFEFEF'} borderBottomColor="#999" borderBottomWidth={isEdit ? 1 : 0}>
        <gridLayout columns="45, 8, *, 8, auto" padding={16}>
          <flexboxLayout col={0} style={{
            height: 45,
            width: 45,
          }}>
            <image
              src={item.from.image}
              height={45}
              width={45}
              borderRadius={45 / 2}
              stretch="aspectFill"
            />
          </flexboxLayout>
          <stackLayout col={2} padding={0}>
            {
              // @ts-ignore
            }
            <wrapLayout padding={0}>
              <label text={name} style={{
                // @ts-ignore
                fontWeight: 'bold',
              }} paddingTop={0} paddingBottom={0} />
              {
                // @ts-ignore
              }
              <label paddingTop={0} paddingBottom={0} text={'added ' + (item.type === 'session' ? 'a' : item.content.type === 'image' ? 'an' : 'a')} />
              <label paddingTop={0} paddingBottom={0} text={item.type === "session" ? "training session" : item.content.type} />
              <label paddingTop={0} paddingBottom={0} text={": " + item.type === "session" ? (item.content as ISupotsu.Session).name : (item.content as ISupotsu.SessionFile).title} />
            </wrapLayout>
          </stackLayout>
          <flexboxLayout col={4}>
            <TrainingButton onTap={() => setIsEdit(!isEdit)} icon="add" size={36} />
          </flexboxLayout>
        </gridLayout>
        {isEdit && (
          <stackLayout>
            <TextEditField plain={isOdd} type="text" labelFor="Rename" value={item.content} />
            <SaveButton text="ADD" isDark />
          </stackLayout>
        )}
      </stackLayout>
    </stackLayout>
  )
}

interface SaveButtonProps {
  backgroundColor?: string;
  color?: string;
  text: string
  isDark?: boolean
  onTap?(): void,
  isLoading?: boolean,
  style?: RNSStyle,
  col?: number,
  row?: number,
  isClear?: boolean,
  ref?: React.MutableRefObject<any>
}

export const SaveButton = ({
  text,
  isDark,
  isLoading,
  onTap,
  style,
  col,
  row,
  isClear,
  ref,
  backgroundColor,
  color
}: SaveButtonProps) => {
  const bgColor = backgroundColor ? backgroundColor : (isDark ? Theme['500'] : Theme2['500'])
  const txtColor = color ?? '#fff'
  return (
    <flexboxLayout onTouch={onTouch} style={{
      background: isClear ? '#fff' : bgColor,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }} onTap={() => {
      if (isLoading) return;
      if (onTap) onTap();
    }} {...col ? { col }: {}}  {...row ? { row }: {}} {...ref ? { ref } : {}}>
      {!isLoading && (
        <label text={text} textAlignment={'center'} verticalAlignment={'middle'} color={isClear ? Theme['500'] : txtColor} fontSize={16} />
      )}
      {isLoading && (
        <activityIndicator busy color={isClear ? Theme['500'] : txtColor} width={16} height={16} />
      )}
    </flexboxLayout>
  )
}
