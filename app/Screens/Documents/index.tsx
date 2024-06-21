import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useStyledContext } from '~/contexts/StyledContext';
import Methods from '~/Methods';
import { CommonHeader, LoadingState, Empty } from '~/ui/common.ui';
import Modal from '~/ui/Modal';
import { UnionUser } from '~/utils/types';
import { SaveButton, TrainingButton } from '../Training';
import { useNavigation, useRoute } from '@react-navigation/core';
import { TextEditField } from '../Events';
import * as ISupotsu from '~/DB/interfaces';
import * as AppSettings from 'tns-core-modules/application-settings';
import { AppAuthContext } from '~/components/Root';
import { FileUploaderProvider, useFileUploads } from '~/services/File.uploads';
import { client } from '~/app';
import { CREATE_DOC, GET_DOCS } from '~/services/graphql/dashboard';
import { getTeams } from '~/utils';
import { READ_DOC } from '../../services/graphql/dashboard';

const CATEGORIES = ["General", "Invoice", "News Letter", "Statements", "Announcements", "Schedules"];

interface DocumentsViewProps {
  user: UnionUser;
  isShown?: boolean;
  row?: number;
  sportFilter?: boolean;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  user,
  children,
  isShown,
  row,
  sportFilter
}) => {
  const {
    fonts,
    theme,
    onTouch
  } = useStyledContext();
  const navigator = useNavigation();
  const [isShownFilter, showFilter] = React.useState(false)
  const [filter, setFilter] = React.useState("")
  const [tags, setTags] = React.useState<string[]>([])
  const { data, loading } = useQuery(GET_DOCS, {
    variables: {
      _id: user._id,
      type: user.type
    },
    pollInterval: 10000
  });
  const documents = React.useMemo(() => {
    if (data && data.documents) {
      return (data.documents as ISupotsu.Document[]).filter((item) => {
        return item.title.toLowerCase().indexOf(filter.toLowerCase()) > -1 || tags.includes(item.tags[0]);
      })
    };
    return [];
  }, [data, filter, tags])
  const hasData = documents.length > 0;
  return (
    <gridLayout rows="auto, *"  {...row ? { row } : {}} visibility={isShown ? 'visible' : 'collapse'} background="#fff">
      <stackLayout row={0}>
        <gridLayout marginBottom={isShownFilter ? 8 : 0} background="#fff" padding="8 16" columns={'auto, *, auto'}>
          <TrainingButton col={0} labelFor={'Add Document'} onTap={() => {
            navigator.navigate(AddDocument.routeName, {
              user
            });
          }} icon={'add'} />
          <TrainingButton col={2} onTap={() => {
            showFilter((bool) => !bool)
          }} icon={'search'} />
        </gridLayout>
        <scrollView marginBottom={isShownFilter ? 8 : 0} scrollBarIndicatorVisible={false} visibility={isShownFilter ? "visible" : "collapse"} orientation="horizontal">
          <stackLayout padding="0 16" orientation="horizontal">
            {CATEGORIES.map((item) => {
              const isSelected = tags.includes(item)
              return (
                <flexboxLayout key={item} style={{
                  background: isSelected ? theme.primary[500] : "#eee",
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  color: isSelected ? '#fff' : '#000',
                  margin: 4,
                  marginLeft: 0,
                  borderRadius: 8,
                }} onTap={() => {
                  setTags(isSelected ? tags.filter((t) => t !== item) : [...tags, item]);
                }}>
                  <label text={item} />
                </flexboxLayout>
              )
            })}
          </stackLayout>
        </scrollView>
        <gridLayout columns="auto, *, auto" style={{
          background: '#eee',
          margin: 8,
          borderRadius: 10,
          padding: '8 0'
        }}>
          <label verticalAlignment="middle" horizontalAlignment="center" className="MaterialIcons size20" col={0} style={{
            margin: "0 8"
          }}>{fonts.MaterialIcons.search}</label>
          <textField onTextChange={(args) => {
            const {value} = args;
            setFilter(value);
          }} col={1} hint="Search" style={{
            padding: '4 0',
            background: '#eee',
          }} />
          <stackLayout col={2} style={{
            margin: "0 8"
          }} />
        </gridLayout>
      </stackLayout>
      <scrollView visibility={!loading && hasData ? "visible" : "collapse"} row={1}>
        <stackLayout>
          {documents.map((item) => {
            const isNew = item.read === 'no'
            return (
              <gridLayout key={item._id} onTouch={onTouch} onTap={() => {
                navigator.navigate(DocumentDetails.routeName, {
                  doc: item
                })
              }} columns="auto, *, auto, auto" padding={16} background="#fff" borderBottomColor="#ddd" borderBottomWidth={0.5}>
                <flexboxLayout col={0} style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                }}>
                  <stackLayout style={{
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                    background: isNew ? theme.secondary[500] : '#ddd',
                  }} />
                </flexboxLayout>
                <stackLayout col={1}>
                  <label style={{
                    fontWeight: isNew ? 'bold' : 'normal',
                    color: !isNew ? '#888' : '#000'
                  }}>{item.title}</label>
                  <label textWrap={false} style={{
                    color: !isNew ? '#888' : '#000'
                  }}>{item.description.trim()}</label>
                </stackLayout>
                <label col={2} verticalAlignment="middle" horizontalAlignment="center" style={{
                  fontSize: 12,
                  color: '#999',
                }}>{Methods.moment(parseInt(item.date)).calendar()}</label>
                <flexboxLayout style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                }} col={3}>
                  <label className="MaterialIcons size35">{fonts.MaterialIcons['keyboard-arrow-right']}</label>
                </flexboxLayout>
              </gridLayout>
            )
          })}
        </stackLayout>
      </scrollView>
      <flexboxLayout justifyContent="center" alignItems="center" visibility={loading ? "visible" : "collapse"} row={1}>
        <LoadingState />
      </flexboxLayout>
      <flexboxLayout justifyContent="center" alignItems="center" visibility={!loading && !hasData ? "visible" : "collapse"} row={1}>
        <Empty />
      </flexboxLayout>
    </gridLayout>
  )
}

export const DocumentDetails = () => {
  const navigator = useNavigation();
  const route = useRoute();
  const { doc } = (route.params || {}) as { doc: ISupotsu.Document };

  const [item, setItem] = React.useState(() => doc);

  React.useEffect(() => {
    client.mutate({
      mutation: READ_DOC,
      variables: {
        _id: doc._id
      }
    }).then(({data}) => {
      console.log(data)
    }).catch((e) => {
      console.log(e)
    })
  }, [])

  return (
    <gridLayout background="#fff" rows="auto, *, auto">
      <CommonHeader user={{
        name: item.title
      }} goBack={() => {
        navigator.goBack();
      }} />
      <scrollView row={1}>
        <stackLayout padding={16}>
          <TextEditField type="text" disabled value={item.title} labelFor="Title:" />
          <TextEditField type="textArea" disabled value={item.description} labelFor="Description:" />
          <SaveButton text="View File" />
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

DocumentDetails.routeName = "documentDetails";

interface AddDocumentState {
  title?: string;
  desc?: string;
  sport?: ISupotsu.Sport;
  teams?: ISupotsu.Team[];
  tags?: string[];
  file?: ISupotsu.IFile;
}

interface AddDocumentError {
  title?: boolean;
  desc?: boolean;
  sport?: boolean;
  teams?: boolean;
  tags?: boolean;
}

export const AddDocument = () => {
  const navigator = useNavigation();
  const route = useRoute();
  const { user } = (route.params || {}) as { user: UnionUser }
  return (
    <gridLayout background="#fff" rows="auto, *, auto">
      <CommonHeader user={{
        name: "Add Document"
      }} goBack={() => {
        navigator.goBack();
      }} />
      <FileUploaderProvider _id="NEW_DOC">
        <AddDocumentForm user={user} />
      </FileUploaderProvider>
    </gridLayout>
  )
}

const AddDocumentForm = ({ user: userFor } : {
  user: UnionUser
}) => {
  const {
    cancelUpload,
    files,
    pickAFile,
    isRawFile
  } = useFileUploads();
  const {
    theme,
    fonts
  } = useStyledContext();
  const {
    user
  } = React.useContext(AppAuthContext);
  const navigator = useNavigation();
  const [filter, setFilter] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [state, updateState] = React.useState<AddDocumentState>({
    title: "",
    desc: "",
    tags: [],
    teams: [],
    sport: null
  });
  const [errors, updateErrors] = React.useState<AddDocumentError>({});
  const setState = (newState: Partial<AddDocumentState>, newErrors: Partial<AddDocumentError>) => {
    updateState({
      ...state,
      ...newState,
    })

    updateErrors({
      ...errors,
      ...newErrors,
    })
  }

  const sports = React.useMemo(() => {
    const _sports: ISupotsu.Sport[] = JSON.parse(AppSettings.getString('sports', '[]'));
    return _sports.filter((item) => item.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
  }, [filter])

  const hasErrors = Object.keys(errors).some(item => item);

  const save = () => {
    const {desc, sport, tags, teams, title, file} = state;
    if (!file) {
      alert("Please upload a file for this document")
      return;
    }

    if (title.length < 3) {
      setState({}, { title: true})
      alert("Please make sure your document has a valid title")
      return;
    }

    if (desc.length < 3) {
      setState({}, { desc: true})
      alert("Please make sure your document has a valid description")
      return;
    }

    if (!sport) {
      setState({}, { sport: true})
      alert("Please make sure your document has a valid sport")
      return;
    }

    if (tags.length < 1) {
      setState({}, { tags: true})
      alert("Please make sure your document has 1 or more categories")
      return;
    }

    if (teams.length < 1) {
      setState({}, { tags: true})
      alert("Please make sure your document has 1 or more teams")
      return;
    }

    console.log('Saving file')

    const doc = {
      title,
      desc,
      userId: userFor._id,
      userType: userFor.type,
      sport: sport._id,
      tags,
      teams: teams.map(t => t._id)
    };
    setIsUploading(true)
    client.mutate({
      mutation: CREATE_DOC,
      variables: {
        doc
      }
    }).then(({data}) => {
      alert('Document was created!')
      navigator.goBack();
      setIsUploading(false)
    }).catch((e) => {
      console.log(e)
      alert('Error occurred while creating your document!')
      setIsUploading(false)
    })
  };

  React.useEffect(() => {
    const fileKeys = Object.keys(files);
    if (fileKeys.length > 0) {
      const firstFile = files[fileKeys[0]];
      setState({
        // @ts-ignore
        file: firstFile.file
      }, {});
      setIsUploading(firstFile.isUploading);
    }
  }, [files]);

  return (
    <>
      <scrollView row={1} scrollBarIndicatorVisible={false}>
        <stackLayout padding={16}>
          <gridLayout visibility={state.file ? 'visible' : 'collapse'} style={{
            background: '#eee',
            padding: 8,
            borderRadius: 8,
            marginBottom: 8,
          }} columns="*, auto">
            <textField col={0} style={{
              fontSize: 12,
              padding: 0,
            }} text={state.file ? state.file.name : ''} editable={false} />
          </gridLayout>
          <SaveButton isLoading={isUploading} style={{
            marginBottom: 16
          }} text={state.file ? "Change file" : "Select file to upload"} onTap={() => pickAFile(true)} />
          <TextEditField type="text" onChange={(text) => {
            setState({
              title: (text as string)
            }, {
              title: (text as string).length < 3
            });
          }} error={errors.title} errorLabel="Invalid document title" value={state.title} labelFor="Title" />
          <TextEditField type="textArea" onChange={(text) => {
            setState({
              desc: (text as string)
            }, {
              desc: (text as string).length < 3
            });
          }} error={errors.desc} errorLabel="Invalid document description" value={state.desc} labelFor="Description" />
          <TextEditField noCustomWrapper type="custom" labelFor="Sport" error={errors.sport} errorLabel="Please select one sport...">
            <stackLayout>
              <gridLayout style={{
                background: '#eee',
                padding: 8,
                borderRadius: 8,
                marginBottom: 8,
              }} columns="*, auto">
                <textField col={0} hint="Search sport" style={{
                  fontSize: 12,
                  padding: 0,
                }} text={filter} onTextChange={(args) => {
                  const { value } = args;
                  setFilter(value);
                }} />
                <label onTap={() => setFilter("")} verticalAlignment="middle" col={1} className="MaterialIcons size14" text={fonts.MaterialIcons.close} />
              </gridLayout>
              <scrollView orientation="horizontal" scrollBarIndicatorVisible={false}>
                <stackLayout orientation="horizontal">
                  {sports.map((item, index) => {
                    const isSelected = state.sport && state.sport._id === item._id;
                    return (
                      <flexboxLayout key={index} style={{
                        background: isSelected ? theme.primary[500] : "#eee",
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 8,
                        color: isSelected ? '#fff' : '#000',
                        margin: 4,
                        marginLeft: 0,
                        borderRadius: 8,
                      }} onTap={() => {
                        setState({
                          sport: item
                        }, {
                          sport: false
                        });
                        setFilter("");
                      }}>
                        <label text={item.name} />
                      </flexboxLayout>
                    )
                  })}
                </stackLayout>
              </scrollView>
            </stackLayout>
          </TextEditField>
          <TextEditField noCustomWrapper type="custom" labelFor="Categories" error={errors.tags} errorLabel="Add 1 or more categories">
            <flexboxLayout style={{
              flexWrap: 'wrap',
            }}>
              {CATEGORIES.map((item) => {
                const isSelected = state.tags.includes(item)
                return (
                  <flexboxLayout key={item} style={{
                    background: isSelected ? theme.primary[500] : "#eee",
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                    color: isSelected ? '#fff' : '#000',
                    margin: 4,
                    marginLeft: 0,
                    borderRadius: 8,
                  }} onTap={() => {
                    setState({
                      tags: isSelected ? [] : [item]
                    }, {
                      tags: isSelected ? true : false
                    })
                  }}>
                    <label text={item} />
                  </flexboxLayout>
                )
              })}
            </flexboxLayout>
          </TextEditField>
          <TextEditField noCustomWrapper type="custom" labelFor="Teams" error={errors.tags} errorLabel="Add 1 or more teams">
            <flexboxLayout style={{
              flexWrap: 'wrap',
            }}>
              {getTeams(user.ownTeams).map((team, index) => {
                const isSelected = state.teams.map((t) => t._id).includes(team._id);
                return (
                  <flexboxLayout key={index} style={{
                    background: isSelected ? theme.primary[500] : "#eee",
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 8,
                    color: isSelected ? '#fff' : '#000',
                    margin: 4,
                    marginLeft: 0,
                    borderRadius: 8,
                  }} onTap={() => {
                    setState({
                      teams: isSelected ? state.teams.filter((t) => t._id !== team._id) : [...state.teams, team]
                    }, {
                      teams: false
                    })
                  }}>
                    <label text={team.name} />
                  </flexboxLayout>
                )
              })}
            </flexboxLayout>
          </TextEditField>
        </stackLayout>
      </scrollView>
      <gridLayout padding={16} columns="*, 8, *" row={2}>
        <SaveButton col={0} isClear text="Cancel" onTap={() => navigator.goBack()} />
        <SaveButton isLoading={isUploading} col={2} text="Save" onTap={() => {
          save();
        }} />
      </gridLayout>
    </>
  )
};

AddDocument.routeName = "addDocument"

export const DocumentNotifications = () => {
  const navigator = useNavigation();
  return (
    <gridLayout background="#fff" rows="auto, *">
      <CommonHeader user={{
        name: "Nofications"
      }} goBack={() => {
        navigator.goBack();
      }} />
    </gridLayout>
  )
}

DocumentNotifications.routeName = "docNotifications"
