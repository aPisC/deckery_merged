import { gameStatusChangedAction, playerJoinedAction } from '../actions/game';
import { openModalAction } from '../actions/ui';

export function initialize({ dispatch, state, params: [action] }) {
  dispatch({
    type: 'initialize',
    payload: action,
  });
}

export function reconnecting({ params: [p] }) {
  if (p >= 5) this.close();
}

export function PLAYER_JOINED({ params: [player], dispatch }) {
  dispatch(playerJoinedAction(player));
}

export function GAME_STATUS_CHANGED({ params: [newStatus], dispatch }) {
  dispatch(gameStatusChangedAction(newStatus));
}

export function BROSWE_CONTAINER({ params: [browseParams], dispatch }) {
  dispatch(openModalAction({ ...browseParams, type: 'ContainerBrowserModal' }));
}
