import React, { useContext } from 'react';
import { ModalContext } from './ModalHandler';
import * as st from './Modal.module.scss';
import Modal from '.';

export default function AlertModal() {
  const { modal, close } = useContext(ModalContext);

  return (
    <Modal
      classnames={{
        inner: st.modalInnerPanel,
      }}
    >
      <div>{modal.message}</div>
      <div className={st.modalButtonRow}>
        <button
          type="button"
          className={`btn ${st.modalButton}`}
          onClick={close}
        >
          Ok
        </button>
      </div>
    </Modal>
  );
}
