import * as React from 'react';
import { SEASON } from '~/apollo/queries/season';
import { SEASON_GAMES } from '~/apollo/queries/seasonGames';
import { SEASON_GROUPS } from '~/apollo/queries/seasonGroups';
import { Season, SeasonGroup, SeasonGroupGame } from '~/generated/graphql';
import { useSupotsuQuery } from '~/utils/useSupotsuMutation';

interface SeasonContextData {
  groups: SeasonGroup[],
  season?: Season
  games: SeasonGroupGame[]
  setSeasonId: React.Dispatch<React.SetStateAction<string>>
  setCurrentSeasonId: React.Dispatch<React.SetStateAction<string>>
  refetch(): void
  loading: boolean
  currentSeasonId?: string
}

const SeasonContext = React.createContext({} as SeasonContextData)

interface SeasonProviderProps {
  
}

export const SeasonProvider: React.FC<SeasonProviderProps> = ({ children }) => {
  const [seasonId, setSeasonId] = React.useState<string>(undefined)
  const [currentSeasonId, setCurrentSeasonId] = React.useState<string>(undefined)
  const { data: seasonData, refetch: refreshSeason, loading: seasonLoading } = useSupotsuQuery(SEASON, {
    variables: {
      _id: seasonId
    },
    onError(error) {
        console.log(error)
    },
  })
  const { data: groupsData, refetch: refreshGroup, loading: groupsLoading } = useSupotsuQuery(SEASON_GROUPS, {
    variables: {
      _id: seasonId
    }
  })

  const { data: seasonGamesData, refetch: refreshGames } = useSupotsuQuery(SEASON_GAMES, {
    variables: {
      _id: currentSeasonId
    }
  })

  const refetch = async () => {
    await refreshSeason()
    await refreshGroup()
  }
  const season: Season = seasonData && seasonData.season ? seasonData.season : undefined
  const groups: SeasonGroup[] = groupsData && groupsData.seasonGroups ? groupsData.seasonGroups : []
  const games: SeasonGroupGame[] = seasonGamesData && seasonGamesData.seasonGames ? seasonGamesData.seasonGames : []

  const loading = seasonLoading || groupsLoading

  React.useEffect(() => {
    if (currentSeasonId) {
      console.log('fetch game for ', currentSeasonId)
      refreshGames({
        _id: currentSeasonId
      })
    }
  }, [currentSeasonId])
  
  return (
    <SeasonContext.Provider value={{ 
      season,
      groups,
      setSeasonId,
      setCurrentSeasonId,
      refetch,
      loading,
      games,
      currentSeasonId
    }}>
      {children}
    </SeasonContext.Provider>
  )
} 

export const useSeasonContext = () => React.useContext(SeasonContext)