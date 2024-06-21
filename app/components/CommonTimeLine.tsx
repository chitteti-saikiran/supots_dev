import * as React from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import * as AppSettings from "@nativescript/core/application-settings";
import { AsyncPost } from './GQL'
import { AppAuthContext } from './Root';
import { AsyncPostItem } from './AsyncPostItem';
import { useNavigation } from '@react-navigation/core';
import { Color } from '@nativescript/core';
import { TimelineFormIcon, TimeLinePlaceHolder, TimeLinePlaceHolderDiveder } from './AppContainer';
import { Theme2 } from '~/Theme';
import IconSet from '~/font-icons';

interface CommonTimeLineProps {
  postUser: { _id: string; type: string }
}

const icons = () => {
  //const _that = this;
  return [
    {
      name: 'panorama-fish-eye',
      label: 'Video',
      desc: 'Share Live Video',
      color: '#4ac',
      cb: () => {

      },
      //svg: require('../images/photo_icon_green.svg')
    },
    {
      name: 'camera-alt',
      label: 'Media',
      desc: 'Share Photos or Videos',
      color: '#4a5',
      cb: () => {

      },
      //svg: require('../images/photo_icon_green.svg')
    },
    {
      name: 'location-on',
      label: 'Check In',
      desc: 'Check In',
      color: '#EB6262',
      cb: () => {

      },
      //svg: require('../images/checkin_pink.svg')
    },
    {
      name: 'person-add',
      label: 'Tag',
      desc: 'Tag friends',
      color: '#4ac',
      cb: () => {

      },
      //svg: require('../images/tag_icon_blu.svg')
    }
  ]
}

export const CommonTimeLine: React.FC<CommonTimeLineProps> = ({
  postUser,
  ...props
}) => {
  const navigation = useNavigation()
  const [data, setData] = React.useState({
    limit: 20,
    page: 0
  })
  const { user } = React.useContext(AppAuthContext);
  const [getPost, {
    data: postsData,
    loading: isLoading
  }] = useLazyQuery(AsyncPost, {
    onCompleted(data) {
      const { posts = [] } = data;
      AppSettings.setString(`${postUser.type}-posts-${postUser._id}`, JSON.stringify(posts))
    },
  });

  const posts = React.useMemo(() => {
    return postsData && postsData.posts ? postsData.posts : []
  }, [postsData])

  const renderPostField = (ref?: any) => {
    return (
      <gridLayout padding={`16 0`} onTap={() => {
        // this.goToCreatePosts()
      }} {...ref ? { ref } : {}} style={{
        background: 'white',
        margin: '0px 0px'
      }}
        columns={'*'}
        rows={'*,*,*,*'}
        marginBottom={16}
      >
        <gridLayout row={1} col={0}
          columns={"20,*,10,50,15"}
          rows={'50'}
          style={{
            verticalAlignment: 'top'
          }}
        >

          <label style={{
            fontSize: 16,
            verticalAlignment: 'middle',
            color: new Color('#345')
          }} row={0} col={1} text={'Write something...'} />



          <absoluteLayout row={0} col={3} style={{
            height: 50,
            width: 50
          }}>
            <image src={(user && user.image) ? user.image : ''} decodeHeight={40} decodeWidth={40} stretch={'aspectFill'} loadMode={'async'} style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              background: '#eee'
            }} />
            <stackLayout left={25} top={40} col={3} style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              marginTop: -20,
              textAlignment: 'center',

              verticalAlignment: 'middle',
              //horizontalAlignment: 'center',
              color: new Color('#fff'),
              fontWeight: 'bold',
              background: Theme2['500']
            }}>
              <label textAlignment={'center'} verticalAlignment={'middle'} className={'Ionicons size16'} text={IconSet.Ionicons["md-add"]} style={{
                textAlignment: 'center',
                color: new Color('#fff'),
              }} />
            </stackLayout>
          </absoluteLayout>

        </gridLayout>

        <gridLayout row={3} columns={'*,*,*,*'} col={0} rows={'40'}>
          {
            icons().map((icon, i) => {
              return (
                <TimelineFormIcon key={i} icon={icon.name} color={new Color(icon.color)} label={String(icon.label)} row={0} col={i} />
              )
            })
          }
        </gridLayout>
      </gridLayout>
    )
  }

  React.useEffect(() => {
    const variables = {
      user: {
        _id: user._id,
        type: user.type
      },
      ids: [
        {
          ...postUser
        }
      ],
      limit: data.limit,
      page: data.page
    }
    getPost({
      variables,
    })
  }, [])
  return (
    <>
      <stackLayout padding={`16 0`}>
        {renderPostField()}
        {isLoading &&
          <stackLayout recycleNativeView={'never'} paddingLeft={0} paddingTop={10} paddingRight={0}>
            <TimeLinePlaceHolder />
            <TimeLinePlaceHolderDiveder />
            <TimeLinePlaceHolder />
            <TimeLinePlaceHolderDiveder />
            <TimeLinePlaceHolder />
            <TimeLinePlaceHolderDiveder />
            <TimeLinePlaceHolder />
          </stackLayout>
        }
        {!isLoading && posts.length > 1 &&
          posts.map((item, i) => {
            return (
              <AsyncPostItem key={i} Placholder={(args: any) => {
                return (
                  <stackLayout padding={0}>
                    <TimeLinePlaceHolder />
                  </stackLayout>
                )
              }} post={item} navigation={navigation} {...props} />
            )
          })
        }
        {!isLoading && posts.length === 0 &&
          <stackLayout recycleNativeView={'never'} paddingLeft={0} paddingRight={0} paddingTop={10}>
            <flexboxLayout recycleNativeView={'never'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} style={{
              //height: 50,
              padding: 20,
              background: '#fff'
            }}>
              <label fontSize={24} color={new Color('#888')} text={`Ops, nothing yet!`} />
              <label textWrap textAlignment={'center'} fontSize={15} color={new Color('#999')} text={`Make a post or follow other users to see some action!`} />
            </flexboxLayout>
          </stackLayout>
        }
      </stackLayout>
    </>
  )
}
