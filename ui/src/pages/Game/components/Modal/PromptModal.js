import React, { useContext, useState } from 'react';
import { ModalContext } from './ModalHandler';
import * as st from './Modal.module.scss';
import Modal from '.';

export default function PromptModal() {
  const { modal, close, callback } = useContext(ModalContext);
  const [value, setValue] = useState(modal.default || '');

  return (
    <Modal
      classnames={{
        inner: st.modalInnerPanel,
      }}
    >
      <div>{modal.message}</div>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="form-control"
          onKeyDown={(event) => {
            if (event.key === 'Enter') callback(value);
          }}
          {...(modal.inputProps || {})}
        />
      </div>
      <div className={st.modalButtonRow}>
        <button
          type="button"
          className={`btn ${st.modalButton}`}
          onClick={() => callback(value)}
        >
          Ok
        </button>
        {modal.buttons &&
          modal.buttons.map((b) => (
            <button
              type="button"
              className={`btn ${st.modalButton}`}
              onClick={() => {
                if (b.onClick) b.onClick();
                if (!b.preventClose) close();
              }}
            >
              {b.text}
            </button>
          ))}
        <button
          type="button"
          className={`btn ${st.modalButtonSecondary}`}
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
