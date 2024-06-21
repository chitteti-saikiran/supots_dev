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
import { CREATE_APP, GET_APPS } from '../../services/graphql/applications';

const CATEGORIES = ["General", "Invoice", "News Letter", "Statements", "Announcements", "Schedules"];

interface ApplicationsViewProps {
  user: UnionUser;
  isShown?: boolean;
  row?: number;
  sportFilter?: boolean;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  user,
  children,
  isShown,
  row,
  sportFilter
}) => {
  const navigator = useNavigation();
  const { fonts, onTouch, theme } = useStyledContext();
  const [isShownFilter, showFilter] = React.useState(false);
  const [filter, setFilter] = React.useState("")
  const { data, loading } = useQuery(GET_APPS, {
    variables: {
      _id: user._id,
      type: user.type
    },
    pollInterval: 10000
  });
  const applications: ISupotsu.Application[] = React.useMemo(() => {
    if (data && data.applications) {
      return (data.applications as ISupotsu.Application[]).filter((item) => {
        return item.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
      })
    };
    return [];
  }, [data, filter])
  const hasData = applications.length > 0;

  return (
    <gridLayout rows="auto, *"  {...row ? { row } : {}} visibility={isShown ? 'visible' : 'collapse'} background="#fff">
      <stackLayout row={0}>
      <gridLayout marginBottom={isShownFilter ? 8 : 0} background="#fff" padding="8 16" columns={'auto, *, auto'}>
          <TrainingButton col={0} labelFor={'Add Application'} onTap={() => {
            navigator.navigate(AddApplication.routeName, {
              user
            });
          }} icon={'add'} />
          <TrainingButton col={2} onTap={() => {
            showFilter((bool) => !bool)
          }} icon={'search'} />
        </gridLayout>
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
            const { value } = args;
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
          {applications.map((item) => {
            const isNew = item.read === 'no'
            return (
              <gridLayout key={item._id} onTouch={onTouch} onTap={() => {
                // navigator.navigate(DocumentDetails.routeName, {
                //   doc: item
                // })
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
                  }}>{item.name}</label>
                  <label textWrap={false} style={{
                    color: !isNew ? '#888' : '#000'
                  }}>{item.surname.trim()}</label>
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
  );
}

interface AddApplicationState {
  name: string;
  surname: string;
  number: string;
  email: string;
  address: string;
  suburb: string;
  state: string;
  postal: string;
  country: string;
  height: string;
  weight: string;
  squad?: ISupotsu.Squad;
  position: string;
  comment: string;
}

interface AddApplicationErrorState {
  name?: boolean;
  surname?: boolean;
  number?: boolean;
  email?: boolean;
  address?: boolean;
  suburb?: boolean;
  state?: boolean;
  postal?: boolean;
  country?: boolean;
  height?: boolean;
  weight?: boolean;
  squad?: boolean;
  position?: boolean;
  comment?: boolean;
}

export const AddApplication = () => {
  const navigator = useNavigation();
  const { fonts } = useStyledContext();
  const route = useRoute();
  const { user } = (route.params || {}) as { user: UnionUser };
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const [squad, setSquad] = React.useState<ISupotsu.Squad>();
  const [state, updateState] = React.useState<AddApplicationState>(() => {
    return {
      name: me.first_name,
      surname: me.last_name,
      address: me.address,
      country: me.country,
      email: me.email,
      height: me.user_height,
      number: "",
      position: "",
      postal: me.postal,
      state: me.state,
      suburb: me.suburb,
      weight: me.user_weight,
      comment: "",
    };
  });

  const [errors, updateErrors] = React.useState<AddApplicationErrorState>({})

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const setState = (newState: Partial<AddApplicationState>) => {
    updateState({
      ...state,
      ...newState,
    })
  }

  const setErrors = (newErrors: Partial<AddApplicationErrorState>) => {
    updateErrors({
      ...errors,
      ...newErrors
    })
  }

  const save = () => {
    const hasErrors = Object.keys(errors).some((item) => item);
    if (hasErrors) {
      alert('Make sure all application details are filled!')
      return;
    }

    // if (!squad) {
    //   alert('Make sure you\'ve selected the squad you\'re applying for!')
    //   return;
    // }

    const variables = {
      app: {
        ...state,
        userFrom: me._id,
        userToId: user._id,
        userToType: user.type,
        team: me._id,
        squad: squad ? squad._id : ""
      }
    }

    console.log(variables);
    setIsLoading(true)
    client.mutate({
      mutation: CREATE_APP,
      variables
    }).then(({data}) => {
      alert('Application was sent!')
      navigator.goBack();
      setIsLoading(false)
    }).catch((e) => {
      console.log(e)
      alert('Error occurred while creating your document!')
      setIsLoading(false)
    })
  }

  return (
    <gridLayout background="#fff" rows="auto, *, auto">
      <CommonHeader user={{
        name: "Add Application"
      }} goBack={() => {
        navigator.goBack();
      }} />
      <scrollView row={1} scrollBarIndicatorVisible={false}>
        <stackLayout padding={16}>
          <TextEditField simple={false} withImage type="select" labelFor="Apply For" onChange={(value) => {
            console.log('picked', value)
          }} selectOptions={[me]} />
          <TextEditField type="text" labelFor="First Name" value={state.name} onChange={(name: string) => {
            setState({
              name
            });
            setErrors({
              name: name.length < 2
            })
          }} />
          <TextEditField type="text" labelFor="Last Name" value={state.surname} onChange={(surname: string) => {
            setState({
              surname
            });
            setErrors({
              surname: surname.length < 2
            })
          }} />
          <TextEditField type="text" labelFor="Mobile No." value={state.number} onChange={(number: string) => {
            setState({
              number
            });
            setErrors({
              number: number.length < 10 || number.length > 13
            })
          }} />
          <TextEditField type="text" labelFor="Email" value={state.email} onChange={(email: string) => {
            setState({
              email
            });
            setErrors({
              email: !Methods.isEmail(email)
            })
          }} />
          <TextEditField type="text" labelFor="Address" value={state.address} onChange={(address: string) => {
            setState({
              address
            });
            setErrors({
              address: address.length < 2
            })
          }} />
          <TextEditField type="text" labelFor="Suburb" value={state.suburb} onChange={(suburb: string) => {
            setState({
              suburb
            });
            setErrors({
              suburb: suburb.length < 2
            })
          }} />
          <TextEditField type="text" labelFor="Postal Code" value={state.postal} onChange={(postal: string) => {
            setState({
              postal
            });
            setErrors({
              postal: postal.length < 2
            })
          }} />
          <TextEditField type="text" labelFor="Country" value={state.country} onChange={(country: string) => {
            setState({
              country
            });
            setErrors({
              country: country.length < 2
            })
          }} />
          <TextEditField type="text" labelFor="Height" value={state.height} onChange={(height: string) => {
            setState({
              height
            });
            setErrors({
              height: height.length < 2
            })
          }} />
          <TextEditField type="text" labelFor="Weight" value={state.weight} onChange={(weight: string) => {
            setState({
              weight
            });
            setErrors({
              weight: weight.length < 2
            })
          }} />
          <TextEditField type="select" labelFor="Squad" onChange={(value) => {}} selectOptions={(user as ISupotsu.Team).squads ? (user as ISupotsu.Team).squads.current : []} />
          <TextEditField type="select" labelFor="Position" onChange={(value) => {}} selectOptions={['Forward', 'Midfield', 'Defender', '']} />
          <TextEditField type="textArea" labelFor="Comment" value={state.comment} onChange={(comment: string) => {
            setState({
              comment
            });
          }} />
          <SaveButton text="Apply" onTap={save} />
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

AddApplication.routeName = "addApplication";
