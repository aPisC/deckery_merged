import {
  containerSelector,
  findContainerSelector,
} from '../../../store/selectors/container';

import * as containerActions from '../../../store/actions/container';
import { ownPlayerSelector } from '../../../store/selectors/player';
import ModuleBase from './ModuleBase';

export default class ContainerModule extends ModuleBase {
  find(container) {
    return findContainerSelector(
      this.__env.getState(),
      this.__env.getAuth(),
      container
    );
  }
  getContainer(containerId = null) {
    if (containerId == null) containerId = this.__env.context.containerId;
    return containerSelector(this.__env.getState(), containerId);
  }
  getContainerByTag(tag, playerId = null) {
    let container = Object.values(this.__env.getState().containers).find(
      (c) => c.player === playerId && c.tag === tag
    );
    if (!container && playerId == null) {
      const player = ownPlayerSelector(
        this.__env.getState(),
        this.__env.getAuth()
      );
      playerId = player.id;
      container = Object.values(this.__env.getState().containers).find(
        (c) => c.player === playerId && c.tag === tag
      );
    }
    return container;
  }
  isOwnContainer() {
    const containerId = this.__env.context.containerId;
    const container = containerSelector(this.__env.getState(), containerId);
    const player = ownPlayerSelector(
      this.__env.getState(),
      this.__env.getAuth()
    );
    return !!container && !!player && container.player === player.id;
  }
  hasCard(container) {
    if (container == null) container = this.__env.context.containerId;
    if (container && typeof container === 'object') container = container.id;
    const C = containerSelector(this.__env.getState(), container);
    return !!(C && C.top) || !!(C && C.cards && C.cards.length > 0);
  }
}

Object.keys(containerActions).forEach((key) => {
  const action = containerActions[key];
  if (key.endsWith('Action')) key = key.substr(0, key.length - 6);
  ContainerModule.prototype[key] = function (...p) {
    return this.__env.getDispatch()(action(...p));
  };
});
