import localId from '../../../../core/localId';
import {
  gameStatusChangedAction,
  playerJoinedAction,
  requestInitializationAction,
  startGameAction,
} from '../actions/game';

export default {
  ADD_PLAYER: ({ state, action, dispatch }) => {
    return {
      ...state,
      players: { ...state.players, [action.payload.id]: action.payload },
    };
  },
  initialize: ({ state, action }) => {
    // Generate local identifiers to hidden cards
    Object.values(action.payload.containers).forEach((container) => {
      container.cards &&
        container.cards.forEach((card) => {
          if (!card.id && !card._id) card._id = localId();
        });
    });
    const r = {
      ...state,
      ...action.payload,
    };
    return r;
  },
  [requestInitializationAction.type]: ({ state, emit }) => {
    emit('initialize', {});
    return state;
  },
  [playerJoinedAction.type]: ({ state, action }) => {
    const player = action.player;
    if (state.players[player.id]) return state;
    return {
      ...state,
      players: { ...state.players, [player.id]: player },
    };
  },
  [gameStatusChangedAction.type]: ({ state, action, dispatch }) => {
    const nStatus = action.status;
    const oStatus = state.game.status;
    if (nStatus === oStatus) return;

    if (nStatus === 'RUNNING') dispatch(requestInitializationAction());
    return {
      ...state,
      game: {
        status: nStatus,
      },
    };
  },
  [startGameAction.type]: ({ emit, state }) => {
    emit('START_GAME', {});
  },
};
