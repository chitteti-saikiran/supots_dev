import { Color, GridLayout } from '@nativescript/core'
import { isAndroid, isIOS } from '@nativescript/core'
import { useNavigation } from '@react-navigation/core'
import * as React from 'react'
import IconSet, { IconType } from '~/font-icons'
import { GridLayoutAttributes } from 'react-nativescript'
import Theme from '~/Theme'

interface PageProps extends GridLayoutAttributes {
  headerOptions?: Omit<HeaderProps, 'theme'>
  goBack?(): void
  absoluteLayout?: boolean
}
export const Page: React.FC<PageProps> = ({ children, absoluteLayout, goBack, headerOptions, ...props }) => {
  if (absoluteLayout) {
    return (
      <absoluteLayout width='100%' height='100%' {...props}>
        <gridLayout left={0} top={0} width='100%' height='100%'>
          {children}
        </gridLayout>
        <stackLayout left={0} top={0} width='100%'>
        {headerOptions && <Header absoluteLayout theme={Theme} goBack={goBack} {...headerOptions} />}
        </stackLayout>
      </absoluteLayout>
    )
  }
  return (
    <gridLayout rows="auto, *" {...props}>
      {headerOptions && <Header theme={Theme} goBack={goBack} {...headerOptions} />}
      <gridLayout row={1}>
        {children}
      </gridLayout>
    </gridLayout>
  )
}

type HeaderAction = {
  type: 'icon',
  active?: boolean,
  iconType: IconType,
  iconName: string,
  onTap?(): void,
  loading?: boolean
} | {
  type: 'text',
  active?: boolean,
  text: string,
  onTap?(): void,
  loading?: boolean
}

interface HeaderProps {
  title?:  string
  color?: string
  textColor?: string,
  goBack?(): void,
  actions?: HeaderAction[]
  settings?: boolean,
  theme: typeof Theme
  absoluteLayout?: boolean
}

const Header = ({ title, theme:themeFor, textColor, absoluteLayout, goBack, color, actions = [], settings = false }: HeaderProps) => {
  const { canGoBack, goBack: navGoBack } = settings ? ({
    canGoBack() {
        return true
    },
  } as { canGoBack(): boolean, goBack?(): void}) : useNavigation();
  const headerRef = React.useRef();
  const size = !canGoBack() ? 'auto' : isIOS ? 54 : 56;

  React.useEffect(() => {
    if (!headerRef) return;
    const { current } = headerRef;
    let prevColor: Color | undefined;
    if (current) {
      // @ts-ignore
      const view = current.nativeView as GridLayout;
      const page = view.page;
      if (isIOS) {

      } else {
        if (page) {
          prevColor = page.androidStatusBarBackground ?? new Color(themeFor[700])

          page.androidStatusBarBackground = new Color(themeFor[800]);
        }
      }
    }

    return () => {
      if (current) {
        // @ts-ignore
        const view = current.nativeView as StackLayout;
        const page = view.page;
        if (isIOS) {

        } else {
          if (page) page.androidStatusBarBackground = prevColor;
        }
      }
    }
  }, [headerRef])

  const leftButton = canGoBack() || goBack ? (
    <flexboxLayout onTap={goBack ? goBack : navGoBack} col={0} style={{
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
    }}>
      <label color={textColor ? textColor : themeFor.contrastDefaultColor === 'light' && isAndroid && color ? '#fff' : '#000'} marginTop={isAndroid ? 2.5 : 0} className='Feather size24' fontWeight='bold' text={IconSet.Feather['arrow-left']} />
    </flexboxLayout>
  ) : null
  return (
    // @ts-ignore
    <gridLayout ref={headerRef} columns={`${size}, *, auto`} style={{
      padding: '12 16 12 4',
      background: color
    }}>
      {leftButton}
      <flexboxLayout col={1} style={{
        alignItems: 'center',
      }}>
        <label color={themeFor.contrastDefaultColor === 'light' && isAndroid && color ? '#fff' : '#000'} verticalAlignment='middle' className='size22' text={title}/>
      </flexboxLayout>
      <flexboxLayout col={2}>
        {actions.map((action, index) => {
          if (index > 3) return null;
          if (action.type === 'icon') {
            return (
              <flexboxLayout onTap={() => {
                if (action.loading) return;
                if (action.onTap) action.onTap()
              }} key={index} style={{
                height: 35,
                width: 35,
                background: action.active ? themeFor['300'] : '#eee',
                marginLeft: 8,
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {!action.loading && <label color={action.active ? '#fff' : '#000'} className={`${action.iconType} size16`} text={IconSet[action.iconType][action.iconName]} />}
                {action.loading && <activityIndicator color={action.active ? '#fff' : '#000'} busy width={15} height={15} />}
              </flexboxLayout>
            )
          }
          if (action.type === 'text') {
            return (
              <flexboxLayout onTap={() => {
                if (action.loading) return;
                if (action.onTap) action.onTap()
              }} key={index} style={{
                height: 35,
                padding: '0 8',
                background: action.active ? themeFor['300'] : '#eee',
                marginLeft: 8,
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {!action.loading && <label color={action.active ? '#fff' : '#000'} className={`size16`} text={action.text} />}
                {action.loading && <activityIndicator color={action.active ? '#fff' : '#000'} busy width={15} height={15} />}
              </flexboxLayout>
            )
          }
        })}
      </flexboxLayout>
    </gridLayout>
  )
}
