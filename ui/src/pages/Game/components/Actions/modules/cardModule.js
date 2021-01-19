import {
  cardSelector,
  containerCardListSelector,
} from '../../../store/selectors/card';
import * as cardActions from '../../../store/actions/card';
import ModuleBase from './ModuleBase';

export default class CardModule extends ModuleBase {
  getCard(cardId) {
    if (cardId == null) return this.__env.context.card;
    return cardSelector(this.__env.getState(), cardId);
  }
  getContainerCards(containerId) {
    return containerCardListSelector(this.__env.getState(), containerId);
  }
}

Object.keys(cardActions).forEach((key) => {
  const action = cardActions[key];
  if (key.endsWith('Action')) key = key.substr(0, key.length - 6);
  CardModule.prototype[key] = function (...p) {
    return this.__env.getDispatch()(action(...p));
  };
});
