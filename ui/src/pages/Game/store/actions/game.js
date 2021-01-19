export const requestInitializationAction = () => ({
  type: requestInitializationAction.type,
});
requestInitializationAction.type = 'REQUEST_INITIALIZATION';

export const startGameAction = () => ({
  type: startGameAction.type,
});
startGameAction.type = 'GAME_START';

export const playerJoinedAction = (player) => ({
  type: playerJoinedAction.type,
  player: player,
});
playerJoinedAction.type = 'PLAYER_JOINED';

export const gameStatusChangedAction = (status) => ({
  type: gameStatusChangedAction.type,
  status: status,
});
gameStatusChangedAction.type = 'GAME_STATUS_CHANGED';
