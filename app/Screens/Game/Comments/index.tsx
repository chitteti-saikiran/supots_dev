
import * as React from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useSubscription } from "@apollo/react-hooks";
import { GMC_STATUS_SUBSCRIPTION } from "~/components/GQL";
import { AppAuthContext } from "~/components/Root";
import { GameContext } from "~/contexts/GameContext";
import { useStyledContext } from "~/contexts/StyledContext";
import { CommonHeader, Empty, LoadingState } from '~/ui/common.ui';
import * as ISupotsu from '~/DB/interfaces';
import { GameSummaryGraphicItemFilter } from "..";
import { PhotoSementItem } from "~/Screens/Photos";
import { CommentsThread } from "~/components/CommentsThread";
import * as AppSettings from '@nativescript/core/application-settings';
import { TextualSummaryItem } from '../index';
import { getComments } from '../helpers';
import Methods from "~/Methods";

const FILTERS: GameSummaryGraphicItemFilter[] = [
  'Fans',
  'Friends',
  'Rivals'
]

export const GameComments = () => {
  const navigator = useNavigation();
  const { fonts } = useStyledContext();
  const { favoriteTeam } = React.useContext(GameContext)
  const {
    user: me
  } = React.useContext(AppAuthContext);
  const route = useRoute();
  const [comments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { game: initGame, filter, action: act } = (route.params || {}) as { game: ISupotsu.Game, action: ISupotsu.GameAction, filter: GameSummaryGraphicItemFilter };
  const [game, updateGame] = React.useState<ISupotsu.Game>(() => initGame);
  const [action, updateAction] = React.useState<ISupotsu.GameAction>(() => act);
  const [view, setView] = React.useState<GameSummaryGraphicItemFilter>(() => filter)

  const { data } = useSubscription(GMC_STATUS_SUBSCRIPTION, {
    variables: {
      _id: initGame._id
    },
  });

  React.useEffect(() => {
    getData();
  }, [])

  React.useEffect(() => {
    setTimeout(() => {
      if (loading) setLoading(false)
    }, 2000)
  }, [loading])

  const gameTeams = [game.teamOne, game.teamTwo];

  const rivalTeam = gameTeams.find((t) => t._id !== favoriteTeam._id);

  const gameComments = getComments({
    comments: action.comments,
    yourId: me._id,
    yourTeam: favoriteTeam._id
  })

  const getData = () => {
    Methods.post(`https://supotsu.com/api/game/action/${action._id}`, {}, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'get',
      success(res) {
        console.log(res)
        setLoading(false)
      },
      error: res => {
        console.log(res)
        setLoading(false)
      }
    })
  }

  return (
    <gridLayout background="#fff" rows="auto, auto, auto, *, auto">
      <CommonHeader user={{
        name: `Game Comments: ${view}`
      }} goBack={() => {
        navigator.goBack();
      }} />
      <TextualSummaryItem row={1} isOdd={false} embedded item={act} />
      <gridLayout row={2} columns="*, *, *">
        {FILTERS.map((item, i) => {
          return (
            <PhotoSementItem key={item} onSelect={() => {
              setView(item)
              setLoading(true)
            }} active={Boolean(view === item)} col={i} item={item} count={gameComments[(item as string).toLocaleLowerCase()].length} />
          )
        })}
      </gridLayout>
      {!loading && (
        <CommentsThread
          comments={gameComments[view.toLocaleLowerCase()]}
          postCommentType="gamePost"
          postId={action._id}
          row={3}
          path="game"
          team={view === "Rivals" ? rivalTeam : favoriteTeam}
          tag={view}
        />
      )}
      {loading && (
        <flexboxLayout row={3} style={{
          width: '100%',
          padding: 20,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <LoadingState />
        </flexboxLayout>
      )}
    </gridLayout>
  )
}

GameComments.routeName = "gameComments";
