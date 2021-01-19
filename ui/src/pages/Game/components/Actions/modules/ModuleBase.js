export default class ModuleBase {
  constructor(context, getState, getAuth, getDispatch) {
    this.__env = {
      context,
      getState,
      getDispatch,
      getAuth,
    };
  }
}
