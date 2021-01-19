import holderReducer from './containerReducer';
import gameReducer from './gameReducer';
import playerReducer from './playerReducer';
import cardReducer from './cardReducer';
import uiReducer from './uiReducer';

const subReducersObjects = [
  holderReducer,
  gameReducer,
  playerReducer,
  cardReducer,
  uiReducer,
  // add more subreducers here...
];

// Generate reducer object
const subReducers = {};
subReducersObjects.forEach((sr) => {
  Object.keys(sr).forEach((k) => (subReducers[k] = sr[k]));
});

const mergedReducer = (ctx) => {
  const action =
    typeof ctx.action === 'function'
      ? ctx.action(ctx.state, ctx.auth)
      : ctx.action;

  if (action.isSocket) {
    if (ctx.action.__socketActionHandled) return ctx.state;
    ctx.action.__socketActionHandled = true;
    ctx.emit(action.type, action);
    return ctx.state;
  }

  console.debug('Reducer event: ', action.type, action, ctx.state);
  if (subReducers[action.type]) {
    const ret = subReducers[action.type]({ ...ctx, action: action });
    if (ret === undefined) return ctx.state;
    return ret;
  }
  console.warn('Unhandled reducer event: ', ctx.action.type);
  return ctx.state;
};

export const reducer = (ctx) => {
  let isFinished = false;
  const actionQueue = [];
  let state = ctx.state;

  const dispatch = (action) => {
    isFinished ? ctx.dispatch(action) : actionQueue.push(action);
  };

  state = mergedReducer({ ...ctx, dispatch });

  while (actionQueue.length !== 0) {
    const action = actionQueue.shift();
    state = reducer({ ...ctx, action, state, dispatch });
  }

  isFinished = true;
  return state;
};
