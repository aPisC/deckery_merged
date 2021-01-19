import { findPlayerSelector } from '../selectors/player';

export const selectTargetPlayerAction = (pid) => (state, auth) => ({
  type: selectTargetPlayerAction.type,
  playerId: findPlayerSelector(state, auth, pid)?.id,
});
selectTargetPlayerAction.type = 'SELECT_TARGET_PLAYER';
