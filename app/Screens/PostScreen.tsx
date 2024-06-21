import * as React from 'react';
import { Page, Color, isAndroid, isIOS, View } from 'tns-core-modules/ui/page/page';
import { goToPageReact, Props } from '../components/AppContainer';
import { Frame } from 'tns-core-modules/ui/frame';
import { ItemSpec } from 'tns-core-modules/ui/layouts/grid-layout/grid-layout';
import { screen } from 'tns-core-modules/platform/platform';
import { EventData } from 'tns-core-modules/data/observable/observable';
import { ScrollView, ScrollEventData } from 'tns-core-modules/ui/scroll-view';;
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout'
import { PanGestureEventData, SwipeGestureEventData, SwipeDirection, GestureTypes, PinchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import Icon from '~/components/Icon';
import { GooglePlacesAutocomplete } from 'nativescript-google-places-autocomplete';
import Methods, { ms } from '~/Methods';
import { getItemSpec } from '../helpers';
import Theme, { Theme2 } from '~/Theme';
import IconSet from '~/font-icons';
import { CreateViewEventData, ItemEventData, ImageSource, GestureEventData, TextView, Application, Placeholder } from '@nativescript/core';
import { ModalProps, CameraRoll, ModalHeaderSize, ModalActionButon, CameraRollCallback, Modal, GoLiveUserPicker, WhoShouldSeeTapPopUp } from '~/ui/common.ui';
import { Client, IQ, Stanza } from "nativescript-xmpp-client";
import * as JID from 'nativescript-xmpp-client/lib/deps/@xmpp/jid/lib/JID.js';
import * as xml2js from 'nativescript-xml2js'
import { onTouch, ScreenProps } from '../app';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { useState } from 'react';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { NodePublisherDelegate } from '~/gmc/gmx-react';
import { CapturePictureListener } from '../gmc/gmx-react';
import * as ISupotsu from '~/DB/interfaces';
import { Request, CompleteEventData, ErrorEventData, ProgressEventData, ResultEventData, Session, Task, session } from 'nativescript-background-http'
import { Folder, FileSystemEntity, File, knownFolders, path } from "tns-core-modules/file-system";
import * as AppSettings from 'tns-core-modules/application-settings';
import { ListView as $ListView, NSVElement } from "react-nativescript";
import { TextField } from 'tns-core-modules/ui/text-field';
import { useNavigation, useRoute } from '@react-navigation/core';
import { AppAuthContext } from '../components/Root';
import { useStyledContext } from '~/contexts/StyledContext';
import { getImage, getImageBMP } from '../utils/screenshot';
import { requestPermissions } from 'nativescript-permissions'
import { useStreamRTMP } from '~/hooks/useStreamRTMP';

interface CreatePostContextData {
  Context: any,
  refreshPostContext(sport: any, cb: (bool?: boolean) => void): void,
  removeFile(_id: any): void,
  renderCamera(): void,
  renderTextEdit(): JSX.Element,
  onPost(type: any, cb: (bool?: boolean) => void): void,
  onPostCheckIn(type: any, cb: (bool?: boolean) => void): void,
  uploadFile(type: any, cb: (bool?: boolean) => void): void,
}
export const CreatePostContext = React.createContext({} as CreatePostContextData);

export const CreatePostProvider: React.FC = ({
  children
}) => {
  const { clearBorder } = useStyledContext();
  const { user: me } = React.useContext(AppAuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [cameraRef, setCameraRef] = useState<any>();
  const [modalCameraRef, setModalCameraRef] = useState<any>();
  const [state, updateState] = useState<any>({
    selectedIndex: 0,
    init: true,
    photo: false,
    hasPostMedia: false,
    hasPhotoMedia: false,
    isFront: true,
    animatedValue: null,
    isShowMore: false,
    isPosting: false,
    isTyping: false,
    postRefresh: Date.now(),
    checkRefresh: Date.now(),
    isUserSending: false,
    isCameraOpen: false,
    keyword: "",
    tags: [],
    links: [],
    friends: Methods.you().friends,
    post: {
      content: "",
      rawContent: "",
      postType: "normal",
      media: [],
      links: [],
      tags: [],
      audienceList: [],
      place: { name: "" },
      coord: { lat: 0, lng: 0 }
    },
    photoPost: {
      content: "",
      rawContent: "",
      postType: "normal",
      media: [],
      links: [],
      tags: [],
      audienceList: [],
      place: { name: "" },
      coord: { lat: 0, lng: 0 }
    },
    checkInPost: {
      content: "",
      rawContent: "",
      postType: "normal",
      media: [],
      links: [],
      tags: [],
      audienceList: [],
      place: { name: "" },
      coord: { lat: 0, lng: 0 }
    },
    linkImages: [
      {
        url: false
      },
      {
        url: false
      },
      {
        url: false
      },
      {
        url: false
      },
      {
        url: false
      }
    ],
    sport: { id: null },
    location: "",
    isCheckingIn: false,
    coord: { lat: 0, lng: 0 },
    typeState: {
      text: "",
      step: 1
    },
    showInput: false,
    checkInState: {
      step: 1
    },
    isTagging: false,
    cameraState: {
      step: 1
    },
    videoState: {
      step: 1
    },
    fileUploads: {},
    fileLoading: {},
    fileRemoved: {},
    user: Methods.you(),
    tag: { val: "Public" }
  });

  const props: Record<string, any> = route.params || {
    user: {
      ...me,
      type: "F"
    },
    isAdmin: true,
    postToName: me.name,
    postToImage: me.image,
    postToId: me._id,
    postToType: me.type || "F",
  };

  const setState = (newState, cb = () => {}) => {
    updateState({
      ...state,
      ...newState,
    });

    if (cb) cb();
  };

  const resetState = () => {
    updateState({
      selectedIndex: 0,
      init: true,
      photo: false,
      hasPostMedia: false,
      hasPhotoMedia: false,
      isFront: true,
      animatedValue: null,
      isShowMore: false,
      isPosting: false,
      isTyping: false,
      postRefresh: Date.now(),
      checkRefresh: Date.now(),
      isUserSending: false,
      isCameraOpen: false,
      keyword: "",
      tags: [],
      friends: Methods.you().friends,
      post: {
        content: "",
        rawContent: "",
        postType: "normal",
        media: [],
        links: [],
        tags: [],
        audienceList: [],
        place: { name: "" },
        coord: { lat: 0, lng: 0 }
      },
      photoPost: {
        content: "",
        rawContent: "",
        postType: "normal",
        media: [],
        links: [],
        tags: [],
        audienceList: [],
        place: { name: "" },
        coord: { lat: 0, lng: 0 }
      },
      checkInPost: {
        content: "",
        rawContent: "",
        postType: "normal",
        media: [],
        links: [],
        tags: [],
        audienceList: [],
        place: { name: "" },
        coord: { lat: 0, lng: 0 }
      },
      linkImages: [
        {
          url: false
        },
        {
          url: false
        },
        {
          url: false
        },
        {
          url: false
        },
        {
          url: false
        }
      ],
      sport: { id: null },
      location: "",
      isCheckingIn: false,
      coord: { lat: 0, lng: 0 },
      typeState: {
        text: "",
        step: 1
      },
      showInput: false,
      checkInState: {
        step: 1
      },
      isTagging: false,
      cameraState: {
        step: 1
      },
      videoState: {
        step: 1
      },
      fileUploads: {},
      fileLoading: {},
      fileRemoved: {},
      user: Methods.you(),
      tag: { val: "Public" }
    })
  }

  const renderTextEdit = () => {
    const { isCliked, isTyping, photoPost, checkInPost, selectedIndex: currentIndex, post, friends, typeState, checkInState, cameraState } = state;

    const contentFor = currentIndex === 0 ? post.content : currentIndex === 1 ? photoPost.content : checkInPost.content;
    return (
      <textView
        style={{
          fontSize: ms(30),
          padding: ms(20),
          color: new Color(currentIndex === 0 ? (post.content === "" ? "#999" : "#000") : currentIndex === 1 ? photoPost.content === "" ? "#999" : "#FFF" : checkInPost.content === "" ? "#999" : "#000"),
          textAlignment: "center",
          verticalAlignment: 'middle',
          fontWeight: "bold",
          borderBottomWidth: 0,
          borderBottomColor: 'transparent'
        }}
        onLoaded={clearBorder}
        onTextChange={(args: any) => {
          const { friends } = Methods.you();
          const content = args.object.text;
          console.log(content)
          const links = post.links;
          const _ = Methods.nullify(content).toLowerCase() as string
          //const { post } = state;
          Methods.listify(_.split(" ")).forEach((item, i) => {
            if (Methods.isWebsite(item) && !links.includes(item)) {
              links.push(item);
            }
          });

          let rawText = Methods.nullify(content);

          if (currentIndex === 0) {
            post.content = content;
            post.rawContent = rawText;
            post.links = links;
            setState({ post });
          } else if (currentIndex === 1) {
            photoPost.content = content;
            photoPost.rawContent = rawText;
            setState({ photoPost });
          } else if (currentIndex === 3) {
            checkInPost.content = content;
            checkInPost.rawContent = rawText;
            setState({ checkInPost, links });
          }
        }}
        borderBottomWidth={0}
        text={contentFor}
        hint={currentIndex === 0 ? (post.content === "" ? "TAP TO TYPE" : post.content) : currentIndex === 1 ? (photoPost.content === "" ? "" : photoPost.content) : (checkInPost.content === "" ? "TAP TO TYPE" : checkInPost.content)}
      />
    );
  };

  const renderCamera = () => {
    const { isCliked, isCameraOpen, isWhoToSee, isWhoToSeeContent, post } = state;
    if (state.isCameraOpen) return;
    const _that = this;
    const render = () => {
      return (
        <CameraRoll isSingle={false} fileType="none" pickerType={"Photos"} {...props} toId={props.postToId} onRef={(ref) => {
          setCameraRef(ref);
        }} toType={props.postToType} />
      )
    }
    setState({ isCameraOpen: true });
    const opt: ModalProps = {
      title: "Select Photo",
      onDoneTitle: 'DONE',
      size: ModalHeaderSize.mini,
      onDoneButton: ModalActionButon.blue,
      render,
      onDone: (_modal: Modal) => {
        if (!cameraRef) return;
        const media: CameraRollCallback[] = cameraRef.getPhotoList();
        const _postLen: number = state.post.media.length;
        if (media.length <= 0) {
          alert('Select file to upload!');
          return;
        }
        const cb = () => {
          if (_modal) {
            _modal.closeCallback()
          }

          Methods.listify(media).forEach((item, i) => {
            post.media[_postLen + i] = {
              _tmpId: item.file.name,
              progress: 0,
              total: 0,
              url: item.url
            }
          })

          setState({ post })
        }
        cb()
        Methods.listify(media).forEach((item: CameraRollCallback, index: number) => {
          console.log('uploading...');
          const indexOf = _postLen + index;
          const exts = [".jpeg", ".jpg", ".png", ".gif", '.mp4', '.mov', '.mpg', '.flv', '.3gp', '.wmv', '.flv', '.avi'];
          const imgs = [".jpeg", ".jpg", ".png", ".gif"];
          const vids = ['.mp4', '.mov', '.mpg', '.flv', '.3gp', '.wmv', '.flv', '.avi'];
          const ext = Methods.ext(item.file.name);
          const run = () => {
            const fileobj = item
            const url = "https://supotsu.com/api/file/upload"

            var request: Request = {
              url: url,
              method: "POST",
              headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": fileobj.file.name
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
              { name: "objType", value: fileobj.objType || "profile" },
              { name: "fromId", value: Methods.you()._id },
              { name: "fromType", value: Methods.you().type },
              { name: "toId", value: props.user._id },
              { name: "toType", value: props.user.type },
              { name: "file", filename: fileobj.file.path, mimeType: `image/${ext(fileobj.file.name)}` }
            ];

            const session_ = session(fileobj.url)
            var task: Task = session_.multipartUpload(params, request);
            task.on('complete', (args: CompleteEventData) => {
              //_modal.closeCallback(false);
              //task.cancel();
              //console.log(args)
            })
            task.on('progress', (args: ProgressEventData) => {
              console.log(args.currentBytes, "/", args.totalBytes);
              state.post.media.forEach((_post, _i) => {
                if (_post._tmpId && (_post._tmpId === item.file.name)) {
                  state.post.media[_i] = {
                    ..._post,
                    progress: args.currentBytes / args.totalBytes * 100,
                    total: args.totalBytes / args.totalBytes * 100,
                  };
                  setState({
                    post: state.post
                  })
                }
              })
            })

            task.on('error', (args: ErrorEventData) => {
              console.log('error', args)
            });

            task.on('responded', (args: ResultEventData) => {
              const _data = JSON.parse(args.data);
              const _post = state.post.media[indexOf];
              if (_post) {
                state.post.media[indexOf] = _data
                setState({
                  post: state.post
                })
              }
              console.log(_data);
              //post.media.push(_data)
              setState({ isCameraOpen: false, post, hasPostMedia: post.media.length > 0 ? true : false });
              //task.cancel();
            });
          }

          run();
        })
      },
      //actionBarHidden: true,
      ref: (ref) => {
        setModalCameraRef(ref);
      },
      onClose: () => {
        setState({ isCameraOpen: false });
        if (modalCameraRef) {
          //modalCameraRef.closeCallback(false)
        }
      }
    }

    goToPageReact(Modal, opt, 'modalCameraRef')
  }

  const icons = () => {
    const _that = this;
    return [
      {
        name: 'location-on',
        label: 'Check In',
        desc: 'Check In',
        color: '#EB6262',
        cb: () => {
          setState({ isCheckingIn: true });
        }
      },
      false,
      {
        name: 'person-add',
        label: 'Tag',
        desc: 'Tag friends',
        color: '#4ac',
        cb: () => {
          setState({ isTagging: true });
        }
      }
    ]
  }

  const onPost = (type, cb = () => { }) => {
    if (state.isError) {
      Methods.alert('Please check your post content before submitting');
      setState({ isSending: false });
      return;
    }

    if (state.post.content === "" && state.post.media.length === 0) {
      Methods.alert('Please type your post content before submitting');
      setState({ isSending: false });
      return;
    }

    const stillUpload = state.post.media.filter((item, i) => {
      if (item._tmpId) return true;
      return false
    });

    if (stillUpload.length && stillUpload.length > 0) {
      Methods.alert('Please wait for media file to finish uploading!');
      return;
    }

    const { refreshPosts } = props;

    const finalCB = () => {
      if (refreshPosts && typeof refreshPosts === "function") {
        refreshPosts();
      }
      resetState();
    }

    const links = [];

    Methods.listify(state.post.content.split(" ")).forEach((item, i) => {
      if (Methods.isWebsite(item) && !links.includes(item)) {
        links.push(item);
      }
    });

    console.log('links', links)

    const { typeState } = state;
    typeState.step = 4;
    setState({ isPosting: true, isCliked: false, isUserSending: false, typeState });

    const user = state.user.type ? state.user : Methods.you()

    const _that = this;
    const _user = {
      id: props && props.isAdmin ? (user.type === "Q" ? Methods.you()._id : user._id) : Methods.you()._id,
      type: props && props.isAdmin ? (user.type === "Q" ? "F" : user.type) : "F"
    };

    const _userTo = props && !props.isAdmin ? {
      name: props.postToName,
      image: props.postToImage,
      id: props.postToId,
      type: props.postToType
    } : {
        name: user.name,
        image: user.image,
        id: user._id,
        type: user.type
      }

    const successCB = (res) => {
      Methods.alert("Post added!")
      if (Methods.shared(`home-posts`)) {
        Methods.shared(`home-posts`).newPost(res)
      }

      setState({
        isPosting: false,
        isTyping: false,
        postToken: Date.now(),
        canAddLinkImages: false,
        postRefresh: Date.now(),
        links: [],
        post: {
          content: "",
          postType: "normal",
          media: [],
          links: [],
          tags: [],
          audienceList: [],
          place: { name: "" },
          coord: { lat: 0, lng: 0 }
        },
        typeState: {
          text: "",
          step: 1
        },
        sport: { id: null },
        linkImages: [
          {
            url: false
          },
          {
            url: false
          },
          {
            url: false
          },
          {
            url: false
          },
          {
            url: false
          }
        ],
        location: "",
        isModalOpen: false,
        isTagging: false,
        isWhoToSee: false,
        isSending: false,
        isModalAlbumOpen: false
      });
      cb()
      finalCB();
    }

    const failCB = (err) => {
      Methods.snackbar({
        text: "Post not added!",
        isError: true
      })

      setState({
        typeState: {
          text: "",
          step: 1
        },
        isPosting: false,
        isTyping: false,
      })
    }

    const linkImages = [];
    console.log('here')
    Methods.listify(state.linkImages)
      .filter((item, i) => {
        return item.id;
      })
      .forEach((item, id) => {
        linkImages.push(item.url);
      });

    const isPhoto = state.post.media.length === 1 && state.post.media[0]['type'] === 'image' ? true : false;
    const isVideo = state.post.media.length === 1 && state.post.media[0]['type'] === 'video' ? true : false;

    const newPost = {
      user: _user,
      userTo: _userTo,
      type: 1,
      postType: "normal",
      sport: state.sport,
      isError: false,
      isEvent: false,
      content: state.post.content,
      rawContent: state.post.rawContent,
      media: state.post.media.map((item) => item._id),
      timeAgo: new Date(),
      isLiked: false,
      likes: [],
      links,
      linkImages: linkImages,
      place: state.post.place,
      shares: [],
      commentType: "post",
      audience: "friends",
      tagged: state.post.tags,
      audienceList: state.post.audienceList,
      tagsLen: state.post.tags.length,
      comments: [],
      ...isPhoto ? {
        commentType: 'photo',
        file: state.post.media[0]._id,
        pages: ['timeline', 'photos']
      } : isVideo ? {
        commentType: 'video',
        video: state.post.media[0]._id,
        video_id: state.post.media[0]._id,
        pages: ['timeline', 'videos']
      } : {},
    };

    Methods.post(`https://supotsu.com/api/feed/create`, newPost, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        setState({ res }, () => {
          if (res.error) {
            failCB(res)
          } else {
            successCB(res)
          }
        })
      },
      error(err) {
        failCB(err);
      }
    })

    setTimeout(() => {
      if (props.componentId) {
        //props.goBack();
      } else {
        //props.navigation.goBack()
      }
    }, 500)

    return;
  }

  const uploadFile = (type, cb = (bool: boolean) => { }) => {
    if (state.photoPost.media.length === 0) {
      Methods.alert('Please capture a photo to upload');
      setState({ isSending: false });
      cb(true)
      return;
    }

    const stillUpload = state.photoPost.media.filter((item, i) => {
      if (item._tmpId) return true;
      return false
    });

    if (stillUpload.length && stillUpload.length > 0) {
      Methods.alert('Please wait for media file to finish uploading!');
      cb(true)
      return;
    }

    const { refreshPosts } = props;

    const finalCB = () => {
      if (refreshPosts && typeof refreshPosts === "function") {
        refreshPosts();
      }
      resetState();
    }

    const { typeState } = state;
    typeState.step = 4;
    setState({ isPosting: true, isCliked: false, isUserSending: false, typeState });

    const user = state.user.type ? state.user : Methods.you()

    const _that = this;
    const _user = {
      id: props && props.isAdmin ? (user.type === "Q" ? Methods.you()._id : user._id) : Methods.you()._id,
      type: props && props.isAdmin ? (user.type === "Q" ? "F" : user.type) : "F"
    };

    const _userTo = props && !props.isAdmin ? {
      name: props.postToName,
      image: props.postToImage,
      id: props.postToId,
      type: props.postToType
    } : {
        name: user.name,
        image: user.image,
        id: user._id,
        type: user.type
      }

    const successCB = (res) => {
      Methods.alert("Post added!")
      if (Methods.shared(`home-posts`)) {
        Methods.shared(`home-posts`).newPost(res)
      }

      setState({
        isPosting: false,
        isTyping: false,
        postToken: Date.now(),
        canAddLinkImages: false,
        postRefresh: Date.now(),
        photoPost: {
          content: "",
          postType: "normal",
          media: [],
          links: [],
          tags: [],
          audienceList: [],
          place: { name: "" },
          coord: { lat: 0, lng: 0 }
        },
        cameraState: {
          text: "",
          step: 1
        },
        sport: { id: null },
        linkImages: [
          {
            url: false
          },
          {
            url: false
          },
          {
            url: false
          },
          {
            url: false
          },
          {
            url: false
          }
        ],
        location: "",
        isModalOpen: false,
        isTagging: false,
        isWhoToSee: false,
        isSending: false,
        isModalAlbumOpen: false
      });
      cb(false)
      finalCB();
    }

    const failCB = (err) => {
      Methods.snackbar({
        text: "Post not added!",
        isError: true
      })

      setState({
        typeState: {
          text: "",
          step: 1
        },
        isPosting: false,
        isTyping: false,
      })
      cb(true)
    }

    const linkImages = [];
    console.log('here')
    Methods.listify(state.linkImages)
      .filter((item, i) => {
        return item.id;
      })
      .forEach((item, id) => {
        linkImages.push(item.url);
      });

    const isPhoto = state.photoPost.media.length === 1 && state.photoPost.media[0]['type'] === 'image' ? true : false;
    const isVideo = state.photoPost.media.length === 1 && state.photoPost.media[0]['type'] === 'video' ? true : false;

    const newPost = {
      user: _user,
      userTo: _userTo,
      type: 1,
      postType: "normal",
      sport: state.sport,
      isError: false,
      isEvent: false,
      content: state.photoPost.content,
      rawContent: state.photoPost.rawContent,
      media: state.photoPost.media,
      timeAgo: new Date(),
      isLiked: false,
      likes: [],
      links: state.photoPost.links,
      linkImages: linkImages,
      place: state.photoPost.place,
      shares: [],
      commentType: "post",
      audience: "friends",
      tagged: state.photoPost.tags,
      audienceList: state.photoPost.audienceList,
      tagsLen: state.photoPost.tags.length,
      comments: []
    };
  }

  const onPostCheckIn = (type, cb = () => { }) => {
    if (state.isError) {
      Methods.alert('Please check your post content before submitting');
      setState({ isSending: false });
      return;
    }

    if (state.checkInPost.content === "") {
      Methods.alert('Please type your post content before submitting');
      setState({ isSending: false });
      return;
    }

    const { refreshPosts } = props;

    const finalCB = () => {
      if (refreshPosts && typeof refreshPosts === "function") {
        refreshPosts();
      }
      resetState();
    }

    const { checkInState } = state;
    checkInState.step = 4;
    setState({ isPosting: true, isCliked: false, isUserSending: false, checkInState });

    const user = state.user.type ? state.user : Methods.you()

    const _that = this;
    const _user = {
      id: props && props.isAdmin ? (user.type === "Q" ? Methods.you()._id : user._id) : Methods.you()._id,
      type: props && props.isAdmin ? (user.type === "Q" ? "F" : user.type) : "F"
    };

    const _userTo = props && !props.isAdmin ? {
      name: props.postToName,
      image: props.postToImage,
      id: props.postToId,
      type: props.postToType
    } : {
        name: user.name,
        image: user.image,
        id: user._id,
        type: user.type
      }

    const linkImages = [];
    Methods.listify(state.linkImages)
      .filter((item, i) => {
        return item.id;
      })
      .forEach((item, id) => {
        linkImages.push(item.url);
      });

    const newPost = {
      user: _user,
      userTo: _userTo,
      type: 1,
      postType: "normal",
      sport: state.sport,
      isError: false,
      isEvent: false,
      content: state.checkInPost.content,
      rawContent: state.checkInPost.rawContent,
      media: state.checkInPost.media.map((item) => item._id),
      timeAgo: new Date(),
      isLiked: false,
      likes: [],
      links: state.post.links,
      linkImages: linkImages,
      place: state.checkInPost.place,
      shares: [],
      commentType: "post",
      audience: "friends",
      tagged: state.checkInPost.tags,
      audienceList: state.checkInPost.audienceList,
      tagsLen: state.checkInPost.tags.length,
      comments: []
    };

    const successCB = (res) => {
      Methods.alert("Post added!")
      if (Methods.shared(`home-posts`)) {
        Methods.shared(`home-posts`).newPost(res)
      }
      setState({
        isPosting: false,
        isTyping: false,
        checkRefresh: Date.now(),
        checkInPost: {
          content: "",
          postType: "normal",
          media: [],
          links: [],
          tags: [],
          audienceList: [],
          place: { name: "" },
          coord: { lat: 0, lng: 0 }
        },
        checkInState: {
          step: 1
        },
        sport: { id: null }
      });
      cb()
      finalCB()
    }

    const failCB = (err) => {
      Methods.snackbar({
        text: "Post not added!",
        isError: true
      })
      setState({
        checkInState: {
          step: 1
        },
        isPosting: false,
        isTyping: false,
      })
    }

    Methods.post(`https://supotsu.com/api/feed/create`, newPost, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        setState({ res }, () => {
          if (res.error) {
            failCB(res)
          } else {
            successCB(res)
          }
        })
      },
      error(err) {
        failCB(err);
      }
    })

    setTimeout(() => {
      // go back;
    }, 500)

  }

  const refreshPostContext = (sport, cb) => {
    const _that = this;
    const { post, selectedIndex: currentIndex, photo, photoPost, hasPhotoMedia, checkInPost } = state;
    const { friends } = Methods.you();

    if (currentIndex === 0) {
      setState({ post }, () => {
        onPost(sport, cb)
      });
    } else if (currentIndex === 1) {
      setState({ photoPost }, () => {
        uploadFile(photoPost)
      });
    } else if (currentIndex === 3) {
      setState({ checkInPost }, () => {
        onPostCheckIn(sport, cb)
      });
    }
  }

  const removeFile = (_id) => {
    const _that = this;
    const { post, fileLoading, fileRemoved } = state;
    console.log('TEST')
    Methods.listify(post.media).forEach((f, i) => {
      if (f._id === _id) {
        const file = f;
        const dataTo = {
          _id,
          user: {
            _id: Methods.you()._id,
            type: Methods.you().type
          },
          img: file,
          tags: []
        };

        Methods.post(`https://supotsu.com/api/file/remove`, dataTo, {
          headers: {
            'Content-Type': 'application/json'
          },
          success(res) {
            post.media.splice(i, 1);
            fileLoading[f._id] = false;
            fileRemoved[f._id] = true
            setState({
              post,
              fileLoading,
              fileRemoved
            });
          },
          error(err) {
            fileLoading[f._id] = false;
            setState({
              err,
              fileLoading
            })
          }
        })
      }
    });
  }

  const Context = {
    setState,
    removeFile,
    renderCamera,
    renderTextEdit,
    state,
    icons,
    refreshPostContext,
  }
  return (
    <CreatePostContext.Provider
      value={{
        Context,
        refreshPostContext,
        removeFile,
        renderCamera,
        renderTextEdit,
        onPost,
        onPostCheckIn,
        uploadFile,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  )
}
export const useCreatePostContext = () => React.useContext(CreatePostContext)

interface PostScreenProps {
  onBack?(): void
  user: any,
  selectedIndex: number,
}

export const Type = (p: any) => {
  const { Context, renderTextEdit = () => null, children, isActive = true, showCameraPick = () => { }, ...props } = p;
  //if(!isActive) return null;
  const { isTyping, currentIndex, post, fileUploads, fileLoading, user, tag } = Context.state;
  const typeState = Context.state.typeState || { step: 1, text: ""}
  const { step, text } = typeState ;
  const [isShowMore, setIsShowMore] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  console.log(p.postToType);

  if (isPosting) {
    return (
      <gridLayout rows={getItemSpec(['*'])}>
        <flexboxLayout row={0} style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <activityIndicator busy color={new Color(Theme2['500'])} />
        </flexboxLayout>
      </gridLayout>
    )
  }

  return (
    <gridLayout rows={getItemSpec(['auto', 'auto', '*', 'auto', 'auto', '80'])}>
      {typeState.step < 4 &&
        <gridLayout columns={getItemSpec(['auto', '*', 'auto', '80'])} height={50} row={0}>
          <label col={0} className={'Ionicons'} text={IconSet.Ionicons["ios-arrow-back"]} color={new Color('#000')}
            style={{
              fontSize: 25,
              marginLeft: 10,
              marginRight: 5,
              textAlignment: 'center', verticalAlignment: 'middle'
            }}
          />
          <label col={1} fontSize={24} marginLeft={10} style={{ color: new Color("#000"), verticalAlignment: 'middle' }} text={`Create Post`} />
        </gridLayout>
      }
      {post.media.length > 0 &&
        <scrollView row={1} scrollBarIndicatorVisible={false} orientation={'horizontal'}>
          <stackLayout padding={16} orientation={'horizontal'}>
            {
              post.media.map((item: ISupotsu.IFile & {
                _tmpId: string,
                url: string,
                progress: number,
                total: number
              }, i) => {
                const onLoaded = (args) => {
                  console.log('...')
                }

                if (!item._id) {
                  return (
                    <gridLayout key={item._tmpId} onLoaded={onLoaded} borderRadius={10} background={'linear-gradient(#555,#222,#000)'} width={80} height={90} marginRight={16}>
                      <image src={`${item.url}`} decodeHeight={60} decodeWidth={60} width={80} height={90} borderRadius={10} />
                      <flexboxLayout row={0} style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <progress value={item.progress} maxValue={item.total} />
                      </flexboxLayout>
                    </gridLayout>
                  )
                }

                if (item._id && fileLoading[item._id]) {
                  return (
                    <gridLayout key={item._tmpId} onLoaded={onLoaded} borderRadius={10} background={'linear-gradient(#555,#222,#000)'} width={80} height={90} marginRight={16}>
                      <image src={`${item.url}`} decodeHeight={60} decodeWidth={60} width={80} height={90} borderRadius={10} />
                      <flexboxLayout row={0} style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <activityIndicator busy color={new Color(Theme2[500])} />
                      </flexboxLayout>
                    </gridLayout>
                  )
                }
                return (
                  <gridLayout onLoaded={onLoaded} key={item._id} borderRadius={10} background={'linear-gradient(#555,#222,#000)'} width={80} height={90} marginRight={16}>
                    <MediaItemUploader media={item} key={item.url} onDelete={() => {
                      if (p.removeFile) {
                        p.removeFile(item._id)
                      }
                    }} />
                  </gridLayout>

                )
              })
            }
          </stackLayout>
        </scrollView>
      }
      <flexboxLayout row={2} style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Methods.getStatusBarHeight() + 90
      }}>
        {
          renderTextEdit && renderTextEdit()
        }
      </flexboxLayout>
      {isShowMore &&
        <gridLayout row={3} marginBottom={16} columns={getItemSpec(['*', 'auto', '*'])}>
          <flexboxLayout col={1} style={{
            height: 50,
            borderRadius: 50 / 2,
            background: '#eee',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `8 16`
          }}>
            {
              Context.icons().map((item, i) => {
                if (!item) {
                  return (
                    <label marginLeft={30} text={""} />
                  )
                }
                return (
                  <stackLayout onTap={() => {
                    setIsShowMore(false);
                    Context.setState({ isShowMore: false });
                    if (typeof item.cb === "function") {
                      item.cb();
                    }
                  }} verticalAlignment={'middle'} horizontalAlignment={'center'} orientation={'horizontal'} key={i}>
                    <label verticalAlignment={'middle'} color={new Color(item.color)} className={`MaterialIcons size16`} text={IconSet.MaterialIcons[item.name]} />
                    <label verticalAlignment={'middle'} marginLeft={5} className={'size16'} text={item.label} />
                  </stackLayout>
                )
              })
            }
          </flexboxLayout>
        </gridLayout>
      }

      {typeState.step === 1 &&
        <gridLayout paddingLeft={30} paddingRight={30} height={50} row={4} columns={getItemSpec(['auto', '*', 'auto'])}>
          <label textAlignment={'center'} verticalAlignment={'middle'} className={'Ionicons'} col={0} text={IconSet.Ionicons["md-camera"]} style={{
            margin: `0 20`,
            fontSize: 25,
            color: new Color("#4a5")
          }} onTap={() => {
            showCameraPick()
          }} />

          {typeState.step === 1 &&
            <PostButton isTyping={false} label={"NEXT"} mode={Context.state.currentIndex} isPosting={false} onPress={() => {
              if (!isTyping) {
                typeState.step = post.content.length <= 2 && post.media.length === 0 ? 1 : 2
              }
              Context.setState({ isTyping: false, typeState });
              //Keyboard.dismiss()
              //if (!isPosting) LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            }} />
          }

          {typeState.step === 2 &&
            <PostButton isTyping={false} label={"NEXT"} mode={Context.state.currentIndex} isPosting={false} onPress={() => {

            }} />
          }

          <label onTap={(args: EventData) => {
            if (isShowMore) {
              setIsShowMore(false);
              Context.setState({ isShowMore: false });
            } else {
              setIsShowMore(true);
              Context.setState({ isShowMore: true });
            }
          }} textAlignment={'center'} verticalAlignment={'middle'} col={2} text={isShowMore ? IconSet.MaterialIcons["close"] : IconSet.MaterialIcons["more-horiz"]} className={"MaterialIcons"} style={{
            margin: `0 20`,
            fontSize: 25,
            color: new Color(!isShowMore ? '#EB6262' : '#000')
            //marginBottom: 5
          }} />
        </gridLayout>
      }

      {typeState.step > 1 &&
        <gridLayout row={4} columns={getItemSpec(['*', 'auto'])} paddingLeft={10} paddingRight={10} paddingTop={10} paddingBottom={5} style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <flexboxLayout col={0} style={{
            marginRight: 30,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <GoLiveUserPicker textColor={"#555"} onUserClick={() => {
              Context.setState({ isUserSending: false, WhoShouldSee: false });
              console.log('post...')
              setIsPosting(true)
              Context.refreshPostContext(Context.state.sport, () => {
                setIsPosting(false)
                Context.setState({ isPosting: false });
              })
            }} isTop {...Context.props} user={user} tag={tag} onPickerFocus={() => {
              Context.setState({ isPickingCrowd: true, isSelectingUser: false, isUserSending: false });
            }} onUserSelect={(user) => {
              Context.setState({ user, isSelectingUser: false });
            }} onTagSelect={(tag) => {
              Context.setState({ tag, isPickingCrowd: false, isSelectingUser: (tag.val === "Public") ? false : true, user: (tag.val === "Public") ? (Context.props.user && Context.props.user._id !== null ? Context.props.user : Methods.you()) : { id: null } });
            }} />
          </flexboxLayout>
          {user.type === "F" &&
            <WhoShouldSeeTapPopUp
              TriggerButton={({ label = false, onTap, ...props }) => {
                return (
                  <flexboxLayout
                    col={1}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: ms(35),
                      paddingLeft: ms(15),
                      paddingRight: ms(15),
                      background: Theme2['500'],
                      borderRadius: ms(35) / 2
                    }} {...props} onTap={() => {
                      //Context.setState({ WhoShouldSee: !state.WhoShouldSee });
                      console.log('nn')
                      if (typeof onTap === "function") onTap()
                    }}>
                    <label style={{
                      color: new Color("#FFF")
                    }} text={Context.state.WhoShouldSee ? "Close" : "Share with"} />
                  </flexboxLayout>
                )
              }}
              requestSport={true}
              sport={Context.state.sport}
              onSportSet={(sport) => {
                Context.setState({ sport }, () => {

                });
              }}
              onAction={(data = [], sport) => {
                post.audienceList = data;
                typeState.step = 4;
                Context.setState({ sport, typeState, post }, () => {

                });
              }}
              onItemTap={(tags: any, i) => {
                typeState.step = 3;
                Context.setState({ typeState, isPickingCrowd: false, isSelectingUser: false, activeWhoToSeeTab: tags, activeWhoToSeeTabIndex: i });
              }}
            />
          }
        </gridLayout>
      }
    </gridLayout>
  )
}

interface MediaItemUploaderProps {
  media: ISupotsu.IFile,
  onDelete(): void
}

const MediaItemUploader = (props: MediaItemUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false)

  //run()
  return (
    <React.Fragment>
      {props.media.type === "image" && <image src={`https://supotsu.com/media/${Methods.you()._id}_${Methods.you().type}/${props.media.url}`} decodeHeight={60} decodeWidth={60} width={80} height={90} borderRadius={10} />}
      <flexboxLayout onTap={props.onDelete} width={80} height={90} borderRadius={10} style={{
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <label className={'MaterialIcons size40'} color={new Color('#ddd')} text={`${IconSet.MaterialIcons["delete"]}`} />
      </flexboxLayout>
    </React.Fragment>
  )
}
interface LiveCommentUser {
  _id: string
  name: string
  image: string
}
interface LiveComment {
  user: LiveCommentUser,
  body: string,
  timestamp: string
}

export const Camera = (p: any) => {
  const { Context, children, isActive = true, postRefresh, onReset, post, photoPost, renderTextEdit, tag, user, sport, ...props } = p;
  const [pictures, setPictures] = useState<any[]>([]);
  const { duration, isLive, setUpRTMP, switchCamera, startStream, stopStream } = useStreamRTMP()
  const [NodeCameraView, setNodeCameraView] = React.useState<cn.nodemedia.NodeCameraView>(null);
  // const [NodePublisher, setNodePublisher] = React.useState<cn.nodemedia.NodePublisher>(null);
  const NodePublisherRef = React.useRef<cn.nodemedia.NodePublisher>();
  const { isFront, isTyping, currentIndex } = Context.state;
  const cameraState = Context.state.cameraState || { step: 1, text: ""};
  const [isPublish, setIsPublish] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photo, setPhoto] = useState<any>(false);
  const [filePath, setFilePath] = useState(null)
  const [isShowMore, setIsShowMore] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [baseString, setBaseString] = useState(null);
  const [nativeFilePath, setNativeFilePath] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [videoXmpp, setVideoXmpp] = useState(null);
  const [videoXmppId, setVideoXmppId] = useState(null);
  const [ownerXmmp, setOwnerXmpp] = useState(null);
  const [ownerXmmpId, setOwnerXmppId] = useState(null);
  const [comments, setComment] = useState<LiveComment[]>([]);
  const [text, setText] = useState('');
  const sv: React.RefObject<NSVElement<ScrollView>> = React.useRef<NSVElement<ScrollView>>();
  const tf: React.RefObject<NSVElement<TextField>> = React.useRef<NSVElement<TextField>>();
  const cameraViewRef: React.RefObject<NSVElement<Placeholder>> = React.useRef<NSVElement<Placeholder>>();
  const cameraNODERef = React.useRef<cn.nodemedia.NodeCameraView>();

  const takePicture = async function () {
    const { current: CV } = cameraViewRef;
    const { current: NodePublisher } = NodePublisherRef;
    if (isAndroid && NodeCameraView) {
      NodeCameraView.setDrawingCacheEnabled(true);
      const pic = android.graphics.Bitmap.createBitmap(NodeCameraView.getDrawingCache());
      NodeCameraView.setDrawingCacheEnabled(false);
      // const pic = getImageBMP(CV.nativeView);
      const baos = new java.io.ByteArrayOutputStream();
      const immagex: android.graphics.Bitmap = pic;
      immagex.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, baos);
      const b = baos.toByteArray();
      const _string = android.util.Base64.encodeToString(b, android.util.Base64.DEFAULT);
      const img: ImageSource = ImageSource.fromBase64Sync(_string);
      const filePath_ = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/Supotsu/";
      if (!new java.io.File(filePath_).exists()) {
        new java.io.File(filePath_).mkdir();
      }

      const mFilePath = `${filePath_}IMG-${Date.now()}.jpg`;
      setNativeFilePath(mFilePath);
      setBaseString(_string);
      const tmpfile = new java.io.File(mFilePath);
      if (!tmpfile.exists()) {
        tmpfile.createNewFile();
      }

      const _file = new java.io.FileOutputStream(tmpfile);

      _file.write(b);
      _file.close();
      console.log(mFilePath);
      //setPictures([...pictures, img]);
      //const file = img.saveToFile(`${knownFolders.documents().path}/IMG-${Date.now()}.jpg`,'png');
      setPhoto(img);
    }
    const source = getImage(CV.nativeView);

    // const { current: NodePublisher } = NodePublisherRef;
    // if (NodePublisher && isAndroid) {
    //   console.log('capturing');

    //   const capt = new CapturePictureListener((pic: android.graphics.Bitmap) => {
    //     console.log(pic)
    //     const baos = new java.io.ByteArrayOutputStream();
    //     const immagex: android.graphics.Bitmap = pic;
    //     immagex.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, baos);
    //     const b = baos.toByteArray();
    //     const _string = android.util.Base64.encodeToString(b, android.util.Base64.DEFAULT);
    //     const img: ImageSource = ImageSource.fromBase64Sync(_string);
    //     const filePath_ = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/Supotsu/";
    //     if (!new java.io.File(filePath_).exists()) {
    //       new java.io.File(filePath_).mkdir();
    //     }

    //     const mFilePath = `${filePath_}IMG-${Date.now()}.jpg`;
    //     setNativeFilePath(mFilePath);
    //     setBaseString(_string);
    //     const tmpfile = new java.io.File(mFilePath);
    //     if (!tmpfile.exists()) {
    //       tmpfile.createNewFile();
    //     }

    //     const _file = new java.io.FileOutputStream(tmpfile);

    //     _file.write(b);
    //     _file.close();
    //     console.log(mFilePath);
    //     //setPictures([...pictures, img]);
    //     //const file = img.saveToFile(`${knownFolders.documents().path}/IMG-${Date.now()}.jpg`,'png');
    //     setPhoto(img);
    //   });

    //   NodePublisher.capturePicture(capt);
    // }
  };

  const savePhoto = () => {
    setIsUploading(true);
    setIsPosting(false);
    setIsUploading(true);
    const indexOf = Context.state.photoPost.media.length;

    const run = () => {
      const _file = File.fromPath(nativeFilePath)
      const fileobj: CameraRollCallback = {
        file: _file,
        isApp: true,
        url: photo,
        objType: "profile",
        session: {
          name: _file.name,
          session: session(_file.name)
        },
        progress: 0
      };
      const url = "https://supotsu.com/api/file/upload";

      Context.state.photoPost.media[0] = {
        _tmpId: fileobj.file.name,
        progress: 0,
        total: 0,
        url: fileobj.url
      }

      Context.setState({
        photoPost: Context.state.photoPost
      });

      var request: Request = {
        url: url,
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "File-Name": fileobj
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
        { name: "objType", value: fileobj.objType || "profile" },
        { name: "fromId", value: Methods.you()._id },
        { name: "fromType", value: Methods.you().type },
        { name: "toId", value: user._id },
        { name: "toType", value: user.type },
        { name: "file", filename: fileobj, mimeType: `image/${ext(fileobj.file.name)}` }
      ];

      const session_ = session(fileobj.url)
      var task: Task = session_.multipartUpload(params, request);
      task.on('complete', (args: CompleteEventData) => {
        //_modal.closeCallback(false);
        //task.cancel();
        //console.log(args)
      })
      task.on('progress', (args: ProgressEventData) => {
        console.log(args.currentBytes, "/", args.totalBytes);
        setTotal(args.totalBytes / args.totalBytes * 100)
        setProgress(args.currentBytes / args.totalBytes * 100)
      })

      task.on('error', (args: ErrorEventData) => {
        console.log('error', args)
      });

      task.on('responded', (args: ResultEventData) => {
        const _data = JSON.parse(args.data);
        const _post = Context.state.photoPost.media[indexOf];
        setTotal(0)
        setProgress(0)
        setIsUploading(false)
        if (_post) {
          Context.state.photoPost.media[indexOf] = _data
          Context.setState({
            photoPost: Context.state.photoPost
          })
        }
        console.log(_data);
        // post.media.push(_data)
        // setState({ isCameraOpen: false, photoPost, hasPostMedia: photoPost.media.length > 0 ? true : false });
        // task.cancel();
      });
    }

    run();
  }

  const goLive = () => {
    if (isLive) {
      setIsPublish(false)
      setOwnerXmpp(null)
      setVideoXmpp(null);
      setComment([]);
      setVideoXmppId(null);
      setOwnerXmppId(null);

      Context.setState({ isPosting: false, isTyping: false });
      stopStream()
    } else {
      setIsPublish(true);
      const _server_id = AppSettings.getString('server_id', null)
      const video_addr = new JID(user._id, `supotsu.com`, `app`);

      const xmpp = new Client({
        websocket: { url: 'ws://supotsu.com:5280/xmpp-websocket' },
        jid: video_addr,
        password: user._id
      });

      let videoJID = null;

      xmpp.on('online', function (data) {
        //console.log(data, _server_id);
        //const _server_id = AppSettings.getString('server_id', null);
        if (!_server_id) {

        } else {
          const _iq = new Stanza('message', {
            from: data.jid,
            to: _server_id,
            type: 'update_id'
          });

          videoJID = data.jid;
          setVideoXmppId(data.jid);
          _iq.children = [
            new Stanza('body', {
              key: `${user._id}-live`,
              id: `${data.jid.user}@supotsu.com/app`
            })
          ]

          xmpp.send(_iq);
        }
      });

      xmpp.on('stanza', function (stanza) {
        var parser = new xml2js.Parser();
        console.log(stanza.root().toString())
        parser.parseString(stanza.root().toString(), function (err, result) {
          const { user, body } = result.message;
          const _user = user[0]['$']
          const comment: LiveComment = {
            user: _user,
            body: body[0]['$']['text'],
            timestamp: body[0]['$']['timestamp']
          };
          console.log(comment)
          comments.push(comment)
          setComment([...comments])
          if (sv.current!.nativeView) {
            sv.current!.nativeView.scrollToVerticalOffset(sv.current!.nativeView.scrollableHeight, true)
          }
        })
      });

      xmpp.on('error', function (error) {
        console.log('client2', error)
      });

      setVideoXmpp(xmpp);

      const owner_addr = new JID(user._id, `supotsu.com`, `app`);

      const o_xmpp = new Client({
        websocket: { url: 'ws://supotsu.com:5280/xmpp-websocket' },
        jid: owner_addr,
        password: user._id
      });

      o_xmpp.on('online', function (data) {
        console.log(data, _server_id);
        //const _server_id = AppSettings.getString('server_id', null);
        if (!_server_id) {

        } else {
          const _iq = new Stanza('message', {
            from: data.jid,
            to: _server_id,
            type: 'update_id'
          });

          setOwnerXmppId(data.jid)

          _iq.children = [
            new Stanza('body', {
              key: `${user._id}-watcher`,
              id: `${data.jid.user}@supotsu.com/app`
            })
          ]

          o_xmpp.send(_iq);

          //SayHiToVideo
          const _first = new Stanza('message', {
            from: data.jid,
            to: videoJID,
            type: 'chat'
          });

          _first.children = [
            new Stanza('body', {
              text: 'Now live!',
              timestamp: Date.now().toString()
            }),
            new Stanza('user', {
              _id: user._id,
              name: user.name,
              image: user.image
            })
          ];

          o_xmpp.send(_first);
        }
      });

      o_xmpp.on('stanza', function (stanza) {
        var parser = new xml2js.Parser();
        parser.parseString(stanza.root().toString(), function (err, result) {
          //const res = JSON.parse(result);
          console.log(result)
        })
      });

      o_xmpp.on('error', function (error) {
        console.log('client2', error)
      });

      setOwnerXmpp(o_xmpp);
      Context.setState({ isPosting: true, isTyping: true });
      const url = `rtmp://supotsu.com/live/${Methods.you()._id}-${Date.now()}`
      startStream(url)
    }
  }

  const send = () => {
    if (text.length > 0) {
      if (ownerXmmp && (ownerXmmp.send && typeof ownerXmmp.send === 'function')) {
        const _first = new Stanza('message', {
          from: ownerXmmpId,
          to: videoXmppId,
          type: 'chat'
        });

        _first.children = [
          new Stanza('body', {
            text,
            timestamp: Date.now().toString()
          }),
          new Stanza('user', {
            _id: user._id,
            name: user.name,
            image: user.image
          })
        ];

        ownerXmmp.send(_first);

        setText('');
      }
    }
  }

  const onLoaded = (args: EventData) => {
    const view = args.object as View;
    const { current: NodePublisher } = NodePublisherRef;
    view.on(GestureTypes.pinch, function (args: PinchGestureEventData) {
      console.log("Pinch Scale: " + args.scale);
      if (args.scale > 1) {

      } else {
        if (NodePublisher) {
          NodePublisher.setZoomScale((args.scale * 100));
        }
      }
    })
  }

  const renderOverlay = () => {
    return (
      <gridLayout background={'rgba(0,0,0,0)'} rows={getItemSpec(['*', '*', '150'])}>
        <gridLayout padding={16} row={1} columns={getItemSpec(['*', 'auto'])}>
          <scrollView ref={sv} scrollBarIndicatorVisible={false} col={0}>
            <stackLayout>
              {
                comments.map((item, i) => {
                  return (
                    <gridLayout marginBottom={16} key={i} columns={getItemSpec(['auto', 'auto', '*'])}>
                      <image col={0} src={item.user.image} style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20
                      }} decodeHeight={30} decodeWidth={30} />
                      <stackLayout col={1}>
                        <label background={'#fff'} borderRadius={10} padding={8} text={item.body} textWrap margin={`0 10`} />
                      </stackLayout>
                    </gridLayout>
                  )
                })
              }
            </stackLayout>
          </scrollView>
          <stackLayout verticalAlignment={'middle'} col={1} width={60} borderRadius={30} background={'#fff'}>
            <LiveViewButton>
              <Methods.LikeIcon liked={false} isNew size={50} />
            </LiveViewButton>
            <LiveViewButton>
              <Methods.CommentIcon commented={false} isNew size={50} />
            </LiveViewButton>
            <LiveViewButton>
              <Methods.ShareIcon shared={false} isNew size={50} />
            </LiveViewButton>
          </stackLayout>
        </gridLayout>
      </gridLayout>
    )
  }

  if (isPosting) {
    return (
      <gridLayout rows={getItemSpec(['*'])}>
        <flexboxLayout row={0} style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <activityIndicator busy color={new Color(Theme2['500'])} />
        </flexboxLayout>
      </gridLayout>
    )
  }

  React.useEffect(() => {
    if (isAndroid) {
      requestPermissions([android.Manifest.permission.CAMERA, android.Manifest.permission.RECORD_AUDIO]).then((value) => {
        console.log(value)
      }).catch((e) => {
        console.log(e)
      })
    }
  }, [])

  return (
    <gridLayout rows={getItemSpec(['*'])} columns={getItemSpec(['*'])}>
      <gridLayout onLoaded={onLoaded} rows={getItemSpec(['*'])} columns={getItemSpec(['*'])}>
        <placeholder ref={cameraViewRef} col={0} row={0} onCreatingView={(args) => {
          const pc = args.object as View;
          pc.width = screen.mainScreen.widthDIPs;
          pc.height = screen.mainScreen.heightDIPs;
          if (!isAndroid) {
            // const nativeView = HKView.alloc();
            // nativeView.setBounds
            // nativeView.text = "Native View - iOS";
            // args.view = nativeView;
          } else if (isAndroid) {
            const nativeView = new android.view.TextureView(args.context);

            nativeView.setLayoutParams(new android.view.ViewGroup.LayoutParams(
              screen.mainScreen.widthDIPs,
              screen.mainScreen.heightDIPs,
            ))
            nativeView.requestLayout();
            nativeView.invalidate();
            args.view = nativeView;
            setUpRTMP(args.view)
          }
        }} />
      </gridLayout>
      {Context.state.selectedIndex === 2 && isPublish &&
        renderOverlay()
      }
      {photo &&
        <gridLayout rows={getItemSpec(['*'])} columns={getItemSpec(['*'])}>
          <image stretch={'aspectFill'} row={0} col={0} src={photo} />
        </gridLayout>
      }

      <gridLayout col={0} row={0} rows={getItemSpec(['auto', '*', 'auto', '80'])}>
        <gridLayout padding={16} columns={getItemSpec(['auto', '*', 'auto'])}>
          {Context.state.selectedIndex === 1 &&
            <label textAlignment={'center'} verticalAlignment={'middle'} className={'Ionicons'} col={0} text={IconSet.Ionicons["md-arrow-back"]} style={{
              margin: `0 20`,
              fontSize: 25,
              color: new Color("#fff")
            }} onTap={() => {
              if (p.onBack) p.onBack();
            }} />
          }
          {Context.state.selectedIndex === 2 && !isPublish &&
            <label textAlignment={'center'} verticalAlignment={'middle'} className={'Ionicons'} col={0} text={IconSet.Ionicons["md-arrow-back"]} style={{
              margin: `0 20`,
              fontSize: 25,
              color: new Color("#fff")
            }} onTap={() => {

            }} />
          }
          {Context.state.selectedIndex === 2 && isPublish &&
            <flexboxLayout background={'red'} borderRadius={16} onTap={() => {
              goLive();
            }} padding={8} col={0} style={{
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <label text={'Stop Broadcast'} fontSize={12} color={new Color('#fff')} />
            </flexboxLayout>
          }
          <label textAlignment={'center'} verticalAlignment={'middle'} className={'MaterialIcons'} col={2} text={IconSet.MaterialIcons["switch-camera"]} style={{
            margin: `0 20`,
            fontSize: 25,
            color: new Color("#fff")
          }} onTap={() => {
            switchCamera();
          }} />
        </gridLayout>
        {photo &&
          <flexboxLayout row={1} style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Methods.getStatusBarHeight() + 90
          }}>
            {
              renderTextEdit && renderTextEdit()
            }
          </flexboxLayout>
        }
        {Context.state.selectedIndex === 1 && cameraState.step === 1 &&
          <gridLayout paddingLeft={30} paddingRight={30} row={2} columns={getItemSpec(['auto', '*', 'auto'])}>

            {photo &&
              <label textAlignment={'center'} verticalAlignment={'middle'} className={'Ionicons'} col={0} text={IconSet.Ionicons["md-refresh"]} style={{
                margin: `0 20`,
                fontSize: 25,
                color: new Color("#fff")
              }} onTap={() => {
                cameraState.step = 1;
                Context.setState({ cameraState });
                setPhoto(false)
              }} />
            }
            {
              photo &&
              <PostButton isTyping={false} mode={0} label={"NEXT"} isPosting={false} onPress={() => {
                cameraState.step = 2;
                Context.setState({ cameraState });
              }} />

            }

            {!photo &&
              <PostButton isTyping={isTyping} mode={1} isPosting={isPosting} onPress={() => {
                takePicture()
                cameraState.step = 1
                Context.setState({ isPosting: true, isTyping: false, cameraState });
              }} />
            }

            {photo &&
              <label textAlignment={'center'} verticalAlignment={'middle'} col={2} text={IconSet.Octicons["text-size"]} className={"Octicons"} style={{
                margin: `0 20`,
                fontSize: 25,
                color: new Color('#fff')
                //marginBottom: 5
              }} onTap={() => {
                Context.setState({ isTyping: !isTyping });
              }} />
            }
          </gridLayout>
        }
        {Context.state.selectedIndex === 1 && cameraState.step > 1 &&
          <gridLayout row={2} columns={getItemSpec(['*', 'auto'])} paddingLeft={10} paddingRight={10} paddingTop={10} paddingBottom={5} style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <flexboxLayout col={0} style={{
              marginRight: 30,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <GoLiveUserPicker textColor={"#555"} onUserClick={() => {
                //Context.setState({ isUserSending: false, WhoShouldSee: false });
                console.log('post...')
                //setIsPosting(true)
                savePhoto()
                //Context.refreshPostContext(Context.state.sport, () => {
                //setIsPosting(false);
                //})
              }} isTop {...Context.props} user={user} tag={tag} onPickerFocus={() => {
                Context.setState({ isPickingCrowd: true, isSelectingUser: false, isUserSending: false });
              }} onUserSelect={(user) => {
                Context.setState({ user, isSelectingUser: false });
              }} onTagSelect={(tag) => {
                Context.setState({ tag, isPickingCrowd: false, isSelectingUser: (tag.val === "Public") ? false : true, user: (tag.val === "Public") ? (Context.props.user && Context.props.user._id !== null ? Context.props.user : Methods.you()) : { id: null } });
              }} />
            </flexboxLayout>
            {user.type === "F" &&
              <WhoShouldSeeTapPopUp
                TriggerButton={({ label = false, onTap, ...props }) => {
                  return (
                    <flexboxLayout
                      col={1}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: ms(35),
                        paddingLeft: ms(15),
                        paddingRight: ms(15),
                        background: Theme2['500'],
                        borderRadius: ms(35) / 2
                      }} {...props} onTap={() => {
                        //Context.setState({ WhoShouldSee: !state.WhoShouldSee });
                        console.log('nn')
                        if (typeof onTap === "function") onTap()
                      }}>
                      <label style={{
                        color: new Color("#FFF")
                      }} text={Context.state.WhoShouldSee ? "Close" : "Share with"} />
                    </flexboxLayout>
                  )
                }}
                requestSport={true}
                sport={Context.state.sport}
                onSportSet={(sport) => {
                  Context.setState({ sport }, () => {

                  });
                }}
                onAction={(data = [], sport) => {
                  if (photoPost) {
                    photoPost.audienceList = data;
                    cameraState.step = 4;
                    Context.setState({ sport, cameraState, photoPost }, () => {

                    });
                  }
                }}
                onItemTap={(tags: any, i) => {
                  cameraState.step = 3;
                  Context.setState({ cameraState, isPickingCrowd: false, isSelectingUser: false, activeWhoToSeeTab: tags, activeWhoToSeeTabIndex: i });
                }}
              />
            }
          </gridLayout>
        }
        {Context.state.selectedIndex === 2 && !isPublish &&
          <gridLayout paddingLeft={30} paddingRight={30} row={2} columns={getItemSpec(['auto', '*', 'auto'])}>
            <PostButton isTyping={isPublish} mode={2} isPosting={isPosting} onPress={() => {
              goLive();
            }} />
          </gridLayout>
        }
        {Context.state.selectedIndex === 2 && isPublish &&
          <gridLayout margin={`8 16`} columns={getItemSpec(['*', 'auto'])} background={'rgba(55,55,55,0.5)'} borderRadius={5} row={2}>
            <textField paddingLeft={8} text={text} onTextChange={(args: any) => {
              setText(args.object.text)
            }} col={0} borderRadius={5} width={{ unit: '%', value: 100 }} color={new Color('#fff')} borderBottomWidth={0} fontSize={14} hint={'WRITE SOMETHING'} />
            <label onTap={send} verticalAlignment={'middle'} textAlignment={'center'} marginRight={8} col={1} className={`Ionicons size20`} color={new Color(Theme2[500])} text={IconSet.Ionicons["md-send"]} />
          </gridLayout>
        }
        {Context.state.selectedIndex === 2 && isPublish &&
          <gridLayout paddingLeft={16} paddingRight={16} rows={getItemSpec(['auto', '*'])} row={3} columns={getItemSpec(['*', 'auto', 'auto'])}>
            <label key={`${duration}-now`} verticalAlignment={'middle'} fontSize={16} color={new Color('#fff')} text={duration} col={0} row={0} />
            <flexboxLayout col={1} row={0} style={{
              marginLeft: 10,
              paddingLeft: 10,
              paddingRight: 10,
              height: 30,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(55,55,55,0.9)'
            }}>
              <label textAlignment={'center'} verticalAlignment={'middle'} className={'Ionicons'} text={IconSet.Ionicons["ios-eye"]} style={{
                fontSize: 17,
                color: new Color("#fff")
              }} onTap={() => {

              }} />
            </flexboxLayout>
            <flexboxLayout col={2} row={0} style={{
              marginLeft: 10,
              paddingLeft: 10,
              paddingRight: 10,
              height: 30,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(55,55,55,0.9)'
            }}>
              <label textAlignment={'center'} verticalAlignment={'middle'} className={'Ionicons'} text={IconSet.Ionicons[isPaused ? "ios-play" : "ios-pause"]} style={{
                fontSize: 17,
                color: new Color("#fff")
              }} onTap={() => {

              }} />
            </flexboxLayout>
          </gridLayout>
        }
      </gridLayout>
    </gridLayout>
  )
}

const LiveViewButton = (p: any) => {
  const { count = 0 } = p;
  return (
    <stackLayout margin={`5 0`} verticalAlignment={'middle'} horizontalAlignment={'center'}>
      {p.children}
      <label marginTop={2} verticalAlignment={'middle'} textAlignment={'center'} color={new Color(Theme[500])} textWrap text={Methods.shortDigit(count).text} />
    </stackLayout>
  )
}

export const CheckinMode = (p: any) => {
  let API_KEY = "AIzaSyAOYKrNk8B72AcOnF9SD3WjcemZHmuUcRY";
  let googlePlacesAutocomplete = new GooglePlacesAutocomplete(API_KEY);
  const [isPosting, setIsPosting] = useState(false);
  const [marker, setMarker] = React.useState(p.initialMarker);
  const [mapView] = useState(new MapView());
  const [places, setPlaces] = useState([]);
  const { Context, renderTextEdit = () => null, children, isActive = true, ...props } = p;
  //if(!isActive) return null;
  const { isTyping, currentIndex, checkInPost, check, isShowMore, user, tag, ...CSState } = Context.state;

  const checkInState = Context.state.checkInState || { step: 1, text: ""};

  const { step, text } = checkInState;

  const width = screen.mainScreen.widthDIPs;

  const search = (text: string) => {
    if (marker && (marker.name === text)) return;
    googlePlacesAutocomplete.search(text).then((placeList: any) => {
      setPlaces(placeList)
    }, (error => {
      console.log(error)
    }));
  }

  const getPlace = (place_) => {

    googlePlacesAutocomplete.getPlaceById(place_.placeId).then((place) => {
      const { latitude, longitude } = place
      const s = {
        name: place_.description,
        ...place,
        coord: {
          latitude,
          longitude
        }
      };
      if (p.onPlaceTap && typeof p.onPlaceTap === "function") {
        p.onPlaceTap(s);
      }
      setMarker(s)
      mapView.removeAllMarkers();
      const _marker = new Marker();
      _marker.position = Position.positionFromLatLng(place.latitude, place.longitude);
      _marker.title = place_.description;
      mapView.addMarker(_marker)
      setPlaces([])
    }, error => {
      console.log(error)
    })
  }

  if (isPosting) {
    return (
      <gridLayout rows={getItemSpec(['*'])}>
        <flexboxLayout row={0} style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <activityIndicator busy color={new Color(Theme2['500'])} />
        </flexboxLayout>
      </gridLayout>
    )
  }

  return (
    <gridLayout rows={getItemSpec(['*'])}>
      <gridLayout onLoaded={(args: EventData) => {
        const view = args.object as GridLayout;
        if (!mapView.parent) {
          mapView.row = 0;
          mapView.col = 0;
          view.addChild(mapView);
        }

        if (marker && marker.coord) {
          mapView.removeAllMarkers();
          const _marker = new Marker();
          _marker.position = Position.positionFromLatLng(marker.coord.latitude, marker.coord.longitude);
          _marker.title = marker.name;
          mapView.addMarker(_marker)
        }
        geolocation.enableLocationRequest(true, true).then((value) => {
          geolocation.isEnabled().then((value) => {
            if (!value) {
              console.log("NO permissions!");
              return false;
            } else {
              console.log("Have location permissions");
              geolocation
                .getCurrentLocation({
                  desiredAccuracy: Accuracy.high,
                  maximumAge: 5000,
                  timeout: 20000
                })
                .then(location => {
                  if (!location) {
                    console.log("Failed to get location!");
                  } else {
                    mapView.latitude = location.latitude;
                    mapView.longitude = location.longitude;
                    mapView.zoom = 8;
                    mapView.myLocationEnabled = true;
                  }
                });
              return true;
            }
          }).catch(err => {
            console.log(err)
          })
        }).catch((err) => {
          console.log(err);
        })
      }}>

      </gridLayout>

      <gridLayout rows={getItemSpec(['auto', '*', 'auto', '80'])}>
        <gridLayout columns={getItemSpec(['auto', '*', 'auto', 'auto'])} style={{
          height: 45,
          margin: 16,
          background: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
          padding: `0 10`,
          borderColor: '#eee',
          borderWidth: 1,
          borderRadius: 4
        }}>
          <label verticalAlignment={'middle'} col={0} className={'Ionicons size25'} text={IconSet.Ionicons['ios-search']} style={{
            color: new Color('#999')
          }} />
          <textField text={marker && marker.name ? marker.name : ''} onTextChange={(args: any) => {
            if (args.object.text.length > 2) {
              search(args.object.text)
            }
          }} verticalAlignment={'middle'} fontSize={16} color={new Color('#999')} margin={`0 10`} borderBottomWidth={0} hint={'Search...'} col={1} />
          <label verticalAlignment={'middle'} col={2} className={'MaterialCommunityIcons size25'} text={IconSet.MaterialCommunityIcons['map-marker-outline']} style={{
            color: new Color('#999')
          }} />
        </gridLayout>
        <flexboxLayout row={1} style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: Methods.getStatusBarHeight() + 90
        }}>
          {
            renderTextEdit && renderTextEdit()
          }
        </flexboxLayout>
        {places.length > 0 &&
          <$ListView
            row={1}
            background={'#fff'}
            items={places}
            cellFactory={(item: any) => {
              return (
                // You MUST pass the ref in to the component.
                <flexboxLayout padding="8 16">
                  <label text={item.description} />
                </flexboxLayout>
              );
            }}
            onItemTap={(args: ItemEventData) => {
              const index: number = args.index;
              const item: any = places[index];
              getPlace(item)
            }}
          />
        }
        {checkInState.step === 1 &&
          <gridLayout paddingLeft={30} paddingRight={30} height={50} row={2} columns={getItemSpec(['auto', '*', 'auto'])}>

            <PostButton isTyping={false} label={"NEXT"} mode={Context.state.currentIndex} isPosting={false} onPress={() => {
              if (!marker) {
                alert('Select place to proceed!')
                return;
              }
              checkInState.step = 2;
              Context.setState({ isTyping: false, checkInState });
            }} />
          </gridLayout>
        }
        {checkInState.step > 1 &&
          <gridLayout row={2} columns={getItemSpec(['*', 'auto'])} paddingLeft={10} paddingRight={10} paddingTop={10} paddingBottom={5} style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <flexboxLayout col={0} style={{
              marginRight: 30,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <GoLiveUserPicker textColor={"#555"} onUserClick={() => {
                Context.setState({ isUserSending: false, WhoShouldSee: false, isPosting: true });
                console.log('post...')
                setIsPosting(true)
                Context.refreshPostContext(Context.state.sport, () => {
                  setIsPosting(false)
                })
              }} isTop {...Context.props} user={user} tag={tag} onPickerFocus={() => {
                Context.setState({ isPickingCrowd: true, isSelectingUser: false, isUserSending: false });
              }} onUserSelect={(user) => {
                Context.setState({ user, isSelectingUser: false });
              }} onTagSelect={(tag) => {
                Context.setState({ tag, isPickingCrowd: false, isSelectingUser: (tag.val === "Public") ? false : true, user: (tag.val === "Public") ? (Context.props.user && Context.props.user._id !== null ? Context.props.user : Methods.you()) : { id: null } });
              }} />
            </flexboxLayout>
            {user.type === "F" &&
              <WhoShouldSeeTapPopUp
                TriggerButton={({ label = false, onTap, ...props }) => {
                  return (
                    <flexboxLayout
                      col={1}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: ms(35),
                        paddingLeft: ms(15),
                        paddingRight: ms(15),
                        background: Theme2['500'],
                        borderRadius: ms(35) / 2
                      }} {...props} onTap={() => {
                        //Context.setState({ WhoShouldSee: !state.WhoShouldSee });
                        console.log('nn')
                        if (typeof onTap === "function") onTap()
                      }}>
                      <label style={{
                        color: new Color("#FFF")
                      }} text={Context.state.WhoShouldSee ? "Close" : "Share with"} />
                    </flexboxLayout>
                  )
                }}
                requestSport={true}
                sport={Context.state.sport}
                onSportSet={(sport) => {
                  Context.setState({ sport }, () => {

                  });
                }}
                onAction={(data = [], sport) => {
                  checkInPost.audienceList = data;
                  checkInState.step = 4;
                  Context.setState({ sport, checkInState, checkInPost }, () => {

                  });
                }}
                onItemTap={(tags: any, i) => {
                  checkInState.step = 3;
                  Context.setState({ checkInState, isPickingCrowd: false, isSelectingUser: false, activeWhoToSeeTab: tags, activeWhoToSeeTabIndex: i });
                }}
              />
            }
          </gridLayout>
        }
      </gridLayout>
    </gridLayout>
  )
}

export const PostButton = ({ mode = 0, width = ms(50), isPosting = false, isTyping = false, onPress = () => { }, ...props }) => {
  if (mode === 1) {
    return (
      <flexboxLayout onTouch={onTouch} col={1} onTap={onPress} style={{
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: ms(70),
        padding: ms(10),
        width: ms(70),
        background: 'rgba(255,255,255,0.4)',
        borderRadius: ms(70) / 2
      }}>
        <stackLayout style={{
          background: '#fff',
          height: ms(50),
          width: ms(50),
          borderRadius: ms(50) / 2
        }} />
      </flexboxLayout>
    )
  }

  if (mode === 2) {
    return (
      <flexboxLayout onTouch={onTouch} col={1} onTap={onPress} style={{
        alignSelf: 'center',
        height: ms(50),
        background: isTyping ? 'red' : '#fff',
        //width: ms(70),
        padding: `0 ${ms(15)}`,
        borderRadius: ms(50) / 2,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <label color={isTyping ? new Color('#fff') : new Color('#000')} text={isTyping ? 'STOP' : 'START LIVE VIDEO'} />
      </flexboxLayout>
    )
  }

  return (
    <flexboxLayout onTouch={onTouch} col={1} onTap={onPress} style={{
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      //flex: 1,
      height: 50,
      padding: `0 15`,
      margin: `0 25`,
      background: Theme2['500'],
      borderRadius: 50 / 2
    }}>
      {isPosting &&
        <activityIndicator color={new Color("#FFF")} />
      }
      {!isPosting &&
        <label style={{
          color: new Color("#FFF")
        }} text={(props.label) ? props.label : "SUBMIT"} />
      }
    </flexboxLayout>
  )
}


const PostScreen: React.FC<PostScreenProps> = ({
  onBack
}) => {
  const { clearBorder } = useStyledContext();
  const { user: me } = React.useContext(AppAuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const {
    Context,
    onPost,
    onPostCheckIn,
    refreshPostContext,
    removeFile,
    renderCamera,
    renderTextEdit,
    uploadFile,
  } = React.useContext(CreatePostContext)

  const scrollerLayout: React.RefObject<NSVElement<StackLayout>> = React.useRef<NSVElement<StackLayout>>();
  const props: Record<string, any> = route.params || {
    user: {
      ...me,
      type: "F"
    },
    isAdmin: true,
    postToName: me.name,
    postToImage: me.image,
    postToId: me._id,
    postToType: me.type || "F",
  };

  let currentView = 0;

  const items: string[] = [
    'TYPE',
    'CAMERA',
    'LIVE',
    'LOCATION'
  ];

  const offsetData: any = {
    0: screen.mainScreen.widthDIPs / 2.4,
    1: screen.mainScreen.widthDIPs / 2.4 - 69,
    2: screen.mainScreen.widthDIPs / 2.4 - 143,
    3: screen.mainScreen.widthDIPs / 2.4 - 222,
  }

  const onSwipeScroll = (args: SwipeGestureEventData) => {
    const {} = state;
    if (args.direction === SwipeDirection.right || args.direction === SwipeDirection.down) {
      if (selectedIndex <= 0) return;
      scrollerLayout.current!.nativeView.animate({
        translate: {
          x: offsetData[selectedIndex - 1],
          y: scrollerLayout.current!.nativeView.translateY
        },
        duration: 250
      }).then(() => {
        currentView = selectedIndex - 1;
        setState({
          selectedIndex: currentView
        })
      })
    } else if (args.direction === SwipeDirection.left || args.direction === SwipeDirection.up) {
      if (selectedIndex >= items.length) return;
      scrollerLayout.current!.nativeView.animate({
        translate: {
          x: offsetData[currentView + 1],
          y: scrollerLayout.current!.nativeView.translateY
        },
        duration: 250
      }).then(() => {
        currentView = selectedIndex + 1;
        setState({
          selectedIndex: currentView
        })
      })
    }
  }

  const onScrollPan = React.useCallback((args: PanGestureEventData) => {
    //console.log(args.deltaX)
  }, [])

  const onItemTap = (index: number, arg: GestureEventData) => {
    setState({
      selectedIndex: index
    })
    console.log('SELECTED_VIEW', index, scrollerLayout.current);
    scrollerLayout.current?.nativeView.animate({
      translate: {
        x: offsetData[index],
        y: scrollerLayout.current?.nativeView.translateY
      },
      duration: 250
    }).then(() => {

    })
  }

  const {
    setState,
    state,
    icons,
  } = Context;

  const { isPosting, photo, postRefresh, checkRefresh, photoPost, checkInState, checkInPost, selectedIndex, isFront, user, isSelectingUser, fileLoading, fileRemoved, isUserSending, isPickingCrowd, post, tag, isTyping, cameraState, typeState, isShowMore, location } = state;

  return (
    <gridLayout rows='*, auto' background={(selectedIndex === 1 || selectedIndex === 2) ? 'black' : 'white'} height={screen.mainScreen.heightDIPs} width={screen.mainScreen.widthDIPs}>

      <stackLayout height={screen.mainScreen.heightDIPs} width={screen.mainScreen.widthDIPs} background={"#fff"} visibility={selectedIndex === 0 ? "visible" : "hidden"}>
        <Type key={`${postRefresh}-text`} {...props} renderTextEdit={renderTextEdit} showCameraPick={() => {
          renderCamera()
        }} Context={Context} isActive={selectedIndex === 0 ? true : false} removeFile={(_id: string) => {
          fileLoading[_id] = true;
          setState({ fileLoading });
          removeFile(_id);
        }} />
      </stackLayout>

      {(selectedIndex === 2) && (
        <stackLayout
        height={screen.mainScreen.heightDIPs}
        width={screen.mainScreen.widthDIPs}
        background={"#000"}
        >
          <Camera onReset={() => {
            setState({
              // postRefresh: Date.now(),
              photo: false,
              cameraState: {
                step: 1
              }
            })
          }} {...props} user={me} renderTextEdit={renderTextEdit} Context={Context} isActive={((selectedIndex === 1) || (selectedIndex === 2)) ? true : false} />
        </stackLayout>
      )}

      {(selectedIndex === 1) && (
        <stackLayout
        height={screen.mainScreen.heightDIPs}
        width={screen.mainScreen.widthDIPs}
        background={"#000"}
        >
          <Camera onReset={() => {
            setState({
              // postRefresh: Date.now(),
              photo: false,
              cameraState: {
                step: 1
              }
            })
          }} {...props} user={me} renderTextEdit={renderTextEdit} Context={Context} isActive={((selectedIndex === 1) || (selectedIndex === 2)) ? true : false} />
        </stackLayout>
      )}

      <stackLayout height={screen.mainScreen.heightDIPs} width={screen.mainScreen.widthDIPs} background={"#FEF7E0"} visibility={selectedIndex === 3 ? "visible" : "hidden"}>
        <CheckinMode key={`${checkRefresh}`} {...props} Context={Context} onPlaceTap={(place) => {
          checkInPost.place = place;
          checkInPost.coord = {
            lng: place.longitude,
            lat: place.latitude
          }

          setState({ checkInPost });
        }} initialMarker={checkInPost.place.name === "" ? false : {
          name: checkInPost.place.name,
          coord: {
            longitude: checkInPost.coord.lng,
            latitude: checkInPost.coord.lat
          }
        }} isActive={selectedIndex === 3 ? true : false} renderTextEdit={renderTextEdit} />
      </stackLayout>

      <scrollView
        onSwipe={onSwipeScroll}
        row={1}
        visibility={selectedIndex === 2 ? (isTyping ? 'hidden' : 'visible') : (selectedIndex === 0) ? (typeState && typeState.step > 1 ? 'hidden' : 'visible') : (selectedIndex === 1 && (cameraState && cameraState.step > 1) ? 'hidden' : 'visible')}
        top={screen.mainScreen.heightDIPs - 54}
        marginTop={-20}
        isScrollEnabled={false}
        background={'transparent'}
        orientation={'horizontal'}
        scrollBarIndicatorVisible={false}
      >

        <stackLayout background={'transparent'} ref={scrollerLayout} orientation={'horizontal'} style={{
          height: 58,
          translateX: screen.mainScreen.widthDIPs / 2.4,
          //paddingRight: screen.mainScreen.widthDIPs/2.8,
          width: screen.mainScreen.widthDIPs + screen.mainScreen.widthDIPs / 1.3,
          verticalAlignment: 'middle'
        }}>
          {
            items.map((item, i) => {
              return (
                <label onTap={(arg: GestureEventData) => onItemTap(i, arg)} style={{
                  fontWeight: selectedIndex === i ? "bold" : "normal"
                }} fontSize={14} marginLeft={10} marginRight={20} color={[0, 3].includes(selectedIndex) ? new Color("black") : new Color('#fff')} text={item} key={i} />
              )
            })
          }
        </stackLayout>
      </scrollView>
    </gridLayout>
  )
}

const PostScreenContainer: React.FC<PostScreenProps> = ({...props}) => {
  return (
    <CreatePostProvider>
      <PostScreen {...props} />
    </CreatePostProvider>
  )
}

export default PostScreenContainer;

