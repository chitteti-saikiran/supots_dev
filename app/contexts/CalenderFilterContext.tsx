import { Color } from '@nativescript/core';
import * as React from 'react';
import Methods from '~/Methods';
import Theme, {Theme2} from '~/Theme';
import * as ISupotsu from '~/DB/interfaces';
import IconSet from '~/font-icons';
import { EventButton } from '~/Screens/Events';
import * as AppSettings from '@nativescript/core/application-settings';

interface RenderCalendarProps {
  sportFilter?: boolean;
  renderActions?(): React.ReactNode;
  setState?(props): void;
  setActiveDate?(date: Date): void;
}

interface CalendarFilterContextData {
  activeDate: Date;
  date: Date;
}

interface CurrentDateData {
  currentMonth: number;
  currentYear: number;
  currentDate: number;
  monthAhead: Date;
  weekAhead: Date;
}

interface CalendarExtraFilterState {
  activeSport: ISupotsu.Sport | null;
  showSportFilter: boolean;
}

const CalendarFilterContext = React.createContext({} as CalendarFilterContextData & CurrentDateData & CalendarExtraFilterState);

export const CalendarFilterProvider: React.FC<RenderCalendarProps> = ({
  children,
  ...props
}) => {
  const [date, setDate] = React.useState(() => {
    const date = new Date()
    return date;
  });

  const [state, updateExtraFilterState] = React.useState<CalendarExtraFilterState>({
    showSportFilter: false,
    activeSport: null,
  })

  const [activeDate, setActiveDate] = React.useState(() => {
    const date = new Date()
    return date;
  });

  const [currentDate, setCurrentData] = React.useState<CurrentDateData>(() => {
    const dateNow = new Date()
    const aheadDate = new Date()
    return {
      currentMonth: dateNow.getMonth(),
      currentYear: dateNow.getFullYear(),
      currentDate: dateNow.getDate(),
      weekAhead: new Date(+dateNow + 12096e5),
      monthAhead: new Date(aheadDate.setMonth(aheadDate.getMonth() + 3))
    };
  });

  const setState = (newState: Partial<CalendarExtraFilterState>, cb = () => { }) => {
    updateExtraFilterState({
      ...state,
      ...newState
    })
    if (cb) cb()
  }

  return (
    <CalendarFilterContext.Provider value={{
      ...currentDate,
      activeDate,
      ...state,
      date
    }}>
      <CalendarFilterView {...props} setState={setState} setActiveDate={setActiveDate}  />
      {children}
    </CalendarFilterContext.Provider>
  )
}

const CalendarFilterView: React.FC<RenderCalendarProps> = ({
  sportFilter = false,
  renderActions,
  setActiveDate,
  setState
}) => {
  const {monthAhead, activeDate, currentMonth, currentYear, activeSport, showSportFilter, date} = useCalendarFilterContext();
  const dummy = Methods.getDummy(6);
  const daysDummy = Methods.getDates(date, monthAhead);

  const sports: ISupotsu.Sport[] = JSON.parse(AppSettings.getString('sports', '[]'));

  const activeSportImageUrl = activeSport ? `https://supotsu.com/${activeSport.image}`.replace('.svg', '.png') : undefined;
  return (
    <stackLayout background={'#fff'} padding={"8 16"}>
      <stackLayout marginBottom={16} visibility={showSportFilter ? 'visible' : 'collapse'}>
        <flexboxLayout col={0} style={{
          alignItems: 'center',
          marginBottom: 8
        }}>
          <label fontSize={20} style={{
            fontWeight: 'bold'
          }} color={new Color(Theme['500'])} marginRight={8} text={"Select Sport"} />
          <label color={new Color(Theme['500'])} className={'MaterialIcons size24'} text={IconSet.MaterialIcons["keyboard-arrow-down"]} />
        </flexboxLayout>
        <scrollView scrollBarIndicatorVisible={false} orientation="horizontal">
          <stackLayout orientation="horizontal">
            <flexboxLayout col={3} marginRight={8} style={{
              width: 35,
              height: 35,
              borderRadius: 35 / 2,
              background: Theme2[500],
              marginRight: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }} onTap={() => {
              setState({
                activeSport: null,
                showSportFilter: false
              })
            }}>
              <label text="All" style={{
                fontSize: 14,
                color: '#fff',
              }} />
            </flexboxLayout>
            {sports.map((sport) => {
              const url = `https://supotsu.com/${sport.image}`.replace('.svg', '.png');
              return (
                <flexboxLayout key={sport._id} style={{
                  width: 35,
                  height: 35,
                  borderRadius: 35 / 2,
                  background: sport.color,
                  marginRight: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }} onTap={() => {
                  setState({
                    activeSport: sport,
                    showSportFilter: false
                  })
                }}>
                  <image src={url} style={{
                    width: 20,
                    height: 20
                  }} />
                </flexboxLayout>
              )
            })}
          </stackLayout>
        </scrollView>
      </stackLayout>

      <gridLayout columns={'*, auto, 16, auto, auto'}>
        <gridLayout col={0} columns={'*, *, *, *, *, *'}>
          {
            dummy.map((item, i: number) => {
              const now = date;
              const current = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), now.getMonth() + i, 1)
              const _mon = Methods.months[current.getMonth()];
              return (
                <flexboxLayout key={i} col={i} style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <label verticalAlignment={'middle'} textAlignment={'center'} text={_mon.substr(0, 3)} marginTop={4} style={{
                    textTransform: 'uppercase',
                    fontSize: 14,
                    color: current.getMonth() === currentMonth && current.getFullYear() === currentYear ? new Color(Theme2[500]) : new Color(Theme2[300])
                  }} />
                </flexboxLayout>
              )
            })
          }
        </gridLayout>
        {sportFilter && (
          <flexboxLayout col={3} style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4
          }} onTap={() => {
            setState({
              showSportFilter: !showSportFilter
            })
          }}>
            <label className="MaterialIcons size20" style={{}} text={IconSet.MaterialIcons["keyboard-arrow-left"]} />
            <flexboxLayout style={{
              height: 24,
              width: 24,
              borderRadius: 24 / 2,
              background: activeSport ? activeSport.color : Theme[500],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {activeSport && (
                <image src={activeSportImageUrl} style={{
                  width: 12,
                  height: 12,
                }} />
              )}
              {!activeSport && (
                <label text="All" style={{
                  fontSize: 10,
                  color: '#fff',
                }} />
              )}
            </flexboxLayout>
            <label className="MaterialIcons size20" style={{}} text={IconSet.MaterialIcons["keyboard-arrow-right"]} />
          </flexboxLayout>
        )}
        {renderActions && renderActions()}
      </gridLayout>

      <gridLayout rows={'auto, 8, auto, auto'} margin={"16 0"}>

        <scrollView scrollBarIndicatorVisible={false} row={2} width={'100%'} orientation={'horizontal'}>
          <stackLayout orientation={'horizontal'}>
            {
              daysDummy.map((item, i) => {
                const _date = new Date(item);
                const todayDate = Methods.moment(date).format('YYYY-MM-DD');
                const activeDate_ = Methods.moment(activeDate).format('YYYY-MM-DD');
                const isToday = Boolean(todayDate === Methods.moment(_date).format('YYYY-MM-DD'));
                const isActive = Boolean(activeDate_ === Methods.moment(_date).format('YYYY-MM-DD'));
                return (
                  <flexboxLayout key={item} onTap={() => {
                    setActiveDate(_date);
                  }} marginRight={16} borderRadius={20} col={i} style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    flexDirection: 'column',
                    ...isToday ? {
                      background: Theme2[300],
                      color: '#fff',
                      padding: '8 0'
                    } : isActive ? {
                      background: Theme[300],
                      color: '#fff',
                      // padding: 8
                    } : {}
                  }}>
                    <label text={Methods.days[_date.getDay()]} />
                    <label text={String(_date.getDate())} />
                  </flexboxLayout>
                )
              })
            }
          </stackLayout>
        </scrollView>
      </gridLayout>
    </stackLayout>
  )
};

export const useCalendarFilterContext = () => {
  const data = React.useContext(CalendarFilterContext);
  return data;
}
