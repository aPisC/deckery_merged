import React, { useContext, useMemo } from 'react';
import CardModal from './CardModal';
import { connect } from '../../../../core/connect';
import { DispatchContext, StateContext } from '../../contexts';
import CardListModal from './CardListModal';
import ContainerBrowserModal from './ContainerBrowserModal';
import { closeModalAction } from '../../store/actions/ui';
import AlertModal from './AlertModal';
import ConfirmModal from './ConfirmModal';
import PromptModal from './PromptModal';
import ModalPrefabs from './ModalPrefabs';

const typeMap = {
  CardModal,
  CardListModal,
  ContainerBrowserModal,
  AlertModal,
  ConfirmModal,
  PromptModal,
};

function ModalHandler({ modalData }) {
  console.log(modalData);
  if (!modalData || !Array.isArray(modalData)) return null;

  return modalData.map((modal) => {
    const original = modal;
    if (ModalPrefabs[modal.type]) {
      const mpf = ModalPrefabs[modal.type];
      const mpfr =
        typeof mpf === 'object'
          ? mpf
          : typeof mpf === 'function'
          ? mpf(modal)
          : null;
      if (mpfr) modal = { ...mpfr, ...modal, type: mpfr.type || modal.type };
    }
    return <RenderModal modal={modal} key={modal.__id} original={original} />;
  });
}

function RenderModal({ modal, original }) {
  const dispatch = useContext(DispatchContext);
  const modalContext = useMemo(
    () => ({
      modal: modal,
      close: () => {
        if (modal.onClose) modal.onClose();
        dispatch(closeModalAction(original || modal));
      },
      callback: (...p) => {
        if (modal.callback) modal.callback(...p);
        if (modal.onClose) modal.onClose();
        dispatch(closeModalAction(original || modal));
      },
    }),
    [modal, dispatch, original]
  );

  const Type = typeMap[modal.type];
  if (!Type) return null;
  return (
    <ModalContext.Provider value={modalContext}>
      <Type />
    </ModalContext.Provider>
  );
}

export default connect(() => {
  const state = useContext(StateContext);
  return {
    modalData: state && state.modals,
  };
})(ModalHandler);

export const ModalContext = React.createContext();
