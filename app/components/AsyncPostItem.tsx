import * as React from 'react';
import { Frame, Page, Color } from '@nativescript/core/ui/frame/frame';
import * as ReactNativeScript from "react-nativescript";
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout/grid-layout';
import IconSet from '~/font-icons';
import * as AppSettings from '@nativescript/core/application-settings';
import Methods, { ms } from '~/Methods';
//import { PageComponentProps } from "react-nativescript/dist/components/Page";
import { POST_UPDATE } from './GQL';
import { screen } from '@nativescript/core/platform/platform';
import Theme, { Theme2 } from '~/Theme';
import { RichTextView, ShareContext, PostItemButton, LoadingState, GenericFile, EmbedMaterial, CameraRoll, WhoShouldSeeTapPopUp, RichInputField, Modal } from '~/ui/common.ui';
import { getItemSpec } from '~/helpers';
//import Video from '~/Video';
//import { NarrowedEventData } from 'react-nativescript/dist/shared/NativeScriptComponentTypings';
import { PostContentProps } from './Post.UI';
import * as ISupotsu from '~/DB/interfaces'
import { useState, Component } from 'react';
import { NSVElement } from "react-nativescript";
import { goToPageReact } from './AppContainer';
import { ScreenProps } from '../app';

import { PropertyChangeData } from 'tns-core-modules/ui/editable-text-base';
import { getImgSrc } from '~/Screens/Training';
import { AppAuthContext } from '~/components/Root';
import { useSupotsuApolloContext } from '../contexts/SupotsuApolloContext';
import { useSubscription } from '@apollo/react-hooks';
import { LIKE_POST, LIKE_COMMENT, VIEW_POST } from '~/services/graphql/post';
import { client } from '~/app';
import { useStyledContext } from '../contexts/StyledContext';

interface AsyncPostProps {
  Placholder(args: any): JSX.Element,
  post?: ISupotsu.Post
  isShared?: boolean
  ref?: React.RefObject<any>
  isFirstTwo?: boolean
  user?: ISupotsu.User | ISupotsu.Club | ISupotsu.Team | ISupotsu.Group | ISupotsu.Institution,
  hideSportLabel?: boolean,
  isPageView?: boolean,
  userType?: string,
  userTo?: string,
  refreshPosts?(): void
}

export const AsyncPostItem = (props: AsyncPostProps & ScreenProps) => {
  const [post, setPost] = useState<ISupotsu.Post>(props.post);
  const [hasComments, setHasComments] = useState(false);
  const parent = React.useRef<NSVElement<GridLayout>>();
  const { data } = useSubscription(POST_UPDATE, {
    variables: {
      _id: post._id
    },
  })

  React.useEffect(() => {
    if (data) {
      console.log(data)
    }
  }, [data]);

  if (data) console.log('post', post._id, data);

  const onTap = () => {
    if (props.isPageView) {
      //this.setState({ isReplyComment: false, isReplyToComment: false, isReplyToCommentUser: false, comment: '', rawComment: '', content: '' });
      return;
    };
    if (props.isShared) return;
    const _props = { ...props, post, screenId: post._id };

    const onCommentsOpen = () => {
      if (Methods.listify(post.media).length > 0) {
        goToPageReact(
          //PostView
          // CameraScreen
          PostDetails
          , {
            ..._props,
            isLightHouse: false,
            onPostUpdate: () => {

            },
            onCommentsOpen() {
              return;
            }
          },
          `Post:${post._id}-comments`
        );
      }
    }

    const navProps = {
      ..._props,
      isLightHouse: Methods.listify(post.media).length > 0,
      onPostUpdate: () => {

      },
      onCommentsOpen
    }

    console.log(parent.current.nativeView.page.frame)
    goToPageReact(
      PostDetails
      ,
      navProps, // parent.current.nativeView.page.frame,
      'Test'
    )
  }
  const _Stacked = !true;
  //@ts-ignore
  if (!post._id) {
    return (
      <props.Placholder />
    );
  }

  if (_Stacked) {
    return (
      <stackLayout padding={0} {...props.ref ? { ref: props.ref } : {}} style={{
        ...(props.isShared && (post.media.length === 0 && !post.hasLink)) ? {
          paddingTop: 5,
          margin: `0 15`
        } : {},
        ...props.isShared ? {
          paddingBottom: 5
        } : {

          },
        borderColor: "#ddd",
        borderWidth: props.isShared ? 1 : 0,
      }} background={'#fff'}>
        <AsyncPostItem.RenderContent {...props} />
      </stackLayout>
    )
  }

  return (
    <gridLayout ref={parent} style={{
      ...(props.isShared && (post.media.length === 0 && !post.hasLink)) ? {
        paddingTop: 5,
        margin: `0 15`
      } : {},
      ...props.isShared ? {
        paddingBottom: 5
      } : {

        },
      borderColor: "#ddd",
      borderWidth: props.isShared ? 1 : 0,
    }} marginBottom={16} columns={'*'} top={0} left={0} key={post._id} rows={'auto, 40, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto'} background={'#fff'}>
      <AsyncPostItem.RenderContent {...props} onTap={onTap} />
    </gridLayout>
  )
}

AsyncPostItem.Video = (props: any) => {
  const { source, oldView = false, containerStyle } = props
  if (!oldView) {
    return (
      <flexboxLayout style={{
        background: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        ...containerStyle
      }} onTap={() => {
        //NavigationService.navigate({ routeName: route, params: {video : false, videos: []}, key: source.uri })
      }}>

      </flexboxLayout>
    )
  }
  return (
    <flexboxLayout style={{
      background: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      ...containerStyle
    }} onTap={() => {
      //NavigationService.navigate({ routeName: route, params: {video : false, videos: []}, key: source.uri })
    }}>

    </flexboxLayout>
  )
}

interface PostLinkViewProps {
  link: ISupotsu.Link
}

const PostLinkView = ({ link }: PostLinkViewProps) => {
  const { fonts } = useStyledContext();
  return (
    <gridLayout columns="auto, *" style={{
      background: '#eee',
      borderWidth: 1,
      borderColor: '#eee',
      marginBottom: 8,
    }}>
      {link.images[0] && (
        <image src={link.images[0]} col={0} style={{
          height: '100%',
          width: 60,
        }} />
      )}
      {!link.images[0] && (
        <flexboxLayout alignItems="center" justifyContent="center" col={0} style={{
          height: '100%',
          width: 50,
        }}>
          <label className="MaterialIcons size35" text={fonts.MaterialIcons.link} />
        </flexboxLayout>
      )}
      <stackLayout padding={8} col={1}>
        <label style={{
          fontSize: 18,
          fontWeight: '600'
        }} text={link.title === "" ? link.url : link.title} />
        <label text={link.url} />
      </stackLayout>
    </gridLayout>
  );
}

interface SharePostProps {
  post?: ISupotsu.Post
}

AsyncPostItem.Post = ({
  post
}: SharePostProps) => {
  const item = post.sharedObject['POST'];
  return (
    <stackLayout style={{
      borderWidth: 1,
      borderColor: '#ccc',
      marginBottom: 4,
      padding: "16 0",
    }}>
      <gridLayout columns="40, *" padding="0 16 8">
        <image decodeHeight={40} decodeWidth={40} src={Methods.getUser(item.userTo).image} loadMode={'async'} col={0} borderRadius={20} height={{ value: 40, unit: 'dip' }} width={{ value: 40, unit: 'dip' }} />
        <gridLayout rows={`auto, auto`} col={1} marginLeft={15} marginTop={-2} marginRight={15}>
          <label row={0} style={{
            fontSize: 16,
            fontWeight: '500',
          }} text={Methods.nullify(Methods.getUser(item.userTo).name).toLowerCase()} />
          <label row={1} textWrap style={{
            fontSize: 10,
            marginTop: -3,
            color: new Color("#888"),
            verticalAlignment: 'middle',
            textAlignment: 'left'
          }} text={Methods.getDateFrom(parseInt(item.timeAgo), true).toUpperCase()} />
        </gridLayout>
      </gridLayout>
      {item.file && item.file._id && AsyncPostItem.renderPhotos([item.file])}
      <stackLayout padding={"0 16"}>
        <gridLayout columns={getItemSpec(['*', 'auto'])} style={{
          flexDirection: 'row',
          padding: 0,
          marginTop: 4,
        }}>
          <flexboxLayout col={0} style={{
            //flex: 1,
            flexDirection: 'row',
            paddingLeft: 0,
            paddingRight: 0,
            alignItems: 'center'
          }}>
            <RichTextView
              style={{
                padding: `0 0`,
                //flex: 1,linkCrop
                fontSize: 15,
              }}
              onUserPress={(user) => {
                if (user) {

                }
              }}
              users={Methods.getTaggableUsers(item.contentUsers)}
              content={Methods.nullify(item.rawContent).length === 0 ? item.content.trim() : Methods.nullify(item.rawContent).trim()}
              userStyle={{}}
              hashStyle={{}}
              skillStyle={{}}
              linkStyle={{}}
            />
          </flexboxLayout>

          <flexboxLayout col={1} style={{
            //flex: 1,
            flexDirection: 'row',
            paddingLeft: 0,
            paddingRight: 0,
            alignItems: 'center'
          }}>
            {item.likes.length > 0 && <label style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={Methods.shortDigit(item.likes.length, "Like").data} />}
            {item.comments.length > 0 && <label style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={Methods.shortDigit(item.comments.length, "Comment").data} />}
            {item.shares.length > 0 && <label style={{ color: new Color('#999'), fontSize: 12 }} text={Methods.shortDigit(item.shares.length, "Share").data} />}
          </flexboxLayout>

        </gridLayout>
      </stackLayout>
    </stackLayout>
  );
}

AsyncPostItem.PostSessionFile = () => {

}

AsyncPostItem.PostSession = () => {

}

AsyncPostItem.PostShared = () => {
  return <stackLayout />
}

AsyncPostItem.Photo = (props: any) => {
  const { source, containerStyle, origins } = props;
  const { height: h, width: w } = origins
  const width = screen.mainScreen.widthDIPs;

  return (
    <image col={0} stretch={'fill'} loadMode={'async'} src={source}  {...(h > w) ? {
      //height: props.style?.height
    } : (w > h) ? {
      style: {
        width
      }
    } : {
          style: { ...props.style }
        }} />
  )
}

AsyncPostItem.Swipper = (props) => {
  return (
    <scrollView scrollBarIndicatorVisible={false} orientation={'horizontal'}>
      <stackLayout orientation={'horizontal'} >
        {props.children}
      </stackLayout>
    </scrollView>
  )
};

AsyncPostItem.renderCommentBox = () => null;

AsyncPostItem.renderPhotos = (photos: any[]) => {
  const width = screen.mainScreen.widthDIPs;
  const height = screen.mainScreen.heightDIPs;

  const _height = width > height ? height : (width > 600) ? 500 : width;

  const e = `?w=${width}&h=${_height}`;

  if (photos.length === 0) {
    return null;
  }

  if (photos.length === 1 && photos[0].type === "video") {

    return (
      <flexboxLayout style={{
        height: _height,
        background: '#000',
        //flexDirection: (photos.length===2 || photos.length>=5)?'row':'column',
        marginBottom: 15
      }}>
        <AsyncPostItem.Video showPostControls containerStyle={{

        }} source={`https://supotsu.com/${Methods.getServerFolder(photos[0].user)}/${photos[0].url}`} video={photos[0]} />
      </flexboxLayout>
    )
  }

  if (photos.length === 1 && photos[0].type === "image") {
    //const url_ = `https://supotsu.com/${Methods.getServerFolder(photos[0].user)}/${photos[0].url}`;
    //console.log(url_);
    return (
      <AsyncPostItem.Photo origins={{
        height: photos[0].height,
        width: photos[0].width
      }} style={{
        width,
        height: _height,
        background: '#000',
        //flexDirection: (photos.length===2 || photos.length>=5)?'row':'column',
        marginBottom: 15
      }} source={`https://supotsu.com:9000/files/${Methods.getThumbFolder(photos[0].user)}/${photos[0].url}${e}`} />
    )
  }

  return (
    <flexboxLayout style={{
      height: width > height ? height : (width > 600) ? 500 : width,
      background: '#000',
      flexDirection: (photos.length === 2 || photos.length >= 5) ? 'row' : 'column',
      marginBottom: 15
    }}>
      <AsyncPostItem.Swipper style={{
        //height: width>height?height:(width>600)?500:width,
        width
      }} showsButtons={false} loadMinimal={true}>
        {
          photos.map((item, i) => {
            return item.type === "video" ? (<AsyncPostItem.Video key={i} source={`https://supotsu.com/${Methods.getServerFolder(item.user)}/${item.url}`} video={item} style={{
              height: _height,
              background: '#000'
            }} />) : (
                <AsyncPostItem.Photo origins={{
                  height: item.height,
                  width: item.width
                }} key={i} source={`https://supotsu.com/${Methods.getThumbFolder(item.user)}/${item.url}${e}`} style={{
                  height: _height,
                  background: '#000',
                  width
                }} />
              )
          })
        }
      </AsyncPostItem.Swipper>
    </flexboxLayout>
  )
}

AsyncPostItem.renderSharedObject = (args: PostContentProps & AsyncPostProps & any) => {
  const props = args;
  const item = args.post;

  if (!item.sharedObject) return null;

  if (item.shareType === "POST") {
    return (
      <AsyncPostItem.Post post={item} />
    )
  }

  return (
    <stackLayout style={{
      background: '#eee',
      borderWidth: 1,
      borderColor: '#ccc',
      height: 120,
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 8,
    }}/>
  );

  const getSharedObject = (obj = { type: 'POST', post: {} }) => {
    return obj[obj.type];
  }

  const sharedObject = getSharedObject(item.sharedObject);
  return (
    <React.Fragment>
      {item.isShared &&
        item.shareType === "POST" &&
        !item.is_live && (
          <AsyncPostItem {...props} isShared={true} isPageView={false} post={sharedObject} />
        )}
      {item.isShared &&
        item.shareType === "SESSIONFILE" &&
        !item.is_live && (
          <EmbedMaterial {...props} isFile={true} file={sharedObject} isShared={true} />
        )}
      {item.isShared &&
        item.shareType === "SESSION" &&
        !item.is_live && (
          <EmbedMaterial {...props} isFile={false} session={sharedObject} isShared={true} />
        )}
      {item.is_live && (
        <Video isEmbed={true}
          video={false}
          videos={[]}
          id={item.video_id}
          {...props}
          key={item.video_id}
        >
          {({ video, isLoading = false }) => {
            if (isLoading) {
              return (
                <React.Fragment>
                  <LoadingState />
                  {AsyncPostItem.renderPostControls({ viewCount: -1, ...args })}
                </React.Fragment>
              )
            }

            if (!video) {
              return (
                <React.Fragment>
                  {AsyncPostItem.renderPostControls({ viewCount: -1, ...args })}
                </React.Fragment>
              );
            }

            return (
              <React.Fragment>
                <GenericFile {...props} isShared={true} file={false} isVideo video={video} key={video._id ? video._id : item.video_id} isGrid={false} />
                {AsyncPostItem.renderPostControls({ viewCount: video.views, ...args })}
              </React.Fragment>
            )
          }}
        </Video>
      )}
    </React.Fragment>
  )
}

const Video = () => <stackLayout />;

AsyncPostItem.renderPostControls = (args: PostContentProps & AsyncPostProps & any) => {
  const {appRef, user:me} = React.useContext(AppAuthContext);
  const { client } = useSupotsuApolloContext();
  const [isLiking, setIsLiking] = React.useState(false)
  const item = args.post;
  const { isLiked, settings = [], viewCount = -1 } = args;
  const props = args;

  const like = () => {
    if (isLiking) return;
    const variables = {
      likeData: {
        _id: me._id,
        type: 'F',
        contentId: item._id,
        contentType: 'post',
      }
    }
    setIsLiking(true);
    client.mutate({
      variables,
      mutation: LIKE_POST
    }).then(({ data }) => {
      setIsLiking(false);
    }).catch((err) => {
      console.log(err);
      setIsLiking(false)
    })
  }

  const _canComment = settings.filter((item) => {
    return item.sub === 'can_comment'
  })

  const ICON_SIZE = 22;

  const isShared = props.isShared

  let can_comment = _canComment.length === 0 ? true : _canComment[0]['value'];
  can_comment = Methods.you()._id === Methods.getUser(item.user)._id || Methods.you()._id === Methods.getUser(item.userTo)._id ? true : can_comment;

  const _canCommentLinks = settings.filter((item) => {
    return item.sub === 'can_comment_link'
  })
  const _name = (item.sport && item.sport._id !== null) ? item.sport.image.split("/")[1] : "";

  if (isShared) {
    return (
      <flexboxLayout style={{
        //flex: 1,
        flexDirection: 'row',
        paddingLeft: 0,
        paddingRight: 0,
        alignItems: 'center'
      }}>
        {item.likes.length > 0 && <label style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={Methods.shortDigit(item.likes.length, "Like").data} />}
        {item.comments.length > 0 && <label style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={Methods.shortDigit(item.comments.length, "Comment").data} />}
        {item.shares.length > 0 && <label style={{ color: new Color('#999'), fontSize: 12 }} text={Methods.shortDigit(item.shares.length, "Share").data} />}
      </flexboxLayout>
    )
  }

  return (
    <React.Fragment>
      <gridLayout columns={getItemSpec(['*', 'auto', 'auto', 'auto', 'auto'])} style={{
        //height: 45,
        padding: 15,
        background: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <flexboxLayout col={0} style={{
          flexDirection: 'row',
          paddingLeft: 0,
          paddingRight: 0,
          alignItems: 'center'
        }}>
          {viewCount > -1 && <label style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={Methods.numify(viewCount) === 0 ? "No views" : Methods.shortDigit(Methods.numify(viewCount), "view").data} />}
          {item.likes.length === -1 && <label style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={Methods.shortDigit(item.likes.length, "Like").data} />}
          {!props.isPageView && viewCount < 0 && Methods.listify(item.comments).length > 0 && <label onTap={() => {
            if (args.onTap && typeof args.onTap === "function") {
              args.onTap()
            }
          }} style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={`View all ${Methods.shortDigit(Methods.listify(item.comments).length, "Comment").data}`} />}
          {item.shares.length === -1 && <label style={{ color: new Color('#999'), fontSize: 12 }} text={Methods.shortDigit(item.shares.length, "Share").data} />}
        </flexboxLayout>
        <PostItemButton col={1} noIcon={!isShared ? false : true} style={{
          paddingLeft: 3,
          paddingRight: 3,
          opacity: isLiking ? 0.5 : 1
        }} onPress={() => {
          if (isShared) return;
          like();
        }} Icon={<Methods.LikeIcon liked={isLiked} size={ICON_SIZE + 2} />
        } Label={!isShared ? false : Methods.shortDigit(item.likes.length, "Like").data} count={Methods.shortDigit(item.likes.length, "Like").text} LabelColor={isLiked ? Theme2['500'] : "#000"} />
        <PostItemButton col={2} noIcon={!isShared ? false : true} style={{
          paddingHorizontal: 3
        }} countColor={Theme2['500']} onPress={() => {
          if (isShared) return;
          if (!props.isPageView) {

          } else if (props.isPageView) {
            //this.setState({ showCommentBox: true });
          } else {
            //this.setState({ isShowingComments: true });
            //NavigationService.navigate({ routeName: route, params: {post:item, screenId: item._id}, key: item._id })
          }
        }} Icon={
          <Methods.CommentIcon commented={false} size={ICON_SIZE} />
        } count={Methods.shortDigit(item.comments.length, "Comment").text} Label={!isShared ? false : Methods.shortDigit(item.comments.length, "Comment").data} />
        {isShared &&
          <PostItemButton col={3} noIcon={!isShared ? false : true} style={{
            paddingHorizontal: 3
          }} countColor={"#4a5"} Icon={
            <Methods.ShareIcon shared={false} size={ICON_SIZE} />
          } count={Methods.shortDigit(item.shares.length, "Share").text} Label={!isShared ? false : Methods.shortDigit(item.shares.length, "Share").data} />
        }
        {!isShared &&
          <stackLayout padding={0} col={3}>
            <ShareContext appRef={appRef} {...props} onPress={() => {
              console.log('test')
            }} shareType={"POST"} post={item} shareContent={item} Embed={
              <stackLayout padding={0} />
            }>
              <PostItemButton noIcon={!isShared ? false : true} style={{
                paddingHorizontal: 3
              }} countColor={"#4a5"} Icon={
                <Methods.ShareIcon shared={false} size={ICON_SIZE} />
              } count={Methods.shortDigit(item.shares.length, "Share").text} Label={!isShared ? false : Methods.shortDigit(item.shares.length, "Share").data} />
            </ShareContext>
          </stackLayout>
        }
        {!props.isShared &&
          <FeedBackPopUp
            {...props}
            hasCustomButton
            CustomActions={(Methods.getUser(item.user)._id === Methods.you()._id && Methods.getUser(item.user).type === "F") ? {
              Edit: {
                icon: "edit",
                label: "Edit Post",
                action: (cb) => {
                  if (props.editorData) props.editorData.actions.edit();
                  cb();
                }
              },
              Remove: {
                icon: "delete",
                label: "Delete Post",
                action: (cb) => {
                  cb();
                }
              }
            } : {}}
            FancyModal={props.FancyModal}
            Icon={
              <label className={`MaterialIcons`} text={`${IconSet.MaterialIcons["more-horiz"]}`} style={{
                color: new Color(Theme['500']),
                fontSize: ICON_SIZE,
                marginLeft: 5
              }} />
            }

            user={{
              id: item._id,
              type: item.commentType
            }}
            object={{
              id: item._id,
              type: item.commentType,
              content: item.content,
              image: false
            }}

            userTo={(Methods.getUser(item.user)._id === Methods.you()._id && Methods.getUser(item.user).type === "F") ? Methods.you() : props.user}

            owner={item.user}
            menus={
              (Methods.getUser(item.user)._id === props.user._id && Methods.getUser(item.user).type === props.userType) ?
                {
                  /*Block:{label:"Hide Post", cb : () => {
                  this.setState({ error: true, isBlocked: true, removed: true });
                  this._isMounted = false;
                  Methods.alert("Post hidden!")
                  }},*/
                  MasterBlock: {
                    label: "Remove Post", data: {}, cb: () => {
                      // this.setState({ error: true, isBlocked: true, removed: true });
                      //this._isMounted = false;
                      //this.alert("Post removed!")
                    }
                  }
                } :
                (Methods.getUser(item.user)._id === Methods.you()._id && Methods.getUser(item.user).type === "F") ?
                  {
                    MasterBlock: {
                      label: "Hide Post", icon: "block", cb: () => {
                        //this.setState({ error: true, isBlocked: true, removed: true });
                        //this._isMounted = false;
                        //this.alert("Post hidden!")
                      }
                    }
                  }
                  :
                  {
                    FeedBack: { label: "Give Feedback?", cb: () => { } },
                    Unfollow: {
                      label: `Unfollow ${(Methods.getUser(item.user)._id === props.user._id && Methods.getUser(item.user).type === props.userType && Methods.getUser(item.user).type !== "F") ? Methods.getUser(item.userTo).name : Methods.getUser(item.userTo).name}`, cb: () => {
                        // this.setState({ error: true, isBlocked: true, removed: true });
                        //this._isMounted = false;
                        //this.alert("Posts from this user won't show again!")
                      }
                    },
                    Block: {
                      label: "Hide Post", cb: () => {
                        //this.setState({ error: true, isBlocked: true, removed: true });
                        //this._isMounted = false;
                        //this.alert("Post hidden!")
                      }
                    }
                  }}
          />
        }
      </gridLayout>
    </React.Fragment>
  )
}

AsyncPostItem.RenderContent = (args: PostContentProps & AsyncPostProps) => {
  const props = args;
  const [item, setPost] = useState(args.post);
  const [settings, setSettings] = useState([]);
  const [errorComments, setErrorComments] = useState([]);

  //return null;

  const { isFirstTwo } = args;

  //@ts-ignore
  /*
  const inRoles = Methods.inRoleIds((Methods.getUser(item.user).roles ? Methods.getUser(item.user).roles : []), (!Methods.getUser(item.user).roles ? false : item.user));
  let showPostOwner = (Methods.getUser(item.user)._id === args.user._id && Methods.getUser(item.user).type === props.userType && Methods.getUser(item.user).type !== "F") ? true : false
  showPostOwner = inRoles ? inRoles : showPostOwner;
  */
  const _canComment = Methods.listify(settings).filter((item: { sub: string; }) => {
    return item.sub === 'can_comment'
  })

  const width = screen.mainScreen.widthDIPs;

  let can_comment = _canComment.length === 0 ? true : _canComment[0]['value'];
  can_comment = Methods.you()._id === Methods.getUser(item.user)._id || Methods.you()._id === Methods.getUser(item.userTo)._id ? true : can_comment;

  const _canCommentLinks = Methods.listify(settings).filter((item: { sub: string; }) => {
    return item.sub === 'can_comment_link'
  })

  const _name = (item.sport && item.sport._id !== null) ? item.sport.image.split("/")[1] : "";

  const previewComments = Methods.inComments(item).filter((item__: { _id: any; }) => !errorComments.includes(item__._id));

  const { renderCommentBox } = AsyncPostItem;

  const isSingleVideo = !item.media ? false : (item.media.length === 1 && (item.media[0] && item.media[0].type === "video"));

  return (
    <React.Fragment>
      {!props.isPageView && <stackLayout row={0} height={{ value: 15, unit: 'dip' }} />}
      {!props.isPageView &&
        <gridLayout columns={`40, auto, *, 40`} paddingLeft={15} paddingRight={15} row={1}>
          <image decodeHeight={40} decodeWidth={40} src={Methods.getUser(item.userTo).image} loadMode={'async'} col={0} borderRadius={20} height={{ value: 40, unit: 'dip' }} width={{ value: 40, unit: 'dip' }} />

          <gridLayout rows={`auto, auto`} col={1} marginLeft={15} marginTop={-2} marginRight={15}>
            {!item.isShared &&
              <label row={0} style={{
                fontSize: 16,
                fontWeight: '500',
              }} text={Methods.nullify(Methods.getUser(item.userTo).name).toLowerCase()} />
            }
            {item.isShared &&
              <label row={0} textWrap={true} style={{
                fontSize: 16,
                fontWeight: '500',
              }}>
                <formattedString>
                  <span style={{
                    fontSize: 16,
                    fontWeight: '500',
                  }} text={Methods.nullify(Methods.getUser(item.userTo).name).toLowerCase()} />
                  <span style={{ fontSize: 16, color: new Color("#888") }} text={' shared a '} />
                  <span style={{
                    fontSize: 16,
                    fontWeight: '500',
                  }} text={Methods.nullify(item.shareType).toLowerCase()} />
                </formattedString>
              </label>
            }
            <label row={1} textWrap style={{
              fontSize: 10,
              marginTop: -3,
              color: new Color("#888"),
              verticalAlignment: 'middle',
              textAlignment: 'left'
            }} text={Methods.getDateFrom(parseInt(item.timeAgo), true).toUpperCase()} />
          </gridLayout>

          <stackLayout col={3}>
            {item.sport && item.sport._id !== null &&
              !props.hideSportLabel &&
              !item.is_live &&
              !item.isShared && (
                <image height={{ value: 30, unit: 'dip' }} width={{ value: 30, unit: 'dip' }} src={`https://supotsu.com/${item.sport.image.replace("_wht", "_drk").replace('.svg', '.png')}`} loadMode={'async'} />
              )}
          </stackLayout>
        </gridLayout>
      }

      <stackLayout padding={0} row={3} height={{ value: 10, unit: 'dip' }} />

      <stackLayout padding={0} row={4}>
        {AsyncPostItem.renderPhotos(item.media)}
        {!props.isShared && AsyncPostItem.renderSharedObject({ ...args })}
        {!props.isShared && item.links.length > 0 &&
          <PostLinkView {...props} link={item.links[0]} />
        }
        {!item.content &&
          <label onTap={args.onTap} style={{
            padding: `0 15`,
            marginBottom: ((isSingleVideo || props.isShared) && item.rawContent !== "") ? 15 : 0,
            fontSize: ((!item.isShared || Methods.listify(item.media).length === 0) && Methods.nullify(item.content).length <= 100) ? 15 : 15
          }} text={item.rawContent} />
        }

        {
          /**
           * shared view
           */
        }

        {item.content !== null && item.content.length > 0 &&
          <stackLayout padding={0} onTap={args.onTap}>
            <gridLayout columns={getItemSpec(['*', 'auto'])} style={{
              flexDirection: !props.isShared ? 'column' : 'row',
              //alignItems: 'flex-end'
              padding: `0 15`,
              //marginTop: item.isShared ? 15 : 0,
              //marginBottom: isSingleVideo ? 15 : 0,
            }}>
              {!props.isShared &&
                <RichTextView col={0} style={{
                  padding: `0 0`,
                  //flex: 1,linkCrop
                  marginBottom: (isSingleVideo || props.isShared) ? 15 : 0,
                  fontSize: ((!item.isShared || Methods.listify(item.media).length === 0) && Methods.nullify(item.content).length <= 100) ? 15 : 15,
                }}
                  //allowFont
                  onUserPress={(user) => {
                    if (user) {
                      //NavigationService.navigate({ routeName: route, params: user, key: user._id })
                    }
                  }} users={Methods.getTaggableUsers(item.contentUsers)} content={Methods.nullify(item.rawContent).length === 0 ? item.content.trim() : Methods.nullify(item.rawContent).trim()} userStyle={{}} hashStyle={{}} skillStyle={{}} linkStyle={{}} />
              }

              {props.isShared &&
                <flexboxLayout col={0} style={{
                  //flex: 1,
                  flexDirection: 'row',
                  paddingLeft: 0,
                  paddingRight: 0,
                  alignItems: 'center'
                }}>
                  <RichTextView
                    style={{
                      padding: `0 0`,
                      //flex: 1,linkCrop
                      fontSize: ((!item.isShared || Methods.listify(item.media).length === 0) && Methods.nullify(item.content).length <= 100) ? 15 : 15,
                    }}
                    onUserPress={(user) => {
                      if (user) {

                      }
                    }}
                    users={Methods.getTaggableUsers(item.contentUsers)}
                    content={Methods.nullify(item.rawContent).length === 0 ? item.content.trim() : Methods.nullify(item.rawContent).trim()}
                    userStyle={{}}
                    hashStyle={{}}
                    skillStyle={{}}
                    linkStyle={{}}
                  />
                </flexboxLayout>
              }

              {props.isShared &&
                <flexboxLayout col={1} style={{
                  //flex: 1,
                  flexDirection: 'row',
                  paddingLeft: 0,
                  paddingRight: 0,
                  alignItems: 'center'
                }}>
                  {item.likes.length > 0 && <label style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={Methods.shortDigit(item.likes.length, "Like").data} />}
                  {item.comments.length > 0 && <label style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={Methods.shortDigit(item.comments.length, "Comment").data} />}
                  {item.shares.length > 0 && <label style={{ color: new Color('#999'), fontSize: 12 }} text={Methods.shortDigit(item.shares.length, "Share").data} />}
                </flexboxLayout>
              }
            </gridLayout>
          </stackLayout>
        }
      </stackLayout>

      {item.content !== null && item.content.length > 0 &&
        <stackLayout onTap={args.onTap} padding={0} row={5} height={{ value: 2, unit: 'dip' }}></stackLayout>
      }

      {!props.isShared && !item.is_live && !(item.media.length === 1 && (item.media[0] && item.media[0].type === "video")) &&
        <stackLayout background="red" padding={0} row={6}>
          {AsyncPostItem.renderPostControls({ ...args })}
        </stackLayout>
      }
    </React.Fragment>
  );
}

export const AsyncComment = ({item, children, noReply, onReplyToggle, refreshParentData}: {
  item: ISupotsu.Comment;
  children?: React.ReactNode;
  onReplyToggle?(bool: boolean): void;
  refreshParentData?(): void;
  noReply?: boolean;
}) => {
  const {appRef, user:me} = React.useContext(AppAuthContext);
  const { client } = useSupotsuApolloContext();

  const [comment, updateComment] = React.useState<ISupotsu.Comment>(() => item)
  const [isReplying, setIsReplying] = React.useState(false);

  const [isLiking, setIsLiking] = React.useState(false)

  const like = () => {
    if (isLiking) return;
    const variables = {
      likeData: {
        _id: me._id,
        type: 'F',
        contentId: comment._id,
        contentType: 'comment',
      }
    }
    setIsLiking(true);
    client.mutate({
      variables,
      mutation: LIKE_COMMENT
    }).then(({ data }) => {
      setIsLiking(false);
      if (refreshParentData) refreshParentData();
    }).catch((err) => {
      console.log(err);
      setIsLiking(false)
    })
  }

  const columns = getItemSpec(['40', 'auto', '*', '20', '*']);
  const preview = false;
  if(comment.media){
    console.log(getImgSrc(comment.media))
  }

  const mediaSrc = comment.media ? getImgSrc(comment.media) : ""

  const ICON_SIZE = 22;
  return (
    <gridLayout style={{
      paddingLeft: 15,
      marginTop: 10,
    }} columns={columns}>
      {comment.user &&
        <flexboxLayout paddingTop={4} col={0} alignItems="flex-start">
          <image src={Methods.getUser(comment.user).image} stretch={'fill'} loadMode={'async'} borderRadius={20} height={{ value: 40, unit: 'dip' }} width={{ value: 40, unit: 'dip' }} />
        </flexboxLayout>
      }
      <stackLayout col={1} style={{
        margin: 10,
        marginTop: 4,
      }}>
        <stackLayout style={{
          verticalAlignment: 'middle',
          background: '#eee',
          borderRadius: 10,
          padding: '4 8',
          ...children || comment.media ? {
            marginBottom: 4
          } : {},
        }}>
          {comment.content && comment.content !== "" &&
            <stackLayout style={{
              verticalAlignment: 'middle'
            }}>
              <label style={{ padding: `2 0 0 0`, fontWeight: '600', color: '#000' }} text={Methods.nullify(Methods.getUser(comment.user).name).toLowerCase()} margin={0} />
              {comment.content !== "" &&
                <RichTextView style={{
                  padding: `-4 0 0 0`,
                  color: '#222',
                  fontSize: (Methods.nullify(comment.content).length <= 100) ? ms(15) : ms(13)
                }}
                  //allowFont
                  onUserPress={(user) => {
                    if (user) {

                    }
                  }}
                  users={Methods.getTaggableUsers(comment.contentUsers)} content={!comment.rawContent ? Methods.nullify(comment.content).trim() : Methods.nullify(comment.rawContent).trim()} userStyle={{}} hashStyle={{}} skillStyle={{}} linkStyle={{}} />
              }
            </stackLayout>
          }
          {comment.content && comment.content !== "" &&
            <stackLayout style={{
              verticalAlignment: 'middle'
            }}>
              <label style={{ padding: `10 0 0 0`, fontWeight: '600', color: '#000' }} text={Methods.nullify(Methods.getUser(comment.user).name).toLowerCase()} />
              {comment.content !== "" &&
                <RichTextView style={{
                  padding: `5 0 0 0`,
                  color: '#222',
                  fontSize: (Methods.nullify(comment.content).length <= 100) ? ms(15) : ms(13)
                }}
                  //allowFont
                  onUserPress={(user) => {
                    if (user) {

                    }
                  }}
                  users={[]} content={Methods.nullify(comment.content).trim()} userStyle={{}} hashStyle={{}} skillStyle={{}} linkStyle={{}} />
              }
            </stackLayout>
          }
        </stackLayout>
        {comment.media && (
          <flexboxLayout height={170} width={170} background={"#000"} borderRadius={10}>
            <image src={mediaSrc} stretch="fill" height={170} width={170} borderRadius={10}/>
          </flexboxLayout>
        )}
        <gridLayout columns="auto, *">
          <flexboxLayout col={0}>
            <PostItemButton
              col={1}
              style={{
                paddingLeft: 3,
                paddingRight: 3,
                opacity: isLiking ? 0.5 : 1,
              }} onPress={() => {
                like();
              }}
              Icon={
                <Methods.LikeIcon liked={Methods.listify(comment.likes).filter((like) => Methods.getUser(like.user)._id === Methods.you()._id).length > 0} size={ICON_SIZE + 2} />
              }
              Label={Methods.shortDigit(Methods.listify(comment.likes).length, "Like").data}
              count={Methods.shortDigit(Methods.listify(comment.likes).length, "Like").text}
              LabelColor={Methods.listify(comment.likes).filter((like) => Methods.getUser(like.user)._id === Methods.you()._id).length > 0 ? Theme2['500'] : "#000"}
            />

            {!noReply && (
              <PostItemButton col={2} style={{
                paddingLeft: 5
              }} countColor={Theme2['500']} onPress={() => {
                setIsReplying(!isReplying);
                onReplyToggle(!isReplying);
              }} Icon={
                <Methods.CommentIcon commented={Methods.listify(comment.replies).filter((reply) => Methods.getUser(reply.user)._id === Methods.you()._id).length > 0} size={ICON_SIZE} />
              } count={Methods.shortDigit(Methods.listify(comment.replies).length, "Reply").text} Label={Methods.shortDigit(Methods.listify(comment.replies).length, "Reply").data} />
            )}

          </flexboxLayout>
        </gridLayout>
        {children}
      </stackLayout>
    </gridLayout>
  )
}

const CommentComposer = () => {
  const [reply, setReply] = React.useState('');
  const postReply = (user, cb = () => {}) => {}
  return (
    <gridLayout height={70} borderTopColor="#eee" borderTopWidth={1} columns="auto, *, auto, auto" padding={"4 8"}>
      <stackLayout style={{
        height: 30,
        verticalAlignment: 'middle',
        horizontalAlignment: 'center'
      }} col={0} onTap={() => {
        // openFile();
      }}>
        <label className={'Ionicons'} text={IconSet.Ionicons["md-camera"]} style={{
          color: new Color('green'),
          fontSize: 25
        }} />
      </stackLayout>
      <stackLayout
        col={1}
        effectiveMinHeight={35}
        style={{
          margin: `0 12`,
          borderColor: '#ddd',
          verticalAlignment: 'middle',
          borderWidth: 1,
          borderRadius: 35 / 2
        }}
      >
        <textView
          hint={"Write a reply..."}
          style={{

          }}
          minHeight={35}
          text={reply}
          onTextChange={(args: PropertyChangeData) => {
            setReply(args.value)
          }}
          borderBottomColor={new Color('rgba(0,0,0,0)')}
        />
      </stackLayout>
      <flexboxLayout col={2} style={{
        height: 35,
        padding: `0 10`,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35 / 2,
        background: Theme2['500']
      }} onTap={() => {
        postReply(Methods.you(), () => {
          // if(refreshParentData) refreshParentData()
        });
      }}>
        <label style={{
          color: new Color('#fff'),
        }} text={"Reply"} />
      </flexboxLayout>
    </gridLayout>
  )
}
class PostDetails extends Component<any, any>{
  private readonly page: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();
  private readonly absoluteLayoutPageRef = React.createRef<NSVElement<Page>>();
  private readonly pageRef: React.RefObject<Page> = React.createRef<Page>();
  private io: any;
  private system: any;
  private confirmBox: any;
  comments = {}
  textField: RichInputField;
  modalCameraRef: Modal;
  cameraRef: CameraRoll;

  constructor(props: any) {
    super(props);
    this.state = {
      isLightHouse: this.props.isLightHouse || false,
      post: this.props.post
    }
  }
  componentDidMount = () => {
    const _that = this;
    setTimeout(() => {
      _that.getContent()
    }, 2000);
    Frame.topmost().showModal(this.absoluteLayoutPageRef.current!.nativeView, {
      context: {},
      closeCallback: () => {
        // this.closeCallback(true);
      },
      animated: true,
      fullscreen: true,
      stretched: false
    })
  }

  getContent = () => {
    const _that = this;
    const _data = {
      _id: _that.props.post._id
    }
    Methods.post(`https://supotsu.com/api/feed/view`, _data, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.error) {
          _that.props.onError(_that.props.post._id)
        } else {
          if (_that.props.onPostUpdate && typeof _that.props.onPostUpdate === "function") {
            _that.props.onPostUpdate(res)
          }
          _that.setState({ post: res, hasContent: true, hasComments: true }, () => {
            if (!_that.props.isPageView) {
              return;
            } else {
              AppSettings.setString(`post_${_that.props.post._id}`, JSON.stringify(res))
              setTimeout(() => {
                _that.getContent();
              }, 2000)
            }
          });
        }
      },
      error() {
        _that.props.onError(_that.props.post._id)
      }
    })
  }

  onReply = (comment, user) => {
    const _user = user ? user : comment.user;
    const content = _user && _user._id === Methods.you()._id ? `${_user.name}` : ` `;
    const raw = _user && _user._id === Methods.you()._id ? `%${_user._id}^${_user.type}% ` : ` `;
    this.setState({
      isReplyComment: comment,
      isReplyToCommentUser: user ? user : comment.user,
      isReplyToComment: true,
      comment: content,
      content: content,
      rawComment: raw,
      taggableUsers: [Methods.you(), Methods.you().friends, Methods.you().pages],
      isCommentBoxExpanded: true,
    })
  }

  reply = (user = Methods.you(), cb = () => { }) => {
    const item = this.state.post;
    //const _user = inRoles ? item.user : this.props.user;

    if (!this.state.isReplyComment) return;

    const reply = {
      //user: _user,
      post_id: item._id,
      comment_id: this.state.isReplyComment._id,
      content: this.state.comment,
      rawContent: this.state.rawComment,
      ...this.state.media ? {
        media: this.state.media
      } : {}
    };

    const _that = this;

    this.setState({ isPostingComment: true }, () => {
      if (Methods.shared('HomeScreen') && this.props.isHome) {
        if (_that.state.hasExternalTextInput) {
          Methods.shared('HomeScreen')._setTimelineState(false);
          _that.setState({ hasExternalTextInput: false });
        }
      }
    });

    Methods.post(`https://supotsu.com/api/feed/comment/reply`, {
      reply,
      user
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      success() {
        _that.setState({
          value: "",
          isError: false,
          isReplyComment: false,
          isReplyToComment: false,
          isReplyToCommentUser: false,
          rawComment: "",
          comment: "",
          isPostingComment: false,
          postToken: Date.now(),
          media: false,
          file: {},
          isCommentBoxExpanded: false
        });
        if (cb) cb()
      },
      error() {
        if (cb) cb()
        _that.setState({ isPostingComment: false });
      }
    })
  }

  comment = (user = Methods.you(), cb = () => { }) => {
    const item = this.state.post;
    //const _user = inRoles ? item.user : this.props.user;

    const comment = {
      user: user,
      postId: item._id,
      content: this.state.comment,
      rawContent: this.state.rawComment,
      type: this.state.post.commentType,
      ...this.state.media ? {
        media: this.state.media
      } : {}
    };
    const _that = this;

    this.setState({ isPostingComment: true }, () => {
      if (Methods.shared('HomeScreen') && this.props.isHome) {
        if (_that.state.hasExternalTextInput) {
          Methods.shared('HomeScreen')._setTimelineState(false);
          _that.setState({ hasExternalTextInput: false });
        }
      }
    });

    Methods.post(`https://supotsu.com/api/feed/comment`, {
      comment,
      user
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      success() {
        _that.setState({
          value: "",
          isError: false,
          rawComment: "",
          comment: "",
          isPostingComment: false,
          postToken: Date.now(),
          media: false,
          file: {},
          isCommentBoxExpanded: false
        });
        if (cb) cb();
      },
      error() {
        if (cb) cb()
        _that.setState({ isPostingComment: false });
      }
    })

    return;
  }

  onCommentInit = (id, comment) => {
    this.comments[id] = comment;
  }

  renderLightHouse = () => {
    const item: ISupotsu.Post = this.props.post;
    const media: ISupotsu.IFile[] = this.props.post.media;
    const isImageFirst = media[0].type === "image";
    const width = screen.mainScreen.widthDIPs;
    const height = screen.mainScreen.heightDIPs;
    let e = `?w=${width}&h=${height}`;
    if (isImageFirst && (media[0].width === media[0].height)) {
      e = `?w=${width}&h=${width}`;
    }

    return (
      <gridLayout row={0} rows={getItemSpec(['*', '50'])} background={'#000'}>
        <flexboxLayout style={{
          alignItems: 'center',
          justifyContent: 'center'
        }} row={0}>
          {isImageFirst &&
            <image stretch={'aspectFit'} src={`https://supotsu.com/${Methods.getThumbFolder(media[0].user)}/${media[0].url}${e}`} style={{
              width,
              background: '#000'
            }} />
          }
        </flexboxLayout>
        <flexboxLayout onTap={()=>{
          if(this.props.onCommentsOpen && typeof this.props.onCommentsOpen === "function") this.props.onCommentsOpen()
        }} row={1}  style={{
          flexDirection: 'row',
          paddingLeft: 16,
          paddingRight: 16,
          alignItems: 'center'
        }}>
          {item.likes.length > 0 && <label style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={Methods.shortDigit(item.likes.length, "Like").data} />}
          {item.comments.length > 0 && <label style={{ color: new Color('#999'), marginRight: 5, fontSize: 12 }} text={Methods.shortDigit(item.comments.length, "Comment").data} />}
          {item.shares.length > 0 && <label style={{ color: new Color('#999'), fontSize: 12 }} text={Methods.shortDigit(item.shares.length, "Share").data} />}
        </flexboxLayout>
      </gridLayout>
    )
  }

  renderComments = () => {
    return (
      <gridLayout rows={getItemSpec(['50', '*', 'auto'])} background={'#fff'}>
        <gridLayout row={0} borderBottomColor={new Color('#ddd')} borderBottomWidth={0.5}>
          <label verticalAlignment={'middle'} textAlignment={'center'} text={'Comments'} />
        </gridLayout>
        <scrollView
          row={1}
        >
          <stackLayout>
            {
              this.state.post.comments.map((comment: ISupotsu.Comment, index: any) => {
                return(
                  <AsyncComment item={comment} key={comment._id}/>
                )
              })
            }
          </stackLayout>
        </scrollView>
        <gridLayout row={2} borderTopColor={new Color('#ddd')} borderTopWidth={0.5}>
          {this.renderCommentBox()}
        </gridLayout>
      </ gridLayout>
    )
  }

  inRoleIds = (arr = [], user = false) => {
    let _c = Methods.listify(arr).filter((item) => {
      return Methods.getUser(item.user)._id = Methods.you()._id;
    });

    return _c.length > 0 ? true : false;
  }

  renderCommentBox = (commentProps: any = { isGlobal: false }) => {
    const item = this.state.post;

    const { isReplyToComment, settings, commentUser = Methods.you() } = this.state;


    const inRoles = Methods.inRoleIds((Methods.getUser(item.user).roles ? Methods.getUser(item.user).roles : []), (!Methods.getUser(item.user).roles ? false : item.user));
    let showPostOwner = (Methods.getUser(item.user)._id === this.props.user._id && Methods.getUser(item.user).type === this.props.userType && Methods.getUser(item.user).type !== "F") ? true : false
    showPostOwner = inRoles ? inRoles : showPostOwner;
    const _canComment = Methods.listify(settings).filter((item) => {
      return item.sub === 'can_comment'
    })


    let can_comment = _canComment.length === 0 ? true : _canComment[0]['value'];
    can_comment = Methods.you()._id === Methods.getUser(item.user)._id || Methods.you()._id === Methods.getUser(item.userTo)._id ? true : can_comment;

    const _canCommentLinks = Methods.listify(settings).filter((item) => {
      return item.sub === 'can_comment_link'
    })

    const _name = (item.sport && item.sport._id !== null) ? item.sport.image.split("/")[1] : "";

    if (this.state.isPostingComment && !this.state.isTypingReply) {
      return (
        <flexboxLayout style={{
          padding: ms(10),
          minHeight: ms(50),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: Methods.ifIphoneX(Methods.getStatusBarHeight(), ms(10))
        }}>
          <activityIndicator busy width={20} height={20} color={new Color(Theme2['500'])} />
        </flexboxLayout>
      )
    }

    if (commentProps.isGlobal) {
      return (
        <React.Fragment>
          <gridLayout columns={getItemSpec(['auto', '*', 'auto'])} style={{
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
            {(!this.props.isPageView && !this.state.isCommentBoxExpanded) &&
              <Methods.Avatar
                url={inRoles ? Methods.getUser(item.user).image : Methods.you().image}
                height={30}
                col={0}
                hasStroke={false}
                hasRadius={true}
                resizeMode={"contain"}
                {...this.props}
              />
            }
            {(this.props.isPageView || this.state.isCommentBoxExpanded) &&
              <stackLayout col={0} onTap={() => {
                this.setState({ isCameraOpen: true });
              }}>
                <label className={'Ionicons'} text={IconSet.Ionicons["md-camera"]} style={{
                  color: new Color('green'),
                  fontSize: 30
                }} />
              </stackLayout>
            }

            {!this.state.isCommentBoxExpanded &&
              <stackLayout col={1} onTap={() => {
                if (!this.props.isPageView) {
                  if (Methods.shared('globalTextView')) {
                    //this.setState({ isCommentBoxExpanded: true  });
                    Methods.shared('globalTextView')._setView(({ isGlobal = true, ...args }) => this.renderCommentBox({ isGlobal, ...args }))
                  }
                } else {
                  this.setState({ isCommentBoxExpanded: true });
                }
              }} style={{
                margin: `0 10`,
                height: 35,
                borderColor: '#ddd',
                verticalAlignment: 'middle',
                borderWidth: this.props.isPageView ? 1 : 0,
                borderRadius: 35 / 2
              }}>
                <label
                  style={{
                    padding: `0 10`,
                    color: new Color("#999")
                  }}
                  text={'Write a comment...'}
                />
              </stackLayout>
            }

            {this.state.isCommentBoxExpanded &&
              <stackLayout
                col={1}
              />
            }

            {(this.props.isPageView || this.state.isCommentBoxExpanded) &&
              <stackLayout col={2} style={{
                height: 35,
                padding: `0 10`,
                horizontalAlignment: 'center',
                verticalAlignment: 'middle',
                borderRadius: 35 / 2,
                background: Theme2['500']
              }} onTap={() => {
                if (this.state.comment.length === 0) return;

                this.comment(commentUser, () => {
                  if (commentProps.onBlur) commentProps.onBlur()
                });
              }}>
                <label style={{
                  color: new Color('#fff'),
                  marginRight: 5
                }} text={'Post as '} />
                {
                  <Methods.Avatar
                    url={commentUser.image}
                    height={25}
                    hasStroke={false}
                    hasRadius={true}
                    resizeMode={"contain"}
                    {...this.props}
                  />
                }
              </stackLayout>
            }
          </gridLayout>
          {this.state.isCameraOpen && this.renderCamera()}
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <gridLayout columns={getItemSpec(['auto', '*', 'auto', 'auto'])} style={{
          margin: 10,
          marginBottom: 10,
          padding: `0 5`,
          //marginTop: previewComments.length>0?0:10,
          height: 40,
          //paddingHorizontal: 10,
          //background: '#eee',
          //flexDirection: 'row',
          //borderColor: '#ddd',
          //justifyContent: 'center',
          //alignItems: 'center',
          //borderWidth: 1,
          borderRadius: 40 / 2
        }}>
          {(!this.props.isPageView && !this.state.isCommentBoxExpanded) &&
            <Methods.Avatar
              url={inRoles ? Methods.getUser(item.user).image : Methods.you().image}
              height={30}
              col={0}
              hasStroke={false}
              hasRadius={true}
              resizeMode={"contain"}
              {...this.props}
            />
          }
          {(this.props.isPageView || this.state.isCommentBoxExpanded) &&
            <stackLayout style={{
              height: 30,
              verticalAlignment: 'middle',
              horizontalAlignment: 'center'
            }} col={0} onTap={() => {
              this.renderCamera()
            }}>
              <label className={'Ionicons'} text={IconSet.Ionicons["md-camera"]} style={{
                color: new Color('green'),
                fontSize: 25
              }} />
            </stackLayout>
          }

          {(!this.state.isCommentBoxExpanded && !this.props.isPageView) &&
            <stackLayout col={1} onTap={() => {
              if (!this.props.isPageView) {
                if (Methods.shared('HomeScreen') && this.props.isHome) {
                  if (this.state.hasExternalTextInput) {
                    Methods.shared('HomeScreen')._setTimelineState(false);
                    this.setState({ hasExternalTextInput: false });
                  } else {
                    Methods.shared('HomeScreen')._setTimelineState(this);
                    this.setState({ hasExternalTextInput: true });
                  }
                } else {
                  this.setState({ isCommentBoxExpanded: true });
                }
              } else {
                this.setState({ isCommentBoxExpanded: true });
              }
            }} style={{
              margin: `0 10`,
              height: 35,
              borderColor: '#ddd',
              verticalAlignment: 'middle',
              borderWidth: this.props.isPageView ? 1 : 0,
              borderRadius: 35 / 2
            }}>
              <label style={{
                padding: `0 10`,
                color: new Color("#999")
              }} text={isReplyToComment ? "Write a reply..." : "Write a comment..."} />
            </stackLayout>
          }

          {(this.state.isCommentBoxExpanded || this.props.isPageView) &&
            <stackLayout
              col={1}
              effectiveMinHeight={35}
              style={{
                margin: `0 10`,
                borderColor: '#ddd',
                verticalAlignment: 'middle',
                borderWidth: this.props.isPageView ? 1 : 0,
                borderRadius: 35 / 2
              }}
            >
              <textView
                hint={isReplyToComment ? "Write a reply..." : "Write a comment..."}
                style={{

                }}
                minHeight={35}
                text={this.state.comment}
                onTextChange={(args: PropertyChangeData) => {
                  // this.setState({ comment: args.object.text })
                }}
                borderBottomColor={new Color('rgba(0,0,0,0)')}
              />
            </stackLayout>
          }

          {((this.props.isPageView || this.state.isCommentBoxExpanded) && Methods.listify(this.props.user.pages).length === 0) &&
            <stackLayout col={2} style={{
              height: 35,
              padding: `0 10`,
              horizontalAlignment: 'center',
              verticalAlignment: 'middle',
              borderRadius: 35 / 2,
              background: Theme2['500']
            }} onTap={() => {
              if (isReplyToComment) {
                this.reply()
              } else {
                this.comment();
              }
            }}>
              <label style={{
                color: new Color('#fff'),
                marginRight: 5
              }} text={isReplyToComment ? "Reply as" : "Post as"} />
              {
                <Methods.Avatar
                  url={commentUser.image}
                  height={25}
                  hasStroke={false}
                  hasRadius={true}
                  resizeMode={"contain"}
                  {...this.props}
                />
              }
            </stackLayout>
          }
          {((this.props.isPageView || this.state.isCommentBoxExpanded) && Methods.listify(this.props.user.pages).length > 0) &&
            <WhoShouldSeeTapPopUp
              col={2}
              single
              TriggerButton={({ label = false, ...props }) => {
                return (
                  <flexboxLayout
                    col={2}
                    style={{
                      height: 35,
                      padding: `0 10`,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 35 / 2,
                      background: Theme2['500']
                    }} {...props}>
                    <label style={{
                      color: new Color('#fff'),
                      marginRight: 5
                    }} text={isReplyToComment ? "Reply as" : "Post as"} />
                    {
                      <Methods.Avatar
                        url={commentUser.image}
                        height={25}
                        hasStroke={false}
                        hasRadius={true}
                        resizeMode={"contain"}
                        {...this.props}
                      />
                    }
                  </flexboxLayout>
                )
              }}
              title="Post As"
              onUserTap={(user) => {
                const cb = () => {
                  if (isReplyToComment) {
                    this.reply(user)
                  } else {
                    this.comment(user);
                  }
                }
                this.setState({ commentUser: user }, () => cb())
              }}
              onItemTap={(tag, i) => {
                this.setState({ isSelectingUser: true, activeWhoToSeeTab: tag, activeIndex: i });
              }}
            />
          }
        </gridLayout>
      </React.Fragment>
    )
  }

  renderCamera = () => {}

  render() {
    const { screenId, SocketIO } = this.props;
    const { isLightHouse, post } = this.state;
    const params = this.props.post;

    let io = false;

    if (SocketIO) {
      io = new SocketIO.connect("https://supotsu.com/post", { transports: ['websocket', 'polling'] });
    }
    return (
      <page ref={this.absoluteLayoutPageRef}>
        {post && post._id && <ViewPost post={post} />}
        {isLightHouse && this.renderLightHouse()}
        {!isLightHouse && this.renderComments()}
      </page>
    )
  }
}

interface ViewPostProps {
  post: ISupotsu.Post;
}
const ViewPost = ({ post }: ViewPostProps) => {
  const view = () => {
    const variables = {
      likeData: {
        _id: Methods.you()._id,
        type: 'F',
        contentId: post._id,
        contentType: 'post',
      }
    }
    client.mutate({
      variables,
      mutation: VIEW_POST
    }).then(({ data }) => {

    }).catch((err) => {

    })
  }

  React.useEffect(() => {
    view();
  }, [])
  return <></>;
}

export const PortalToPageWithActionBar: React.SFC<{ forwardedRef: React.RefObject<NSVElement<Page>>, actionBarTitle: string }> =
  (props) => {
    const { forwardedRef, actionBarTitle, children, ...rest } = props;
    console.log(`[PortalToPageWithActionBar - "${actionBarTitle}"] createPortal() forwardedRef.current: ${forwardedRef.current}`);
    return ReactNativeScript.createPortal(
      (
        <page ref={forwardedRef} actionBarHidden={false} {...rest} >
          <actionBar title={actionBarTitle} className={"action-bar"} />
          {children}
        </page>
      ),
      null,
      `Portal('${actionBarTitle}')`
    );
  }

export const FeedBackPopUp = (props: any) => null;
