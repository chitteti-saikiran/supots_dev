// import { ViewWithBottomSheetBase } from '@nativescript-community/ui-material-bottomsheet';
import * as React from 'react'
import { useModalDestroy } from '../hooks/useModalDestroy';
import * as RNS from 'react-nativescript'
import { Frame, isAndroid, View } from '@nativescript/core';
import Theme from '~/Theme';
import { Divider } from './Divider';

const portalRoot = new RNS.NSVRoot()

interface ConfirmSheetProps {
  open?: boolean
  onClose?(confirmed?: boolean): void
  dismissable?: boolean
  onConfirm?(): void
  title: string
  message: string
  background?: string
  cancelText?: string
  okText?: string
  noCancel?: boolean
  customView?: React.ReactNode
}
export const ConfirmSheet = ({ onClose, dismissable, customView, onConfirm, cancelText, open, background, okText, noCancel = false, message, title }: ConfirmSheetProps) => {
  const containerRef = React.useRef(null);
  const portalRef = React.useRef(null);

  const peekHeight = isAndroid ? 200 : undefined;

  const openModal = () => {
    // @ts-ignore
    const containerView = (containerRef.current?.nativeView || Frame.topmost()) as View;
    // @ts-ignore
    const portalView = portalRef.current?.nativeView as View;
    if (!containerView) return;
    containerView.showModal(portalView, {
      animated: true,
      fullscreen: true,
      context: {},
      // peekHeight,
      closeCallback: (_args) => {
        if (onClose) onClose()
      },
    })
  }

  const closeModal = () => {
    // @ts-ignore
    const portalView = portalRef.current?.nativeView as View
    if (portalView) {
      portalView.closeModal({ name: 'react-nativescript' })
    }
  }

  React.useEffect(() => {
    openModal()
    return () => {
      closeModal()
    }
  }, [])

  useModalDestroy({
    portalRef,
    onClose
  })

  return (
    <>
      <stackLayout ref={containerRef} />

      {RNS.createPortal(
        // @ts-ignore
        <gridLayout rows='*, auto' ref={portalRef} style={{
          background: 'rgba(0, 0, 0, 0.5)'
        }}>
          <stackLayout background='transparent' onTap={() => {
            if (onClose && dismissable) {
              onClose(false)
            }
          }} />
          <gridLayout row={1} rows="auto, auto, auto" borderTopLeftRadius={20} borderTopRightRadius={20} background={background || 'transparent'} style={{
            padding: '0 20',
          }}>
            <flexboxLayout marginBottom={8} justifyContent='center' padding="14 0" row={0}>
              <Divider onTap={() => closeModal()} style={{
                width: 30,
              }} />
            </flexboxLayout>
            <gridLayout row={1} rows="auto, 20, auto, 20, *, 30">
              <gridLayout columns="*, auto" >
                <label verticalAlignment='middle' text={title} textWrap style={{
                  // color: colors.text.dark,
                  fontSize: 18,
                  fontWeight: '600',
                }} />
              </gridLayout>
              <flexboxLayout row={2}>
                {!customView ? <label text={message} /> : customView}
              </flexboxLayout>
              {noCancel && (
                <gridLayout row={4}>
                  <ConfirmButton onTap={() => {
                    if (onConfirm) onConfirm()
                    if (onClose) {
                      onClose(true)
                    }
                    if (!noCancel) closeModal()
                  }} type='submit' okText={okText} col={2} />
                </gridLayout>
              )}
              {!noCancel && (
                <gridLayout row={4} columns={'*, 8, *'}>
                  <ConfirmButton onTap={() => {
                    if (onClose) {
                      onClose(false)
                    }
                    closeModal()
                  }} type='cancel' cancelText={cancelText} col={0} />
                  <ConfirmButton onTap={() => {
                    if (onConfirm) onConfirm()
                    if (onClose) {
                      onClose(true)
                    }
                    closeModal()
                  }} type='submit' okText={okText} col={2} />
                </gridLayout>
              )}
            </gridLayout>
          </gridLayout>
        </gridLayout>,
        portalRoot,
        'confirmBox'
      )}
    </>
  )
}

interface ConfirmButtonProps extends RNS.FlexboxLayoutAttributes {
  type: 'cancel' | 'submit'
  cancelText?: string
  okText?: string,
}
export const ConfirmButton = ({ type, cancelText = 'Cancel', okText = 'Okay', ...props }: ConfirmButtonProps) => {
  return (
    <flexboxLayout style={{
      height: 50,
      background: type === 'cancel' ? 'white' : Theme['500'],
      borderColor: Theme[500],
      borderWidth: 1,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center'
    }} {...props}>
      <label color={type === 'cancel' ? Theme[500] : '#fff'} text={type === 'cancel' ? cancelText : okText} />
    </flexboxLayout>
  )
}
