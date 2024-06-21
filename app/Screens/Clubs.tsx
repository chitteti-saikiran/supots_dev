import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { DrawerContext } from '~/components/AppContainer';
import { CLUBS } from '~/components/GQL';
import { AppAuthContext } from '~/components/Root';
import { CommonHeader, Empty, LoadingState } from '~/ui/common.ui';
import { Club } from '~/DB/interfaces';
import IconSet from '~/font-icons';
import { useNavigation } from '@react-navigation/core';
import { Club as ClubScreen } from './Club';

export const Clubs = () => {
  const {
    user
  } = React.useContext(AppAuthContext)
  const {
    closeDraweCallback,
    openDraweCallback,
  } = React.useContext(DrawerContext);

  const navigator = useNavigation()

  const [search, setSearch] = React.useState('');

  const {data, loading, refetch} = useQuery(CLUBS, {})
  const clubs: Club[] = React.useMemo(() => {
    const list = data?.clubs ?? []
    return list.filter((c) => c.name.toLowerCase().indexOf(search.toLowerCase()) > -1)
  }, [data])

  return (
    <gridLayout rows='auto, auto, *'>
      <CommonHeader goBack={openDraweCallback} user={{
        name: "Clubs"
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
          <textField borderColor='#fff' background='#fff' hint='Search Club' onTextChange={(args) => {
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
      <flexboxLayout visibility={!loading && clubs.length === 0 ? 'visible' : 'collapse'} row={2} style={{
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eee'
      }}>
        <Empty onTap={() => refetch()} style={{
          background: '#eee'
        }}/>
      </flexboxLayout>
      <scrollView visibility={!loading && clubs.length > 0 ? 'visible' : 'collapse'} row={2}>
        <stackLayout>
          {clubs.map((c) => {
            return (
              <gridLayout key={c._id} columns='40, 8, *, 8' padding={16} borderBottomColor='#ddd' borderBottomWidth={1} onTap={() => {
                navigator.navigate(ClubScreen.routeName, {
                  club: c
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

Clubs.routeName = 'clubs'
