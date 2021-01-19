import { selectTargetPlayerAction } from '../actions/player';

function selectTargetPlayer({ state, action, dispatch }) {
  return {
    ...state,
    targetPlayer: action.playerId,
  };
}

export default {
  [selectTargetPlayerAction.type]: selectTargetPlayer,
};
