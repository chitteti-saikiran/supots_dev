import * as React from 'react';
import * as ISupotsu from '~/DB/interfaces';
import { CommonHeader, Empty, PostItemButton, RichTextView, TrainingAddButtonIcon } from '~/ui/common.ui';
import { useNavigation, useRoute } from '@react-navigation/core';
import { StackLayout, GestureTypes, GestureEventData, EventData, Application, Color, PropertyChangeData } from "@nativescript/core";
import IconSet from '~/font-icons';
import Theme, { Theme2 } from "~/Theme";
import { onTouch } from "~/app";
import * as AppSettings from "@nativescript/core/application-settings";
import Methods from "~/Methods";
import { AsyncComment } from './AsyncPostItem';
import { UploadMeta } from '~/Screens/Events';
import { AppAuthContext } from './Root';
import { screen } from '@nativescript/core/platform/platform';
import { File } from '@nativescript/core/file-system'
import {FilePickerOptions, openFilePicker} from '@nativescript-community/ui-document-picker'
import { Request, CompleteEventData, ErrorEventData, ProgressEventData, ResultEventData, Session, Task, session as uploadSession } from 'nativescript-background-http'
import { ScrollView, TextField } from '@nativescript/core';
import { getImgSrc } from '~/Screens/Training';
import { getItemSpec } from '~/helpers';
import { useStyledContext } from '../contexts/StyledContext';
import { LIKE_REPLY } from '../services/graphql/post';
import { useSupotsuApolloContext } from '../contexts/SupotsuApolloContext';
import { GameSummaryGraphicItemFilter } from '~/Screens/Game';

interface CommentsThreadProps {
  comments: ISupotsu.Comment[],
  postId: string,
  postCommentType: string,
  col?: number,
  row?: number,
  isEdit?: boolean,
  path: 'feed' | 'session_file' | 'game' | 'gamePost',
  refreshParentData?(): void;
  team?: ISupotsu.Team;
  tag?: GameSummaryGraphicItemFilter;
  noComment?: boolean;
}

export const CommentsThread = ({
  comments,
  postCommentType,
  postId,
  col,
  row,
  isEdit = false,
  path = 'feed',
  refreshParentData,
  tag,
  team,
  noComment
}: CommentsThreadProps) => {
  const [comment, setComment] = React.useState('');
  const {
    user
  } = React.useContext(AppAuthContext)
  const { clearBorder } = useStyledContext();
  const scrollRef = React.useRef<ScrollView>(null)
  const textFieldRef = React.useRef<TextField>(null)
  const taskRef = React.useRef<Task>(null)
  const [uploadMeta, setUploadMeta] = React.useState<UploadMeta>({
    progress: 0,
    total: 0
  })
  const [media, setMedia] = React.useState<ISupotsu.IFile>(null)
  const [isPostingComment, setIsPostingComment] = React.useState(false);
  const [isReplying, setIsReplying] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isReplyComment, setIsReplyComment] = React.useState<ISupotsu.Comment>(null);
  const [data, setData] = React.useState<ISupotsu.Comment[]>(() => {
    return comments
  })

  const postComment = (user = Methods.you(), cb = () => { }) => {
    const commentData = {
      user: user,
      postId: postId,
      content: comment,
      rawContent: comment,
      type: postCommentType,
      ...media ? {
        media
      } : {},
      ...tag ? {
        tag
      } : {},
      ...team ? {
        team: team._id
      } : {},
    };

    setIsPostingComment(true);

    Methods.post(`https://supotsu.com/api/${path}/comment`, {
      comment: commentData,
      user
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        setData([...data, res])
        setComment('');
        setIsPostingComment(false);
        setMedia(null)

        const currentSV = scrollRef.current

        if(currentSV) {
          currentSV.scrollToVerticalOffset(currentSV.scrollableHeight + 250, true);
        }
        if (cb) cb();
      },
      error(err) {
        setIsPostingComment(false);
        alert(err);
      }
    })

    return;
  }

  const postReply = (user = Methods.you(), cb = () => { }) => {
    if (!isReplyComment) return;

    const reply = {
      //user: _user,
      post_id: postId,
      comment_id: isReplyComment._id,
      content: comment,
      rawContent: comment,
      ...media ? {
        media
      } : {}
    };
    setIsPostingComment(true);

    Methods.post(`https://supotsu.com/api/feed/comment/reply`, {
      reply,
      user
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        setIsPostingComment(null);
        setIsPostingComment(false);
        setIsReplying(false);
        if (cb) cb()
        setIsPostingComment(false);
      },
      error() {
        if (cb) cb()
        setIsPostingComment(false);
      }
    })
  }

  const removeFile = (_id) => {
    if (media && media._id === _id) {
      const dataTo = {
        _id,
        user: {
          _id: Methods.you()._id,
          type: Methods.you().type
        },
        img: media,
        tags: []
      };

      setIsUploading(true);

      Methods.post(`https://supotsu.com/api/file/remove`, dataTo, {
        headers: {
          'Content-Type': 'application/json'
        },
        success(res) {
          setMedia(null)
          if(!taskRef.current) setIsUploading(false);
        },
        error(err) {
          if(!taskRef.current) setIsUploading(false);
          alert(err)
        }
      })
    }
  }

  const openFile = () => {
    openFilePicker({
      pickerMode: 0,
      extensions: [".png", ".jpg"],
      multipleSelection: false
    }).then(({files}) => {
      if (files[0]) {
        if (media) removeFile(media._id)
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
            setIsUploading(true)
            setUploadMeta({
              progress,
              total
            })
          })

          task.on('error', (args: ErrorEventData) => {
            console.log('error', args)
            setIsUploading(false)
            taskRef.current = null;
            alert("Error while uploading file, please try again!")
          });

          task.on('responded', (args: ResultEventData) => {
            const _data = JSON.parse(args.data);
            console.log(_data);
            setIsUploading(false);
            setMedia(_data);
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

  React.useEffect(() => {
    const currentTaskRef = taskRef?.current
    if (currentTaskRef) {

    }

    return () => {
      if (currentTaskRef) {
        currentTaskRef.cancel();
      }

      if(media) {
        // removeFile(media._id)
      }
    }
  }, [taskRef, media])

  return (
    <gridLayout rows="*, auto,auto" {...row?{row}:{}} {...col?{col}:{}}>
      {data.length === 0 && (
        <flexboxLayout row={0} style={{
          width: '100%',
          padding: 20,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Empty text="No comments found!" />
        </flexboxLayout>
      )}
      {data.length > 0 && (
        <scrollView onLoaded={(args: EventData) => {
          const view = args.object as ScrollView;
          scrollRef.current = view;
        }} row={0}>
          <stackLayout style={{
            width: '100%',
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {
              data.map((item: ISupotsu.Comment, index: any) => {
                return(
                  <AsyncComment noReply={noComment} onReplyToggle={(bool: boolean) => {
                    setIsReplying(bool);
                    setIsReplyComment(item)
                    if (bool && textFieldRef.current) {
                      textFieldRef.current.focus()
                    }
                  }} item={item} key={item._id}>
                    {item.replies.length > 0 && (
                      <RepliesThread refreshParentData={refreshParentData} comment={item} limit={2} path={path} />
                    )}
                  </AsyncComment>
                )
              })
            }
          </stackLayout>
        </scrollView>
      )}
      {!isEdit && !isUploading && !isPostingComment && media && (
        <gridLayout marginTop={8} marginLeft={8} marginRight={8} background="#eee" padding={8} columns="*, auto" row={1}>
          <label>{media.name}</label>
          <TrainingAddButtonIcon onPress={() => removeFile(media._id)} col={1} icon="md-close" size={20} />
        </gridLayout>
      )}
      {!isEdit && !noComment && !isPostingComment && !isUploading && (
        <gridLayout row={2} height={70} borderTopColor="#eee" borderTopWidth={1} columns="auto, *, auto, auto" padding={"4 8"}>
          <stackLayout style={{
            height: 30,
            verticalAlignment: 'middle',
            horizontalAlignment: 'center'
          }} col={0} onTap={() => {
            openFile();
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
              hint={isReplying ? "Write a reply..." : "Write a comment..."}
              style={{

              }}
              minHeight={35}
              onLoaded={(args: EventData) => {
                const view = args.object as TextField;
                textFieldRef.current = view;
                clearBorder(args);
              }}
              text={''}
              onTextChange={(args: PropertyChangeData) => {
                setComment(args.value)
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
            if (!isReplying) {
              postComment(Methods.you(), () => {
                if(refreshParentData) refreshParentData()
              });
            } else {
              postReply(Methods.you(), () => {
                if(refreshParentData) refreshParentData()
              });
            }
          }}>
            <label style={{
              color: new Color('#fff'),
            }} text={isReplying?"Reply":"Post"} />
          </flexboxLayout>
        </gridLayout>
      )}
      {!isEdit && (isPostingComment || isUploading) && (
        <flexboxLayout row={2} height={70} borderTopColor="#eee" borderTopWidth={1} alignItems="center" justifyContent="center">
          <activityIndicator width={30} height={30} busy color={Theme2[500]} />
        </flexboxLayout>
      )}
    </gridLayout>
  )
}

interface RepliesThreadProps {
  comment: ISupotsu.Comment;
  limit: number;
  refreshParentData(): void;
}

const RepliesThread = ({
  path,
  comment,
  refreshParentData
}: RepliesThreadProps & Partial<CommentsThreadProps>) => {
  const [data, setData] = React.useState<ISupotsu.Reply[]>(() => {
    return comment.replies
  });
  const [showAll, setShowAll] = React.useState(false);
  return (
    <gridLayout style={{
      borderLeftColor: '#eee',
      borderLeftWidth: 1,
      paddingLeft: 16,
      paddingRight: 8,
      paddingBottom: 16,
    }}>
      {data.map((reply: ISupotsu.Reply) => {
        return <ThreadReply key={reply._id} reply={reply} refreshParentData={refreshParentData} />
      })}
    </gridLayout>
  )
}

interface ThreadReplyProps{
  reply: ISupotsu.Reply;
  refreshParentData(): void;
}

const ThreadReply = ({
  reply,
  refreshParentData,
}: ThreadReplyProps) => {
  const {appRef, user:me} = React.useContext(AppAuthContext);
  const { client } = useSupotsuApolloContext();

  const user = Methods.getUser(reply.user);
  const ICON_SIZE = 22;
  const columns = getItemSpec(['40', 'auto', '*', '20']);
  const mediaSrc = reply.media ? getImgSrc(reply.media) : "";

  const [isLiking, setIsLiking] = React.useState(false)

  const like = () => {
    if (isLiking) return;
    const variables = {
      likeData: {
        _id: me._id,
        type: 'F',
        contentId: reply._id,
        contentType: 'reply',
      }
    }
    setIsLiking(true);
    client.mutate({
      variables,
      mutation: LIKE_REPLY
    }).then(({ data }) => {
      setIsLiking(false);
      refreshParentData();
    }).catch((err) => {
      console.log(err);
      setIsLiking(false)
    })
  }

  return (
    <stackLayout>
      <gridLayout columns={columns}>
        <flexboxLayout paddingTop={4} col={0} alignItems="flex-start">
          <image src={user.image} stretch={'fill'} loadMode={'async'} borderRadius={15} height={{ value: 30, unit: 'dip' }} width={{ value: 30, unit: 'dip' }} />
        </flexboxLayout>
        <stackLayout col={1} style={{
          margin: 10,
          marginTop: 4,
        }}>
          <stackLayout style={{
            verticalAlignment: 'middle',
            background: '#eee',
            borderRadius: 10,
            padding: '4 8',
            ...reply.media ? {
              marginBottom: 4
            } : {},
          }}>
            {reply.content && reply.content !== "" &&
              <stackLayout style={{
                verticalAlignment: 'middle'
              }}>
                <label style={{ padding: `2 0 0 0`, fontWeight: '600', color: '#000' }} text={Methods.nullify(Methods.getUser(reply.user).name).toLowerCase()} margin={0} />
                {reply.content !== "" &&
                  <RichTextView style={{
                    padding: `-4 0 0 0`,
                    color: '#222',
                    fontSize: (Methods.nullify(reply.content).length <= 100) ? 15 : 13
                  }}
                    //allowFont
                    onUserPress={(user) => {
                      if (user) {

                      }
                    }}
                    users={Methods.getTaggableUsers(reply.contentUsers)} content={!reply.rawContent ? Methods.nullify(reply.content).trim() : Methods.nullify(reply.rawContent).trim()} userStyle={{}} hashStyle={{}} skillStyle={{}} linkStyle={{}} />
                }
              </stackLayout>
            }
          </stackLayout>
          {reply.media && (
            <flexboxLayout height={170} width={170} background={"#000"} borderRadius={10}>
              <image src={mediaSrc} stretch="fill" height={170} width={170} borderRadius={10} />
            </flexboxLayout>
          )}
        </stackLayout>
      </gridLayout>
      <gridLayout columns="auto, *" marginTop={-4}>
        <flexboxLayout col={0}>
          <PostItemButton
            col={1}
            style={{
              paddingLeft: 3,
              paddingRight: 3,
              opacity: isLiking ? 0.5 : 1
            }} onPress={() => {
              like();
            }}
            Icon={
              <Methods.LikeIcon liked={reply.likes.filter((like) => Methods.getUser(like.user)._id === Methods.you()._id).length > 0} size={ICON_SIZE + 2} />
            }
            Label={Methods.shortDigit(reply.likes.length, "Like").data}
            count={Methods.shortDigit(reply.likes.length, "Like").text}
            LabelColor={reply.likes.filter((like) => Methods.getUser(like.user)._id === Methods.you()._id).length > 0 ? Theme2['500'] : "#000"}
          />
        </flexboxLayout>
      </gridLayout>
    </stackLayout>
  )
}

interface CommentLightBoxProps {
  post: ISupotsu.Post;
  onCommentsOpen?(): void;
}

export const CommentLightBox = () => {
  const navigate = useNavigation();
  const route = useRoute();
  const { post, onCommentsOpen } = route.params as CommentLightBoxProps;
  const item: ISupotsu.Post = post;
  const media: ISupotsu.IFile[] = post.media;
  const isImageFirst = media[0].type === "image";
  const width = screen.mainScreen.widthDIPs;
  const height = screen.mainScreen.heightDIPs;
  let e = `?w=${width}&h=${height}`;
  if (isImageFirst && (media[0].width === media[0].height)) {
    e = `?w=${width}&h=${width}`;
  }

  return (
    <gridLayout row={0} rows="auto, *, 50" background={'#000'}>
      <CommonHeader
        transparent
        user={{
          name: Methods.getUser(item.user).name
        }}
        goBack={navigate.goBack}
      />
      <flexboxLayout style={{
        alignItems: 'center',
        justifyContent: 'center'
      }} row={1}>
        {isImageFirst &&
          <image stretch={'aspectFit'} src={
            'http://darylglass.co.za/supotsu-mobile/images/dummy_images/image_001.jpg'
          // `https://supotsu.com/${Methods.getThumbFolder(media[0].user)}/${media[0].url}${e}`
        } style={{
            width,
            background: '#000'
          }} />
        }
      </flexboxLayout>
      <flexboxLayout onTap={() => {
        if (onCommentsOpen && typeof onCommentsOpen === "function") onCommentsOpen()
      }} row={2} style={{
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

CommentLightBox.routeName = 'commentLightBox';
