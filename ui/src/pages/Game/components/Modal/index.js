import { faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useContext } from 'react';
import FaButton from '../../../../sharedComponents/fa/FaButton';
import * as st from './Modal.module.scss';
import { ModalContext } from './ModalHandler';

export default function Modal({
  children,
  callback,
  classnames,
  title,
  __modalData,
  hidden,
}) {
  const { close, modal } = useContext(ModalContext);

  title = title || modal.title;

  return (
    <div
      className={`${st.modalOuter} ${(classnames && classnames.outer) || ''}`}
      onClick={() => close()}
      style={{ display: hidden ? 'none' : 'block' }}
    >
      <div
        className={`${st.modalInner} ${(classnames && classnames.inner) || ''}`}
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <div
            className={`${st.modalHeader} ${
              (classnames && classnames.header) || ''
            }`}
          >
            <div>{title}</div>
            <FaButton icon={faTimes} onClick={() => close()} />
          </div>
        )}
        <div
          className={`${st.modalBody} ${(classnames && classnames.body) || ''}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
