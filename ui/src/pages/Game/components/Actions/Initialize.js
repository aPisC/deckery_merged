import playerModule from './modules/playerModule';
import containerModule from './modules/containerModule';
import cardModule from './modules/cardModule';
import uiModule from './modules/uiModule';
import { openModalAction } from '../../store/actions/ui';

export default (context, getState, getAuth, getDispatch) => ({
  player: new playerModule(context, getState, getAuth, getDispatch),
  container: new containerModule(context, getState, getAuth, getDispatch),
  ui: new uiModule(context, getState, getAuth, getDispatch),
  card: new cardModule(context, getState, getAuth, getDispatch),

  log: console.log,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  parseInt: parseInt,
  parseFloat: parseFloat,
  alert: (message, header) =>
    getDispatch()(
      openModalAction({ type: 'AlertModal', message: message, title: header })
    ),
});
