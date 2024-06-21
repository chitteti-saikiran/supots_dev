import * as React from 'react';
import icons, { IconType } from '../utils/icons';
import { Divider } from './Divider';
import { Avatar } from './Avatar'
import { useImageCache } from '../utils/image-cache';
import { Theme2 } from '~/Theme';

interface LabelItemProps {
  name: string,
  username: string,
  poster?: string
  onTap?(): void,
  border?: boolean
  icon?: {
    type: IconType,
    name: string
  },
  unread?: boolean,
  textWrap?: boolean
}
export const LabelItem = ({ name, border, username, poster, onTap, unread, textWrap, icon = {
  name: 'edit',
  type: 'Feather'
} }: LabelItemProps) => {
  const imageData = poster
  const unreadTextStyle = unread ? {
    fontWeight: 'bold'
  } : {}
  return (
    <flexboxLayout borderColor={'#ddd'} borderWidth={border ? 1 : 0} onTap={onTap} padding={17} borderRadius={10} background={unread ? Theme2['100'] : '#fff'} marginBottom={17}>
      <gridLayout columns='40, 12, *, auto, 8, 40,' width={'100%'}>
        {!poster || !imageData ? (
          <Avatar col={0} square={poster ? true : false} image={poster} size={40} name={name} />
        ) : (
          <image src={imageData} col={0} style={{
            width: 40,
            height: 40,
            borderRadius: 10,
          }} loadMode="async" stretch='aspectFill' />
        )}
        <flexboxLayout flexDirection='column' justifyContent='center' col={2}>
          <label text={name} style={{
            color: '#000',
            ...unreadTextStyle,
          }} />
          <label textWrap={textWrap} text={username} style={{
            color: '#000',
            fontSize: 10,
            ...unreadTextStyle,
          }} />
        </flexboxLayout>
        <Divider col={4} style={{
          height: 40,
          width: 1,
        }} />
        <flexboxLayout height={40} col={6} width={40} alignItems='center' justifyContent='center'>
          <label className={`${icon.type} size18`} text={icons[icon.type][icon.name]} />
        </flexboxLayout>
      </gridLayout>
    </flexboxLayout>
  )
}
