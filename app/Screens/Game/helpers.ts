import * as ISupotsu from '~/DB/interfaces';

export const isGameLive = (game: ISupotsu.Game) => {
  return ['running','paused'].includes(game.state);
}

export const isGamePast = (game: ISupotsu.Game) => {
  return ['ended'].includes(game.state);
}

export const isGameUpcoming = (game: ISupotsu.Game) => {
  return ['none'].includes(game.state);
}

interface GetCommentsProps {
  comments: ISupotsu.Comment[];
  yourTeam: string;
  yourId: string;
}
export const getComments = ({
  comments,
  yourId,
  yourTeam,
}: GetCommentsProps) => {
  const fans = comments.filter((c) => {
    return (c.team && c.team._id === yourTeam ) && (c.tag && c.tag === "Fans")
  });

  const rivals = comments.filter((c) => {
    return (c.team && c.team._id !== yourTeam ) && (c.tag && c.tag === "Rivals")
  });

  const friends = comments.filter((c) => {
    return (c.tag && c.tag === "Friends")
  });

  return {
    fans,
    friends,
    rivals,
  }
}
