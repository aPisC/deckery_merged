import {
  playerSelector,
  ownPlayerSelector,
  targetPlayerSelector,
  playerListSelector,
  findPlayerSelector,
} from '../../../store/selectors/player';
import * as playerActions from '../../../store/actions/player';
import ModuleBase from './ModuleBase';

export default class PlayerModule extends ModuleBase {
  find(player) {
    return findPlayerSelector(
      this.__env.getState(),
      this.__env.getAuth(),
      player
    );
  }

  getPlayer(playerId) {
    return playerSelector(this.__env.stateGet(), playerId);
  }

  getOwnPlayer() {
    return ownPlayerSelector(this.__env.stateGet(), this.__env.authGet());
  }
  getTargetPlayer() {
    return targetPlayerSelector(this.__env.stateGet(), this.__env.authGet());
  }
  getPlayers() {
    return playerListSelector(this.__env.stateGet());
  }
}

Object.keys(playerActions).forEach((key) => {
  const action = playerActions[key];
  if (key.endsWith('Action')) key = key.substr(0, key.length - 6);
  PlayerModule.prototype[key] = function (...p) {
    return this.__env.getDispatch()(action(...p));
  };
});
