import * as uiActions from '../../../store/actions/ui';
import ModuleBase from './ModuleBase';

export default class UiModule extends ModuleBase {}

Object.keys(uiActions).forEach((key) => {
  const action = uiActions[key];
  if (key.endsWith('Action')) key = key.substr(0, key.length - 6);
  UiModule.prototype[key] = function (...p) {
    return this.__env.getDispatch()(action(...p));
  };
});
