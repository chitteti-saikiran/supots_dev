import * as React from 'react';
import { Component, Fragment, useState } from 'react';
import { client, onTouch } from '~/app';

import { useGameContext } from '~/contexts/GameContext';
import * as Application from '@nativescript/core/application';
import * as AppSettings from '@nativescript/core/application-settings';
import { generateSqd, PlayerQL, SET_GAME_PLAYERS, REMOVE_ACT, GMC_STATUS_SUBSCRIPTION, GMC_STREAM_SUBSCRIPTION, GMC_UPDATER, GMC_STARTER, GMC_ENDER, GMC_PAUSE, ADD_ACTION, CREATE_GAME, EDIT_SQUAD_GAME, GET_GAME, ADD_SHOOTOUT_ACTION } from '~/components/GQL';
import { Color } from '@nativescript/core/color/color';
import { Theme2 } from '~/Theme';
//import { CameraPlus } from '@nstudio/nativescript-camera-plus';
import { EventData, View, ShowModalOptions, isIOS, isAndroid } from '@nativescript/core/ui/page';
import IconSet from '~/font-icons';
import { goToPageReact } from '../components/AppContainer';
import { ComboModal, DateModalProps, DateModal, LocationModalProps, LocationModal, TrainingAddButtonIcon, Modal, ModalProps, SaveButton, styles, BasicTextField, LocDiv, ComboSelector, DateSelector, LocationSelector } from '~/ui/common.ui';
import { ComboModalProps, ComboModalHeaderSize, ModalHeaderSize, ModalActionButon } from '../ui/common.ui';
import * as moment from 'moment';
import Methods from '~/Methods';
import Helper from '~/helpers';
import * as dialogs from "@nativescript/core/ui/dialogs";
import { setCurrentOrientation } from 'nativescript-screen-orientation';
import { screen } from '@nativescript/core/platform';
import { CreateViewEventData } from '@nativescript/core';
import { getItemSpec } from '../helpers';
import { ListView as $ListView, NSVElement } from "react-nativescript";
import { Page } from 'tns-core-modules/ui/page/page';
import { Frame } from 'tns-core-modules/ui/frame';
import { useStyledContext } from '~/contexts/StyledContext';
import { useNavigation, useRoute } from '@react-navigation/core';
import * as ISupotsu from '../DB/interfaces/index';
import NativeModal from '~/ui/Modal';
import { useStreamRTMP } from '~/hooks/useStreamRTMP';

const d = AppSettings.getString('you', '{}');
const user = JSON.parse(d);

const _users = AppSettings.getString('users', '[]');
const users = JSON.parse(_users);

const _teams = AppSettings.getString('teams', '[]');
const teams = JSON.parse(_teams);

const _sports = AppSettings.getString('sports', '[]');

const _games = AppSettings.getString('game-list', '[]');
const games = JSON.parse(_games);

interface GMCPlayerProps {
  game: any;
  squad: any;
  team: any;
  isHome: boolean;
  playerList: any[];
  subList: any[];
  otherLineup: any[];
  lineup: any[];
  otherSubs: any[];
  role: string;
  isLoadingPlayers: boolean
  setSquad(squad: any): void;
  players: number;
  onPlayerPicked(player: any): void;
  onSubPicked(player: any): void;
  subs: number;
  mainProps: any;
  saveLineupPlay(player: any, index: any): void
  saveSubPlay(player: any, index: any): void
  removeSub(index: number): void
  removePlayer(index: number): void
}

export class GMCPlayer extends Component<GMCPlayerProps, any>{

  constructor(props: GMCPlayerProps) {
    super(props);
  }

  setIsSubs = (isSubs: boolean) => {
    this.setState({ isSubs })
  }

  setIsCreating = (isCreating: boolean) => {
    this.setState({ isCreating })
  }
  setLoading = (isLoading: boolean) => {
    this.setState({ isLoading })
  }

  setName = (name: string) => {
    this.setState({ name })
  }

  state = {
    name: "",
    isSubs: false,
    isLoading: false,
    isCreating: false,
    isAdding: false,
    squad: {
      _id: null
    }
  }
  componentDidMount = () => {

  }

  generateDefaultSquad = () => {
    const { setLoading, props } = this;
    const { setSquad } = props;
    const { name } = this.state;
    setLoading(true);

    client.mutate({
      mutation: generateSqd,
      variables: {
        team_id: this.props.team._id,
        name
      }
    }).then(({ data }) => {
      if (data.generateDefaultSquad && data.generateDefaultSquad._id) {
        setSquad(data.generateDefaultSquad);
        setLoading(!true)
      } else {
        alert('Squad not generated at this moment, please try again!');
        setLoading(!true)
      }
    }).catch((err) => {
      alert(err);
      setLoading(!true)
    })
  }

  openPlayerAddModal = () => {

  }

  renderModal = (props: object) => {

    const render = () => {
      return (
        <PlayerPickerModal {...props} isModal />
      )
    };

    const { isAdding } = this.state;
    if (isAdding) return;
    this.setState({ isAdding: true });

    const opts: ModalProps = {
      title: "Select User",
      onDoneTitle: 'Add Player',
      size: ModalHeaderSize.mini,
      render,
      onDoneButton: ModalActionButon.red,
      onClose: () => {
        this.setState({ isAdding: false });
      },
      onDone: (_modal: Modal) => {

      }
    }

    goToPageReact(Modal, opts, 'ComboModal')
  }

  render = () => {
    const { setIsSubs, props } = this;
    const { team, squad, setSquad, subList, lineup, playerList, isLoadingPlayers = false, isHome } = props;
    const { isCreating, isLoading, name, isSubs } = this.state;
    const canEdit = props.isHome ? true : (props.role !== "Team Member") ? true : false;
    const { squads } = team;
    var players = Array(props.players).fill(() => {
      return {
        _id: null,
        name: ''
      }
    })

    var subs = Array(props.subs).fill(() => {
      return {
        _id: null,
        name: ''
      }
    });

    const data = playerList.filter((player) => {
      if (!isSubs) {
        const ids = Methods.listify(props.subList.map((i) => i._id));
        return !ids.includes(player._id)
      } else {
        const ids = Methods.listify(props.lineup.map((i) => i._id));
        return !ids.includes(player._id)
      }
    })

    return (
      <gridLayout {...this.props.mainProps} className="gmc-player-holder" rows={`auto, *`}>
        <gridLayout columns={`auto,*,auto`} row={0} style={{
          background: '#fff',
          alignItems: 'center',
          flexDirection: 'row',
          padding: 10,
          borderRadius: '2 2 0 0'
        }}>
          {squad &&
            <flexboxLayout onTouch={onTouch} onTap={() => {
              setIsSubs(!isSubs)
            }} justifyContent="center" alignItems="center" col={0} padding="0 0">
              <stackLayout className={!isSubs ? "gmc-next-btn" : "gmc-next-btn dark"}>
                <label text={isSubs ? 'Subs' : 'Line Up'} />
              </stackLayout>
            </flexboxLayout>
          }
          <label col={1} style={{
            color: new Color('#000'),
            textAlignment: 'center'
          }} text={team.name} />
          {//squad &&
            <TrainingAddButtonIcon disabled={!canEdit} col={2} size={30} onPress={() => {
              //PlayerPickerModal
              const passProps = {
                ...props,
                isSubs,
                selected: [...subList, ...lineup],
                otherSelected: [...props.otherSubs, ...props.otherLineup],
                onPlayerPicked(item: any) {
                  if (isSubs) {
                    if (props.subList.length === subs.length) return;
                    props.onSubPicked(item);
                    return
                  };
                  if (props.lineup.length === players.length) return;
                  //setPlayer(item);
                  props.onPlayerPicked(item)
                },
                getSelection() {
                  return [...subList, ...lineup]
                },
                getOtherSelection() {
                  return [...props.otherSubs, ...props.otherLineup]
                },
                onSubPicked(item: any) {
                  if (!isSubs) {
                    if (props.lineup.length === players.length) return;
                    //setPlayer(item);
                    props.onPlayerPicked(item)

                    return;
                  };
                  if (props.subList.length === subs.length) return;
                  //setPlayer(item);
                  props.onSubPicked(item)
                }
              }
              this.renderModal(passProps)
            }} />
          }
        </gridLayout>
        {!squad && !isLoadingPlayers && squads.current.length === 0 &&
          <stackLayout horizontalAlignment="center" verticalAlignment="middle" row={1}>
            <label style={{
              color: new Color('white'),
              marginBottom: 10,
              textAlignment: 'center',
              horizontalAlignment: 'center',
              verticalAlignment: 'middle'
            }} text={isCreating ? `Squad Name` : `Create Squad?`} />
            {isCreating &&

              <textField width={{ value: 50, unit: '%' }} onTextChange={(args: any) => {
                this.setState({
                  name: args.object.text
                })
              }} text={name} hint="Name" style={{
                //height: 40,
                padding: 10,
                borderRadius: 5,
                width: 100,
                background: '#fff',
                marginBottom: 10
              }} />
            }
            <stackLayout horizontalAlignment="center" verticalAlignment="middle" onTap={() => {
              if (isCreating) {
                if (name.length <= 3) {
                  alert('Name too short');
                  return;
                }
                this.generateDefaultSquad()
              } else {
                this.setState({
                  isCreating: true
                })
              }
            }} style={{
              borderRadius: 10,
              background: Theme2['500'],
              alignItems: 'center',
              justifyContent: 'center',
              height: 30,
              padding: `0 10`
            }}>
              {!isLoading && !isCreating &&
                <label style={{
                  color: new Color('#fff')
                }} text="Create" />
              }
              {isLoading && !isCreating &&
                <activityIndicator color={new Color('#fff')} />
              }
              {isCreating &&
                <label style={{
                  color: new Color('#fff')
                }} text="Save" />
              }
            </stackLayout>
          </stackLayout>
        }
        {!squad && !isLoadingPlayers && squads.current.length > 0 &&
          <$ListView
            items={squads.current}
            row={1}
            backgroundColor={new Color('rgba(0,0,0,0)')}
            separatorColor={new Color('white')}
            cellFactory={(item: any) => {
              const ref: React.RefObject<NSVElement<any>> = React.createRef<NSVElement<any>>()
              return (
                <stackLayout onTap={() => {
                  setSquad(item);
                }} onTouch={onTouch} ref={ref} verticalAlignment={'middle'} orientation="horizontal" padding={"5 20"}>
                  <flexboxLayout style={{
                    marginBottom: 0,
                    marginRight: 10,
                    width: 40,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <image src={team.image} style={{
                      height: 35,
                      width: 35,
                      borderRadius: 17.5
                    }} stretch="fill" />
                  </flexboxLayout>
                  <flexboxLayout height={35} flexDirection={'column'} justifyContent={'center'}>
                    <label textWrap style={{
                      color: new Color('#fff'),
                      fontSize: 14,
                      margin: 0,
                      padding: 0
                    }} verticalAlignment="middle" text={item.name} />
                    <label textWrap style={{
                      color: new Color('#fff'),
                      fontSize: 12,
                      margin: 0,
                      padding: 0
                    }} verticalAlignment="middle" text={item.gender} />
                  </flexboxLayout>
                </stackLayout>
              )
            }}
          />
        }
        {squad &&
          <scrollView row={1} />
        }
        {isLoadingPlayers &&
          <flexboxLayout row={1} style={{
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <activityIndicator busy color={new Color('#fff')} />
          </flexboxLayout>
        }
        {squad && !isLoadingPlayers &&
          <$ListView
            items={data}
            row={1}
            backgroundColor={new Color('rgba(0,0,0,0)')}
            separatorColor={new Color('white')}
            cellFactory={(item: any) => {
              const ref: React.RefObject<NSVElement<any>> = React.createRef<NSVElement<any>>()
              let selected = false;
              const index = data.findIndex((item_) => {
                return item_._id === item._id;
              })
              if (isSubs) {
                const ids = Methods.listify(props.subList.map((i) => i._id));
                selected = ids.includes(item._id)
              } else {
                const ids = Methods.listify(props.lineup.map((i) => i._id));
                selected = ids.includes(item._id)
              }
              return (
                <stackLayout onTap={() => {
                  //setSquad(item);
                }} ref={ref} verticalAlignment={'middle'} orientation="horizontal" padding={"5 20"}>
                  <PlayerPickedItem addPlayer={() => {
                    if (isSubs) {
                      props.onSubPicked(item)
                    } else {
                      props.onPlayerPicked(item)
                    }
                    console.log('select player', selected)
                  }} game={this.props.game} remove={() => {
                    if (isSubs) {
                      props.removeSub(index);
                    } else {
                      props.removePlayer(index);
                    }
                  }} savePlayer={(_player: any) => {
                    if (isSubs) {
                      props.saveSubPlay(_player, index)
                    } else {
                      props.saveLineupPlay(_player, index)
                    }
                  }} key={selected ? `selected-${isSubs ? 'sub' : 'line'}-${item._id}` : `normal-${isSubs ? 'sub' : 'line'}-${item._id}`} selected={selected} player={item} {...props} isHome={isHome} />
                </stackLayout>

              )
            }}
          />
        }
      </gridLayout>
    )
  }
}

const PlayerPickedItem = (props: { isHome?: any; game: any; role?: any; remove?: any; savePlayer?(data?: any): any; addPlayer?(data?: any): any; player?: any; selected?: any; isActive?: boolean; isModal?: boolean; color?: string }) => {
  const { player, selected, game: initGame, isModal } = props;
  const [isEdit, setIsEdit] = React.useState(false);
  const { game: gameCTX } = useGameContext();
  const [number, setNumber] = React.useState(player.number || 0)
  const [position, setPosition] = React.useState(player.position || "-");
  const [isModalOpen, setModalOpen] = React.useState(false);
  const canEdit = props.isHome ? true : (props.role !== "Team Member") ? true : false;
  const item = player;
  const game = !initGame ? gameCTX : initGame;
  const openNumber = (args: EventData) => {
    if (isModalOpen) return;
    setModalOpen(true)

    const opts: ComboModalProps = {
      items: gen(100),
      title: "Select Jersey Number",
      selected: number,
      size: ComboModalHeaderSize.mini,
      onDone: (number?: number) => {
        if (number) {
          setNumber(number)
        }
        setModalOpen(false)
      }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
  }

  const openPosition = (args: EventData) => {
    if (isModalOpen) return;
    setModalOpen(true)

    const items = Helper.positions[game.sport.name] ? Helper.positions[game.sport.name]['positions'] : [];

    const opts: ComboModalProps = {
      items: items,
      title: "Select Position",
      selected: position,
      size: ComboModalHeaderSize.mini,
      onDone: (position?: any) => {
        if (position) {
          setPosition(position)
        }
        setModalOpen(false)
      }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
  }

  const renderNormalActions = () => {
    return (
      <Fragment>
        {selected && !isEdit && (canEdit) &&
          <gridLayout horizontalAlignment={'center'} col={4} columns={getItemSpec(['auto', 'auto', 'auto'])}>
            <TrainingAddButtonIcon col={0} size={25} icon={'md-create'} backgroundColor={"#4a5"} onPress={() => {
              setIsEdit(true)
            }} />
            <label col={1} style={{
              width: 1,
              height: 10,
              margin: `0 5`
            }} />
            <TrainingAddButtonIcon col={2} size={25} icon={'md-remove'} backgroundColor={"#D21E41"} onPress={() => {
              if (props.remove) {
                props.remove()
              }
            }} />
          </gridLayout>
        }
        {!selected && !isEdit && (canEdit) &&
          <gridLayout horizontalAlignment={'center'} col={4} columns={getItemSpec(['auto', 'auto', 'auto'])}>
            <TrainingAddButtonIcon col={0} size={25} icon={'md-add'} backgroundColor={"#4a5"} onPress={() => {
              if (props.addPlayer && !isModal) {
                props.addPlayer();
              } else if (props.savePlayer) {
                props.savePlayer({
                  ...player,
                  number,
                  position
                })
              }
            }} />
          </gridLayout>
        }
        {isEdit &&
          <gridLayout horizontalAlignment={'center'} col={4} columns={getItemSpec(['auto', 'auto', 'auto'])}>
            <TrainingAddButtonIcon col={0} size={25} icon={'save'} iconType={'MaterialIcons'} backgroundColor={"#4a5"} onPress={() => {
              setIsEdit(!true);
              if (props.savePlayer) {
                props.savePlayer({
                  ...player,
                  number,
                  position
                })
              }
            }} />
          </gridLayout>
        }
      </Fragment>
    )
  }

  const renderModalActions = () => {
    return (
      <Fragment>
        {player && !isEdit &&
          <gridLayout marginTop={10} horizontalAlignment={'center'} col={4} columns={getItemSpec(['auto', 'auto', 'auto'])}>
            <TrainingAddButtonIcon col={0} size={25} icon={'md-create'} backgroundColor={"#4a5"} onPress={() => {
              setIsEdit(true)
            }} />
            <label col={1} style={{
              width: 1,
              height: 10,
              margin: `0 5`
            }} />
            <TrainingAddButtonIcon col={2} size={25} icon={props.isActive ? 'md-remove' : 'md-add'} backgroundColor={props.isActive ? "#D21E41" : Theme2['500']} onPress={() => {
              const _obj = {
                ...player,
                position,
                number
              }
              if (props.isActive) {
                props.remove(_obj)
              } else {
                if (position === "" || position === "-") {
                  alert("Select player position")
                  return;
                }
                props.savePlayer(_obj)
              }
            }} />
          </gridLayout>
        }
        {player && isEdit &&
          <gridLayout marginTop={10} horizontalAlignment={'center'} col={4} columns={getItemSpec(['auto', 'auto', 'auto'])}>
            <TrainingAddButtonIcon col={0} size={25} icon={'save'} iconType={'MaterialIcons'} backgroundColor={"#4a5"} onPress={() => {
              const _obj = {
                ...player,
                position,
                number
              }
              if (props.isActive) {
                return;
              } else {
                if (position === "" || position === "-") {
                  alert("Select player position")
                  return;
                }
                props.savePlayer(_obj);
                setIsEdit(false);
              }
            }} />
          </gridLayout>
        }
      </Fragment>
    )
  }

  return (
    <Fragment>
      <flexboxLayout style={{
        marginBottom: 0,
        marginRight: 10,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <image src={String(item.user.image).replace('default_avatar.svg', 'default_avatar.png')} style={{
          height: 35,
          width: 35,
          borderRadius: 17.5
        }} stretch="fill" />
      </flexboxLayout>
      <gridLayout {...isModal ? {} : {
        height: 35
      }} columns={getItemSpec(['*', '20', '*', '20', 'auto'])}>
        {!isEdit && isModal &&
          <stackLayout col={0} colSpan={3}>
            <label col={2} textWrap style={{
              color: new Color('#000'),
              fontSize: 14,
              margin: 0,
              padding: 0
            }} verticalAlignment="middle" text={item.name ? item.name : item.user.name} />
            <gridLayout columns={getItemSpec(['*', '20', '*', '20', 'auto'])}>
              <label col={0} textWrap style={{
                color: props.color ?? new Color('#000'),
                fontSize: 12,
                margin: 0,
                padding: 0
              }} verticalAlignment="middle" text={position || "Edit Position"} />
              <label col={2} textWrap style={{
                color: props.color ?? new Color('#000'),
                fontSize: 12,
                margin: 0,
                padding: 0
              }} verticalAlignment="middle" text={number || "0"} />
            </gridLayout>
          </stackLayout>
        }
        {!isEdit && !isModal &&
          <label col={0} textWrap style={{
            color: props.color ?? new Color('#fff'),
            fontSize: 14,
            margin: 0,
            padding: 0
          }} verticalAlignment="middle" text={position ?? (item.name ? item.name : item.user.name)} />
        }
        {!isEdit && !isModal &&
          <label col={2} textWrap style={{
            color: props.color ?? new Color('#fff'),
            fontSize: 14,
            margin: 0,
            padding: 0
          }} verticalAlignment="middle" text={number} />
        }
        {isEdit &&
          <stackLayout onTouch={onTouch} onTap={openPosition} col={0} style={{
            verticalAlignment: 'middle',
            padding: '0 10',
            borderRadius: 4,
            background: '#fff'
          }} >
            <label text={position || "Select Position"} />
          </stackLayout>
        }
        {isEdit &&
          <stackLayout onTouch={onTouch} onTap={openNumber} col={2} style={{
            verticalAlignment: 'middle',
            padding: '0 10',
            borderRadius: 4,
            background: '#fff'
          }}>
            <label text={number || "Select Jersey Number"} />
          </stackLayout>
        }
        {isModal && renderModalActions()}
        {!isModal && renderNormalActions()}
      </gridLayout>
    </Fragment>
  )
}

export const PlayerPickerModal = (props: any) => {
  const _usersList = AppSettings.getString('users', '[]');
  const usersList = JSON.parse(_usersList);
  const { selected = [], otherSelected = [] } = props;
  const [] = useState(!false);
  const [, setTime] = useState(Date.now())
  const [current, setCurrent] = useState(selected);
  const [otherCurrent, setOtherCurrent] = useState(otherSelected || []);

  const [users] = useState(usersList);

  const other_ids = otherCurrent.map((item_: { _id: any; }) => item_._id);
  return (
    <$ListView
      items={users.filter((item: { _id: any; }) => {
        return !other_ids.includes(item._id);// || !cu_ids.includes(item._id);
      })}
      onLoaded={() => {
        setTime(Date.now());
        setCurrent(props.getSelection());
        setOtherCurrent(props.getOtherSelection())
      }}
      separatorColor={new Color('white')}
      cellFactory={(item: any) => {
        const ref: React.RefObject<NSVElement<any>> = React.createRef<NSVElement<any>>()
        const _players = Methods.data.all_players || [];
        const __player = _players.filter((item_) => item_.user._id === item._id);
        const hasPlayer = __player[0] ? __player[0] : false
        const ids = selected.filter((item_: { isPlayer: any; }) => {
          return item_.isPlayer ? true : false
        }).map((item_: { _id: any; }) => item_._id);
        const others = otherCurrent.filter((item_: { isPlayer: any; }) => {
          return item_.isPlayer ? true : false
        }).map((item_: { _id: any; }) => item_._id);
        const new_ids = current.filter((item_: { isPlayer: any; }) => {
          return !item_.isPlayer ? true : false
        }).map((item_: { _id: any; }) => item_._id);
        if (ids.includes(item._id)) return null;
        if (others.includes(item._id)) return null;

        const playerObj = {
          _id: item._id,
          user: item,
          isPlayer: false,
          position: hasPlayer ? hasPlayer['position'] : '',
          number: hasPlayer ? hasPlayer['number'] : 0
        };

        return (
          <stackLayout onTap={() => {
            //setSquad(item);
          }} ref={ref} verticalAlignment={'middle'} orientation="horizontal" padding={"5 20"}>
            <PlayerPickedItem isModal={!props.isModal ? false : true} isHome={true} game={props.game} isActive={new_ids.includes(item._id) ? true : false} savePlayer={(player: any) => {
              props.onPlayerPicked(player)
              setTimeout(() => {
                setCurrent(props.getSelection());
                setOtherCurrent(props.getOtherSelection())
              }, 100)
            }} remove={(player: any) => {
              props.onPlayerPicked(player)
              setTimeout(() => {
                setCurrent(props.getSelection());
                setOtherCurrent(props.getOtherSelection())
              }, 100)
            }} player={playerObj} color={props.color} />
          </stackLayout>
        )
      }}
      row={1}
    />
  )
}

interface GMCNextProps {
  game: any
}

export class GMC_old extends Component<any, any>{
  private readonly pageRef: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();;
  constructor(props: any) {
    super(props);
    this.state = {
      newGame: {}
    }
  }

  goToGMCNext = () => {
    const { newGame } = this.state;
    goToPageReact(GMCNext, { game: newGame }, 'GMCNext');
    AppSettings.setString('newGame', JSON.stringify({
      ...newGame,
      page: 'GMC'
    }));
  }

  openSportPicker = (args: EventData) => {
    const mainView = args.object as View;
    const { newGame, isSportOpen } = this.state;
    if (isSportOpen) return;
    this.setState({ isSportOpen: true });
    const option: ShowModalOptions = {
      context: { items: gen(50), title: "Select Sport", size: 'mini', selected: newGame.sport },
      closeCallback: (sport: { image: string; }) => {
        if (sport) {
          newGame.sport = {
            ...sport,
            image: `https://supotsu.com/${sport.image.replace("_wht.svg", "_wht.png")}`
          };
          this.setState({ newGame })
        }
        this.setState({ isSportOpen: false });
      },
      fullscreen: true
    };
    mainView.showModal('~/modals/combo-no-image', option);
  }

  openRolePicker = (args: EventData) => {
    const mainView = args.object as View;
    const { newGame, isRoleOpen } = this.state;
    if (isRoleOpen) return;
    this.setState({ isRoleOpen: true });
    const option: ShowModalOptions = {
      context: { items: gen(50), title: "Select Role", size: 'mini', selected: newGame.role },
      closeCallback: (role: any) => {
        if (role) {
          newGame.role = role
          this.setState({ newGame })
        }
        this.setState({ isRoleOpen: false });
      },
      fullscreen: true
    };
    mainView.showModal('~/modals/combo-no-image', option);
  }

  goBack = () => {
    Frame.topmost().goBack();
  }

  render = () => {
    const { newGame } = this.state;
    return (
      <page actionBarHidden ref={this.pageRef}>
        <gridLayout rows={`auto,*`} columns={`*`}>
          <stackLayout col={0} row={0}>
            <gridLayout backgroundColor="#000" rows={`auto,40`} columns={getItemSpec(["10", "auto", "40", "*", "40", "6", "auto", "16"])}>
              <flexboxLayout justifyContent="center" onTap={this.goBack} alignItems="center" paddingTop={5} row={1} col={2}>
                <image className="Ionicons size10" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
              </flexboxLayout>
              <label textWrap margin="0 10 2 5" verticalAlignment="middle" style={{
                textAlignment: 'left',
                fontWeight: 'bold',
                fontSize: 18
              }} color={new Color("white")} row={1} col={3} textAlignment={'center'} text="1 / 4 - Match Details" />
              {newGame.sport && newGame.role &&
                <flexboxLayout onTouch={onTouch} onTap={this.goToGMCNext} justifyContent="center" alignItems="center" col={6} padding="0 0" row={1}>
                  <stackLayout className="gmc-next-btn red">
                    <label text="NEXT" />
                  </stackLayout>
                </flexboxLayout>
              }
            </gridLayout>
          </stackLayout>
          <flexboxLayout flexDirection="row" justifyContent="center" alignItems="flex-start" backgroundImage="~/images/gmc_bg.png" col={0} row={1}>
            <GMCDetailField active={newGame.sport ? true : false} imageSrc={newGame.sport ? newGame.sport.image : false} onPress={this.openSportPicker} label={newGame.sport ? newGame.sport.name : ''} btnText="Select Sport" />
            <GMCDetailDiv />
            <GMCDetailField active={newGame.role ? true : false} imageSrc={newGame.role ? user.image : false} onPress={this.openRolePicker} label={newGame.role || ''} btnText="Select GMC Role" />
          </flexboxLayout>
        </gridLayout>
      </page>
    )
  }
}

interface GMCNewGameData {
  sport?: ISupotsu.Sport;
  role?: string;
}

export const GMC = () => {
  const {} = useStyledContext();
  const navigation = useNavigation();
  const [newGame, setNewGame] = React.useState<GMCNewGameData>(() => {
    const savedGame = AppSettings.getString('new-game', '{}')
    return {
      ...JSON.parse(savedGame)
    }
  })

  React.useEffect(() => {
    setCurrentOrientation('landscape', () => {

    })
  }, []);

  return (
    <gridLayout rows={`auto,*`} columns={`*`}>
      <stackLayout col={0} row={0}>
        <gridLayout backgroundColor="#000" rows={`auto,40`} columns={getItemSpec(["10", "auto", "40", "*", "40", "6", "auto", "16"])}>
          <flexboxLayout justifyContent="center" onTap={navigation.goBack} alignItems="center" paddingTop={5} row={1} col={2}>
            <image className="Ionicons size10" tintColor={"#fff"} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
          </flexboxLayout>
          <label textWrap margin="0 10 2 5" verticalAlignment="middle" style={{
            textAlignment: 'left',
            fontWeight: 'bold',
            fontSize: 18
          }} color={"white"} row={1} col={3} textAlignment={'center'} text="1 / 5 - Match Details" />
          {newGame.sport && newGame.role ?
            <flexboxLayout onTouch={onTouch} onTap={() => {
              AppSettings.setString('new-game', JSON.stringify(newGame));
              navigation.navigate(GMCNext.routeName, {
                newGame
              })
            }} justifyContent="center" alignItems="center" col={6} padding="0 0" row={1}>
              <stackLayout className="gmc-next-btn red">
                <label text="NEXT" />
              </stackLayout>
            </flexboxLayout> : null
          }
        </gridLayout>
      </stackLayout>
      <flexboxLayout flexDirection="row" justifyContent="center" alignItems="flex-start" backgroundImage="~/images/gmc_bg.png" col={0} row={1}>
        <ComboSelector
          renderTrigger={(ref, onOpenModal) => {
            return (
              <GMCDetailField active={newGame.sport ? true : false} imageSrc={newGame.sport ? newGame.sport.image : ""} onPress={onOpenModal} label={newGame.sport ? newGame.sport.name : ''} btnText="Select Sport" />
            )
          }}
          items={JSON.parse(_sports)}
          size={ComboModalHeaderSize.mini}
          title="Select sport"
          complex
          selected={newGame.sport}
          onDone={(sport) => {
            setNewGame({
              ...newGame,
              sport
            })
          }}
        />
        <GMCDetailDiv />
        <ComboSelector
          renderTrigger={(ref, onOpenModal) => {
            return (
              <GMCDetailField active={newGame.role ? true : false} imageSrc={newGame.role ? user.image : ""} onPress={onOpenModal} label={newGame.role || ''} btnText="Select GMC Role" />
            )
          }}
          items={["Admin", "Captain", "Coach"]}
          size={ComboModalHeaderSize.mini}
          title="Select role"
          selected={newGame.role}
          onDone={(role) => {
            setNewGame({
              ...newGame,
              role
            })
          }}
        />
      </flexboxLayout>
    </gridLayout>
  )
}

GMC.routeName = 'gmc'

export class GMCNext_old extends Component<GMCNextProps & any, any>{
  private readonly pageRef: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();;
  constructor(props: GMCNextProps & any) {
    super(props);
    this.state = {
      newGame: props.game
    }
  }
  componentDidMount() {
    //this.getData();
    const frame: Frame = Frame.topmost();
    frame.navigate({
      create: () => {
        const page: Page = this.pageRef.current!.nativeView;
        return page;
      }
    });
  };

  goBack = () => {
    Frame.topmost().goBack();
  }

  openHalfTimePicker = (args: EventData) => {
    const { newGame, isHalfTimeOpen } = this.state;
    if (isHalfTimeOpen) return;
    this.setState({ isHalfTimeOpen: true });

    const opts: ComboModalProps = {
      items: gen(50),
      title: "Set Half Time",
      selected: newGame.half,
      size: ComboModalHeaderSize.mini,
      onDone: (half?: number) => {
        if (half) {
          newGame.half = half;
          this.setState({ newGame })
        }
        this.setState({ isHalfTimeOpen: false });
      }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
  }

  openDatePicker = (args: EventData) => {
    const { newGame, isHalfTimeOpen } = this.state;
    if (isHalfTimeOpen) return;
    this.setState({ isHalfTimeOpen: true });

    const opts: DateModalProps = {
      title: "Set Date & Time",
      orientation: "landscape",
      size: ComboModalHeaderSize.mini,
      onChange: (date: Date) => {
        if (date) {
          newGame.date = date;
          this.setState({ newGame })
        }
      },
      onDone: (date: Date) => {
        if (date) {
          newGame.date = date;
          this.setState({ newGame })
        }
        this.setState({ isHalfTimeOpen: false });
      }
    }

    goToPageReact(DateModal, opts, 'ComboModal')
  }

  openAdminPicker = (args: EventData) => {
    const { newGame, isAdminPicker } = this.state;
    if (isAdminPicker) return;
    this.setState({ isAdminPicker: true })

    const opts: ComboModalProps = {
      items: users,
      withImage: true,
      complex: true,
      selected: newGame.admin,
      title: "Select Admin",
      size: ComboModalHeaderSize.mini,
      onDone: (admin?: any) => {
        if (admin) {
          newGame.admin = admin;
          this.setState({ newGame })
        }

        this.setState({ isAdminPicker: false });
      }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
  }

  openLocation = () => {
    const { newGame, isAdminPicker } = this.state;
    if (isAdminPicker) return;
    this.setState({ isAdminPicker: true })
    const test: LocationModalProps = {
      size: ComboModalHeaderSize.mini,
      //ground: true,
      title: "Set Location",
      value: newGame.location,
      onDone: (place) => {
        if (place) {
          newGame.location = place;
          this.setState({ newGame })
        }

        this.setState({ isAdminPicker: false });
      }
    }

    goToPageReact(LocationModal, test, 'LocationModal')
  }

  goToGMCNext = () => {
    const { newGame } = this.state;
    goToPageReact(GMCRefs, { game: newGame }, 'GMCRefs');
    AppSettings.setString('newGame', JSON.stringify({
      ...newGame,
      page: 'GMCNext'
    }));
  }

  render = () => {
    const { newGame } = this.state;
    //@ts-ignore
    const date = newGame.date ? `${moment(newGame.date).format('DD MMM YY')} @ ${moment(newGame.date).format('HH:MM')}` : null
    return (
      <page actionBarHidden ref={this.pageRef}>
        <gridLayout rows={`auto,*`} columns={`*`}>
          <stackLayout col={0} row={0}>
            <gridLayout backgroundColor="#000" rows={`auto,40`} columns={getItemSpec(["10", "auto", "40", "*", "40", "6", "auto", "16"])}>
              <flexboxLayout justifyContent="center" onTap={this.goBack} alignItems="center" paddingTop={5} row={1} col={2}>
                <image className="Ionicons size10" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
              </flexboxLayout>
              <label textWrap margin="0 10 2 5" verticalAlignment="middle" style={{
                textAlignment: 'left',
                fontWeight: 'bold',
                fontSize: 18
              }} color={new Color("white")} row={1} col={3} textAlignment={'center'} text="1 / 4 - Match Details" />
              <flexboxLayout onTouch={onTouch} onTap={this.goToGMCNext} justifyContent="center" alignItems="center" col={6} padding="0 0" row={1}>
                <stackLayout className="gmc-next-btn red">
                  <label text="NEXT" />
                </stackLayout>
              </flexboxLayout>
            </gridLayout>
          </stackLayout>
          <flexboxLayout flexDirection="row" justifyContent="center" alignItems="center" backgroundImage="~/images/gmc_bg.png" col={0} row={1}>
            <GMCDetailField icon active={newGame.date ? true : false} onPress={this.openDatePicker} label={newGame.date ? date : null} imageSrc={newGame.date ? `font://${IconSet.MaterialIcons.event}` : ''} imgClass={"MaterialIcons"} btnText="Set Date and Time" />
            <GMCDetailDiv />
            <GMCDetailField icon active={newGame.half ? true : false} onPress={this.openHalfTimePicker} imageSrc={newGame.half ? `font://${IconSet.MaterialCommunityIcons["clock-fast"]}` : ''} imgClass={"MaterialCommunityIcons"} label={newGame.half} btnText="Set half time" />
            <GMCDetailDiv />
            <GMCDetailField active={newGame.admin ? true : false} onPress={this.openAdminPicker} imageSrc={newGame.admin ? newGame.admin.image : ''} label={newGame.admin ? newGame.admin.name : false} btnText="Set Game Admin" />
            <GMCDetailDiv />
            <GMCDetailField icon active={newGame.location ? true : false} onPress={this.openLocation} label={newGame.location ? newGame.location.name : false} imageSrc={newGame.location ? `font://${IconSet.MaterialIcons["location-on"]}` : ''} imgClass={"MaterialIcons"} btnText="Set Location" />
          </flexboxLayout>
        </gridLayout>
      </page>
    )
  }
}

interface GMCNextNewGameData extends GMCNewGameData {
  location?: any;
  half?: string;
  date?: Date;
  admin?: ISupotsu.User;
}

export const GMCNext = () => {
  const {} = useStyledContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { newGame: prevData } = route.params as { newGame: GMCNewGameData}
  const [newGame, setNewGame] = React.useState<GMCNextNewGameData>(() => {
    return {
      ...prevData
    }
  });

  React.useEffect(() => {
    setCurrentOrientation('landscape', () => {

    })
  }, []);

  // @ts-ignore
  const date = newGame.date ? `${moment(newGame.date).format('DD MMM YY')} @ ${moment(newGame.date).format('HH:MM')}` : null;

  return (
    <gridLayout rows={`auto,*`} columns={`*`}>
      <stackLayout col={0} row={0}>
        <gridLayout backgroundColor="#000" rows={`auto,40`} columns={getItemSpec(["10", "auto", "40", "*", "40", "6", "auto", "16"])}>
          <flexboxLayout justifyContent="center" onTap={navigation.goBack} alignItems="center" paddingTop={5} row={1} col={2}>
            <image className="Ionicons size10" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
          </flexboxLayout>
          <label textWrap margin="0 10 2 5" verticalAlignment="middle" style={{
            textAlignment: 'left',
            fontWeight: 'bold',
            fontSize: 18
          }} color={new Color("white")} row={1} col={3} textAlignment={'center'} text="2 / 5 - Match Details" />
          <flexboxLayout onTouch={onTouch} onTap={() => {
            AppSettings.setString('new-game', JSON.stringify(newGame));
            navigation.navigate(GMCRefs.routeName, {
              newGame
            })
          }} justifyContent="center" alignItems="center" col={6} padding="0 0" row={1}>
            <stackLayout className="gmc-next-btn red">
              <label text="NEXT" />
            </stackLayout>
          </flexboxLayout>
        </gridLayout>
      </stackLayout>
      <flexboxLayout flexDirection="row" justifyContent="center" alignItems="center" backgroundImage="~/images/gmc_bg.png" col={0} row={1}>
        <DateSelector
          orientation='landscape'
          size={ComboModalHeaderSize.mini}
          title="Pick a date"
          renderTrigger={(ref, open) => <GMCDetailField icon active={newGame.date ? true : false} onPress={open} label={newGame.date ? date : null} imageSrc={newGame.date ? `font://${IconSet.MaterialIcons.event}` : ''} imgClass={"MaterialIcons"} btnText="Set Date and Time" />}
          onDone={(date) => {
            setNewGame({
              ...newGame,
              date
            })
          }}
          onChange={(date) => {
            setNewGame({
              ...newGame,
              date
            })
          }}
        />
        <GMCDetailDiv />
        <GMCDetailDiv />
        <ComboSelector
          title="Select Admin"
          size={ComboModalHeaderSize.mini}
          items={gen(50)}
          selected={newGame.half}
          onDone={(half) => {
            setNewGame({
              ...newGame,
              half
            })
          }}
          renderTrigger={(ref, open) => <GMCDetailField icon active={newGame.half ? true : false} onPress={open} imageSrc={newGame.half ? `font://${IconSet.MaterialCommunityIcons["clock-fast"]}` : ''} imgClass={"MaterialCommunityIcons"} label={newGame.half || ""} btnText="Set half time" />}
        />
        <GMCDetailDiv />
        <ComboSelector
          title="Select Admin"
          size={ComboModalHeaderSize.mini}
          items={users}
          selected={newGame.admin}
          withImage
          complex
          onDone={(admin) => {
            setNewGame({
              ...newGame,
              admin
            })
          }}
          renderTrigger={(ref, open) => <GMCDetailField active={newGame.admin ? true : false} onPress={open} imageSrc={newGame.admin ? newGame.admin.image : ''} label={newGame.admin ? newGame.admin.name : ""} btnText="Set Game Admin" />}
        />
        <GMCDetailDiv />
        <LocationSelector
          renderTrigger={(ref, open) => <GMCDetailField icon active={newGame.location ? true : false} onPress={open} label={newGame.location ? newGame.location.name : ""} imageSrc={newGame.location ? `font://${IconSet.MaterialIcons["location-on"]}` : ''} imgClass={"MaterialIcons"} btnText="Set Location" />}
          size={ComboModalHeaderSize.mini}
          //ground: true,
          title="Set Location"
          value={newGame.location}
          onDone={(location) => {
            if (location) {
              setNewGame({
                ...newGame,
                location
              })
            }
          }}
        />
      </flexboxLayout>
    </gridLayout>
  )
}

GMCNext.routeName = "gmcNext"

export const gen = (num = 50) => {
  const _new = new Array(num).fill(null).map((item, i) => i + 1);
  return _new;
}

const GMCDetailDiv = () => <label text="" width={10} height={10} />

export const GMCDetailField = (props: { active?: boolean; icon?: boolean; team?: boolean; imageSrc?: string; backgroundColor?: string; label?: string; size?: number; btnText?: string; imgClass?: string; onPress?(args?: EventData): void }) => {
  const { active = false, imageSrc, btnText = "Select", label: labelFor = "", onPress } = props;
  const size = props.size ? props.size : 80;
  const imgBorder = size / 2;
  const holderSize = size + imgBorder;
  const holderBorder = holderSize / 2;
  const backgroundColor = props.backgroundColor ? props.backgroundColor : "rgba(0,0,0,0.5)";
  const finSize = props.team ? size + size / 4 : size;
  const finBorder = finSize / 2;
  return (
    <flexboxLayout width={200} flexDirection="column" justifyContent="center" alignItems="center" className="gmc-detail-picker">
      <flexboxLayout width={holderSize} justifyContent="center" alignItems="center" backgroundColor={backgroundColor} borderRadius={holderBorder} height={holderSize}>
        {!active ?
          <flexboxLayout onTouch={onTouch} onTap={onPress} justifyContent="center" alignItems="center" width={finSize} height={finSize} borderRadius={finBorder} background="#fff">
            <image className="Ionicons size16" tintColor={new Color("#000")} src={`font://${IconSet.Ionicons["md-add"]}`} stretch="none" />
          </flexboxLayout> : null
        }
        {active ?
          <flexboxLayout onTouch={onTouch} onTap={onPress} justifyContent="center" alignItems="center" width={finSize} height={finSize} borderRadius={finBorder} background="#fff">
            <image className={`${props.imgClass} size16`} stretch={props.icon ? "none" : "fill"} {...props.icon ? {
              tintColor: new Color("#000")
            } : {
                height: finSize,
                width: finSize,
                borderRadius: finBorder
              }} src={imageSrc} />
          </flexboxLayout> : null
        }
      </flexboxLayout>
      <stackLayout margin="10">
        <label visibility={labelFor === "" ? "collapse" : "visible"} fontSize={14} color={new Color("#fff")} textAlignment="center" margin="0 0 8" text={labelFor || ""} />
        <stackLayout onTouch={onTouch} onTap={onPress} className="save-button light round">
          <label text={btnText} />
        </stackLayout>
      </stackLayout>
    </flexboxLayout>
  )
}

export class GMCRefs_old extends Component<GMCNextProps & any, any>{
  private readonly pageRef: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();
  constructor(props: GMCNextProps & any) {
    super(props);
    this.state = {
      newGame: props.game
    }
  }
  componentDidMount() {
    const frame: Frame = Frame.topmost();
    //this.getData();
    frame.navigate({
      create: () => {
        const page: Page = this.pageRef.current!.nativeView.nativeView;
        return page;
      }
    });
  }

  goBack = () => {
    Frame.topmost().goBack();
  }

  openAdminPicker = (args: EventData) => {
    const { newGame, isAdminPicker } = this.state;
    if (isAdminPicker) return;
    this.setState({ isAdminPicker: true })
    const ids = [];
    if (newGame.ref1) {
      ids.push(newGame.ref1._id)
    }

    if (newGame.ref2) {
      ids.push(newGame.ref2._id)
    }

    const opts: ComboModalProps = {
      items: users.filter((item: { _id: any; }) => !ids.includes(item._id)).map((item: any) => {
        return {
          ...item
        }
      }),
      withImage: true,
      selected: newGame.ref,
      complex: true,
      title: "Select Ref",
      size: ComboModalHeaderSize.mini,
      onDone: (admin?: any) => {
        if (admin) {
          newGame.ref = admin;
          this.setState({ newGame })
        }

        this.setState({ isAdminPicker: false });
      }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
  }

  openAdmin1Picker = (args: EventData) => {
    const { newGame, isAdminPicker } = this.state;
    if (isAdminPicker) return;
    this.setState({ isAdminPicker: true })
    const ids = [];

    if (newGame.ref) {
      ids.push(newGame.ref._id)
    }
    if (newGame.ref2) {
      ids.push(newGame.ref2._id)
    }

    const opts: ComboModalProps = {
      items: users.filter((item: { _id: any; }) => !ids.includes(item._id)).map((item: any) => {
        return {
          ...item
        }
      }),
      withImage: true,
      selected: newGame.ref1,
      complex: true,
      title: "Select Ass.1",
      size: ComboModalHeaderSize.mini,
      onDone: (admin?: any) => {
        if (admin) {
          newGame.ref1 = admin;
          this.setState({ newGame })
        }

        this.setState({ isAdminPicker: false });
      }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
  }

  openAdmin2Picker = () => {
    const { newGame, isAdminPicker } = this.state;
    if (isAdminPicker) return;
    this.setState({ isAdminPicker: true })
    const ids = [];
    if (newGame.ref1) {
      ids.push(newGame.ref1._id)
    }
    if (newGame.ref) {
      ids.push(newGame.ref._id)
    }

    const opts: ComboModalProps = {
      items: users.filter((item: { _id: any; }) => !ids.includes(item._id)).map((item: any) => {
        return {
          ...item
        }
      }),
      withImage: true,
      selected: newGame.ref2,
      complex: true,
      title: "Select Ass.2",
      size: ComboModalHeaderSize.mini,
      onDone: (admin?: any) => {
        if (admin) {
          newGame.ref2 = admin;
          this.setState({ newGame })
        }

        this.setState({ isAdminPicker: false });
      }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
  }

  goToGMCNext = () => {
    const { newGame } = this.state;
    goToPageReact(GMCTeams, { game: newGame }, 'GMCTeams');

    AppSettings.setString('newGame', JSON.stringify({
      ...newGame,
      page: 'GMCRefs'
    }));
  }

  render = () => {
    const { newGame } = this.state;
    return (
      <page actionBarHidden ref={this.pageRef}>
        <gridLayout rows={`auto,*`} columns={`*`}>
          <stackLayout col={0} row={0}>
            <gridLayout backgroundColor="#000" rows={`auto,40`} columns={getItemSpec(["10", "auto", "40", "*", "40", "6", "auto", "16"])}>
              <flexboxLayout justifyContent="center" onTap={this.goBack} alignItems="center" paddingTop={5} row={1} col={2}>
                <image className="Ionicons size10" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
              </flexboxLayout>
              <label textWrap margin="0 10 2 5" verticalAlignment="middle" style={{
                textAlignment: 'left',
                fontWeight: 'bold',
                fontSize: 18
              }} color={new Color("white")} row={1} col={3} textAlignment={'center'} text="2 / 4 - Match Referees" />
              <flexboxLayout onTouch={onTouch} onTap={this.goToGMCNext} justifyContent="center" alignItems="center" col={6} padding="0 0" row={1}>
                <stackLayout className="gmc-next-btn red">
                  <label text="NEXT" />
                </stackLayout>
              </flexboxLayout>
            </gridLayout>
          </stackLayout>
          <flexboxLayout flexDirection="row" justifyContent="center" alignItems="center" backgroundImage="~/images/gmc_bg.png" col={0} row={1}>
            <GMCDetailField active={newGame.ref ? true : false} onPress={this.openAdminPicker} imageSrc={newGame.ref ? newGame.ref.image : ''} label={newGame.ref ? newGame.ref.name : false} btnText="Set Game Ref" />
            <GMCDetailDiv />
            <GMCDetailField active={newGame.ref1 ? true : false} onPress={this.openAdmin1Picker} imageSrc={newGame.ref1 ? newGame.ref1.image : ''} label={newGame.ref1 ? newGame.ref1.name : false} btnText="Set Game Ass. 1" />
            <GMCDetailDiv />
            <GMCDetailField active={newGame.ref2 ? true : false} onPress={this.openAdmin2Picker} imageSrc={newGame.ref2 ? newGame.ref2.image : ''} label={newGame.ref2 ? newGame.ref2.name : false} btnText="Set Game Ass. 2" />
          </flexboxLayout>
        </gridLayout>
      </page>
    )
  }
}

interface GMCRefsNewGameData extends GMCNextNewGameData {
  ref?: ISupotsu.User;
  ref1?: ISupotsu.User;
  ref2?: ISupotsu.User;
}

export const GMCRefs = () => {
  const {} = useStyledContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { newGame: prevData } = route.params as { newGame: GMCNextNewGameData}
  const [newGame, setNewGame] = React.useState<GMCRefsNewGameData>(() => {
    return {
      ...prevData
    }
  });

  React.useEffect(() => {
    setCurrentOrientation('landscape', () => {

    })
  }, []);

  const ids = React.useMemo(() => {
    const ids = [];
    if (newGame.ref) {
      ids.push(newGame.ref._id)
    }

    if (newGame.ref1) {
      ids.push(newGame.ref1._id)
    }

    if (newGame.ref2) {
      ids.push(newGame.ref2._id)
    }

    return ids;
  }, [newGame]);

  return (
    <gridLayout rows={`auto,*`} columns={`*`}>
      <stackLayout col={0} row={0}>
        <gridLayout backgroundColor="#000" rows={`auto,40`} columns={getItemSpec(["10", "auto", "40", "*", "40", "6", "auto", "16"])}>
          <flexboxLayout justifyContent="center" onTap={navigation.goBack} alignItems="center" paddingTop={5} row={1} col={2}>
            <image className="Ionicons size10" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
          </flexboxLayout>
          <label textWrap margin="0 10 2 5" verticalAlignment="middle" style={{
            textAlignment: 'left',
            fontWeight: 'bold',
            fontSize: 18
          }} color={new Color("white")} row={1} col={3} textAlignment={'center'} text="3 / 5 - Match Referees" />
          <flexboxLayout onTouch={onTouch} onTap={() => {
            AppSettings.setString('new-game', JSON.stringify(newGame));
            navigation.navigate(GMCTeamsRefactor.routeName, {
              newGame
            })
          }} justifyContent="center" alignItems="center" col={6} padding="0 0" row={1}>
            <stackLayout className="gmc-next-btn red">
              <label text="NEXT" />
            </stackLayout>
          </flexboxLayout>
        </gridLayout>
      </stackLayout>
      <flexboxLayout flexDirection="row" justifyContent="center" alignItems="center" backgroundImage="~/images/gmc_bg.png" col={0} row={1}>
        <ComboSelector
          renderTrigger={(ref, open) => <GMCDetailField active={newGame.ref ? true : false} onPress={open} imageSrc={newGame.ref ? newGame.ref.image : ''} label={newGame.ref ? newGame.ref.name : ""} btnText="Set Game Ref" />}
          items={users.filter((item: { _id: any; }) => !ids.includes(item._id)).map((item: any) => {
            return {
              ...item
            }
          })}
          withImage
          selected={newGame.ref}
          complex
          title={"Select Ref"}
          size={ComboModalHeaderSize.mini}
          onDone={(ref?: any) => {
            if (ref) {
              setNewGame({
                ...newGame,
                ref
              })
            }
          }}
        />
        <GMCDetailDiv />
        <ComboSelector
          renderTrigger={(ref, open) => <GMCDetailField active={newGame.ref1 ? true : false} onPress={open} imageSrc={newGame.ref1 ? newGame.ref1.image : ''} label={newGame.ref1 ? newGame.ref1.name : ""} btnText="Set Game Ass. 1" />}
          items={users.filter((item: { _id: any; }) => !ids.includes(item._id)).map((item: any) => {
            return {
              ...item
            }
          })}
          withImage
          selected={newGame.ref1}
          complex
          title={"Set Game Ass. 1"}
          size={ComboModalHeaderSize.mini}
          onDone={(ref1?: any) => {
            if (ref1) {
              setNewGame({
                ...newGame,
                ref1
              })
            }
          }}
        />
        <GMCDetailDiv />
        <ComboSelector
          renderTrigger={(ref, open) => <GMCDetailField active={newGame.ref2 ? true : false} onPress={open} imageSrc={newGame.ref2 ? newGame.ref2.image : ''} label={newGame.ref2 ? newGame.ref2.name : ""} btnText="Set Game Ass. 2" />}
          items={users.filter((item: { _id: any; }) => !ids.includes(item._id)).map((item: any) => {
            return {
              ...item
            }
          })}
          withImage
          selected={newGame.ref2}
          complex
          title={"Set Game Ass. 2"}
          size={ComboModalHeaderSize.mini}
          onDone={(ref2?: any) => {
            if (ref2) {
              setNewGame({
                ...newGame,
                ref2
              })
            }
          }}
        />
      </flexboxLayout>
    </gridLayout>
  );
}

GMCRefs.routeName = "gmcRefs";

export class GMCTeams extends Component<GMCNextProps & any, any>{
  private readonly pageRef: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();;
  constructor(props: GMCNextProps & any) {
    super(props);
    this.state = {
      newGame: props.game
    }
  }
  componentDidMount() {
    const frame: Frame = Frame.topmost();
    //this.getData();
    frame.navigate({
      create: () => {
        const page: Page = this.pageRef.current!.nativeView;
        return page;
      }
    });
  }

  goBack = () => {
    Frame.topmost().goBack();
  }

  openTeam2Picker = (args: EventData) => {
    const { newGame, isAdminPicker } = this.state;
    if (isAdminPicker) return;
    this.setState({ isAdminPicker: true })
    const ids = [];
    if (newGame.teamOne) {
      ids.push(newGame.teamOne._id)
    }

    const opts: ComboModalProps = {
      items: teams.filter((item: { _id: any; }) => !ids.includes(item._id)).map((item: any) => {
        return {
          ...item,
          selected: newGame.teamTwo
        }
      }),
      withImage: true,
      selected: newGame.teamTwo,
      complex: true,
      title: "Choose 2nd Team",
      size: ComboModalHeaderSize.mini,
      onDone: (team?: any) => {
        if (team) {
          newGame.teamTwo = team;
          if (newGame.homeTeam) {
            delete newGame.homeTeam;
          }
          this.setState({ newGame })
        }

        this.setState({ isAdminPicker: false });
      }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
  }

  openTeam1Picker = (args: EventData) => {
    const { newGame, isAdminPicker } = this.state;
    if (isAdminPicker) return;
    this.setState({ isAdminPicker: true })
    const ids = [];
    if (newGame.teamTwo) {
      ids.push(newGame.teamTwo._id)
    }

    const opts: ComboModalProps = {
      items: teams.filter((item: { _id: any; }) => !ids.includes(item._id)).map((item: any) => {
        return {
          ...item,
          selected: newGame.teamOne
        }
      }),
      withImage: true,
      selected: newGame.teamTwo,
      complex: true,
      title: "Choose 1st Team",
      size: ComboModalHeaderSize.mini,
      onDone: (team?: any) => {
        if (team) {
          newGame.teamOne = team;
          if (newGame.homeTeam) {
            delete newGame.homeTeam;
          }
          this.setState({ newGame })
        }

        this.setState({ isAdminPicker: false });
      }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
  }

  goToGMCNext = () => {
    const { newGame } = this.state;
    goToPageReact(GMCPlayers, { game: newGame }, 'GMCPlayers');

    AppSettings.setString('newGame', JSON.stringify({
      ...newGame,
      page: 'GMCTeams'
    }));
  }

  render = () => {
    const { newGame } = this.state;
    const isHomeSelector = (newGame.teamOne && newGame.teamTwo && !newGame.homeTeam) ? true : false;
    return (
      <page actionBarHidden ref={this.pageRef}>
        <gridLayout backgroundImage="~/images/gmc_bg.png" rows={`auto,auto,*`} columns={`*`}>
          <stackLayout col={0} row={0}>
            <gridLayout backgroundColor="#000" rows={`auto,40`} columns={getItemSpec(["10", "auto", "40", "*", "40", "6", "auto", "16"])}>
              <flexboxLayout justifyContent="center" onTap={this.goBack} alignItems="center" paddingTop={5} row={1} col={2}>
                <image className="Ionicons size10" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
              </flexboxLayout>
              <label textWrap margin="0 10 2 5" verticalAlignment="middle" style={{
                textAlignment: 'left',
                fontWeight: 'bold',
                fontSize: 18
              }} color={new Color("white")} row={1} col={3} textAlignment={'center'} text="3 / 4 - Match Teams" />
              {(newGame.teamOne && newGame.teamTwo && newGame.homeTeam) &&
                <flexboxLayout onTouch={onTouch} onTap={this.goToGMCNext} justifyContent="center" alignItems="center" col={6} padding="0 0" row={1}>
                  <stackLayout className="gmc-next-btn red">
                    <label text="NEXT" />
                  </stackLayout>
                </flexboxLayout>
              }
            </gridLayout>
          </stackLayout>
          {(newGame.teamOne && newGame.teamTwo && !newGame.homeTeam) &&
            <stackLayout row={1} style={{
              color: new Color('#fff'),
              verticalAlignment: 'middle',
              margin: 10
            }}>
              <label textAlignment={'center'} text={'Please select the team that you are part of, by clicking the team logo below.'} />
            </stackLayout>
          }
          <flexboxLayout flexDirection="row" justifyContent="center" alignItems="center" col={0} row={2}>
            <GMCDetailField team backgroundColor={newGame.teamOne && newGame.homeTeam && (newGame.teamOne._id === newGame.homeTeam._id) ? Theme2['500'] : null} active={newGame.teamOne ? true : false} size={80} onPress={isHomeSelector ? () => {
              newGame.homeTeam = newGame.teamOne;
              this.setState({ newGame })
            } : this.openTeam1Picker} imageSrc={newGame.teamOne ? newGame.teamOne.image : ''} label={newGame.teamOne ? newGame.teamOne.name : false} btnText={newGame.teamOne ? "Change Team" : "Choose Team"} />
            <GMCDetailDiv />
            <flexboxLayout justifyContent="center" alignItems="center" style={{
              padding: "0 15"
            }}>
              <label style={{
                fontWeight: '200',
                fontSize: 35,
                color: new Color('white')
              }} text={'VS'} />
            </flexboxLayout>
            <GMCDetailDiv />
            <GMCDetailField team backgroundColor={newGame.teamTwo && newGame.homeTeam && (newGame.teamTwo._id === newGame.homeTeam._id) ? Theme2['500'] : null} active={newGame.teamTwo ? true : false} size={80} onPress={isHomeSelector ? () => {
              newGame.homeTeam = newGame.teamTwo;
              this.setState({ newGame })
            } : this.openTeam2Picker} imageSrc={newGame.teamTwo ? newGame.teamTwo.image : ''} label={newGame.teamTwo ? newGame.teamTwo.name : false} btnText={newGame.teamTwo ? "Change Team" : "Choose Team"} />
          </flexboxLayout>
        </gridLayout>
      </page>
    )
  }
}

interface GMCTeamsNewGameData extends GMCRefsNewGameData{
  teamOne?: ISupotsu.Team;
  teamTwo?: ISupotsu.Team;
  homeTeam?: ISupotsu.Team;
}

export const GMCTeamsRefactor = () => {
  const {} = useStyledContext();
  const { game } = useGameContext()
  const navigation = useNavigation();
  const route = useRoute();
  const { newGame: prevData } = route.params as { newGame: GMCRefsNewGameData}
  const [newGame, setNewGame] = React.useState<GMCTeamsNewGameData>(() => {
    return {
      ...prevData
    }
  });

  React.useEffect(() => {
    setCurrentOrientation('landscape', () => {

    })
  }, []);

  const ids = React.useMemo(() => {
    const ids = [];
    if (newGame.teamOne) {
      ids.push(newGame.teamOne._id)
    }

    if (newGame.teamTwo) {
      ids.push(newGame.teamTwo._id)
    }

    return ids;
  }, [newGame])

  React.useEffect(() => {
    if (game && game.homeTeam && !newGame.homeTeam) {
      setNewGame({
        ...newGame,
        homeTeam: game?.homeTeam
      })
    }
  }, [game])

  console.log(game?.homeTeam)

  const isHomeSelector = (newGame.teamOne && newGame.teamTwo && !newGame.homeTeam) ? true : false;

  return (
    <gridLayout backgroundImage="~/images/gmc_bg.png" rows={`auto,auto,*`} columns={`*`}>
      <stackLayout col={0} row={0}>
        <gridLayout backgroundColor="#000" rows={`auto,40`} columns={getItemSpec(["10", "auto", "40", "*", "40", "6", "auto", "16"])}>
          <flexboxLayout justifyContent="center" onTap={navigation.goBack} alignItems="center" paddingTop={5} row={1} col={2}>
            <image className="Ionicons size10" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
          </flexboxLayout>
          <label textWrap margin="0 10 2 5" verticalAlignment="middle" style={{
            textAlignment: 'left',
            fontWeight: 'bold',
            fontSize: 18
          }} color={new Color("white")} row={1} col={3} textAlignment={'center'} text="4 / 5 - Match Teams" />
          {(newGame.teamOne && newGame.teamTwo && newGame.homeTeam) &&
            <flexboxLayout onTouch={onTouch} onTap={() => {
              AppSettings.setString('new-game', JSON.stringify(newGame));
              navigation.navigate(GMCPlayersRefactor.routeName, {
                newGame
              })
             }} justifyContent="center" alignItems="center" col={6} padding="0 0" row={1}>
              <stackLayout className="gmc-next-btn red">
                <label text="NEXT" />
              </stackLayout>
            </flexboxLayout>
          }
        </gridLayout>
      </stackLayout>
      {(newGame.teamOne && newGame.teamTwo && !newGame.homeTeam) &&
        <stackLayout row={1} style={{
          color: new Color('#fff'),
          verticalAlignment: 'middle',
          margin: 10
        }}>
          <label textAlignment={'center'} text={'Please select the team that you are part of, by clicking the team logo below.'} />
        </stackLayout>
      }
      <flexboxLayout flexDirection="row" justifyContent="center" alignItems="center" col={0} row={2}>
        <ComboSelector
          renderTrigger={(ref, open) => {
            return (
              <GMCDetailField team backgroundColor={newGame.teamOne && newGame.homeTeam && (newGame.teamOne._id === newGame.homeTeam._id) ? Theme2['500'] : null} active={newGame.teamOne ? true : false} size={80} onPress={isHomeSelector ? () => {
                newGame.homeTeam = newGame.teamOne;
                setNewGame({
                  ...newGame,
                  homeTeam: newGame.teamOne
                })
              } : open} imageSrc={newGame.teamOne ? newGame.teamOne.image : ''} label={newGame.teamOne ? newGame.teamOne.name : ""} btnText={newGame.teamOne ? "Change Team" : "Choose Team"} />
            )
          }}
          items={teams.filter((item: { _id: any; }) => !ids.includes(item._id)).map((item: any) => {
            return {
              ...item,
              selected: newGame.teamOne
            }
          })}
          withImage
          selected={newGame.teamOne}
          complex
          title={"Choose 1st Team"}
          size={ComboModalHeaderSize.mini}
          onDone={(team?: any) => {
            if (team) {
              if (newGame.homeTeam) {
                delete newGame.homeTeam;
              }
              setNewGame({
                ...newGame,
                teamOne: team
              })
            }
          }}
        />
        <GMCDetailDiv />
        <flexboxLayout justifyContent="center" alignItems="center" style={{
          padding: "0 15"
        }}>
          <label style={{
            fontWeight: '200',
            fontSize: 35,
            color: new Color('white')
          }} text={'VS'} />
        </flexboxLayout>
        <GMCDetailDiv />
        <ComboSelector
          renderTrigger={(ref, open) => {
            return (
              <GMCDetailField team backgroundColor={newGame.teamTwo && newGame.homeTeam && (newGame.teamTwo._id === newGame.homeTeam._id) ? Theme2['500'] : null} active={newGame.teamTwo ? true : false} size={80} onPress={isHomeSelector ? () => {
                setNewGame({
                  ...newGame,
                  homeTeam: newGame.teamTwo
                })
              } : open} imageSrc={newGame.teamTwo ? newGame.teamTwo.image : ''} label={newGame.teamTwo ? newGame.teamTwo.name : ""} btnText={newGame.teamTwo ? "Change Team" : "Choose Team"} />
            )
          }}
          items={teams.filter((item: { _id: any; }) => !ids.includes(item._id)).map((item: any) => {
            return {
              ...item,
              selected: newGame.teamTwo
            }
          })}
          withImage
          selected={newGame.teamTwo}
          complex
          title={"Choose 2nd Team"}
          size={ComboModalHeaderSize.mini}
          onDone={(team?: any) => {
            if (team) {
              if (newGame.homeTeam) {
                delete newGame.homeTeam;
              }
              setNewGame({
                ...newGame,
                teamTwo: team
              })
            }
          }}
        />
      </flexboxLayout>
    </gridLayout>
  )
}

GMCTeamsRefactor.routeName = "gmcTeams"

interface GMCPlayersProps {
  setGameSquad?(data: any): void
}

export class GMCPlayers extends Component<GMCNextProps & GMCPlayersProps, any>{
  private readonly pageRef: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();;
  constructor(props: GMCNextProps & GMCPlayersProps) {
    super(props);
    this.state = {
      newGame: props.game,
      //data: Methods.data,
      squadOne: this.props.game.squadOne ? this.props.game.squadOne : null,
      squadTwo: this.props.game.squadTwo ? this.props.game.squadTwo : null,
      playersOne: [],
      playersTwo: [],
      subsOne: [],
      subsTwo: [],
      playersForSquadOne: [],
      playersForSquadTwo: []
    }
  }
  componentDidMount() {
    const frame: Frame = Frame.topmost();
    //this.getData();
    frame.navigate({
      create: () => {
        const page: Page = this.pageRef.current!.nativeView;
        return page;
      }
    });
  }

  goBack = () => {
    Frame.topmost().goBack();
  }

  openAdminPicker = (args: EventData) => {
    const mainView = args.object as View;
    const { newGame, isAdminPicker } = this.state;
    if (isAdminPicker) return;
    this.setState({ isAdminPicker: true })
    const option: ShowModalOptions = {
      context: { items: users, title: "Select Ref", size: 'mini' },
      closeCallback: (admin?: any) => {
        if (admin) {
          newGame.ref = admin;
          this.setState({ newGame })
        }

        this.setState({ isAdminPicker: false });
      },
      fullscreen: true
    };
    mainView.showModal('~/modals/combo', option)
  }

  openAdmin1Picker = (args: EventData) => {
    const mainView = args.object as View;
    const { newGame, isAdminPicker } = this.state;
    if (isAdminPicker) return;
    this.setState({ isAdminPicker: true })
    const option: ShowModalOptions = {
      context: { items: users, title: "Select Ass.1", size: 'mini' },
      closeCallback: (admin?: any) => {
        if (admin) {
          newGame.ref1 = admin;
          this.setState({ newGame })
        }

        this.setState({ isAdminPicker: false });
      },
      fullscreen: true
    };
    mainView.showModal('~/modals/combo', option)
  }

  openAdmin2Picker = (args: EventData) => {
    const mainView = args.object as View;
    const { newGame, isAdminPicker } = this.state;
    if (isAdminPicker) return;
    this.setState({ isAdminPicker: true })
    const option: ShowModalOptions = {
      context: { items: users, title: "Select Ass.2", size: 'mini' },
      closeCallback: (admin?: any) => {
        if (admin) {
          newGame.ref2 = admin;
          this.setState({ newGame })
        }

        this.setState({ isAdminPicker: false });
      },
      fullscreen: true
    };
    mainView.showModal('~/modals/combo', option)
  }

  goToGMCNext = (args: EventData) => {
    const { newGame, squadOne, squadTwo, playersOne, playersTwo, subsOne, subsTwo } = this.state;
    const view = args.object as View;
    const game = {
      ...newGame,
      squadOne,
      squadTwo,
      players: {
        teamOne: {
          lineup: playersOne.map((item: { number: string; user: any; }, i: number) => {
            const obj = {
              ...item,
              number: item.number ? parseInt(item.number, 2) : (i + 1)
            }
            delete obj.user;
            return obj;
          }),
          subs: subsOne.map((item: { number: string; user: any; }, i: number) => {
            const obj = {
              ...item,
              number: item.number ? parseInt(item.number, 2) : (i + 1)
            }
            delete obj.user;
            return obj;
          })
        },
        teamTwo: {
          lineup: playersTwo.map((item: { number: string; user: any; }, i: number) => {
            const obj = {
              ...item,
              number: item.number ? parseInt(item.number, 2) : (i + 1)
            }
            delete obj.user;
            return obj;
          }),
          subs: subsTwo.map((item: { number: string; user: any; }, i: number) => {
            const obj = {
              ...item,
              number: item.number ? parseInt(item.number, 2) : (i + 1)
            }
            delete obj.user;
            return obj;
          })
        }
      }
    }

    goToPageReact(GMCStream, { game }, 'GMCStream');
    AppSettings.setString('newGame', JSON.stringify({
      ...game,
      page: 'GMCPlayers'
    }));
  }

  getSquadPlayers = (_id: any, cb = (player: any) => { }) => {
    const variables = {
      _id
    };

    if (client) {
      client.query({
        query: PlayerQL,
        variables
      }).then(({ data }) => {
        if (data.squadPlayers && cb) {
          cb(data.squadPlayers)
        }
      }).catch((e) => {
        alert(e)
      })
    }
  }

  render = () => {
    const { newGame, squadOne, squadTwo, playersOne, playersTwo, subsOne, subsTwo, playersForSquadOne, playersForSquadTwo } = this.state;
    return (
      <page actionBarHidden ref={this.pageRef}>
        <gridLayout rows={`auto,*`} columns={`*`}>
          <stackLayout col={0} row={0}>
            <gridLayout backgroundColor="#000" rows={`auto,40`} columns={getItemSpec(["10", "auto", "40", "*", "40", "6", "auto", "16"])}>
              <flexboxLayout justifyContent="center" onTap={this.goBack} alignItems="center" paddingTop={5} row={1} col={2}>
                <image className="Ionicons size10" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
              </flexboxLayout>
              <label textWrap margin="0 10 2 5" verticalAlignment="middle" style={{
                textAlignment: 'left',
                fontWeight: 'bold',
                fontSize: 18
              }} color={new Color("white")} row={1} col={3} textAlignment={'center'} text="4 / 4 - Match Players" />
              <flexboxLayout onTouch={onTouch} onTap={this.goToGMCNext} justifyContent="center" alignItems="center" col={6} padding="0 0" row={1}>
                <stackLayout className="gmc-next-btn red">
                  <label text="NEXT" />
                </stackLayout>
              </flexboxLayout>
            </gridLayout>
          </stackLayout>
          <gridLayout columns={getItemSpec(["10", "*", "10", "*", "10"])} rows={getItemSpec(["10", "*", "10"])} backgroundImage="~/images/gmc_bg.png" col={0} row={1}>
            <GMCPlayer
              mainProps={{
                borderColor: new Color("#fff"),
                className: "gmc-player-holder",
                row: 1,
                col: 1
              }}
              playerList={playersForSquadOne}
              subs={5}
              squad={squadOne}
              isHome={(newGame.homeTeam && newGame.teamOne) && (newGame.teamOne._id === newGame.homeTeam._id) ? true : false}
              game={newGame}
              team={newGame.teamOne}
              players={11}
              setSquad={(squadOne: any) => {
                console.log(squadOne)
                this.setState({ squadOne, isLoadingPlayersOne: true }, () => {
                  this.getSquadPlayers(squadOne._id, (players: any) => {
                    this.setState({ playersForSquadOne: players, isLoadingPlayersOne: false })
                  })
                })
                if (this.props.setGameSquad) {
                  this.props.setGameSquad({
                    squadOne: squadOne._id
                  })
                }
              }}
              onPlayerPicked={(player) => {
                const ids = playersOne.map((item: { _id: any; }) => item._id);
                if (ids.includes(player._id)) {
                  playersOne.filter((item: { _id: any; }) => item._id !== player._id);
                  this.setState({ playersOne })
                } else {
                  playersOne.push(player)
                  this.setState({ playersOne })
                }
              }}
              onSubPicked={(player) => {
                const ids = subsOne.map((item: { _id: any; }) => item._id);
                if (ids.includes(player._id)) {
                  subsOne.filter((item: { _id: any; }) => item._id !== player._id);
                  this.setState({ subsOne })
                } else {
                  subsOne.push(player)
                  this.setState({ subsOne })
                }
              }}
              role={this.props.game.role}
              isLoadingPlayers={this.state.isLoadingPlayersOne}
              subList={subsOne}
              otherSubs={subsTwo}
              lineup={playersOne}
              otherLineup={playersTwo}
              saveLineupPlay={(player, index) => {
                playersOne[index] = player;
                this.setState({ playersOne })
              }}
              saveSubPlay={(player, index) => {
                subsOne[index] = player;
                this.setState({ subsOne })
              }}
              removeSub={(index = 0) => {
                const _subs = subsOne.filter((item: any, i: number) => i !== index);
                this.setState({
                  subsOne: _subs
                })
              }}
              removePlayer={(index = 0) => {
                const _subs = playersOne.filter((item: any, i: number) => i !== index);
                this.setState({
                  playersOne: _subs
                })
              }}
            />

            <GMCPlayer
              mainProps={{
                borderColor: new Color("#fff"),
                className: "gmc-player-holder",
                row: 1,
                col: 3
              }}
              lineup={playersTwo}
              otherLineup={playersOne}
              subList={subsTwo} otherSubs={subsOne}
              isLoadingPlayers={this.state.isLoadingPlayersTwo}
              role={this.props.game.role}
              playerList={playersForSquadTwo}
              subs={5}
              squad={squadTwo}
              isHome={(newGame.homeTeam && newGame.teamTwo) && (newGame.teamTwo._id === newGame.homeTeam._id) ? true : false}
              game={newGame}
              team={newGame.teamTwo}
              players={11}
              setSquad={(squadTwo: any) => {
                this.setState({ squadTwo, isLoadingPlayersTwo: true }, () => {
                  this.getSquadPlayers(squadTwo._id, (players: any) => {
                    this.setState({ playersForSquadTwo: players, isLoadingPlayersTwo: false })
                  })
                });
                if (this.props.setGameSquad) {
                  this.props.setGameSquad({
                    squadTwo: squadTwo._id
                  })
                }
              }}
              onPlayerPicked={(player) => {
                const ids = playersTwo.map((item: { _id: any; }) => item._id);
                if (ids.includes(player._id)) {
                  playersTwo.filter((item: { _id: any; }) => item._id !== player._id);
                  this.setState({ playersTwo })
                } else {
                  playersTwo.push(player)
                  this.setState({ playersTwo })
                }
              }}
              onSubPicked={(player) => {
                const ids = subsTwo.map((item: { _id: any; }) => item._id);
                if (ids.includes(player._id)) {
                  subsTwo.filter((item: { _id: any; }) => item._id !== player._id);
                  this.setState({ subsTwo })
                } else {
                  subsTwo.push(player)
                  this.setState({ subsTwo })
                }
              }}
              saveLineupPlay={(player, index) => {
                playersTwo[index] = player;
                this.setState({ playersTwo })
              }}
              saveSubPlay={(player, index) => {
                subsTwo[index] = player;
                this.setState({ subsTwo })
              }}
              removeSub={(index = 0) => {
                const _subs = subsTwo.filter((item: any, i: number) => i !== index);
                this.setState({
                  subsTwo: _subs
                })
              }}
              removePlayer={(index = 0) => {
                const _subs = playersTwo.filter((item: any, i: number) => i !== index);
                this.setState({
                  playersTwo: _subs
                })
              }}
            />
          </gridLayout>
        </gridLayout>
      </page>
    )
  }
}

interface GMCPlayersNewGameData extends GMCTeamsNewGameData {
  squadOne?: ISupotsu.Squad;
  squadTwo?: ISupotsu.Squad;
}

interface GMCPlayersNewGameState {
  squadOne?: ISupotsu.Squad;
  squadTwo?: ISupotsu.Squad;
  playersOne: ISupotsu.Player[];
  playersTwo: ISupotsu.Player[];
  subsOne: ISupotsu.Player[];
  subsTwo: ISupotsu.Player[];
  playersForSquadOne: ISupotsu.Player[];
  playersForSquadTwo: ISupotsu.Player[];
  isLoadingPlayersTwo?: boolean;
  isLoadingPlayersOne?: boolean;
}

export const GMCPlayersRefactor = () => {
  const {} = useStyledContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { newGame: prevData } = route.params as { newGame: GMCTeamsNewGameData}
  const [newGame, setNewGame] = React.useState<GMCPlayersNewGameData>(() => {
    return {
      ...prevData
    }
  });

  const [squadOne, setSquadOne] = React.useState<ISupotsu.Squad>();
  const [squadTwo, setSquadTwo] = React.useState<ISupotsu.Squad>();

  const [playersForSquadOne, setPlayersForSquadOne] = React.useState<ISupotsu.Player[]>([]);
  const [playersForSquadTwo, setPlayersForSquadTwo] = React.useState<ISupotsu.Player[]>([]);

  const [playersOne, setPlayersOne] = React.useState<ISupotsu.Player[]>([]);
  const [playersTwo, setPlayersTwo] = React.useState<ISupotsu.Player[]>([]);

  const [subsOne, setSubsOne] = React.useState<ISupotsu.Player[]>([]);
  const [subsTwo, setSubsTwo] = React.useState<ISupotsu.Player[]>([]);

  const [state, updateState] = React.useState<GMCPlayersNewGameState>(() => {
    return {
      playersOne: [],
      playersTwo: [],
      subsOne: [],
      subsTwo: [],
      playersForSquadOne: [],
      playersForSquadTwo: [],
    }
  });

  const setState = (newState: Partial<GMCPlayersNewGameState>, cb = () => {}) => {
    updateState({
      ...state,
      ...newState
    })

    if (cb) cb();
  }

  const getSquadPlayers = (_id: any, cb = (players: any) => { }) => {
    const variables = {
      _id
    };

    if (client) {
      client.query({
        query: PlayerQL,
        variables
      }).then(({ data }) => {
        if (data.squadPlayers && cb) {
          cb(data.squadPlayers)
        }
      }).catch((e) => {
        alert(e)
      })
    }
  }

  const goToGMCNext = (args: EventData) => {
    const game = {
      ...newGame,
      squadOne,
      squadTwo,
      players: {
        teamOne: {
          lineup: playersOne.map((item: { number: string; user: any; }, i: number) => {
            const obj = {
              ...item,
              number: item.number ? parseInt(item.number, 2) : (i + 1)
            }
            delete obj.user;
            return obj;
          }),
          subs: subsOne.map((item: { number: string; user: any; }, i: number) => {
            const obj = {
              ...item,
              number: item.number ? parseInt(item.number, 2) : (i + 1)
            }
            delete obj.user;
            return obj;
          })
        },
        teamTwo: {
          lineup: playersTwo.map((item: { number: string; user: any; }, i: number) => {
            const obj = {
              ...item,
              number: item.number ? parseInt(item.number, 2) : (i + 1)
            }
            delete obj.user;
            return obj;
          }),
          subs: subsTwo.map((item: { number: string; user: any; }, i: number) => {
            const obj = {
              ...item,
              number: item.number ? parseInt(item.number, 2) : (i + 1)
            }
            delete obj.user;
            return obj;
          })
        }
      }
    }
    AppSettings.setString('newGame1', JSON.stringify({
      ...game,
      page: 'GMCPlayers'
    }));

    AppSettings.setString('gmc-game', JSON.stringify(game));

    navigation.navigate(GMCStream.routeName, {
      game
    })
  }

  React.useEffect(() => {
    setCurrentOrientation('landscape', () => {

    })
  }, []);

  console.log('[Players]', 'squad', squadOne?._id, squadTwo?._id)

  return (
    <gridLayout rows={`auto,*`} columns={`*`}>
      <stackLayout col={0} row={0}>
        <gridLayout backgroundColor="#000" rows={`auto,40`} columns={getItemSpec(["10", "auto", "40", "*", "40", "6", "auto", "16"])}>
          <flexboxLayout justifyContent="center" onTap={navigation.goBack} alignItems="center" paddingTop={5} row={1} col={2}>
            <image className="Ionicons size10" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
          </flexboxLayout>
          <label textWrap margin="0 10 2 5" verticalAlignment="middle" style={{
            textAlignment: 'left',
            fontWeight: 'bold',
            fontSize: 18
          }} color={new Color("white")} row={1} col={3} textAlignment={'center'} text="5 / 5 - Match Players" />
          <flexboxLayout onTouch={onTouch} onTap={goToGMCNext} justifyContent="center" alignItems="center" col={6} padding="0 0" row={1}>
            <stackLayout className="gmc-next-btn red">
              <label text="NEXT" />
            </stackLayout>
          </flexboxLayout>
        </gridLayout>
      </stackLayout>
      <gridLayout columns={getItemSpec(["10", "*", "10", "*", "10"])} rows={getItemSpec(["10", "*", "10"])} backgroundImage="~/images/gmc_bg.png" col={0} row={1}>
        <GMCPlayer
          mainProps={{
            borderColor: new Color("#fff"),
            className: "gmc-player-holder",
            row: 1,
            col: 1
          }}
          playerList={playersForSquadOne}
          subs={5}
          squad={squadOne}
          isHome={(newGame.homeTeam && newGame.teamOne) && (newGame.teamOne._id === newGame.homeTeam._id) ? true : false}
          game={newGame}
          team={newGame.teamOne}
          players={11}
          setSquad={(squadOne: ISupotsu.Squad) => {
            if (!squadOne) return;
            setSquadOne(squadOne);
            setState({ isLoadingPlayersOne: true })
            getSquadPlayers(squadOne._id, (players: ISupotsu.Player[]) => {
              setState({ isLoadingPlayersOne: false })
              setPlayersForSquadOne(players)
            })
          }}
          onPlayerPicked={(player) => {
            const ids = playersOne.map((item: { _id: any; }) => item._id);
            if (ids.includes(player._id)) {
              const list = playersOne.filter((item: { _id: any; }) => item._id !== player._id);
              setPlayersOne(list);
            } else {
              const list = [...playersOne, player]
              setPlayersOne(list);
            }
          }}
          onSubPicked={(player) => {
            const ids = subsOne.map((item: { _id: any; }) => item._id);
            if (ids.includes(player._id)) {
              const list = subsOne.filter((item: { _id: any; }) => item._id !== player._id);
              setSubsOne(list)
            } else {
              const list = [...subsOne, player]
              setSubsOne(list)
            }
          }}
          role={newGame.role}
          isLoadingPlayers={state.isLoadingPlayersOne}
          subList={subsOne}
          otherSubs={subsTwo}
          lineup={playersOne}
          otherLineup={playersTwo}
          saveLineupPlay={(player, index) => {
            playersOne[index] = player;
            setPlayersOne(playersOne);
          }}
          saveSubPlay={(player, index) => {
            subsOne[index] = player;
            setSubsOne(subsOne)
          }}
          removeSub={(index = 0) => {
            const _subs = subsOne.filter((item: any, i: number) => i !== index);
            setSubsOne(_subs)
          }}
          removePlayer={(index = 0) => {
            const _subs = playersOne.filter((item: any, i: number) => i !== index);
            setPlayersOne(_subs);
          }}
        />

        <GMCPlayer
          mainProps={{
            borderColor: new Color("#fff"),
            className: "gmc-player-holder",
            row: 1,
            col: 3
          }}
          lineup={playersTwo}
          otherLineup={playersOne}
          subList={subsTwo} otherSubs={subsOne}
          isLoadingPlayers={state.isLoadingPlayersTwo}
          role={newGame.role}
          playerList={playersForSquadTwo}
          subs={5}
          squad={squadTwo}
          isHome={(newGame.homeTeam && newGame.teamTwo) && (newGame.teamTwo._id === newGame.homeTeam._id) ? true : false}
          game={newGame}
          team={newGame.teamTwo}
          players={11}
          setSquad={(squadTwo: ISupotsu.Squad) => {
            if (!squadTwo) return;
            setSquadTwo(squadTwo)
            setState({ squadTwo, isLoadingPlayersTwo: true });
            getSquadPlayers(squadTwo._id, (players: any) => {
              setState({ isLoadingPlayersTwo: false })
              setPlayersForSquadTwo(players)
            })
          }}
          onPlayerPicked={(player) => {
            const ids = playersTwo.map((item: { _id: any; }) => item._id);
            if (ids.includes(player._id)) {
              const list = playersTwo.filter((item: { _id: any; }) => item._id !== player._id);
              setPlayersTwo(list);
            } else {
              const list = [...playersTwo, player]
              setPlayersTwo(list);
            }
          }}
          onSubPicked={(player) => {
            const ids = subsTwo.map((item: { _id: any; }) => item._id);
            if (ids.includes(player._id)) {
              const list = subsTwo.filter((item: { _id: any; }) => item._id !== player._id);
              setSubsTwo(list)
            } else {
              const list = [...subsTwo, player]
              setSubsTwo(list)
            }
          }}
          saveLineupPlay={(player, index) => {
            playersTwo[index] = player;
            setPlayersTwo(playersTwo);
          }}
          saveSubPlay={(player, index) => {
            subsTwo[index] = player;
            setSubsTwo(subsTwo)
          }}
          removeSub={(index = 0) => {
            const _subs = subsTwo.filter((item: any, i: number) => i !== index);
            setSubsTwo(_subs);
          }}
          removePlayer={(index = 0) => {
            const _subs = playersTwo.filter((item: any, i: number) => i !== index);
            setPlayersTwo(_subs);
          }}
        />
      </gridLayout>
    </gridLayout>
  )
}

GMCPlayersRefactor.routeName = "gmcPlayers"

export const ActionIcon = {
  goal: '~/images/soccer_icon_wht.svg.png',
  yellow: '~/images/yellow_card_icon.svg.png',
  red: '~/images/assets/red_card_icon.png',
  foul: '~/images/assets/yellow_card_icon_ptn.png',
  corner: '~/images/assets/yellow_card_icon_ptn.png',
  substitution: '~/images/substitution_icon.svg.png',
  substituion: '~/images/substitution_icon.svg.png',
  shootout: '~/images/penalty_icon_wht.svg.png',
}

export const isActionIconNeedBG = (type: string) => {
  return ['goal', 'shootout', 'substitution', 'substituion'].includes(type);
}

interface GMCStreamState {
  game: ISupotsu.Game;
  canStart: boolean;
  isSaving: boolean;
  started: boolean;
  teamTwoPop: boolean;
  teamOnePop: boolean;
  isRunning: boolean;
  isPublish?: boolean;
  gameTime: number;
  gameTimeRun: number;
  overtimes: any[];
  isLoading?: boolean;
  isSettings?: boolean;
  isSavingGame?: boolean;
  errrrorr?: any;
  e?: any;

}

export const GMCStream = ({...props}: GMCNextProps & any) => {
  let gameTime;
  const pageRef = React.useRef()
  const { duration, isLive, setUpRTMP, switchCamera, startStream, stopStream } = useStreamRTMP()

  const [state, updateState] = React.useState<GMCStreamState>(() => {
    const _newGame = AppSettings.getString('gmc-game', '{}')
    const game = JSON.parse(_newGame);
    return {
      game,
      canStart: false,
      isSaving: false,
      started: game._id ? true : false,
      teamTwoPop: false,
      teamOnePop: false,
      isRunning: false,
      gameTime: 0,
      gameTimeRun: 1,
      overtimes: []
    }
  })

  const setState = (newState: Partial<GMCStreamState>, cb = () => {}) => {
    updateState({
      ...state,
      ...newState
    })
    if (cb) {
      cb()
    }
  }

  const subscribe = (_id: any) => {
    if (client) {
      client.subscribe({
        query: GMC_STATUS_SUBSCRIPTION,
        variables: {
          _id
        }
      }).subscribe({
        next({ data }) {
          if (data.game && (data.game._id === state.game._id)) {
            setState({
              game: data.game,
              started: true,
              isLoading: false,
              isRunning: data.game.state === 'running' ? true : false
            })
          } else {

          }
        },
        error(error: any) {
          alert(error)
        }
      });

      client.subscribe({
        query: GMC_STREAM_SUBSCRIPTION,
        variables: {
          _id
        }
      }).subscribe({
        next({ data }) {
          if (data.gameLive) {
            setState({
              //started: true,
              isPublish: data.gameLive.ended,
              //isRunning: !data.gameLive.ended
            })
          } else {

          }
        }
      });
    }
  }

  const startGame = () => {
    setState({
      started: true,
      gameTime: 0,
      gameTimeRun: Date.now(),
      isRunning: true
    }, () => {
      gameTime = setInterval(() => {
        setState({
          gameTime: state.gameTime + 1,
          isRunning: true
        });
      }, 1000)
    });
  }

  const pauseGame = () => {
    clearInterval(gameTime);
    setState({
      isRunning: false
    })

  }

  const resumeGame = () => {
    gameTime = setInterval(() => {
      setState({
        gameTime: state.gameTime + 1,
        isRunning: true,
        started: true
      }, () => {
        updateGameTime();
      });
    }, 1000);
  }

  const updateGameTime = () => {
    const _that = this;
    const { gameTime, game } = state;
    const variables = {
      _id: game._id,
      time: gameTime
    };


    client.mutate({
      mutation: GMC_UPDATER,
      variables
    }).then(({ data }) => {
      setState({
        game: data.updateGameTime,
        started: true
      })
    }).catch((e: any) => {
      alert(e)
    })
  }

  const startGameConsole = () => {
    const { gameTime, game } = state;
    const variables = {
      _id: game._id,
      time: gameTime
    };

    client.mutate({
      mutation: GMC_STARTER,
      variables
    }).then(({ data }) => {
      setState({
        isLoading: false,
        isRunning: !false,
        game: data.startGame
      })
    }).catch((e: any) => {
      alert(e)
    })
  }

  const endGameConsole = () => {
    const { gameTime, game } = state;
    const variables = {
      _id: game._id,
      time: gameTime
    };


    client.mutate({
      mutation: GMC_ENDER,
      variables
    }).then(({ data }) => {
      setState({
        isLoading: false,
        isRunning: false,
        game: data.endGame
      })
    }).catch((e: any) => {
      alert(e)
    })
  }

  const pauseGameConsole = () => {
    const { gameTime, game } = state;
    const variables = {
      _id: game._id,
      time: gameTime
    };

    client.mutate({
      mutation: GMC_PAUSE,
      variables
    }).then(({ data }) => {
      console.log('[GAME-PAUSED]')
      setState({
        isLoading: false,
        isRunning: false,
        game: data.pauseGame
      })
    }).catch((e: any) => {
      alert(e)
    })
  }

  const addGameAction = (data: { label?: any; type?: any; player?: any; time?: any; squad?: any; TeamPick?: any; }, teamOne?: any, cb = () => { }) => {
    const { gameTime, game, isRunning } = state;
    if (!isRunning && game.state !== "ended") {
      alert('Make sure that the game is running');
      return;
    }
    const variables = {
      action: {
        label: data.label,
        type: data.type,
        player: data.player,
        game: game._id,
        time: data.time ? data.time : gameTime,
        squad: data.squad,
        team: data.TeamPick
      },
      teamOne
    };

    console.log('ADD_ACTION', data.type)

    client.mutate({
      mutation: ADD_ACTION,
      variables
    }).then(({ data }) => {
      console.log('Done', data.addGameAction)
      setState({
        game: data.addGameAction,
        started: true
      });
      if (cb) {
        cb();
      }
    }).catch((e: any) => {
      alert(e)
      console.log(e)
    })
  }

  const addShootout = (data: object[], teamOne?: boolean, cb = () => { }) => {
    const { gameTime, game, isRunning } = state;
    if (game.state !== "ended") {
      alert('Make sure that the game is finished!');
      return;
    }
    const variables = {
      shootouts: data,
      teamOne,
      game: game._id
    };

    const _that = this;

    console.log('ADD_SHOOTUTS', data.length)

    client.mutate({
      mutation: ADD_SHOOTOUT_ACTION,
      variables
    }).then(({ data }) => {
      console.log('Done:ShootoutAdd', data.addShootout._id)
      setState({
        game: data.addShootout
      });
      if (cb) {
        cb();
      }
    }).catch((e: any) => {
      alert(e)
      console.log(e)
    })
  }

  const stopGame = () => {

  }

  const getGame = () => {
    const { game } = state;

    const variables = {
      _id: game._id
    }

    client.query({
      query: GET_GAME,
      variables
    }).then(({ data }) => {
      setState({
        game: data.game,
        started: true,
        isLoading: false,
        isRunning: data.game.state === 'running' ? true : false
      })

    }).catch((e: any) => {
      alert(e);
      console.log(e)
      setState({
        errrrorr: e,
        isLoading: false,
      })
    })
  }

  const save = () => {
    const { game } = state;
    console.log(game);
    const _that = this;
    const date = new Date(game.matchDate || game.date);

    if (!game.squadOne._id || !game.squadTwo._id) {
      alert('Squad missing')
      return;
    }

    setState({ isSavingGame: true });

    const players = {
      teamOne: {
        lineup: game.players.teamOne.lineup.map((item: { [x: string]: any; number?: any; }) => {
          const { __typename, ...plyr } = item;
          return {
            ...plyr,
            number: parseInt(item.number, 2)
          }
        }),
        subs: game.players.teamOne.subs.map((item: { [x: string]: any; number?: any; }) => {
          const { __typename, ...plyr } = item;
          return {
            ...plyr,
            number: parseInt(item.number, 2)
          }
        }),
      },
      teamTwo: {
        lineup: game.players.teamTwo.lineup.map((item: { [x: string]: any; number?: any; }) => {
          const { __typename, ...plyr } = item;
          return {
            ...plyr,
            number: parseInt(item.number, 2)
          }
        }),
        subs: game.players.teamTwo.subs.map((item: { [x: string]: any; number?: any; }) => {
          const { __typename, ...plyr } = item;
          return {
            ...plyr,
            number: parseInt(item.number, 2)
          }
        }),
      }
    }

    const variables = {
      game: {
        // @ts-ignore
        admin: game.admin._id,
        quarter: Number(game.quarter) || 2,
        currentQuarter: 1,
        // @ts-ignore
        ref: game.ref ? game.ref._id : '',
        // @ts-ignore
        ref_left: game.ref1 ? game.ref1._id : '',
        // @ts-ignore
        ref_right: game.ref2 ? game.ref2._id : '',
        // @ts-ignore
        location: game.location._id,
        teamOne: game.teamOne._id,
        teamTwo: game.teamTwo._id,
        homeTeam: game?.homeTeam?._id,
        squadOne: game.squadOne._id,
        squadTwo: game.squadTwo._id,
        sport: game.sport._id,
        players,
        // @ts-ignore
        half: game.half,
        date: date.toLocaleString(),
        owner: user._id
      }
    };

    if (client) {
      client.mutate({
        mutation: CREATE_GAME,
        variables
      }).then(({ data }) => {
        setState({
          game: data.createGame,
          started: true,
          isSavingGame: false
        })
        subscribe(data.createGame._id);
        Methods.setData('GMCDetails-State', null);
        Methods.setData('GMCNext-State', null);
        Methods.setData('GMC-State', null);
        AppSettings.remove('new-game');
      }).catch((e: any) => {
        alert(e);
        console.log(e);
        setState({ e })
        setState({
          isSavingGame: false
        })
      });
    }
  }

  const removeAct = (_id = "", cb = (data: any) => { }) => {
    const { game } = props;
    const _that = this;
    const variables = {
      _id,
      game_id: game._id
    }

    if (client) {
      client.mutate({
        mutation: REMOVE_ACT,
        variables
      }).then(({ data }) => {
        setState({
          game: data.removeAct
        })

        cb(true)

      }).catch((e: any) => {
        alert(e);
        setState({
          errrrorr: e
        })
        cb(false)
      })

    }

  }

  const setPlayers = (data: any) => {
    const variables = {
      _id: props.game._id,
      ...data
    }
    const _that = this;
    setState({ isSavingGame: true })
    if (client) {
      client.mutate({
        mutation: SET_GAME_PLAYERS,
        variables
      }).then(() => {
        setState({
          isSavingGame: false
        })

      }).catch((e: any) => {
        alert('Error while saving game!');
        setState({
          isSavingGame: false,
          e,
        })
      });
    }
  }

  const goBack = () => {
    stopGame()
    Frame.topmost().goBack();
  }

  const openSettings = (num: number, sport: string) => {
    const overtimesArr = [];

    for (let index = 0; index < num; index++) {
      const name = index + 1 === num ? `FT Stoppage Extra` : `${index + 1}/${num} Stoppage Extra`;
      const type = index + 1 === num ? `ft_stoppage_extra` : `${index + 1}_stoppage_extra`;
      const obj = {
        name: name,
        type,
        sports: [sport],
        value: 0
      };

      overtimesArr.push(obj);
    };

    overtimesArr.push(...[
      {
        type: "overtime_1_extra",
        name: "Overtime 1",
        sports: [],
        value: 0
      },
      {
        type: "overtime_2_extra",
        name: "Overtime 2",
        sports: [],
        value: 0
      }
    ]);



    const { isSettings } = state;
    if (isSettings) return;
    setState({ isSettings: true });

    const opts: ModalProps = {
      title: "Game Settings",
      onDoneTitle: 'Save',
      size: ModalHeaderSize.mini,
      render: () => <Settings num={num} overtimesArr={overtimesArr} />,
      onDoneButton: ModalActionButon.red,
      onClose: () => {
        setState({ isSettings: false });
      },
      onDone: (_modal: Modal) => {
        setState({ isSettings: false });
        if (_modal.closeCallback) _modal.closeCallback()
      }
    }

    goToPageReact(Modal, opts, 'SettingsModal')
  }

  React.useEffect(() => {
    setCurrentOrientation('landscape', () => {

    })
    const _newGame = AppSettings.getString('gmc-game', '{}')
    const game = JSON.parse(_newGame);
    const { players } = game;
    const hasPlayers = !players.teamOne ? false : (players.teamOne.lineup.length > 0 || players.teamTwo.lineup.length > 0) ? true : false;
    if (game._id) {
      subscribe(game._id);
      getGame();
      if (['running'].includes(game.state)) {
        resumeGame();
      }
      setState({
        gameTime: game.currentTime ? game.currentTime : 0,
        started: hasPlayers,
        canStart: hasPlayers,
        isLoading: ['paused', 'ended', 'none'].includes(game.state) ? false : true
      })
    } else {
      setState({
        isLoading: false
      })
    }
  }, [])

  const { game, started, isLoading = true, isPublish = false, teamOnePop, teamTwoPop, isRunning, isSavingGame = false } = state;
  const matchDate = new Date(game.matchDate || game.date);
  const today = new Date();
  today.setMinutes(today.getMinutes() - 5);

  const goalsOne = Methods.listify(game.teamOneActs).filter((_item) => _item.type === 'goal');
  const goalsTwo = Methods.listify(game.teamTwoActs).filter((_item) => _item.type === 'goal');

  const redsOne = Methods.listify(game.teamOneActs).filter((_item) => _item.type === 'red').map((item, i) => item.player._id);
  const redsTwo = Methods.listify(game.teamTwoActs).filter((_item) => _item.type === 'red').map((item, i) => item.player._id);

  const subsOne = Methods.listify(game.teamOneActs).filter((_item) => _item.type === 'substitution').map((item, i) => item.second_player._id);
  const subsTwo = Methods.listify(game.teamTwoActs).filter((_item) => _item.type === 'substitution').map((item, i) => item.second_player._id);

  const offFieldOne = [...redsOne, ...subsOne];

  const offFieldTwo = [...redsTwo, ...subsTwo];

  const { navigation } = props

  return (
<page actionBarHidden ref={pageRef} backgroundColor="black">
        <gridLayout rows={getItemSpec(['*'])} columns={getItemSpec(['*'])}>
          {game.state !== "ended" &&
            <gridLayout rows={getItemSpec(['*'])} columns={getItemSpec(['*'])} row={0} col={0}>
            <placeholder col={0} row={0} onCreatingView={(args) => {
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
          }
          <gridLayout rows={getItemSpec(['auto', '*'])} row={0} col={0}>
            {game.state === "ended" && (!teamOnePop && !teamTwoPop) &&
              <stackLayout col={0} row={0}>
                <gridLayout backgroundColor="#000" rows={`auto,40`} columns={getItemSpec(["10", "auto", "40", "*", "40", "6", 'auto', "auto", "16"])}>
                  <flexboxLayout justifyContent="center" onTap={goBack} alignItems="center" paddingTop={5} row={1} col={2}>
                    <image className="Ionicons size10" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
                  </flexboxLayout>
                  <label textWrap margin="0 10 2 5" verticalAlignment="middle" style={{
                    textAlignment: 'left',
                    fontWeight: 'bold',
                    fontSize: 18
                  }} color={new Color("white")} row={1} col={3} textAlignment={'center'} text="Game Ended" />
                  <flexboxLayout marginRight={6} onTouch={onTouch} onTap={() => {
                    openSettings(game.quarter, game.sport.name)
                  }} justifyContent="center" alignItems="center" col={6} padding="0 0" row={1}>
                    <stackLayout className="gmc-next-btn red">
                      <label text="SETTINGS" />
                    </stackLayout>
                  </flexboxLayout>
                  <flexboxLayout onTouch={onTouch} onTap={goBack} justifyContent="center" alignItems="center" col={7} padding="0 0" row={1}>
                    <stackLayout className="gmc-next-btn red">
                      <label text="DONE" />
                    </stackLayout>
                  </flexboxLayout>
                </gridLayout>
              </stackLayout>
            }
            {!isSavingGame &&
              <gridLayout row={1} rows={getItemSpec(['auto', '*'])}>
                {game.state !== 'ended' &&
                  //timescore
                  <gridLayout row={0} style={{
                    padding: `10 0 0 0`
                  }} columns={getItemSpec(['20', '*', '5', 'auto', '5', '*', '20'])}>
                    <GameTeamAvatar onPress={() => {
                      if (!started) return;
                      setState({
                        teamTwoPop: false,
                        teamOnePop: !teamOnePop
                      })
                    }} primary team={game.teamOne} col={1} active={teamOnePop} />
                    <stackLayout horizontalAlignment={'center'} verticalAlignment={'middle'} col={3} style={{
                      marginTop: 5,
                      margin: `0 5`,
                      height: 80,
                    }}>
                      <flexboxLayout style={{
                        padding: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        //marginBottom: 5,
                        background: Theme2['500']
                      }}>
                        <label style={{
                          color: new Color('#fff'),
                          fontWeight: 'bold',
                          textAlignment: 'center'
                        }} text={`${Methods.shortDigit(goalsOne.length).data === '' ? 0 : Methods.shortDigit(goalsOne.length).data}` + `:` + `${Methods.shortDigit(goalsTwo.length).data === '' ? 0 : Methods.shortDigit(goalsTwo.length).data}`} />
                      </flexboxLayout>

                      {started &&
                        <label style={{
                          marginTop: 5,
                          color: new Color('#fff'),
                          fontSize: 16,
                          textAlignment: 'center'
                        }} text={game.state === 'ended' ? 'Finished' : Methods.hhmmss(game.currentTime)} />
                      }
                      {started && game.state !== 'ended' &&
                        <label style={{
                          //marginTop: 5,
                          color: new Color('#fff'),
                          fontSize: 14,
                          textAlignment: 'center'
                        }} text={`${Methods.gameQuarter(game.currentQuarter)} half`} />
                      }
                    </stackLayout>
                    <GameTeamAvatar onPress={() => {
                      if (!started) return;
                      setState({
                        teamTwoPop: !teamTwoPop,
                        teamOnePop: false
                      })
                    }} team={game.teamTwo} col={5} active={teamTwoPop} />
                  </gridLayout>
                }
                {!isLoading &&
                  <gridLayout rows={getItemSpec(['*', 'auto', '10'])} row={1}>
                    {(!teamOnePop && !teamTwoPop) && !started && !game._id &&
                      <flexboxLayout row={0} style={{
                        minHeight: 150,
                        width: { value: 100, unit: '%' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                      }}>
                        {!started &&
                          <SaveButton style={styles.button} onPress={() => {
                            setState({
                              isSaving: true
                            }, () => save())
                          }} label={'Save Game'} />
                        }
                        {!started &&
                          <label style={{
                            margin: `0 10`
                          }} />
                        }
                        {!started &&
                          <SaveButton isDark style={styles.button} onPress={() => {
                            navigation.reset({
                              routeNames: ['home'],
                              routes: [{
                                name: 'home'
                              }],
                              index: 0
                            })
                          }} label={'Close'} />
                        }

                      </flexboxLayout>
                    }
                    {(!teamOnePop && !teamTwoPop) && game._id && (game.state && game.state === 'none') &&
                      <flexboxLayout row={0} style={{
                        width: {
                          value: 100,
                          unit: '%'
                        },
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                      }}>
                        {
                          <SaveButton style={styles.button} onPress={() => {

                          }} label={'Edit Game'} />
                        }
                        {
                          <label style={{
                            margin: `0 10`
                          }} />
                        }
                        {
                          <SaveButton isDark style={styles.button} onPress={() => {
                            navigation.reset({
                              routeNames: ['home'],
                              routes: [{
                                name: 'home'
                              }],
                              index: 0
                            })
                          }} label={'Close'} />
                        }

                        {today.getTime() >= matchDate.getTime() &&
                          <label style={{
                            margin: `0 10`
                          }} />
                        }
                        {today.getTime() >= matchDate.getTime() &&
                          <SaveButton isDark style={{ ...styles.button, backgroundColor: '#D21E41' }} onPress={() => {
                            resumeGame();
                            startGameConsole();
                          }} label={'Start Game'} />
                        }

                      </flexboxLayout>
                    }
                    {(!teamOnePop && !teamTwoPop) && (game.state && game.state === 'paused') &&
                      <flexboxLayout row={0} style={{
                        minHeight: 150,
                        width: { value: 100, unit: '%' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                      }}>
                        <SaveButton isDark style={{ ...styles.button, backgroundColor: '#D21E41' }} onPress={() => {
                          setState({
                            isLoading: true
                          })
                          resumeGame();
                          startGameConsole();
                        }} label={'Start Game'} />
                        <label style={{
                          width: 20,
                          height: 10
                        }} />
                        {
                          <SaveButton isDark style={styles.button} onPress={() => {
                            if (navigation.canGoBack) {
                              navigation.goBack()
                            } else {
                              navigation.reset({
                                routeNames: ['home'],
                                routes: [{
                                  name: 'home'
                                }],
                                index: 0
                              })
                            }
                          }} label={'Go Back'} />
                        }
                      </flexboxLayout>
                    }
                    {(!teamOnePop && !teamTwoPop) && isRunning && started && (game.state && game.state === 'running') &&
                      <flexboxLayout row={0} style={{
                        minHeight: 150,
                        width: { value: 100, unit: '%' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                      }}>
                        <SaveButton onPress={() => {
                          setState({ isLoading: true });
                          pauseGameConsole()
                        }} style={styles.button} label={'Game Break'} />
                        <label style={{
                          width: 20,
                          height: 10
                        }} />
                        <SaveButton style={{
                          ...styles.button,
                          backgroundColor: '#D21E41'
                        }} onPress={() => {
                          setState({ isLoading: true });
                          endGameConsole()
                        }} label={'End Game'} />
                      </flexboxLayout>
                    }

                    {(!teamOnePop && !teamTwoPop) && isRunning && started && (game.state && game.state === 'running') &&
                      <gridLayout columns={getItemSpec(['*', 'auto', '*'])} row={1}>
                        <scrollView height={80} orientation={'horizontal'} col={0}>
                          <stackLayout orientation={'horizontal'} >
                            {
                              Object.keys(ActionIcon).map((item, i) => {
                                const image = ActionIcon[item];
                                const count = Methods.listify(game.teamOneActs).filter((_item) => _item.type === item);
                                if (count.length === 0) return null;
                                return (
                                  <absoluteLayout style={{
                                    padding: 5,
                                    marginRight: 10
                                  }}>
                                    <image top={0} left={0} src={image} style={{
                                      height: 25,
                                      width: 25
                                    }} />

                                    <stackLayout top={0} left={25} style={{
                                      borderRadius: 5,
                                      padding: 5,
                                      background: 'white',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                      //marginTop:
                                    }}>
                                      <label style={{
                                        fontSize: 12
                                      }} text={String(Methods.shortDigit(count.length).data || 0)} />
                                    </stackLayout>
                                  </absoluteLayout>
                                )
                              })
                            }
                          </stackLayout>
                        </scrollView>
                        <flexboxLayout col={1} onTap={() => {
                          if (state.isPublish) {
                            setState({ isPublish: false });
                            stopStream()
                          } else {
                            setState({ isPublish: true });
                            const url = state.game._id ? `rtmp://supotsu.com/game/${state.game._id}` : `rtmp://supotsu.com/live/game-test`
                            startStream(url)
                          }
                          if (isRunning) {
                            //this.pauseGame();
                          } else {
                            //this.resumeGame();
                          }
                        }} style={{
                          height: 80,
                          width: 80,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 80 / 2,
                          margin: `0 10`,
                          background: 'rgba(0,0,0,0.4)'
                        }}>
                          <flexboxLayout style={{
                            width: 80,
                            height: 80,
                            background: isPublish ? 'red' : '#fff',
                            borderRadius: (80 / 2),
                            paddingLeft: isPublish ? 0 : 5,
                            paddingTop: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <label className={"Ionicons"} text={IconSet.Ionicons[isPublish ? 'md-pause' : 'md-play']} style={{
                              fontSize: 45,
                              color: new Color('#000')
                            }} />
                          </flexboxLayout>
                        </flexboxLayout>

                        <scrollView height={80} orientation={'horizontal'} col={2}>
                          <stackLayout orientation={'horizontal'} >
                            {
                              Object.keys(ActionIcon).map((item, i) => {
                                const image = ActionIcon[item];
                                const count = Methods.listify(game.teamOneActs).filter((_item) => _item.type === item);
                                if (count.length === 0) return null;
                                return (
                                  <absoluteLayout style={{
                                    padding: 5,
                                    marginRight: 10
                                  }}>
                                    <image top={0} left={0} src={image} style={{
                                      height: 25,
                                      width: 25
                                    }} />

                                    <stackLayout top={0} left={25} style={{
                                      borderRadius: 5,
                                      padding: 5,
                                      background: 'white',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                      //marginTop:
                                    }}>
                                      <label style={{
                                        fontSize: 12
                                      }} text={String(Methods.shortDigit(count.length).data || 0)} />
                                    </stackLayout>
                                  </absoluteLayout>
                                )
                              })
                            }
                          </stackLayout>
                        </scrollView>
                      </gridLayout>
                    }

                  </gridLayout>
                }
                {isLoading &&
                  <flexboxLayout row={1} style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <activityIndicator busy color={new Color(Theme2['500'])} />
                  </flexboxLayout>
                }
                {(!teamOnePop && !teamTwoPop) && (game.state && game.state === 'ended') &&
                  <gridLayout columns={getItemSpec(["10", "*", "10", "*", "10"])} rows={getItemSpec(["10", "*", "10"])} col={0} row={1}>
                    <GameActionsEdit hasShootouts={game.teamTwoShootouts.length > 0 || game.teamOneShootouts.length > 0 ? true : false} shootouts={game.teamOneShootouts} matchTime={game.matchHalf * game.quarter} col={1} row={1} goals={goalsOne} isTeamOne onGameActionAdd={() => {
                      setState({
                        teamTwoPop: false,
                        teamOnePop: true
                      })
                    }} removeAct={removeAct} acts={game.teamOneActs} team={game.teamOne} />
                    <GameActionsEdit hasShootouts={game.teamTwoShootouts.length > 0 || game.teamOneShootouts.length > 0 ? true : false} shootouts={game.teamTwoShootouts} matchTime={game.matchHalf * game.quarter} col={3} row={1} ggoals={goalsTwo} onGameActionAdd={() => {
                      setState({
                        teamTwoPop: true,
                        teamOnePop: false
                      })
                    }} removeAct={removeAct} acts={game.teamTwoActs} team={game.teamTwo} />
                  </gridLayout>
                }
              </gridLayout>
            }

            {isSavingGame &&
              <flexboxLayout row={1} style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <activityIndicator busy color={new Color(Theme2['500'])} />
              </flexboxLayout>
            }
            {!isSavingGame && teamOnePop &&
              <GameActionPop isDraw={goalsOne.length === goalsTwo.length ? true : false} game={game} team={game.teamOne} squad={game.squadOne} sport={game.sport} isGameOver={game.state === "ended"} time={game.currentTime / 60} min={0} max={game.matchHalf * game.quarter} players={[...game?.players?.teamOne?.lineup, ...game?.players?.teamOne?.subs].filter((item, i) => {
                return !offFieldOne.includes(item._id);
              })} onDiscard={() => {
                setState({
                  teamTwoPop: false,
                  teamOnePop: false
                })
              }} onShootOutClick={(data: object[], cb = () => { }) => {
                addShootout(data, true, cb)
              }} onActionClick={(action: { name: any; type: any; }, { name, ...player }: any, time: any, second_player?: string, cb = () => { }) => {
                const data = {
                  label: action.name,
                  type: action.type,
                  player: player._id,
                  second_player,
                  squad: game.squadOne._id,
                  team: game.teamOne._id,
                  time
                }

                addGameAction(data, true, cb)
              }} />
            }
            {!isSavingGame && teamTwoPop &&
              <GameActionPop isDraw={goalsOne.length === goalsTwo.length ? true : false} game={game} team={game.teamTwo} squad={game.squadTwo} sport={game.sport} isGameOver={game.state === "ended"} time={game.currentTime / 60} min={0} max={game.matchHalf * game.quarter}
              players={[...game?.players?.teamTwo?.lineup, ...game?.players?.teamTwo?.subs].filter((item, i) => {
                return !offFieldTwo.includes(item._id);
              })} onDiscard={() => {
                setState({
                  teamTwoPop: false,
                  teamOnePop: false
                })
              }} onShootOutClick={(data: object[], cb = () => { }) => {
                addShootout(data, false, cb)
              }} onActionClick={(action: { name: any; type: any; }, { name, ...player }: any, time: any, second_player?: string, cb = () => { }) => {
                const data = {
                  label: action.name,
                  type: action.type,
                  player: player._id,
                  second_player,
                  squad: game.squadTwo._id,
                  team: game.teamTwo._id,
                  time
                }

                addGameAction(data, false, cb)
              }} />
            }
          </gridLayout>
        </gridLayout>
      </page>
  )
}

GMCStream.routeName = 'gmcStream';

const Settings = ({ overtimesArr, num }: any) => {
  const [overtimes, setOvertmes] = useState(overtimesArr)
  return (
    <scrollView row={1}>
      <stackLayout padding={20}>
        <gridLayout columns={getItemSpec(['*', '10', '*'])}>
          <BasicTextField keyboardType={'number'} hint={"Overtime 1"} onTextChange={(text: string) => {

          }} col={0} />
          <BasicTextField keyboardType={'number'} hint={"Overtime 2"} onTextChange={(text: string) => {

          }} col={2} />
        </gridLayout>
        <LocDiv />
        {num <= 2 &&
          <React.Fragment>
            <gridLayout columns={getItemSpec(['*', '10', '*'])}>
              {
                overtimes.filter((item, i) => {
                  return i < 2;
                }).map((ot, i) => {
                  return (
                    <BasicTextField keyboardType={'number'} hint={ot.name} onTextChange={(text: string) => {

                    }} col={i === 0 ? 0 : 2} />
                  )
                })
              }
            </gridLayout>
            <LocDiv />
          </React.Fragment>
        }
        {num > 2 &&
          <React.Fragment>
            <gridLayout columns={getItemSpec(['*', '10', '*'])}>
              {
                overtimes.filter((item, i) => {
                  if (i > 3) return false;
                  if (i < 2) return false;
                  return i <= 3 && i > 1;
                }).map((ot, i) => {
                  return (
                    <BasicTextField keyboardType={'number'} hint={ot.name} onTextChange={(text: string) => {

                    }} col={i === 0 ? 0 : 2} />
                  )
                })
              }
            </gridLayout>
            <LocDiv />
          </React.Fragment>
        }
      </stackLayout>
    </scrollView>
  )
};

@Interfaces([cn.nodemedia.NodePublisherDelegate])
export class NodePublisherDelegate extends java.lang.Object implements cn.nodemedia.NodePublisherDelegate {
  private emitter: any; //must be
  constructor(cb: any) {
    super();
    this.emitter = cb;
  }

  public setPublisher(cb: any) {
    this.emitter = cb;
  }

  onEventCallback(streamer: cn.nodemedia.NodePublisher, event: any, msg: any): void {
    console.log(`[RTMP:LOG]: ${event} | ${msg}`);
    if (typeof this.emitter === "function") {
      this.emitter(streamer, event, msg);
    }
  }

}

@Interfaces([cn.nodemedia.NodePublisher.CapturePictureListener])
export class CapturePictureListener extends java.lang.Object implements cn.nodemedia.NodePublisher.CapturePictureListener {
  private emitter: any; //must be
  constructor(cb: any) {
    super();
    this.emitter = cb;
  }

  onCaptureCallback(picture: globalAndroid.graphics.Bitmap) {
    if (typeof this.emitter === "function") {
      this.emitter(picture);
    }
  }

  public setPublisher(cb: any) {
    this.emitter = cb;
  }
}

const GameTeamAvatar = (props: { col: number; primary?: boolean; active?: boolean; onPress?(): void; team: ISupotsu.Team }) => {
  return (
    <gridLayout onTouch={onTouch} onTap={() => {
      if (props.onPress) {
        props.onPress()
      }
    }} col={props.col} columns={props.primary ? getItemSpec(['80', '5', '*', '5']) : getItemSpec(['80', '10', '*', '5'].reverse())}>
      <flexboxLayout style={{
        height: 80,
        width: 80,
        borderRadius: 80 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: props.active ? Theme2['500'] : '#fff',
        borderWidth: 5
      }} col={props.primary ? 0 : 3}>
        <image stretch={'fill'} style={{
          height: 60,
          width: 60,
          borderRadius: 60 / 2
        }} src={props.team.image} />
      </flexboxLayout>
      <stackLayout verticalAlignment={'middle'} col={props.primary ? 2 : 1} style={{
        fontSize: 50,
        color: new Color('white')
      }} horizontalAlignment={props.primary ? 'left' : 'right'}>
        <label textWrap fontSize={30} text={props.team.name} />
      </stackLayout>
    </gridLayout>
  )
}

interface Action {
  name: string,
  type: string,
  hasSecondPlayer?: boolean
}

interface ExtraAction {
  value: string,
  sports: string[],
  action: Action,
  timeMax?: number
}

const extraActions = (num: number, sport = "", isDraw = false, gameHalf: number): ExtraAction[] => {
  const acts: ExtraAction[] = [];
  const _half = gameHalf || 0;
  for (let index = 0; index < num; index++) {
    const name = index + 1 === num ? `FT Stoppage` : `${index + 1}/${num} Stoppage`;
    const type = index + 1 === num ? `ft_stoppage` : `${index + 1}_stoppage`;
    const q = index + 1;
    const obj: ExtraAction = {
      value: name,
      sports: [sport],
      timeMax: _half * q,
      action: {
        name,
        type
      }
    };

    acts.push(obj);
  }
  acts.push(...[
    {
      value: 'Overtime 1',
      sports: ['Football', 'Rugby'],
      action: {
        name: 'Overtime 1',
        type: 'overtime_1'
      }
    },
    {
      value: 'Overtime 2',
      sports: ['Football', 'Rugby'],
      action: {
        name: 'Overtime 2',
        type: 'overtime_2'
      }
    }
  ]);

  if (isDraw) {
    acts.push({
      value: 'Penalty S/T',
      sports: ['Football'],
      action: {
        name: 'Shootout',
        type: 'shootout'
      }
    })
  };

  return acts;
}

const GameActionPop = (props: any) => {
  const [isPlayerSelect, setIsPlayerSelect] = useState(true);
  const [gameStage, setGameStage] = useState('');
  const [action, setAction] = useState(null);
  const [backdate, setBackdate] = useState(props.isGameOver ? true : false);
  const [value, setValue] = useState(props.time || 0);
  const [player, setPlayer] = useState({ _id: null, name: null });
  const [second_player, setSecondPlayer] = useState({ _id: null, name: null });
  const [backdateMax, setBDMax] = useState((props.isGameOver ? props.max : props.time) || 0);
  const [isLoading, setLoading] = useState(false)
  const [isGSError, setGSError] = useState(false);
  const [players, setPlayers] = useState([]);
  const [isSelectingSecondPlayer, setIsSelectingSecondPlayer] = useState(false);

  const maxValue = gameStage !== "" ? 10 : 0;
  const isShootOut = gameStage === "Penalty S/T" ? true : false;

  const save = () => {
    const time = value * 60;
    if (player._id === null) {
      alert("select player");
      return;
    }
    if (props.isGameOver && gameStage === "") {
      setGSError(true)
      return;
    }
    if (time <= 0) {
      alert("Select action time!");
      return;
    }
    if (props.onActionClick) {

      setLoading(true);
      const _action = {
        ...action,
        gameStage
      };
      props.onActionClick(_action, player, time, second_player._id, () => {
        setAction(false);
        setBackdate(props.isGameOver ? true : false);
        setValue(props.time || 0);
        setPlayer({ _id: null, name: null })
        setSecondPlayer({ _id: null, name: null })
        setLoading(!true);
        setGameStage('');
        setGSError(false)
        //console.log('clll')
      })
    } else {
      setLoading(!true);
    }
  }

  const saveShootout = () => {
    if (props.isGameOver && gameStage === "") {
      setGSError(true)
      return;
    }
    if (props.onShootOutClick) {
      setLoading(true);
      const _acts = players.map((item, i) => {
        return {
          player: item._id,
          game: props.game._id,
          isGoal: item.isGoal,
          squad: props.squad._id,
          team: props.team._id
        }
      })

      props.onShootOutClick(_acts, () => {
        setAction(false);
        setBackdate(props.isGameOver ? true : false);
        setValue(props.time || 0);
        setPlayer({ _id: null, name: null })
        setSecondPlayer({ _id: null, name: null })
        setLoading(!true);
        setGameStage('');
        setGSError(false)
        setPlayers([]);
        if (props.onDiscard) props.onDiscard();
        //console.log('clll')
      })
    } else {
      setLoading(!true);
    }
  }

  if (isLoading) {
    return (
      <flexboxLayout row={1} style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <activityIndicator busy color={new Color(Theme2['500'])} />
      </flexboxLayout>
    )
  }

  const showSwapView = !isSelectingSecondPlayer && (action && ['goal', 'substitution'].includes(action.type)) && second_player._id;

  return (
    <gridLayout row={1} rows={getItemSpec(props.isGameOver ? ['20', 'auto', 'auto', 'auto', '10', 'auto', '20'] : ['70', 'auto', 'auto', 'auto', '30', 'auto', '20'])}>
      {props.isGameOver && !isSelectingSecondPlayer &&
        <scrollView scrollBarIndicatorVisible={false} width={screen.mainScreen.widthPixels} row={1}>
          <stackLayout horizontalAlignment={'center'} width={screen.mainScreen.widthPixels} orientation={'horizontal'} padding={'0 10'}>
            {
              extraActions(props.game.quarter, props.sport ? props.sport.name : "", props.isDraw, props.game.matchHalf).filter((item, i) => {
                if (props.sport && props.sport._id) {
                  return item.sports.includes(props.sport.name);
                } else {
                  return true;
                }
              }).filter((item, i) => {
                if (showSwapView && item.value === "Penalty S/T") return false;
                return true;
              }).map((item, i) => {
                const normalColor = isGSError ? 'red' : '#fff'
                return (
                  <flexboxLayout key={i} onTap={(args: EventData) => {
                    if (gameStage === item.value) {
                      setGameStage('');
                      if (action && action.type === item.action.type) setAction(null)
                      setGSError(false);
                      setValue(props.time || 0)
                    } else {
                      setGameStage(item.value);
                      if (!action) setAction(item.action)
                      setGSError(false)
                      setValue(0);
                      console.log(item.timeMax)
                      setBDMax(item.timeMax || props.max)
                    }
                  }} style={{
                    padding: 10,
                    marginRight: 10,
                    borderRadius: 10,
                    background: gameStage === item.value ? "#fff" : "rgba(0,0,0,0)",
                    borderColor: new Color(normalColor),
                    borderWidth: 1
                  }}>
                    <label color={gameStage === item.value ? new Color("#000") : new Color(normalColor)} text={item.value} />
                  </flexboxLayout>
                )
              })
            }
          </stackLayout>
        </scrollView>
      }
      {action && !isShootOut && !showSwapView &&
        <scrollView scrollBarIndicatorVisible={false} width={screen.mainScreen.widthPixels} {...props.isGameOver ? {
          marginTop: isSelectingSecondPlayer ? 5 : 30
        } : {}} height={70} row={isSelectingSecondPlayer ? 1 : 2} orientation="horizontal">
          <stackLayout width={screen.mainScreen.widthPixels} padding={`0 10`} orientation="horizontal">
            {
              props.players.filter((item) => {
                if (second_player._id && second_player._id === item._id) return false;
                return true
              }).map((item: any, i) => {
                return (
                  <flexboxLayout onTouch={onTouch} key={i} onTap={() => {
                    setPlayer(item);
                    if (second_player._id) setIsSelectingSecondPlayer(false)
                  }} style={{
                    height: 70,
                    width: 70,
                    borderRadius: 70 / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: player._id === item._id ? '#D21E41' : Theme2['500'],
                    borderWidth: 5,
                    margin: `0 10`
                  }}>
                    <flexboxLayout style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fff',
                      height: 50,
                      padding: 5,
                      width: 50,
                      borderRadius: 50 / 2
                    }}>
                      <label horizontalAlignment={'center'} verticalAlignment={'middle'} style={{
                        textAlignment: 'center',
                        color: new Color('#000')
                      }} text={item.name} />
                    </flexboxLayout>
                  </flexboxLayout>
                )
              })
            }
          </stackLayout>
        </scrollView>
      }
      {action && !isShootOut && isSelectingSecondPlayer && !showSwapView &&
        <scrollView scrollBarIndicatorVisible={false} width={screen.mainScreen.widthPixels} {...props.isGameOver ? {
          marginTop: 5
        } : {}} height={70} row={3} orientation="horizontal">
          <stackLayout width={screen.mainScreen.widthPixels} padding={`0 10`} orientation="horizontal">
            {
              props.players.filter((item) => {
                if (player._id && player._id === item._id) return false;
                return true
              }).map((item: any, i) => {
                return (
                  <flexboxLayout onTouch={onTouch} key={i} onTap={() => {
                    setSecondPlayer(item);
                    if (player._id) setIsSelectingSecondPlayer(false)
                  }} style={{
                    height: 70,
                    width: 70,
                    borderRadius: 70 / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: second_player._id === item._id ? '#4a5' : Theme2['500'],
                    borderWidth: 5,
                    margin: `0 10`
                  }}>
                    <flexboxLayout style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fff',
                      height: 50,
                      padding: 5,
                      width: 50,
                      borderRadius: 50 / 2
                    }}>
                      <label horizontalAlignment={'center'} verticalAlignment={'middle'} style={{
                        textAlignment: 'center',
                        color: new Color('#000')
                      }} text={item.name} />
                    </flexboxLayout>
                  </flexboxLayout >
                )
              })
            }
          </stackLayout>
        </scrollView>
      }
      {showSwapView &&
        <GameActionPopSwapView {...props} onTap={() => {
          setIsSelectingSecondPlayer(true)
        }} player={player} second_player={second_player} />
      }
      {action && isShootOut &&
        <scrollView width={screen.mainScreen.widthPixels} {...props.isGameOver ? {
          marginTop: 30
        } : {}} row={isSelectingSecondPlayer ? 1 : 2} orientation="horizontal">
          <stackLayout width={screen.mainScreen.widthPixels} padding={`0 10`} orientation="horizontal">
            {
              props.players.map((item: any, i: any) => {
                const ids = players.map((item_) => item_._id);
                const isSelected = ids.includes(item._id);
                const player_ = players.filter((item_) => item_._id === item._id)[0];
                return (
                  <PenaltyPlayer
                    item={item}
                    player={player_}
                    setGoal={(player: { _id: any; }) => {
                      const players_ = players.filter((item) => item._id !== player._id);
                      const _arr = [...players_];
                      _arr.push(player);
                      setPlayers(_arr);
                    }}
                    key={item._id}
                    isSelected={isSelected}
                    setPlayer={(player: { _id: any; }) => {
                      const ids = players.map((item) => item._id);
                      if (ids.includes(player._id)) {
                        setPlayers(players.filter((item) => item._id !== player._id))
                      } else {
                        const _player = {
                          ...player,
                          isGoal: false
                        }
                        const _arr = [...players];
                        _arr.push(_player);
                        setPlayers(_arr);
                      }
                    }}
                  />
                )
              })
            }
          </stackLayout>
        </scrollView>
      }
      {!action &&
        <flexboxLayout row={2} style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: `30 0`,
          margin: 0,
          marginBottom: 0,
          borderRadius: 10,
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}>
          {
            [
              {
                name: 'Goal',
                type: 'goal',
                hasSecondPlayer: true
              },
              {
                name: 'Foul',
                type: 'foul'
              },
              {
                name: 'Corner',
                type: 'corner'
              }
            ].map((item: any, i) => {
              return (
                <flexboxLayout key={i} onTap={() => {
                  const { hasSecondPlayer = false, ...item_ } = item;
                  setAction(item_);
                  if (item.type === "goal") {
                    dialogs.confirm({
                      title: "Goal Assistant",
                      message: "Did the goal have an assistant?",
                      okButtonText: "Yes",
                      cancelButtonText: "No",
                    }).then(function (result) {
                      if (result) {
                        setIsSelectingSecondPlayer(true);
                      } else {
                        setIsSelectingSecondPlayer(false);
                      }
                    });
                  } else {
                    setIsSelectingSecondPlayer(hasSecondPlayer)
                  }
                }} style={{
                  height: 70,
                  width: 70,
                  borderRadius: 70 / 2,
                  //flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: Theme2['500'],
                  borderWidth: 5,
                  margin: 10
                }}>
                  <flexboxLayout style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: Theme2['500'],
                    height: 50,
                    padding: 5,
                    width: 50,
                    borderRadius: 50 / 2
                  }}>
                    <label textWrap horizontalAlignment={'center'} verticalAlignment={'middle'} style={{
                      textAlignment: 'center',
                      color: new Color('#fff')
                    }} text={item.name} />
                  </flexboxLayout>
                </flexboxLayout>
              )
            })
          }
          {
            [
              {
                name: 'Red Card',
                type: 'red'
              },
              {
                name: 'Yellow Card',
                type: 'yellow'
              },
              {
                name: 'Subs',
                type: 'substitution',
                hasSecondPlayer: true
              }
            ].map((item: any, i) => {
              return (
                <flexboxLayout onTap={() => {
                  const { hasSecondPlayer = false, ...item_ } = item;
                  setAction(item_);
                  setIsSelectingSecondPlayer(hasSecondPlayer)
                }} key={i} style={{
                  height: 70,
                  width: 70,
                  borderRadius: 70 / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: Theme2['500'],
                  borderWidth: 5,
                  margin: 10
                }}>
                  <flexboxLayout style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: Theme2['500'],
                    height: 50,
                    width: 50,
                    padding: 5,
                    borderRadius: 50 / 2
                  }}>
                    <label textWrap horizontalAlignment={'center'} verticalAlignment={'middle'} style={{
                      textAlignment: 'center',
                      color: new Color('#fff')
                    }} text={item.name} />
                  </flexboxLayout>
                </flexboxLayout >
              )
            })
          }
        </flexboxLayout >
      }

      {action && backdate && !isShootOut &&
        <stackLayout row={isSelectingSecondPlayer ? 2 : 5}>
          {!props.isGameOver &&
            <slider minValue={0} maxValue={gameStage !== "" ? 10 : (backdate ? backdateMax : props.max)} color={new Color("#345")} onValueChange={(args: any) => {
              const { value } = args.object;
              setValue(value);
            }} value={value} />
          }
          {props.isGameOver &&
            <slider minValue={0} maxValue={gameStage !== "" ? backdateMax : props.max} color={new Color("#345")} onValueChange={(args: any) => {
              const { value } = args.object;
              setValue(value);
            }} value={value} />
          }

          {!isSelectingSecondPlayer &&
            <gridLayout rows={getItemSpec(['auto'])} columns={getItemSpec(['20', '*', 'auto', '*', '20'])}>
              <label verticalAlignment={'middle'} color={new Color('#fff')} col={1} text={`Time: ${Number(value).toFixed(0)}`} />
              <flexboxLayout alignItems={'center'} justifyContent={'center'} col={2}>
                <SaveButton isDark label={'Save'} onPress={() => {
                  save();
                }} style={{ ...styles.button, marginTop: 0 }} />
                <label style={{
                  width: 10,
                  height: 10
                }} />
                {['goal', 'substitution'].includes(action.type) &&
                  <React.Fragment>
                    <SaveButton isDark={false} label={'Change 2nd Player'} onPress={() => {
                      setIsSelectingSecondPlayer(true)
                    }} style={{ ...styles.button, marginTop: 0 }} />
                    <label style={{
                      width: 10,
                      height: 10
                    }} />
                  </React.Fragment>
                }
                <SaveButton isDark label={'Done'} onPress={() => {
                  props.onDiscard()
                }} style={{ ...styles.button, marginTop: 0 }} />
              </flexboxLayout>
              <label verticalAlignment={'middle'} color={new Color('#fff')} horizontalAlignment={'right'} textAlignment={'right'} col={3} text={`Max: ${Number(backdate ? backdateMax : props.max).toFixed(0)}`} />
            </gridLayout>
          }
        </stackLayout>
      }

      {action && backdate && !isShootOut && isSelectingSecondPlayer &&
        <stackLayout row={5} style={{
          marginTop: 10
        }}>
          {isSelectingSecondPlayer &&
            <gridLayout rows={getItemSpec(['auto'])} columns={getItemSpec(['20', '*', 'auto', '*', '20'])}>
              <label verticalAlignment={'middle'} color={new Color('#fff')} col={1} text={`Time: ${Number(value).toFixed(0)}`} />
              <flexboxLayout alignItems={'center'} justifyContent={'center'} col={2}>
                {['goal'].includes(action.type) &&
                  <React.Fragment>
                    <SaveButton isDark={false} label={'Remove Assist'} onPress={() => {
                      setIsSelectingSecondPlayer(false);
                      setSecondPlayer({ _id: null, name: null })
                    }} style={{ ...styles.button, marginTop: 0, background: '#D21E41' }} />
                    <label style={{
                      width: 10,
                      height: 10
                    }} />
                  </React.Fragment>
                }
                <SaveButton isDark label={'Cancel'} onPress={() => {
                  if (player._id) {
                    setIsSelectingSecondPlayer(false)
                  } else {
                    setAction(false);
                    setBackdate(props.isGameOver ? true : false);
                    setValue(props.time || 0);
                    setPlayer({ _id: null, name: null })
                    setSecondPlayer({ _id: null, name: null })
                    setLoading(!true);
                    setGameStage('');
                    setGSError(false)
                    setIsSelectingSecondPlayer(false)
                  }
                }} style={{ ...styles.button, marginTop: 0 }} />
              </flexboxLayout>
              <label verticalAlignment={'middle'} color={new Color('#fff')} horizontalAlignment={'right'} textAlignment={'right'} col={3} text={`Max: ${Number(backdate ? backdateMax : props.max).toFixed(0)}`} />
            </gridLayout>
          }
        </stackLayout>
      }

      {action && !backdate &&
        <stackLayout row={5}>
          <gridLayout rows={getItemSpec(['auto'])} columns={getItemSpec(['20', '*', 'auto', '*', '20'])}>
            <label verticalAlignment={'middle'} color={new Color('#fff')} col={1} text={``} />
            <flexboxLayout alignItems={'center'} justifyContent={'center'} col={2}>
              <SaveButton isDark label={'Save'} onPress={() => {
                save();
              }} style={{ ...styles.button, marginTop: 0 }} />
              <label style={{
                width: 10,
                height: 10
              }} />
              <SaveButton isDark label={'Done'} onPress={() => {
                props.onDiscard()
              }} style={{ ...styles.button, marginTop: 0 }} />
            </flexboxLayout>
            <label verticalAlignment={'middle'} color={new Color('#fff')} horizontalAlignment={'right'} textAlignment={'right'} col={3} text={``} />
          </gridLayout>
        </stackLayout>
      }

      {props.isGameOver && !action &&
        <stackLayout row={5}>
          <gridLayout rows={getItemSpec(['auto'])} columns={getItemSpec(['20', '*', 'auto', '*', '20'])}>
            <label verticalAlignment={'middle'} color={new Color('#fff')} col={1} text={``} />
            <flexboxLayout alignItems={'center'} justifyContent={'center'} col={2}>
              <SaveButton isDark label={'Done'} onPress={() => {
                props.onDiscard()
              }} style={{ ...styles.button, marginTop: 0 }} />
            </flexboxLayout>
            <label verticalAlignment={'middle'} color={new Color('#fff')} horizontalAlignment={'right'} textAlignment={'right'} col={3} text={``} />
          </gridLayout>
        </stackLayout>
      }

      {!backdate &&
        <gridLayout row={5} columns={getItemSpec(['*', '80', '20'])} style={{

        }}>
          <label col={0} style={{

          }} />
          <SaveButton col={1} isDark={!backdate} label={'Backdate'} style={styles.button} onPress={() => setBackdate(!backdate)} />
        </gridLayout>
      }
      {isShootOut &&
        <gridLayout row={5} columns={getItemSpec(['*', '80', '20'])} style={{

        }}>
          <label col={0} style={{

          }} />
          <SaveButton col={1} isDark={!backdate} label={'Save'} style={styles.button} onPress={() => {
            saveShootout()
          }} />
        </gridLayout>
      }
    </gridLayout>
  )
}

const GameActionPopSwapView = ({ player, second_player, onTap, ...props }) => {
  return (
    <flexboxLayout onTouch={onTouch} onTap={(args: EventData) => {
      if (onTap && typeof onTap === "function") {
        onTap();
      }
    }} {...props.isGameOver ? {
      marginTop: 30
    } : {}} row={2} alignItems={'center'} justifyContent={'center'}>
      <flexboxLayout style={{
        height: 70,
        width: 70,
        borderRadius: 70 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#D21E41',
        borderWidth: 5,
        margin: `0 10`
      }}>
        <flexboxLayout style={{
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          height: 50,
          padding: 5,
          width: 50,
          borderRadius: 50 / 2
        }}>
          <label horizontalAlignment={'center'} verticalAlignment={'middle'} style={{
            textAlignment: 'center',
            color: new Color('#000')
          }} text={player.name} />
        </flexboxLayout>
      </flexboxLayout>

      <label className={`Ionicons`} text={`${IconSet.Ionicons["md-swap"]}`} style={{
        margin: `0 10`,
        color: new Color('white'),
        fontSize: 15
      }} />

      <flexboxLayout style={{
        height: 70,
        width: 70,
        borderRadius: 70 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#4a5',
        borderWidth: 5,
        margin: `0 10`
      }}>
        <flexboxLayout style={{
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          height: 50,
          padding: 5,
          width: 50,
          borderRadius: 50 / 2
        }}>
          <label horizontalAlignment={'center'} verticalAlignment={'middle'} style={{
            textAlignment: 'center',
            color: new Color('#000')
          }} text={second_player.name} />
        </flexboxLayout>
      </flexboxLayout>
    </flexboxLayout>
  )
}

const PenaltyPlayer = (props: any) => {
  const { setPlayer, item, player, isSelected, setGoal } = props;
  const absHeight = 70 + 90;
  const red = (player && !player.isGoal) ? "#D21E41" : "#4a5"
  return (
    <absoluteLayout width={80} height={absHeight}>
      {isSelected &&
        /**
         * Goal Picker
         */
        <stackLayout top={75} left={70 / 3} style={{
          //height: 60,
          width: 40,
          borderRadius: 10,
          background: '#fff',
          padding: `5 0`
        }}>
          {
            ['yes', false, 'no'].map((item, i) => {
              if (!item) {
                return (
                  <label key={i} text={''} height={5} width={10} />
                )
              }

              //const isTrue = player.isGoal && item === "yes"?true:false;
              if (item === "yes") {
                return (
                  <stackLayout onTap={() => {
                    const _player = {
                      ...player,
                      isGoal: !player.isGoal
                    }
                    setGoal(_player)
                  }} key={i} style={{
                    height: 30,
                    width: 30,
                    verticalAlignment: 'middle',
                    horizontalAlignment: 'center',
                    borderRadius: 15,
                    color: new Color('#fff'),
                    background: !player.isGoal ? "#DDD" : "#4a5"
                  }}>
                    <label textAlignment={'center'} text={String(item)} />
                  </stackLayout>
                )
              }
              return (
                <stackLayout onTap={() => {
                  const _player = {
                    ...player,
                    isGoal: !player.isGoal
                  }
                  setGoal(_player)
                }} key={i} style={{
                  height: 30,
                  width: 30,
                  verticalAlignment: 'middle',
                  horizontalAlignment: 'center',
                  borderRadius: 15,
                  color: new Color('#fff'),
                  background: player.isGoal ? "#DDD" : "#D21E41"
                }}>
                  <label textAlignment={'center'} text={String(item)} />
                </stackLayout>
              )
            })
          }
        </stackLayout>
      }
      <flexboxLayout top={0} left={0} onTouch={onTouch} onTap={() => {
        setPlayer(item);
      }} style={{
        height: 70,
        width: 70,
        borderRadius: 70 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: isSelected ? red : Theme2['500'],
        borderWidth: 5,
        margin: `0 10`
      }}>
        <flexboxLayout style={{
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          height: 50,
          padding: 5,
          width: 50,
          borderRadius: 50 / 2
        }}>
          <label horizontalAlignment={'center'} verticalAlignment={'middle'} style={{
            textAlignment: 'center',
            color: new Color('#000')
          }} text={item.name} />
        </flexboxLayout>
      </flexboxLayout>

    </absoluteLayout>
  )
}

const GameActionsEdit = (p: any) => {
  const { team = { name: "" }, ...props } = p;
  const actionLabels = Object.keys(ActionIcon).map((item, i) => {
    return Methods.capitalize(item);
  })

  return (
    <gridLayout col={props.col} row={props.row} className="gmc-player-holder" rows={`auto,*`}>
      <gridLayout columns={`10,*,auto`} row={0} style={{
        background: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        borderRadius: '2 2 0 0'
      }}>
        <label col={1} style={{
          color: new Color('#000'),
          textAlignment: 'center'
        }} text={team.name} />
        <TrainingAddButtonIcon col={2} size={30} onPress={() => {
          if (props.onGameActionAdd) {
            props.onGameActionAdd()
          }
        }} />
      </gridLayout>
      <$ListView
        row={1}
        items={actionLabels}
        cellFactory={(item: any) => {
          const ref: React.RefObject<NSVElement<any>> = React.createRef<NSVElement<any>>()
          const index = actionLabels.indexOf(item)
          const count = Methods.listify(props.acts).filter((_item) => _item.type === item.toLowerCase());
          return (
            <stackLayout padding={0} ref={ref}>
              <GameActionEditItem item={item} index={index} actionLabels={actionLabels} {...props} acts={count} />
            </stackLayout>
          )
        }}
      />
    </gridLayout>
  )
}

const GameActionEditItem = ({ item, index = 0, acts = [], shootouts = [], actionLabels = [], ...props }) => {
  const [isEdit, setEdit] = useState(false);

  const isGoal = String(item).toLowerCase() === "goal" ? true : false;
  const scoredShootouts = shootouts.filter((item) => item.isGoal);

  return (
    <stackLayout padding={0} style={isEdit ? {
      backgroundColor: new Color("#fff")
    } : {}}>
      <gridLayout onTap={(args: EventData) => {
        if (acts.length === 0) return;
        setEdit(!isEdit);
      }} style={{
        borderBottomColor: isEdit ? new Color("#000") : new Color('#fff'),
        borderBottomWidth: !isEdit ? 0 : 1,
        padding: `0 10`,
      }} rows={getItemSpec(['35'])} columns={getItemSpec(['*', 'auto'])}>
        <label row={0} col={0} style={{
          color: isEdit ? new Color("#000") : new Color("#fff")
        }} text={item.plural()} />
        <label row={0} col={1} style={{
          color: isEdit ? new Color("#000") : new Color("#fff"),
        }} text={isGoal && props.hasShootouts ? `${acts.length} (${scoredShootouts.length})` : `${acts.length}`} />
      </gridLayout>
      {isEdit &&
        acts.sort((a, b) => {
          const aTime = a.time as number;
          const bTime = b.time as number;
          return aTime - bTime;
        }).map((act, i) => {
          const isOver = ['Shootout', 'FT Stoppage', 'Overtime 2'].includes(item);
          console.log('isOver Game', isOver, item);
          return (
            <GameActionEditItemView isOver={isOver} key={i} act={act} {...props} index={i} acts={acts} />
          )
        })
      }
      {isEdit && isGoal &&
        <React.Fragment>
          {

            shootouts.filter((item) => item.isGoal).map((shootout, i) => {
              return (
                <GameShootoutItem {...props} index={i} shootout={shootout} shootouts={shootouts} />
              )
            })
          }
          {

            shootouts.filter((item) => !item.isGoal).map((shootout, i) => {
              return (
                <GameShootoutItem {...props} index={i} shootout={shootout} shootouts={shootouts} />
              )
            })
          }
        </React.Fragment>
      }
    </stackLayout>
  )
}

const GameActionEditItemView = ({ act, acts, index = 0, isOver = false, ...props }) => {
  const [isLoading, setLoading] = useState(false);
  return (
    <gridLayout style={{
      borderBottomColor: acts.length === (index + 1) ? new Color("#000") : new Color(Theme2['500']),
      borderBottomWidth: acts.length === (index + 1) ? 0 : 1,
      padding: `0 10`,
      marginLeft: 15
    }} columns={getItemSpec(['*', 'auto', '10', 'auto'])} rows={getItemSpec(['35'])}>
      <label row={0} col={0} style={{
        color: new Color(Theme2['500']),
      }} text={act.player.name} />
      <label col={1} style={{
        color: new Color(Theme2['500']),
        margin: `0 10`
      }} text={(isOver ? props.matchTime + " + " : "") + "" + (act.time / 60).toFixed(0) + "'"} />
      {!isLoading &&
        <flexboxLayout row={0} col={3} justifyContent={'center'} alignItems={'center'}>
          <TrainingAddButtonIcon size={20} icon={'md-remove'} backgroundColor={"#D21E41"} onPress={() => {
            dialogs.confirm({
              title: "Remove action?",
              message: "Are you want to remove this action?",
              okButtonText: "Remove",
              cancelButtonText: "Cancel",
            }).then(function (result) {
              console.log("Dialog result: " + result);
              if (result) {
                setLoading(true);
                if (props.removeAct) {
                  props.removeAct(act._id, (bool: boolean) => {
                    setLoading(false)
                  })
                }
              }
            });
          }} />
        </flexboxLayout>
      }
      {isLoading &&
        <flexboxLayout row={0} col={3} justifyContent={'center'} alignItems={'center'}>
          <activityIndicator width={20} height={20} busy color={new Color(Theme2['500'])} />
        </flexboxLayout>
      }
    </gridLayout>
  )
}

const GameShootoutItem = (p: any) => {
  const { shootout, shootouts, index, ...props } = p
  const [isLoading, setLoading] = useState(false);
  return (
    <gridLayout style={{
      ...index === 0 ? {
        borderTopColor: new Color(Theme2['500']),
        borderTopWidth: 1,
      } : {},
      borderBottomColor: shootouts.length === (index + 1) ? new Color("#000") : new Color(Theme2['500']),
      borderBottomWidth: shootouts.length === (index + 1) ? 0 : 1,
      padding: `0 10`,
      marginLeft: 15
    }} columns={getItemSpec(['*', 'auto', '10', 'auto'])} rows={getItemSpec(['35'])}>
      <label row={0} col={0} style={{
        color: new Color(Theme2['500']),
      }} text={shootout.player.name} />
      <label col={1} style={{
        color: new Color(Theme2['500']),
        margin: `0 10`
      }} text={"Pen"} />

      {!isLoading &&
        <flexboxLayout row={0} col={3} justifyContent={'center'} alignItems={'center'}>
          <TrainingAddButtonIcon size={20} icon={shootout.isGoal ? 'ios-checkmark' : "ios-close"} backgroundColor={shootout.isGoal ? "#4a5" : "#D21E41"} onPress={() => {
            dialogs.confirm({
              title: "Toggle goal?",
              message: "Are you want to change the goal state of this action??",
              okButtonText: "Change",
              cancelButtonText: "Cancel",
            }).then(function (result) {
              //console.log("Dialog result: " + result);
              if (result) {
                setLoading(true);
                if (props.toggleShootout) {

                } else {
                  setLoading(false)
                }
              }
            });
          }} />
        </flexboxLayout>
      }

      {isLoading &&
        <flexboxLayout row={0} col={3} justifyContent={'center'} alignItems={'center'}>
          <activityIndicator width={20} height={20} busy color={new Color(Theme2['500'])} />
        </flexboxLayout>
      }
    </gridLayout>
  )
}
