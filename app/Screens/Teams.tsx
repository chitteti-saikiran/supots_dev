import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { DrawerContext } from '~/components/AppContainer';
import { CLUBS, INSTITUTIONS, TEAMS } from '~/components/GQL';
import { AppAuthContext } from '~/components/Root';
import { CommonHeader, Empty, LoadingState } from '~/ui/common.ui';
import { Institution, Team } from '~/DB/interfaces';
import IconSet from '~/font-icons';
import { useNavigation } from '@react-navigation/core';
import TeamScreen from './Team';

export const Teams = () => {
  const {
    user
  } = React.useContext(AppAuthContext)
  const {
    closeDraweCallback,
    openDraweCallback,
  } = React.useContext(DrawerContext);

  const navigator = useNavigation()

  const [search, setSearch] = React.useState('');

  const {data, loading, refetch} = useQuery(TEAMS, {
    fetchPolicy: 'cache-and-network'
  })
  const teams: Team[] = React.useMemo(() => {
    const list = data?.teams ?? []
    return list.filter((c) => c?.name?.toLowerCase().indexOf(search.toLowerCase()) > -1)
  }, [data])

  React.useEffect(() => {
    refetch()
  }, [])
  return (
    <gridLayout rows='auto, auto, *'>
      <CommonHeader goBack={openDraweCallback} user={{
        name: "Teams"
      }} icons={[]} />
      <flexboxLayout row={1} style={{
        padding: 10
      }}>
        <gridLayout columns='*, auto' style={{
          borderColor: '#eee',
          borderWidth: 1,
          borderRadius: 4,
          padding: '0 8'
        }}>
          <textField borderColor='#fff' background='#fff' hint='Search Teams' onTextChange={(args) => {
            setSearch(args.value)
          }} />
          <flexboxLayout width={40} alignItems='center' justifyContent='center' col={1}>
            <label className='MaterialIcons size26' color='#ddd' text={IconSet.MaterialIcons.search} />
          </flexboxLayout>
        </gridLayout>
      </flexboxLayout>
      <flexboxLayout visibility={loading ? 'visible' : 'collapse'} row={2} style={{
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eee'
      }}>
        <LoadingState style={{
          background: '#eee'
        }}/>
      </flexboxLayout>
      <flexboxLayout visibility={!loading && teams.length === 0 ? 'visible' : 'collapse'} row={2} style={{
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eee'
      }}>
        <Empty onTap={() => refetch()} style={{
          background: '#eee'
        }}/>
      </flexboxLayout>
      <scrollView visibility={!loading && teams.length > 0 ? 'visible' : 'collapse'} row={2}>
        <stackLayout>
          {teams.map((c) => {
            return (
              <gridLayout key={c._id} columns='40, 8, *, 8' padding={16} borderBottomColor='#ddd' borderBottomWidth={1} onTap={() => {
                navigator.navigate(TeamScreen.routeName, {
                  team: c
                })
              }}>
                <flexboxLayout style={{
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <image stretch='aspectFill' src={c.image} style={{
                    height: 40,
                    width: 40,
                    borderRadius: '50%'
                  }}/>
                </flexboxLayout>
                <stackLayout col={2} style={{

                }}>
                  <label text={c.name} style={{
                    color: '#000'
                  }}/>
                  <label text={`Manager: ${c.manager ? c.manager?.name : '-'}`} style={{
                    fontSize: 12,
                    color: '#000'
                  }}/>
                </stackLayout>
              </gridLayout>
            )
          })}
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

Teams.routeName = 'teams'
