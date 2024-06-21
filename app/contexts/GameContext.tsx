import { NavigationProp } from '@react-navigation/core';
import * as React from 'react';
import * as ISupotsu from '~/DB/interfaces';
import { GAME_POSTS } from '~/services/graphql/games';
import * as AppSettings from '@nativescript/core/application-settings';
import { client } from '~/app';
import { Game, GamePost } from '~/generated/graphql';

interface GameContextData {
  game?: Game;
  navigator?: NavigationProp<any, any>;
  favoriteTeam?: ISupotsu.Team,
  setGame(game: Game): void;
  setFavTeam(team: ISupotsu.Team): void;
  posts: GamePost[];
  setNav(nav: NavigationProp<any, any>): void;
}

export const GameContext = React.createContext({} as GameContextData);

export const GameContextProvider: React.FC = ({
  children
}) => {
  const [game, setGame] = React.useState<Game>();
  const [favoriteTeam, setFavTeam] = React.useState<ISupotsu.Team>();
  const [navigator, setNav] = React.useState<NavigationProp<any, any>>();

  const [posts, setPosts] = React.useState<GamePost[]>([]);

  const getPosts = () => {
    client.query({
      query: GAME_POSTS,
      variables: {
        _id: game._id,
      }
    }).then(({ data }) => {
      if (data.gamePosts) {
        const { gamePosts } = data;
        setPosts(gamePosts);
        AppSettings.setString(`game_posts_${game._id}`, JSON.stringify(gamePosts))
      }
    }).catch((e) => {

    })
  };

  React.useEffect(() => {
    if (game && game._id) {
      getPosts();
    }
  }, [game]);

  return (
    <GameContext.Provider value={{
      setFavTeam,
      setGame,
      setNav,
      favoriteTeam,
      game,
      navigator,
      posts,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGameContext = () => React.useContext(GameContext);
