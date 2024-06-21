import React from "react"
import { alert } from "tns-core-modules/ui/dialogs";
import * as ReactNativeScript from "react-nativescript";
import { BaseNavigationContainer, useNavigation, useRoute } from '@react-navigation/core';
import { stackNavigatorFactory, tabNavigatorFactory } from "react-nativescript-navigation";
import IconSet from '~/font-icons';
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { ListView as NSListView } from '@nativescript/core/ui/list-view';
import { ItemEventData, ObservableArray, EventData } from "@nativescript/core";
import { Color } from "tns-core-modules/color";
import Theme, { Theme2 } from "~/Theme";
import * as ISupotsu from '~/DB/interfaces';
//@ts-ignore
import { client } from "~/app";
import * as Application from "@nativescript/core/application";
import * as AppSettings from "@nativescript/core/application-settings";
import PostScreen from "~/Screens/PostScreen";
import Methods from "~/Methods";
import { GAMES_QRY, EVENTS, sports } from '../components/GQL';
import { ScreenProps } from '../app';
import { Page } from "tns-core-modules/ui/page";
import Helper, { getItemSpec } from "~/helpers";
import { Props } from "~/components/AppContainer";
import { LoadingState, Empty } from "~/ui/common.ui";
import { useState, useEffect } from 'react';
import { PropertyChangeData } from 'tns-core-modules/ui/editable-text-base';
import { GMCStream } from '~/gmc/gmx-react';
import { goToPageReact } from '~/components/AppContainer';
import moment from 'moment';
import { PhotoSementItem } from "./Photos";
import { ListView as $ListView, NSVElement } from "react-nativescript";
import { screen, isIOS, isAndroid } from '@nativescript/core/platform/platform';
import { AsyncComment } from '../components/AsyncPostItem';
import { Video } from 'nativescript-videoplayer';
import { View as BaseView } from '@nativescript/core/ui/page/page';
import { UnionUser } from "~/utils/types";

const dummy = Methods.getDummy(32);
const dum = Methods.arrayChunks(dummy, 3);

export const VideoItemStyle = {
  title: {
    fontSize: 14,
    color: Theme2[500]
  },
  desc: {
    fontSize: 12,
    color: '#555',
  },
  footer: {
    fontSize: 10,
    color: '#666',
  }
}

const VideoLoader = () => (
  <flexboxLayout style={{
    height: 140,
    margin: '16 0',
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
)

export const Videos = ({user,  canBeLoaded = false, color = Theme[500]}: {user: UnionUser, canBeLoaded: boolean, color?: string}) => {
  const [active, setActive] = useState<string>('Uploads');
  const [isGrid, setIsGrid] = useState<boolean>(false)
  const [state, updateState] = useState<Record<string, any>>({})

  const setState = (newState: Partial<Record<string, any>>) => {
    updateState({
      ...state,
      ...newState
    })
  }

  const canSee = () => {
    return {};
  }

  const getVideos = React.useCallback(() => {
    /*const _ = canSee();
    if(!_.can_see_posts || !_.can_see_tagged_posts || !_.who_to_see_posts){
        return;
    }

    */
    const dataTo = {
      userId: user._id,
      userType: user.type,
      yourId: Methods.you().id
    }

    Methods.post(Methods.apiURL + "/get-user-videos", dataTo, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      success(res) {
        AppSettings.setString('your-vids', JSON.stringify(res));
        setState({
          yourVideos: res,
          isLoadingYourVideos: false
        })
        setActive(active)
      },
      error(error) {
        setState({
          yourVideos: state.yourVideos || [],
          isLoadingYourVideos: false
        })
      }
    });
  }, [])

  const getFTVideos = React.useCallback(() => {
    const _that = this;
    /*const _ = canSee();
    if(!_.can_see_posts || !_.can_see_tagged_posts || !_.who_to_see_posts){
        return;
    }*/
    const dataTo = {
      userId: user._id,
      userType: user.type,
      yourId: Methods.you().id
    }

    Methods.post(Methods.apiURL + "/get-user-feature-videos", dataTo, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      success(res) {
        AppSettings.setString('tagged-vids', JSON.stringify(res));
        setState({
          videosOfYou: res,
          isLoadingVideosOfYou: false
        })
      },
      error(error) {
        console.log(`Tagged Videos ERR::${error}`)
        setState({
          videosOfYou: state.videosOfYou || [],
          isLoadingVideosOfYou: false
        })
      }
    });
  }, [])

  useEffect(() => {
    const _yourVids = AppSettings.getString('your-vids', '[]');
    const yourVids: ISupotsu.Post[] = JSON.parse(_yourVids);

    setState({
      yourVideos: yourVids,
      isLoadingYourVideos: yourVids.length > 0 ? true : false
    });

    const _taggedVid = AppSettings.getString('tagged-vids', '[]');
    const tagged: ISupotsu.Post[] = JSON.parse(_taggedVid);

    setState({
      videosOfYou: tagged,
      isLoadingVideosOfYou: tagged.length > 0 ? true : false
    });

    return () => {

    }

  }, [active])

  useEffect(() => {
    getFTVideos();
    getVideos()

    return () => {
      console.log("Exit Videos")
    }
  }, [])

  const { yourVideos = [], videosOfYou = [], isLoadingVideosOfYou, isLoadingYourVideos } = state;

  if(!canBeLoaded) {
    return <VideoLoader />
  }

  return (
    <scrollView background={'#eee'}>
      <stackLayout padding={'16 0'}>
        <gridLayout columns="*,*">
          {['Uploads', 'Tagged'].map((item, i)=>{
            return (
              <PhotoSementItem color={color} key={item} onSelect={()=>{
                setActive(item);
                setIsGrid(false);
              }} active={Boolean(active === item)} col={i} item={item} />
            )
          })}
        </gridLayout>
        <gridLayout margin={8} columns="auto, auto, *">
          <label onTap={()=> setIsGrid(true)} col={0} className={`MaterialIcons`} text={IconSet.MaterialIcons['grid-on']} color={isGrid? Theme2[500] : Theme[500]} />
          <label onTap={()=> setIsGrid(false)} col={1} marginLeft={4} className={`MaterialIcons`} text={IconSet.MaterialIcons['format-list-bulleted']} color={!isGrid? Theme2[500] : Theme[500]} />
        </gridLayout>
        <stackLayout visibility={active === "Uploads" ? "hidden" : "visible"}>
          {isGrid && !isLoadingYourVideos && dum.map((item, i) => {
            const { widthPixels } = screen.mainScreen;
            const widthOf = widthPixels / 6 - 2;
            return (
              <gridLayout margin={'0'} height={widthOf} key={i} columns="*,*,*">
                {item.map((photoItem, index) => {
                  return (
                    <flexboxLayout key={index} col={index} style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 0.5,
                      borderColor: '#eee',
                      background: '#555'
                    }} />
                  )
                })}
              </gridLayout>
            )
          })}
          {!isGrid && !isLoadingYourVideos && (
            <>
              {yourVideos.map((item, i) => {
                return (
                  <VideoListView video={item} key={i} />
                )
              })}
            </>
          )}
          {isLoadingYourVideos && (
            <VideoLoader />
          )}
        </stackLayout>
        <stackLayout visibility={active === "Tagged" ? "hidden" : "visible"}>
          {isGrid && !isLoadingVideosOfYou && dum.map((item, i) => {
            const { widthPixels } = screen.mainScreen;
            const widthOf = widthPixels / 6 - 2;
            return (
              <gridLayout margin={'0'} height={widthOf} key={i} columns="*,*,*">
                {item.map((photoItem, index) => {
                  return (
                    <flexboxLayout key={index} col={index} style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 0.5,
                      borderColor: '#eee',
                      background: '#555'
                    }} />
                  )
                })}
              </gridLayout>
            )
          })}
          {!isGrid && !isLoadingVideosOfYou && (
            <>
              {videosOfYou.map((item, i) => {
                return (
                  <VideoListView video={item} key={i} />
                )
              })}
            </>
          )}
          {isLoadingVideosOfYou && (
            <VideoLoader />
          )}
        </stackLayout>
      </stackLayout>
    </scrollView>
  )
}

interface VideoListItemProps {
  video: ISupotsu.Video
}

const openVideo = (props: any) => {
  goToPageReact(VideoFullScreen, {
    ...props
  },
  `video`
  )
}

export const VideoListView = ({
  video
}: VideoListItemProps) => {
  const router = useNavigation()
  return(
    <gridLayout background="#fff" columns="140, *, auto" padding="8" style={{
      borderWidth: 0.5,
      borderColor: '#eee',
    }} onTap={() => {
      router.navigate('videoScreen', { video })
    }}>
      <flexboxLayout style={{
          height: 80,
          borderRadius: 16,
          background: '#000',
        }} col={0}>
        <VideoListView.Image src={video.poster}/>
      </flexboxLayout>

      <gridLayout style={{
        padding: '2 16',
        height: 80,
      }} col={1} rows="auto, *, auto">
        <label row={0} text={video.user.name} style={VideoItemStyle.title} />
        <label row={1} textWrap text={video.desc} style={VideoItemStyle.desc} />
        <label row={3} text={`${Methods.shortDigit(video.views).text} ${video.views === 1 ? 'VIEW' : 'VIEWS'} - ${Methods.moment(video.date).format('DD MMM YYYY').toUpperCase()}`} style={VideoItemStyle.footer} />
      </gridLayout>
    </gridLayout>
  )
}

VideoListView.Image = ({src}: {src: string} ) => {
  return(
    <image loadMode={'async'} style={{
      height: 80,
      borderRadius: 16,
      background: '#000',
    }} stretch="aspectFill" src={src}/>
  )
}

export const VideoFullScreen = (props: any) => {
  const [active, setActive] = useState('Related')
  const [state, updateState] = useState<Record<string, any>>({
    videos: [],
    isLoadingVideos: true,
    comments: []
  })
  const route = useRoute()
  // @ts-ignore
  const { video = {} } = route.params

  const setState = (newState: Partial<Record<string, any>>) => {
    updateState({
      ...state,
      ...newState
    })
  }

  const getRelated = ({ text = '' }) => {
    const data = {
      yourId: Methods.you().id,
      text
    };

    Methods.post(Methods.apiURL + "/get-related-videos", data, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.length > 0) {
          setState({
            videos: res,
            isLoadingVideos: false,
          });
        } else {
          setState({ isLoadingVideos: false });
        }
      },
      error(res) {
        setState({ active: false, isLoadingVideo: false, activeContent: false, returned: res });
      }
    });
  }

  useEffect(() => {
    getRelated({text: (video as ISupotsu.Video).desc})
  }, [])

  const {isFullScreen, videos, comments, commentUser = Methods.you()} = state;

  return(
    <gridLayout rows={"250, auto, *, auto"} background={'#fff'}>
      <stackLayout row={0} style={{
        background: '#000',
        padding: 0
      }}>
        <videoPlayer src={"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"} onLoaded={(args: EventData) => {

        }}/>
      </stackLayout>
      <gridLayout row={1} columns="*,*">
        {['Comments', 'Related'].map((item, i) => {
          return (
            <PhotoSementItem key={item} onSelect={() => {
              setActive(item)
            }} active={Boolean(active === item)} col={i} item={item} />
          )
        })}
      </gridLayout>
      <scrollView row={2}>
        <stackLayout>
          {active === "Related" && (
            <RelatedVideos videos={videos}  />
          )}
          {active === "Comments" && (
            <Comments comments={(video as ISupotsu.Video).comments}/>
          )}
        </stackLayout>
      </scrollView>
      {active === "Comments" && (
        <gridLayout row={3} columns={getItemSpec(['auto', '*', 'auto'])} style={{
          margin: 10,
          padding: `0 10`,
          //marginTop: previewComments.length>0?0:10,
          height: 40,
          //paddingHorizontal: 10,
          //backgroundColor: '#eee',
          flexDirection: 'row',
          //borderColor: '#ddd',
          justifyContent: 'center',
          alignItems: 'center',
          //borderWidth: 1,
          borderRadius: 40 / 2
        }}>
          {(!props.isPageView && !state.isCommentBoxExpanded) &&
              <Methods.Avatar
                url={Methods.you().image}
                height={30}
                col={0}
                hasStroke={false}
                hasRadius={true}
                resizeMode={"contain"}
                {...props}
              />
            }
            {(props.isPageView || state.isCommentBoxExpanded) &&
              <stackLayout col={0} onTap={() => {
                setState({ isCameraOpen: true });
              }}>
                <label className={'Ionicons'} text={IconSet.Ionicons["md-camera"]} style={{
                  color: 'green',
                  fontSize: 30
                }} />
              </stackLayout>
            }

            {!state.isCommentBoxExpanded &&
              <stackLayout col={1} onTap={() => {
                setState({ isCommentBoxExpanded: true });
              }} style={{
                margin: `0 10`,
                height: 35,
                borderColor: '#ddd',
                verticalAlignment: 'middle',
                borderWidth: props.isPageView ? 1 : 0,
                borderRadius: 35 / 2
              }}>
                <label
                  style={{
                    padding: `0 10`,
                    color: "#999",
                  }}
                  text={'Write a comment...'}
                />
              </stackLayout>
            }

            {state.isCommentBoxExpanded &&
              <stackLayout
                col={1}
              />
            }

            {(props.isPageView || state.isCommentBoxExpanded) &&
              <stackLayout col={2} style={{
                height: 35,
                padding: `0 10`,
                horizontalAlignment: 'center',
                verticalAlignment: 'middle',
                borderRadius: 35 / 2,
                background: Theme2['500']
              }} onTap={() => {
                if (state.comment.length === 0) return;

                /*
                comment(commentUser, () => {
                  if (commentProps.onBlur) commentProps.onBlur()
                });
                */
              }}>
                {
                  <Methods.Avatar
                    url={commentUser.image}
                    height={25}
                    hasStroke={false}
                    hasRadius={true}
                    resizeMode={"contain"}
                    {...props}
                  />
                }
              </stackLayout>
            }
        </gridLayout>
      )}
    </gridLayout>
  )
}

interface CommentsProps {
  comments: ISupotsu.Comment[]
}

const Comments = ({
  comments
}: CommentsProps) => {
  return (
    <>
    {comments.map((comment, index) => {
      return(
        <AsyncComment item={comment} key={index} />
      )
    })}
    </>
  )
}

const RelatedVideos = ({
  videos
}: { videos: ISupotsu.Video[]}) => {
  return (
    <>
    {videos.map((item, index)=>{
      return(
        <VideoListView key={index} video={item} />
      )
    })}
    </>
  )
}
