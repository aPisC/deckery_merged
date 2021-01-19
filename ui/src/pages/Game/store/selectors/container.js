const { StateContext } = require('../../contexts');
const { ownPlayerSelector, findPlayerSelector } = require('./player');
const { AuthenticatedContenxt } = require('../../../../core/authentication');

/**
 * Returns a container object by id
 * @param {object} state State of the game
 * @param {int} containerId Id of the searched container
 */
function containerSelector(state, containerId) {
  return state.containers[containerId];
}
containerSelector.contexts = [StateContext];
containerSelector.deps = (state) => [state.containers];

/**
 * Returns all containers of the given player
 * @param {object} state State of the game
 * @param {int} playerId Id of the player
 */
function playerContainerListSelector(state, playerId) {
  return Object.values(state.containers).filter(
    (c) => c.player === playerId && playerId !== null
  );
}
playerContainerListSelector.contexts = [StateContext];
playerContainerListSelector.deps = (state, playerId) => [
  state.containers,
  playerId,
];

/**
 * Returns the containers of the game area
 * @param {object} state State of the game
 */
function gameContainerListSelector(state) {
  return Object.values(state.containers).filter((c) => c.player === null);
}
gameContainerListSelector.contexts = [StateContext];
gameContainerListSelector.deps = (state) => [state.containers];

/**
 * Returns all containers of the current player
 * @param {object} state State of the game
 * @param {object} auth Auth object
 */
function ownContainerListSelector(state, auth) {
  const player = ownPlayerSelector(state, auth);
  if (!player) return [];
  return playerContainerListSelector(state, player.id);
}
ownContainerListSelector.contexts = [StateContext, AuthenticatedContenxt];
ownContainerListSelector.deps = (state, auth) => [
  state.containers,
  auth.user && auth.user.id,
];

function findContainerSelector(state, auth, container) {
  if (typeof container === 'object') return container;
  if (typeof container === 'number') return state.containers[container];
  if (typeof container === 'string') {
    if (!isNaN(container)) return state.containers[container];
    const parts = container.split('$');

    if (parts.length === 1) {
      const ownPlayer = ownPlayerSelector(state, auth);
      return Object.values(state.containers).find(
        (c) => (c.player === ownPlayer?.id || !c.player) && c.tag === parts[0]
      );
    }

    if (parts.length === 2) {
      const player = findPlayerSelector(state, auth, parts[0]);
      return (
        player &&
        Object.values(state.containers).find(
          (c) => c.player === player.id && c.tag === parts[1]
        )
      );
    }
  }
  return null;
}
findContainerSelector.contexts = [StateContext, AuthenticatedContenxt];
findContainerSelector.deps = () => [];

export {
  containerSelector,
  playerContainerListSelector,
  gameContainerListSelector,
  ownContainerListSelector,
  findContainerSelector,
};
