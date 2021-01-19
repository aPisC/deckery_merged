import { StateContext } from '../../contexts';
import { AuthenticatedContenxt } from '../../../../core/authentication';

/**
 * Retrives the list of all player in the game
 * @param {object} state Statte of the game
 */
function playerListSelector(state) {
  return Object.values(state.players);
}
playerListSelector.contexts = [StateContext];
playerListSelector.deps = (state) => [state.players];

/**
 * Returns the player object by the id of the player
 * @param {*} state State of the game
 * @param {*} playerId Id of the searched player
 */
function playerSelector(state, playerId) {
  return state.players[playerId];
}
playerSelector.contexts = [StateContext];
playerSelector.deps = (state, playerId) => [state.players, playerId];

/**
 * Returns the player of the current user
 * @param {object} state State of the game
 * @param {object} auth Auth object
 */
function ownPlayerSelector(state, auth) {
  return Object.values(state.players).find((p) => p.user === auth.user.id);
}
ownPlayerSelector.contexts = [StateContext, AuthenticatedContenxt];
ownPlayerSelector.deps = (state, auth) => [
  auth.user && state.players && state.players[auth.user.id],
];

/**
 * Returns all players except the player of current user
 * @param {object} state State of the game
 * @param {object} auth Auth object
 */
function otherPlayerListSelector(state, auth) {
  return Object.values(state.players).filter(
    (p) => p.user !== (auth.user && auth.user.id)
  );
}
otherPlayerListSelector.contexts = [StateContext, AuthenticatedContenxt];
otherPlayerListSelector.deps = (state, auth) => [
  state.players,
  auth.user && auth.user.id,
];

/**
 * Returns all players except the player of current user
 * @param {object} state State of the game
 * @param {object} auth Auth object
 */
function targetPlayerSelector(state, auth) {
  if (state.targetPlayer) return state.players[state.targetPlayer];
  return ownPlayerSelector(state, auth);
}
targetPlayerSelector.contexts = [StateContext, AuthenticatedContenxt];
targetPlayerSelector.deps = (state, auth) => [
  state.players,
  state.targetPlayer,
  auth.user && auth.user.id,
];

function findPlayerSelector(state, auth, player) {
  if (typeof player == 'number') return state.players[player];
  if (typeof player == 'object') return player;
  if (typeof player == 'string') {
    if (!isNaN(player)) return state.players[player];
    if (player === 'me') return ownPlayerSelector(state, auth);
    if (player === 'target') return targetPlayerSelector(state, auth);

    return Object.values(state.players).find((p) => p.name === player);
  }
  return null;
}

/*
 * Export selectors
 */

export {
  playerSelector,
  playerListSelector,
  targetPlayerSelector,
  ownPlayerSelector,
  otherPlayerListSelector,
  findPlayerSelector,
};
