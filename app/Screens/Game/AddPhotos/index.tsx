import * as React from 'react';
import { CreatePostProvider, Camera, useCreatePostContext } from '~/Screens/PostScreen';
import * as ISupotsu from '~/DB/interfaces';
import { AppAuthContext } from '~/components/Root';
import { NSVElement } from 'react-nativescript';
import { StackLayout } from '@nativescript/core';

interface AddPhotoProps {
  user: ISupotsu.Game & { name: string; type: string, image: string };
  onBack?(args?: any): void;
}

export const AddPhotos: React.FC<AddPhotoProps> = (props) => {
  return (
    <CreatePostProvider>
      <AddPhotoScreen {...props} />
    </CreatePostProvider>
  )
}

const AddPhotoScreen: React.FC<AddPhotoProps> = ({
  user,
  onBack,
}) => {
  const { user: me } = React.useContext(AppAuthContext);
  const scrollerLayout: React.RefObject<NSVElement<StackLayout>> = React.useRef<NSVElement<StackLayout>>();
  const props: Record<string, any> = {
    user: {
      ...me,
      type: "F"
    },
    isAdmin: true,
    postToName: user.name,
    postToImage: user.image,
    postToId: user._id,
    postToType: user.type || "G",
  };
  const {
    Context,
    onPost,
    onPostCheckIn,
    refreshPostContext,
    removeFile,
    renderCamera,
    renderTextEdit,
    uploadFile,
  } = useCreatePostContext();
  const {
    setState,
    state,
    icons,
  } = Context;

  const { isPosting, photo, postRefresh, checkRefresh, photoPost, checkInState, checkInPost, selectedIndex, isFront, isSelectingUser, fileLoading, fileRemoved, isUserSending, isPickingCrowd, post, tag, isTyping, cameraState, typeState, isShowMore, location } = state;

  React.useEffect(() => {
    setState({
      selectedIndex: 1,
    })
  }, [])

  return (
    <Camera key={`${postRefresh}`} onReset={() => {
      setState({
        postRefresh: Date.now(),
        photo: false,
        cameraState: {
          step: 1
        }
      })
    }} {...props} user={me} renderTextEdit={renderTextEdit} Context={Context} isActive onBack={onBack} />
  )
}
