import * as React from 'react';
import Theme, { Theme2 } from '~/Theme';
import IconSet from '../font-icons';
import { EventData, TextView } from '@nativescript/core';
import { onTouch } from '~/app';
import { isAndroid } from 'tns-core-modules/ui/page/page';

type SocialColor = 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'google'
const SocialColors = {
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  google: '#CD201F',
  instagram: '#E4405F'
}

interface StyledContextData {
  theme: {
    primary: typeof Theme,
    secondary: typeof Theme2
  },
  socialColors: Record<SocialColor, string>
  fonts: typeof IconSet,
  onTouch(args: EventData),
  clearBorder(args: EventData),
}
const StyledContext = React.createContext({} as StyledContextData);

export const clearBorder = (args: EventData) => {
  const tv = args.object as TextView;
  if (isAndroid) {
   tv.nativeView.setBackground(null);
  }
}

export const StyleContextProvider: React.FC = ({
  children
}) => {
  return (
    <StyledContext.Provider value={{
       theme: {
         primary: Theme,
         secondary: Theme2
       },
       fonts: IconSet,
       onTouch,
       clearBorder,
       socialColors: SocialColors
    }}>
      {children}
    </StyledContext.Provider>
  )
}

export const useStyledContext = (): StyledContextData => {
  return React.useContext(StyledContext);
}
