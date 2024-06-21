import { AbsoluteLayout, Frame, StackLayout, View } from '@nativescript/core';
import * as React from 'react'
import * as RNS from 'react-nativescript'
import { getRootView } from 'tns-core-modules/application';
import { ConfirmButton } from '~/components/ConfirmSheet';
import { Divider } from '~/components/Divider';
import { AppAuthContext } from '~/components/Root';
import { useOldModalRef } from './common.ui';

// This is needed to keep the reconciler aware that it's the same portal on each render
const portalRoot = new RNS.NSVRoot();
const portalLabel = "Unique label to describe my portal";

export interface ModalProps {
  renderTriggerAction?(ref: React.MutableRefObject<any>, onOpenModal:() => void): React.ReactNode;
  renderContent?(onOpenModal:() => void, onCloseModal:() => void, isOpen?: boolean): React.ReactNode;
  fullscreen?: boolean;
  onModalMounted?(open:() => void, closel:() => void): void
};

export const Modal: React.FC<ModalProps> = ({
  renderTriggerAction,
  renderContent,
  children,
  fullscreen = false,
  onModalMounted
}) => {
  const {
    appRef: newRef
  } = React.useContext(AppAuthContext);
  const {
    appRef: oldRef
  } = useOldModalRef();
  const [isModalOpen, toggleModalOpen] = React.useState<boolean>(false);
  const containerRef = React.useRef(getRootView()); // A ref to the container
  const portalRef = React.useRef(null); // A ref for the react portal

  const handleOpenModal = () => {
    const appRef = oldRef ? oldRef : newRef;
    if (!appRef) return;
    if (!appRef.current) return;
    if (isModalOpen) {
      handleCloseModal();
      return;
    }
    const containerView = appRef.current?.nativeView;
    const portalView = portalRef.current?.nativeView as AbsoluteLayout;
    if (!containerView) return;
    toggleModalOpen(true);
    containerView.showModal(portalView, {
      animated: true,
      fullscreen,
      context: {},
      closeCallback: (args) => {
        console.log(`Closed with args`, args);
        toggleModalOpen(false);
      }
    });
  }

  const handleCloseModal = () => {
    const portalView = portalRef.current?.nativeView as AbsoluteLayout
    if (portalView) portalView.closeModal({ name: 'react-nativescript' })
  }

  React.useEffect(() => {
    if (onModalMounted) {
      onModalMounted(handleOpenModal, handleCloseModal)
    }
  }, [onModalMounted])

  useModalDestroy(({
    portalRef,
    onClose(args) {
        handleCloseModal()
    },
  }))

  return (
    <>
      {renderTriggerAction && renderTriggerAction(containerRef, handleOpenModal)}
      {RNS.createPortal(
        (
          <absoluteLayout ref={portalRef}>
            {renderContent ? renderContent(handleOpenModal, handleCloseModal, isModalOpen) : children}
          </absoluteLayout>
        ),
        portalRoot,
        portalLabel
      )}
    </>
  );
}

interface UseModalDestroyOptions {
  portalRef: any
  onClose?(args?: any): void
}
/**
 * Hook for automatically dismissing modals
 * @param portalRef host ref for the modal
 * @param onClose an optional onClose callback
 */
export const useModalDestroy = ({
  portalRef,
  onClose
}: UseModalDestroyOptions): void => {
  React.useEffect(() => {
    return () => {
      const portal = portalRef.current.nativeView as View
      portal?.closeModal()
      if (onClose) onClose()
    }
  }, [])
}

interface ModalExpandableBodyProps {
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
export const ModalExpandableBody: React.FC<ModalExpandableBodyProps> = ({
  onClose,
  title,
  message,
  children,
  cancelText,
  onConfirm,
  background,
  noCancel,
  okText,
}) => (
  <gridLayout rows='*, auto' style={{
    background: 'rgba(0, 0, 0, 0.5)'
  }}>
    <stackLayout onTap={() => {
      if (onClose) {
        onClose(false)
      }
    }} />
    <gridLayout row={1} rows="auto, auto, auto" borderTopLeftRadius={20} borderTopRightRadius={20} background={background || 'white'} style={{
      padding: '0 20',
    }}>
      <flexboxLayout marginBottom={8} justifyContent='center' padding="14 0" row={0}>
        <Divider onTap={() => onClose && onClose(false)} style={{
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
          {!children ? <label text={message} /> : children}
        </flexboxLayout>
        {noCancel && (
          <gridLayout row={4}>
            <ConfirmButton onTap={() => {
              if (onConfirm) onConfirm()
              if (onClose) {
                onClose(true)
              }
            }} type='submit' okText={okText} col={2} />
          </gridLayout>
        )}
        {!noCancel && (
          <gridLayout row={4} columns={'*, 8, *'}>
            <ConfirmButton onTap={() => {
              if (onClose) {
                onClose(false)
              }
            }} type='cancel' cancelText={cancelText} col={0} />
            <ConfirmButton onTap={() => {
              if (onConfirm) onConfirm()
              if (onClose) {
                onClose(true)
              }
            }} type='submit' okText={okText} col={2} />
          </gridLayout>
        )}
      </gridLayout>
    </gridLayout>
  </gridLayout>
)

export default Modal;
