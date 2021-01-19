import { openModalAction, closeModalAction } from '../actions/ui';

function openModalHandler({ state, action }) {
  action.modal.__id = +new Date();
  return {
    ...state,
    modals: [...state.modals, action.modal],
  };
}
function closeModalHandler({ state, action }) {
  return {
    ...state,
    modals: state.modals.filter((m) => m !== action.modal),
  };
}

export default {
  [openModalAction.type]: openModalHandler,
  [closeModalAction.type]: closeModalHandler,
};
