import { Screen } from '@nativescript/core';
import * as React from 'react';
import { LabelAttributes, RNSStyle } from 'react-nativescript';
import Theme from '~/Theme';

interface DividerProps extends LabelAttributes {
  col?: number;
  row?: number;
  height?: number;
  width?: number;
  style?: RNSStyle
}

export const Divider: React.FC<DividerProps> = ({ col, row, style = {}, ...rest }) => {
  const stylesComposed = {
    width: Screen.mainScreen.widthDIPs / 4,
    height: 5,
    borderRadius: 8,
    background: Theme ? Theme[100] : '#7F87F138',
    ...style
  }
  return (
    <label {...rest} {...col ? { col } : {}} {...row ? { row } : {}} style={stylesComposed}/>
  )
}
