import React from "react"
import IconSet from '~/font-icons';
import { Color } from "tns-core-modules/color";
import Theme from "~/Theme";
import * as ISupotsu from '~/DB/interfaces';
//@ts-ignore
import { client } from "~/app";
import * as AppSettings from "@nativescript/core/application-settings";
import Methods from "~/Methods";
import { GAMES_QRY } from '../components/GQL';
import Helper from "~/helpers";
import { LoadingState, Empty } from "~/ui/common.ui";
import { useState, useEffect, useCallback } from 'react';
import { PhotoSementItem } from "./Photos";
import { UnionUser } from "~/utils/types";
import { CalendarFilterProvider } from "~/contexts/CalenderFilterContext";
import { EventFilterSegments } from "./Events";
import { useNavigation } from '@react-navigation/core';
import { Game } from './Game/index';
import { useGameContext } from '../contexts/GameContext';
import Team from "./Team";
import { useSeasonContext } from "~/contexts/SeasonContext";
import { Game as IGame, Team as ITeam } from '~/generated/graphql'
import { GMC, GMCNext } from "~/gmc/gmx-react";

const view_filters = [
  ['Upcoming', 0],
  ['Live', 1],
  ['Past', 2],
  ['Draft', 3]
];

type GameFilter = "Upcoming" | "Live" | "Past" | "Draft"

const ViewFilters: GameFilter[]  = ["Upcoming", "Live", "Past", "Draft"]

interface GameList {
  date: string,
  games: IGame[]
}

interface GameProps {
  user: UnionUser;
  isShown?: boolean;
  row?: number;
  sportFilter?: boolean;
  gameIds?: string[]
}

export const GamesView = ({
  user,
  isShown = true,
  row = 1,
  gameIds
}: GameProps) => {
  const { setGame, setNav } = useGameContext();
  const navigator = useNavigation();
  const [games, setGames] = useState<IGame[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const [active, setActive] = useState<GameFilter>('Upcoming')
  const [displayedGames, setDisplayGames] = useState<IGame[]>([])
  const [upcomingGames, setUpcomingGames] = useState<GameList[]>([])
  const [liveGames, setLiveGames] = useState<GameList[]>([])
  const [pastGames, setPastGames] = useState<GameList[]>([])
  const [drafts, setDrafts] = useState<GameList[]>([])

  const setUpcomingGameList = React.useCallback((games: IGame[] =  []) => {
    const dates: string[] = []
    games.forEach((item, index) => {
      const date = Methods.moment(item.fullDate).format('dddd, DD MMMM');
      if(!dates.includes(date)){
        dates.push(date)
      }
    })

    const games_ = games.filter((item)=>{
      return item.state === "none";
    })

    const list: GameList[] = dates.map((date) => {
      const _games = games_.filter((item)=>{
        const date_ = Methods.moment(item.fullDate).format('dddd, DD MMMM');
        return date_ === date;
      })
      return {
        date,
        games: _games
      }
    });

    setUpcomingGames(list.filter((item)=> item.games.length > 0))
  }, [])

  const setLiveGameList = React.useCallback((games: IGame[] =  []) => {
    const dates: string[] = []
    games.forEach((item, index) => {
      const date = Methods.moment(item.fullDate).format('dddd, DD MMMM');
      if(!dates.includes(date)){
        dates.push(date)
      }
    })

    const games_ = games.filter((item)=>{
      return ['running','paused'].includes(item.state);
    })

    const list: GameList[] = dates.map((date) => {
      const _games = games_.filter((item)=>{
        const date_ = Methods.moment(item.fullDate).format('dddd, DD MMMM');
        return date_ === date;
      })
      return {
        date,
        games: _games
      }
    });

    setLiveGames(list.filter((item)=> item.games.length > 0))
  }, [])


  const setPastGameList = React.useCallback((games: IGame[] =  []) => {
    const dates: string[] = []
    games.forEach((item, index) => {
      const date = Methods.moment(item.fullDate).format('dddd, DD MMMM');
      if(!dates.includes(date)){
        dates.push(date)
      }
    })

    const games_ = games.filter((item)=>{
      return item.state === "ended";
    })

    const list: GameList[] = dates.map((date) => {
      const _games = games_.filter((item)=>{
        const date_ = Methods.moment(item.fullDate).format('dddd, DD MMMM');
        return date_ === date;
      })
      return {
        date,
        games: _games
      }
    });

    setPastGames(list.filter((item)=> item.games.length > 0))
  }, [])

  const setDarfGameList = React.useCallback((games: IGame[] =  []) => {
    const dates: string[] = []
    games.forEach((item, index) => {
      const date = Methods.moment(item.fullDate).format('dddd, DD MMMM');
      if(!dates.includes(date)){
        dates.push(date)
      }
    })

    const games_ = games.filter((item)=>{
      return item.state === "none";
    })

    const list: GameList[] = dates.map((date) => {
      const _games = games_.filter((item)=>{
        const date_ = Methods.moment(item.fullDate).format('dddd, DD MMMM');
        return date_ === date;
      })
      return {
        date,
        games: _games
      }
    });

    setDrafts(list.filter((item)=> item.games.length > 0))
  }, [])


  const refreshData = useCallback(() => {
    const _games = AppSettings.getString(`game-list-${user.type}`, '[]');
    const gamesData: IGame[] = JSON.parse(_games);
    const filteredGames = gamesData.filter((item: { state: string; }, i: any) => {
      return item.state === 'none';
    })
    setUpcomingGameList(gamesData)
    setLiveGameList(gamesData)
    setPastGameList(gamesData)
    setDarfGameList(gamesData)
    setDisplayGames(filteredGames)
    setGames(gamesData)
    setLoading(false)
  }, [active])

  const onGameTap = (game: IGame, draft?: boolean) => {
    if (draft) {
      const draftGame = {
        ...game,
        role: ''
      }
      AppSettings.setString('new-game', JSON.stringify(draftGame))
      setGame(game);
      setNav(navigator);
      navigator.navigate(GMC.routeName, {
        game,
        draftGame
      })
    } else {
      setGame(game);
      setNav(navigator);
      navigator.navigate(Game.routeName, {
        game
      })
    }
  }

  const getData = () => {
    client.query({
      query: GAMES_QRY,
      variables: {
        user: user._id,
        gameIds
      }
    }).then(({ data }) => {
      const games_ = data.games.sort((a: { matchDate: any; }, b: { matchDate: any; }) => {
        let a_: any = new Date(a.matchDate || '');
        a_ = a_ === 'Invalid date' ? 0 : a_.getTime();

        let b_: any = new Date(b.matchDate || '');
        b_ = b_ === 'Invalid date' ? 0 : b_.getTime();
        return a_ < b_;
      }) || [];

      const filteredGames = games_.filter((item: { state: string; }, i: any) => {
        return item.state === 'none';
      })

      setUpcomingGameList(games)
      setLiveGameList(games)
      setPastGameList(games)
      setDisplayGames(filteredGames)
      setDarfGameList(games)
      setGames(games_)
      setLoading(false)
      refreshData();
      AppSettings.setString(`game-list-${user.type}`, JSON.stringify(games_));

    }).catch((err) => {
      setLoading(false)
    })
  }

  useEffect(() => {
    refreshData();
  }, [])

  useEffect(() => {
    getData()
    return () => {
      console.log("Closing games")
    }
  }, [])

  useEffect(() => {
    if (gameIds) getData()
    return () => {
      console.log("Closing games")
    }
  }, [gameIds])

  return (
    <>
      {isLoading &&
        <flexboxLayout style={{
          height: 140,
          margin: '16 16 0 16',
          borderColor: new Color('#ddd'),
          borderWidth: 1,
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
      }
      {!isLoading && games.length === 0 &&

        <flexboxLayout style={{
          height: 140,
          margin: '16 16 0 16',
          borderColor: new Color('#ddd'),
          borderWidth: 1,
          borderRadius: 8,
          background: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Empty style={{
            width: '100%'
          }} />
        </flexboxLayout>
      }
      {!isLoading && games.length > 0 &&
        <>
          <EventFilterSegments active={active as string} options={ViewFilters as string[]} onChange={(item) => {
            setActive(item as GameFilter);
            refreshData();
          }} />
          <stackLayout marginTop={16}></stackLayout>
          <stackLayout background="#fff" margin="0 0 16 0">
            {active === "Upcoming" &&
              <GameListView key="Upcoming" onTap={onGameTap} type="Upcoming" games={upcomingGames} />
            }
            {active === "Live" &&
              <GameListView key="Live" onTap={onGameTap} type={"Live"} games={liveGames} />
            }
            {active === "Past" &&
              <GameListView key="Past" onTap={onGameTap} type="Past" games={pastGames} />
            }
            {active === "Draft" &&
              <GameListView key="Draft" onTap={onGameTap} type="Draft" games={drafts} />
            }
          </stackLayout>
        </>
      }
    </>
  );
}

export const Games = ({ ...props }: GameProps) => {
  const { isShown = true, row = 1, sportFilter } = props;
  return (
    <scrollView visibility={isShown ? "visible" : "collapse"} row={row} background={'#eee'}>
      <stackLayout padding={sportFilter ? '0' : '16 0'}>
        <CalendarFilterProvider {...props}>
          <GamesView {...props} />
        </CalendarFilterProvider>
      </stackLayout>
    </scrollView>
  )
}

interface GameListViewProps {
  games: GameList[],
  type: GameFilter,
  onTap(game: IGame, draft?: boolean): void;
}

const GameListView = ({ games, type, onTap }: GameListViewProps) => {
  return(
    <>
    {games.length === 0 &&
      <flexboxLayout  key={`games-${type}-empty`} style={{
        height: 140,
        margin: '16 16 16 16',
        borderColor: new Color('#ddd'),
        borderWidth: 1,
        borderRadius: 8,
        background: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Empty style={{
          width: '100%',
          borderWidth: 0
        }} />
      </flexboxLayout>
    }
    {games.length > 0 &&
      <stackLayout key={`games-${type}-${games.length}`}>
        {games.map((listItem, index) => {
          return (
            <stackLayout key={`${type}-${index}`}>
              <flexboxLayout visibility="collapse" style={{
                background: Theme[500],
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <label text={listItem.date} fontSize={16} color={'#fff'} />
              </flexboxLayout>
              <stackLayout padding="0 16 16">
                {listItem.games.map((item, index: number) => {
                  return (
                    <GameCard onTap={onTap} type={type} game={item} key={item._id} />
                  )
                })
                }
              </stackLayout>
            </stackLayout>
          )
        })}
      </stackLayout>
    }
    </>
  )
}

interface GameCardProps {
  game: IGame;
  type: GameFilter;
  onTap(game: IGame, draft?: boolean): void;
}

const GameCard = ({
  game,
  type,
  onTap
}: GameCardProps) => {
  const date = Methods.moment(game.matchDate).format("DD MMM Y");
  const goals = game
  if (date === "Invalid date" && type === "Upcoming") return <></>;
  if (!game.teamOne.name || !game.teamTwo.name) return <></>;
  return(
    <>
      <gridLayout columns="5,70, *, 70,5, auto" margin="0 0 0 0" padding={8} rows="auto, auto" style={{
        background: '#fff',
        borderBottomColor: '#ddd',
        borderBottomWidth: 0.5
      }}>
        <GameCard.Team col={1} team={game.teamOne} />
        {type === "Upcoming" && (
          <GameCard.Upcoming onTap={() => onTap(game)} col={2} game={game} />
        )}
        {type === "Past" && (
          <GameCard.Past onTap={() => onTap(game)} col={2} game={game} />
        )}
        {type === "Live" && (
          <GameCard.Live onTap={() => onTap(game)} col={2} game={game} />
        )}
        {type === "Draft" && (
          <GameCard.Past draft onTap={() => onTap(game, true)} col={2} game={game} />
        )}
        <GameCard.Team col={3} team={game.teamTwo} />
        {type === "Upcoming" && (
          <stackLayout col={5}>
            <label color={new Color('#ddd')} textAlignment={'center'} verticalAlignment={'middle'} className={'MaterialIcons size18'} text={IconSet.MaterialIcons["event-available"]} />
          </stackLayout>
        )}
      </gridLayout>
      {type === 'Past' && (
        <GameCard.PastInfo countFour={0} countOne={0} countTwo={0} countThree={0} />
      )}
    </>
  )
}

interface GameCardPastInfo {
  countOne: number;
  countTwo: number;
  countThree: number;
  countFour: number;
}
GameCard.PastInfo = ({
  countFour,
  countOne,
  countThree,
  countTwo
}: GameCardPastInfo): JSX.Element => {
  return(
    <gridLayout>
      <gridLayout columns="*,*,*,*">
        <GameCard.PastInfoItem col={0} labelFor="Goals" count={countOne} />
        <GameCard.PastInfoItem col={1} labelFor="Yellow Cards" count={countTwo} />
        <GameCard.PastInfoItem col={2} labelFor="Red Cards" count={countThree} />
        <GameCard.PastInfoItem col={3} labelFor="Fouls" count={countFour} />
      </gridLayout>
    </gridLayout>
  )
}

type GameCardPastInfoItemLabel = "Goals" | "Yellow Cards" | "Red Cards" | "Fouls"

const CardImages = {
  "Goals": "~/images/assets/soccer_icon_drk.png",
  "Yellow Cards": "~/images/assets/yellow_card_icon.png",
  "Red Cards": "~/images/assets/red_card_icon.png",
  "Fouls": "~/images/assets/yellow_card_icon_ptn.png",
}

interface GameCardPastInfoItemProps {
  col: number,
  labelFor: GameCardPastInfoItemLabel,
  count: number,
}

GameCard.PastInfoItem = ({
  col,
  labelFor
}: GameCardPastInfoItemProps) => {
  return(
    <stackLayout col={col}>
      <flexboxLayout style={{
        alignItems: "center",
        justifyContent: "center",
      }}>
        <label text={'0'} textAlignment="center" verticalAlignment="middle" style={{
          color: Theme[500],
          fontSize: 30,
          marginRight: 4,
        }} />
        <image src={CardImages[labelFor]} height={labelFor === "Goals" ? 30 : 15} />
      </flexboxLayout>
      <label text={labelFor} textAlignment="center" verticalAlignment="middle" style={{
        fontSize: 10,
        color: '#666',
      }} />
    </stackLayout>
  )
}

interface GameCardTeamProps {
  team: ITeam,
  col: number
}

GameCard.Team = ({
  team,
  col,
}: GameCardTeamProps) => {
  const navigator = useNavigation();
  return(
    <flexboxLayout style={{
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: 80,
    }} col={col} onTap={() => {
      navigator.navigate(Team.routeName, { team })
    }}>
      <image src={team.image} style={{
        width: 40,
        height: 40,
        borderRadius: 20,
      }} />
      <label textWrap textAlignment="center" text={String(team?.name).toUpperCase()} style={{
        fontSize: 10,
      }} />
    </flexboxLayout>
  )
}

interface GameCardLiveProps {
  game: IGame,
  col: number,
  draft?: boolean
  onTap(): void
}

GameCard.Upcoming = ({
  game,
  col,
  onTap
}: GameCardLiveProps) => {
  return(
    <flexboxLayout onTap={onTap} col={col} style={{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <label fontSize={10} text={"VS"} color="#666" />
      <label fontSize={14} text={Methods.moment(game.matchDate).format("HH:MM")} style={{
        fontWeight: 'bold',
        color: '#384353'
      }}/>
      <label fontSize={14} text={Methods.moment(game.matchDate).format("DD MMM Y")} style={{
        fontWeight: 'bold',
        color: '#384353'
      }}/>
    </flexboxLayout>
  )
}

GameCard.Live = ({
  game,
  col,
  onTap
}: GameCardLiveProps) => {
  const goalsOne: any[] = Helper.listify(game.teamOneActs).filter((_item) => _item.type === 'goal');
  const goalsTwo: any[] = Helper.listify(game.teamTwoActs).filter((_item) => _item.type === 'goal');

  return(
    <flexboxLayout onTap={onTap} col={col} style={{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <label fontSize={14} text={`${goalsOne.length} - ${goalsTwo.length}`} style={{
        fontWeight: 'bold',
        color: '#384353'
      }}/>
    </flexboxLayout>
  )
}

GameCard.Past = ({
  game,
  col,
  onTap,
  draft
}: GameCardLiveProps) => {
  const goalsOne: any[] = Helper.listify(game.teamOneActs).filter((_item) => _item.type === 'goal');
  const goalsTwo: any[] = Helper.listify(game.teamTwoActs).filter((_item) => _item.type === 'goal');

  return(
    <flexboxLayout onTap={onTap} col={col} style={{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <label fontSize={14} text={draft ? '[draft]' : `${goalsOne.length} - ${goalsTwo.length}`} style={{
        fontWeight: 'bold',
        color: '#384353'
      }}/>
    </flexboxLayout>
  )
}

GameCard.Draft = ({
  game,
  col,
  onTap
}: GameCardLiveProps) => {
  const goalsOne: any[] = Helper.listify(game.teamOneActs).filter((_item) => _item.type === 'goal');
  const goalsTwo: any[] = Helper.listify(game.teamTwoActs).filter((_item) => _item.type === 'goal');

  return(
    <flexboxLayout onTap={onTap} col={col} style={{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <label fontSize={14} text={`DRAFT`} style={{
        fontWeight: 'bold',
        color: '#384353'
      }}/>
    </flexboxLayout>
  )
}
