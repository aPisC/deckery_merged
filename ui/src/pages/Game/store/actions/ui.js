export const openModalAction = (modal) => ({
  type: openModalAction.type,
  modal: modal,
});
openModalAction.type = 'UI_MODAL_OPEN';

export const closeModalAction = (modal) => ({
  type: closeModalAction.type,
  modal: modal,
});
closeModalAction.type = 'UI_MODAL_CLOSE';
