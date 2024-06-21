import * as React from 'react';
import IconSet from '~/font-icons';
import Methods from '~/Methods';
import { CommonHeader } from '~/ui/common.ui';
import { GamePostReactionIcon } from '.';
import { SaveButton } from '../Training';
import Theme, { Theme2 } from '~/Theme';
import Icon from '~/components/Icon';
import { clearBorder } from '~/contexts/StyledContext';
import { ActionIcon } from '~/gmc/gmx-react';
import { GameContext } from '~/contexts/GameContext';
import * as ISupotsu from '~/DB/interfaces';
import { AppAuthContext } from '~/components/Root';
import { icons } from './index';

interface GamePostComposerProps {
  close?(args?: any): void;
  active: GamePostReactionIcon;
}

type Reaction = {
  key: string;
  icon?: string;
  iconType?: string;
  image?: string;
  background?: boolean;
  color?: string;
}

export const Reactions: Reaction[] = [
  {
    key: 'like',
    icon: 'thumb-up',
    iconType: 'MaterialIcons',
    background: true
  },
  {
    key: 'dislike',
    icon: 'thumb-down',
    iconType: 'MaterialIcons',
    background: true,
  },
  {
    key: 'haha',
    icon: 'laughing',
    iconType: 'Fontisto',
    color: 'green',
  },
  {
    key: 'wow',
    icon: 'grim-stars',
    iconType: 'FontAwesome5Free',
    color: 'gold',
  },
  {
    key: 'sad',
    icon: 'frown',
    iconType: 'FontAwesome5Free',
    color: Theme2[500]
  },
  {
    key: 'angry',
    icon: 'tired',
    iconType: 'FontAwesome5Free',
    color: 'red',
  },
];

interface GamePostInput {
  game_id: string;
  team_id: string;
  user: string;
  content: string;
  error?: boolean;
  player?: string;
  moment?: any;
  reaction?: any;
  min: any;
}

export const GamePostComposer: React.FC<GamePostComposerProps> = ({
  close,
  active: initActive,
}) => {
  const [active, setActive] = React.useState(initActive);
  const { user } = React.useContext(AppAuthContext);
  const { game, favoriteTeam } = React.useContext(GameContext)
  const [reaction, setReaction] = React.useState(null);
  const [moment, setMoment] = React.useState(null);
  const [player, setPlayer] = React.useState(null);
  const [text, setText] = React.useState('');
  const chunks: Reaction[][] = Methods.arrayChunks(Reactions, 2);

  const momentIcons = Object.keys(ActionIcon).filter(i => !['substituion', 'corner'].includes(i)).map(i => ({
    key: i,
    image: ActionIcon[i].replace('_icon_wht', '_icon_drk').replace('substitution_icon', 'substitution_icon_drk')
  }));

  const momentIconChunks = Methods.arrayChunks(momentIcons, 2);

  const renderTextView = () => {
    return (
      <stackLayout row={2} padding={16}>
        <textView
          row={1}
          height='100%'
          width='100%'
          text={text}
          hint='Write something'
          style={{
            fontSize: 30,
            padding: 20,
            textAlignment: "center",
            verticalAlignment: 'middle',
            fontWeight: "bold",
            borderBottomWidth: 0,
            borderBottomColor: 'transparent'
          }}
          onLoaded={clearBorder}
          onTextChange={(args: any) => {
            const content = args.object.text;
            setText(content);
          }}
        />
      </stackLayout>
    )
  }

  const post: GamePostInput = React.useMemo(() => {
    const object: GamePostInput = {
      team_id: favoriteTeam?._id,
      game_id: game?._id,
      content: text,
      min: game.currentTime,
      user: user?._id,
    }

    if (moment) {
      object['moment'] = moment;
    } else if (player) {
      object['player'] = player._id;
    } else if (reaction) {
      object['reaction'] = reaction;
    } else {
      object['error'] = true;
    }
    return object;
  }, [game, favoriteTeam, player, moment, reaction, user]);


  return (
    <gridLayout width={'100%'} height={'100%'} rows="auto, auto, *, auto, auto">
      <CommonHeader goBack={close} user={{
        name: active.key === 'moment' ? 'Comment on game' : active.key === 'player' ? 'Player reaction' : 'React to game',
      }} />
      <gridLayout padding='8 0' background={Theme[500]} row={1} columns={'*,*,*'} col={0} rows={'auto'}>
        {
          icons.map((icon, i) => {
            return (
              <flexboxLayout key={i} justifyContent={'center'} alignItems={'center'} style={{

              }} col={i}>
                <flexboxLayout justifyContent={'center'} onTap={() => {
                  setActive(icon);
                }} alignItems={'center'} style={{
                  background: active.key === icon.key ? Theme2[500] : Theme[500],
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                }}>
                  <Icon type={icon.type ? icon.type : 'MaterialIcons'} name={icon.name} style={{
                    color: '#fff',
                    fontSize: 25,
                  }} />
                </flexboxLayout>
              </flexboxLayout>
            )
          })
        }
      </gridLayout>
      {active.key === 'reaction' && (
        <>
          {!reaction ? (
            <gridLayout row={2} rows='*, *, *' columns='*, *'>
              {chunks.map((arr, row) => (
                <>
                  {arr.map((r, col) => {
                    return (
                      <flexboxLayout margin={16} justifyContent='center' alignItems='center' col={col} row={row}>
                        <flexboxLayout onTap={() => setReaction(r)} justifyContent='center' alignItems='center' style={{
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                          backgroundColor: r.background ? Theme[500] : r.color,
                        }}>
                          <Icon type={r.iconType} name={r.icon} style={{
                            color: r.color ? r.color : '#fff',
                            fontSize: r.background ? 60 : 100,
                          }} />
                        </flexboxLayout>
                      </flexboxLayout>
                    )
                  })}
                </>
              ))}
            </gridLayout>
          ) : renderTextView()}
        </>
      )}
      {active.key === 'moment' && (
        <>
          {!moment ? (
            <gridLayout row={2} rows='*, *, *' columns='*, *'>
              {momentIconChunks.map((arr, row) => (
                <>
                  {arr.map((r, col) => {
                    console.log(row, col)
                    return (
                      <flexboxLayout key={r.key} margin={16} justifyContent='center' alignItems='center' col={col} row={row}>
                        <flexboxLayout onTap={() => setMoment(r)} justifyContent='center' alignItems='center' style={{
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                        }}>
                          <image src={r.image} style={{
                            width: 100,
                            height: 100,
                          }} />
                        </flexboxLayout>
                      </flexboxLayout>
                    )
                  })}
                </>
              ))}
            </gridLayout>
          ) : renderTextView()}
        </>
      )}
      {active.key === 'player' && (
        <>
          {!player ? (
            <gridLayout width='100%' height='100%' row={2} rows='auto, *'>
              <scrollView row={1}>
                <stackLayout>
                  {[...game.players.teamOne.lineup, game.players.teamTwo.lineup].map((p, i) => {
                    return (
                      <gridLayout onTap={() => setPlayer(p)} margin={16} columns='auto, *' key={i}>
                        <image stretch='aspectFill' src={
                          // @ts-ignore
                          p.user ? p.user.image.replace('.svg', '.png') : 'https://supotsu.com:8080/default_avatar.png'
                        } style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          marginRight: 8,
                        }} />
                        <label verticalAlignment='middle' text={
                          // @ts-ignore
                          p.name
                        } col={1} style={{
                          color: Theme[500]
                        }} />
                      </gridLayout>
                    )
                  })}
                </stackLayout>
              </scrollView>
            </gridLayout>
          ) : renderTextView()}
        </>
      )}
      <gridLayout padding='0 8 8' columns='*, 8, *' row={4}>
        <SaveButton col={0} text='Clear' onTap={() => {
          setPlayer(null);
          setMoment(null);
          setReaction(null);
        }} />
        <SaveButton col={2} text='Submit' onTap={() => {
          if (post['error']) {
            return;
          }
          alert('Comment added successfully');
          if (close) close();
        }} />
      </gridLayout>
    </gridLayout>
  )
}
