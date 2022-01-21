import { CSSProperties } from '@emotion/react/node_modules/@emotion/serialize';
import React from 'react';
import { CloseButtonVariant } from 'react-bootstrap/esm/CloseButton';
import { default as BsModal } from 'react-bootstrap/Modal';

export type ModalProps = {
  show: boolean;
  onHide: () => void;
  backdrop?: 'static' | true | false;
  modal?: {
    centered?: boolean;
    size?: 'sm' | 'lg' | 'xl';
    fullscreen?: true | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down';
    backdropClassName?: string;
    animation?: boolean;
    dialogClassName?: string;
    contentClassName?: string;
    scrollable?: boolean;
  };
  header?: {
    closeLabel?: string;
    closeVariant?: CloseButtonVariant;
    closeButton?: boolean;
    onHide?: () => void;
    title?: string;
  };
  footer?: React.ReactNode;
  body?: {
    className?: string;
    styles?: CSSProperties;
  };
};

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <BsModal {...props.modal} show={props.show} onHide={props.onHide} backdrop={props.backdrop}>
      {props.header && (
        <BsModal.Header {...props.header}>
          <BsModal.Title>{props.header?.title}</BsModal.Title>
        </BsModal.Header>
      )}
      <BsModal.Body {...props.body}>{props.children}</BsModal.Body>
      {props.footer && <BsModal.Footer>{props.footer}</BsModal.Footer>}
    </BsModal>
  );
};

Modal.defaultProps = {
  modal: { centered: true, size: 'lg' },
};
export default Modal;
