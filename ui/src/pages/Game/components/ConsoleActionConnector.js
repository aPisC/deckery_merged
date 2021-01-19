import { useContext, useEffect } from 'react';
import { DispatchContext } from '../contexts';

import * as cardActions from '../store/actions/card';
import * as containerActions from '../store/actions/container';
import * as gameActions from '../store/actions/game';
import * as playerActions from '../store/actions/player';
import * as uiActions from '../store/actions/ui';
import { ActionsContext } from './Actions/ActionsBackend';

const actionFiles = [
  cardActions,
  containerActions,
  gameActions,
  playerActions,
  uiActions,
];

const actionFns = {};

for (const actionFile of actionFiles) {
  Object.keys(actionFile).forEach((an) => {
    const af = actionFile[an];
    actionFns[an] = (dispatch, ...p) => dispatch(af(...p));
  });
}

export default function ConsoleActionConnector() {
  const dispatch = useContext(DispatchContext);
  const actions = useContext(ActionsContext);
  useEffect(() => {
    const module = {};
    Object.keys(actionFns).forEach((n) => {
      module[n] = (...p) => actionFns[n](dispatch, ...p);
    });
    window.dispatch = module;
    window.actions = actions;
    return () => {
      window.dispatch = {};
      window.actions = {};
    };
  }, [dispatch, actions]);
  return null;
}
