import * as React from 'react'
import { Screen } from '@nativescript/core';
import Theme from '~/Theme';

export const BubbleBackground: React.FC = ({ children }) => {
  const { widthDIPs } = Screen.mainScreen
  return (
    <absoluteLayout background="#fff" borderRadius={30} borderBottomLeftRadius={0} borderBottomRightRadius={0}>
      <stackLayout left={0} top={0} width={widthDIPs} height={widthDIPs} borderRadius={widthDIPs/2} className='LoginCurve' />
      <stackLayout left={0} top={0} width={widthDIPs} background={Theme[300]}  height={widthDIPs} borderRadius={widthDIPs/2} className='LoginCurveLeft' />
      <stackLayout left={0} top={0} width={widthDIPs} background={Theme[200]} height={widthDIPs} borderRadius={widthDIPs/2} className='LoginCurveRight' />
      <gridLayout left={0} top={0} height="100%" width="100%" padding={16} rows="*">
        {children}
      </gridLayout>
    </absoluteLayout>
  )
}
