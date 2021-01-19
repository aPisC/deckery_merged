import { findContainerSelector } from '../selectors/container';

export const insertedCardAction = (card, container) => ({
  type: insertedCardAction.type,
  payload: card,
  holder: container,
});
insertedCardAction.type = 'CONTAINER_INSERT_CARD';

export const removedCardAction = (card, container) => ({
  type: removedCardAction.type,
  payload: card,
  holder: container,
});
removedCardAction.type = 'CONTAINER_REMOVE_CARD';

export const moveCardAction = (card, from, to, dragProps) => (state, auth) => ({
  type: moveCardAction.type,
  cards: card,
  extra: dragProps,
  from: findContainerSelector(state, auth, from)?.id,
  to: findContainerSelector(state, auth, to)?.id,
  isSocket: true,
});
moveCardAction.type = 'MOVE_CARD';

export const setTopCardAction = (card, container) => ({
  type: setTopCardAction.type,
  card: card,
  container: container,
});
setTopCardAction.type = 'SET_TOP_CARD';

export const shufflePile = (container) => (state, auth) => ({
  type: shufflePile.type,
  container: findContainerSelector(state, auth, container)?.id,
  isSocket: true,
});
shufflePile.type = 'SHUFFLE_PILE';

export const browseContainerAction = (container, limit) => (state, auth) => ({
  type: browseContainerAction.type,
  container: findContainerSelector(state, auth, container)?.id,
  isSocket: true,
  limit: limit,
});
browseContainerAction.type = 'BROSWE_CONTAINER';

export const updateContainerAction = (container, data) => (state, auth) => ({
  type: updateContainerAction.type,
  container: findContainerSelector(state, auth, container)?.id,
  data,
});
updateContainerAction.type = 'CONTAINER_UPDATE_DATA';
