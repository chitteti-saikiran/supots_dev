import { useNavigation, useRoute } from '@react-navigation/core';
import * as React from 'react';
import { setCurrentOrientation, orientationCleanup } from 'nativescript-screen-orientation';
import { AppAuthContext } from '~/components/Root';
import { GameContext } from '~/contexts/GameContext';

import { Video } from 'nativescript-videoplayer';
import { useStyledContext } from '~/contexts/StyledContext';
import Methods from '~/Methods';
import * as ISupotsu from '~/DB/interfaces';
import { isGameUpcoming } from './helpers';
import { RNSStyle } from 'react-nativescript';
import { CommonHeader } from '../../ui/common.ui';
import { CommentsThread } from '~/components/CommentsThread';

export const FullScreenVideoScreen = () => {
  const navigator = useNavigation();
  const { fonts } = useStyledContext();
  const { favoriteTeam, game, posts } = React.useContext(GameContext)
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const route = useRoute();
  const [loading, setLoading] = React.useState(true);
  const { videoSrc = '', currentTime = 0 } = (route.params || {}) as { videoSrc: string, currentTime: number };

  const [showScore, setShowScore] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);

  const videoRef = React.useRef(null);
  const timeOutRef = React.useRef<NodeJS.Timeout>(null);

  const goalsOne: ISupotsu.GameAction[] = Methods.listify(game.teamOneActs).filter((_item) => _item.type === 'goal');
  const goalsTwo: ISupotsu.GameAction[] = Methods.listify(game.teamTwoActs).filter((_item) => _item.type === 'goal');
  const isUpcoming = isGameUpcoming(game);

  const onVideoTap = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }

    setShowScore(true);
    setShowComments(false)

    const tm = setTimeout(() => {
      setShowScore(false)
    }, 3000);

    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    }
  }

  React.useEffect(() => {
    setCurrentOrientation('landscape', () => {

    });
    return () => {
      orientationCleanup();
    }
  }, []);

  React.useEffect(() => {
    const current = videoRef.current;
    if (current) {
      const video = videoRef.current.nativeView as Video;
      // video.seekToTime(currentTime);
      video.play();
    }
  }, [videoRef]);

  const icons = [
    {
      className: "MaterialIcons",
      icon: "chat-bubble",
      onPress() {
        setShowComments(!showComments)
      }
    }
  ]

  const comments: ISupotsu.Comment[] = React.useMemo(() => {
    const list: ISupotsu.Comment[] = posts.map((p) => {
      const comment: ISupotsu.Comment = {
        _id: p._id,
        content: p.content,
        contentUsers: [],
        date: p.date,
        hasLink: false,
        likes: p.likes,
        links: [],
        media: undefined,
        owner: {
          F: p.user,
          C: undefined,
          E: undefined,
          G: undefined,
          I: undefined,
          L: undefined,
          Q: undefined,
          T: undefined,
          type: 'F',
          _id: p.user._id,
          posts: [],
          status: 'none'
        },
        rawContent: p.content,
        replies: [],
        status: 'active',
        timeAgo: p.date,
        users: [],
        type: 'gamePost',
        user: {
          F: p.user,
          C: undefined,
          E: undefined,
          G: undefined,
          I: undefined,
          L: undefined,
          Q: undefined,
          T: undefined,
          type: 'F',
          _id: p.user._id,
          posts: [],
          status: 'none'
        },
        userTo: {
          F: p.user,
          C: undefined,
          E: undefined,
          G: undefined,
          I: undefined,
          L: undefined,
          Q: undefined,
          T: undefined,
          type: 'F',
          _id: p.user._id,
          posts: [],
          status: 'none'
        },
      };
      return comment;
    });
    return list
  }, [posts]);

  return (
    <gridLayout onTap={onVideoTap} style={{
      backgroundColor: '#000',
    }}>
      <videoPlayer ref={videoRef} controls={!showComments} autoPlay={true} src={videoSrc} width={'100%'} height={'100%'} />
      <gridLayout rows="auto, *">
        {showScore && (
          <CommonHeader transparent titleOnly user={{
            name: ""
          }} goBack={() => {
            navigator.goBack()
          }} icons={icons} />
        )}
        <gridLayout row={1} visibility={showScore ? 'visible' : 'collapse'} columns='*, auto, 100, auto, *' rows='40, *' padding={17}>
          <image col={1} height={35} width={35} src={game.teamOne.image} />
          <label col={2} text={isUpcoming ? `VS` : `${goalsOne.length} - ${goalsTwo.length}`} style={GameBannerScoreStyles.goals} horizontalAlignment='center' />
          <image height={35} width={35} col={3} src={game.teamTwo.image} />
        </gridLayout>
      </gridLayout>
      <gridLayout visibility={showComments ? 'visible' : 'collapse'} rows="auto, *" columns='*, 300'>
        <CommonHeader col={1} titleOnly user={{
          name: "Comments"
        }} goBack={() => {
          setShowComments(false)
        }} />
        <CommentsThread
          comments={comments}
          postCommentType="gamePost"
          postId={game._id}
          row={1}
          col={1}
          noComment
          path="game"
        />
      </gridLayout>
    </gridLayout>
  )
}

FullScreenVideoScreen.routeName = 'fullScreenGameVideo';

const GameBannerScoreStyles: Record<string, RNSStyle> = {
  goals: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlignment: 'center',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlignment: 'center',
  },
  place: {
    color: '#fff',
    textAlignment: 'center',
    fontSize: 10
  }
}
