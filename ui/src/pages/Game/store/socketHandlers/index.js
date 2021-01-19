import * as gameHandlers from './game';
import * as cardHandlers from './card';
const subHandlersObjects = [
  gameHandlers,
  cardHandlers,
  // add more handler objects here...
];

// Generate reducer object
const subHandlers = {};
subHandlersObjects.forEach((sr) => {
  Object.keys(sr).forEach((k) => (subHandlers[k] = sr[k]));
});

function socketHandler(params) {
  const event = params.event;
  console.debug(
    'Socket recieve:',
    event,
    ...(Array.isArray(params.params) ? params.params : [params.params])
  );
  const handler = subHandlers[event];
  if (typeof handler === 'function') {
    handler.call(this, params);
  }
}
export default socketHandler;
