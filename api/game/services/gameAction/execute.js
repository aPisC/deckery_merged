class GameActionExecuter {
  constructor(game) {
    this.game = game;
    this.actionQueue = [];
  }

  execute(action) {
    let resolve = null;
    let reject = null;
    let value = undefined;
    let isResolved = false;
    let isRejected = false;

    // Load default priority
    if (action.priority == null)
      action.priority = strapi.services.gameaction.priorities[action.type];

    strapi.log.debug('Game Action', 'Enqueue action data', action);

    const prom = new Promise((rs, rj) => {
      resolve = rs;
      reject = rj;
      if (isResolved) rs(value);
      if (isRejected) rj(value);
    });

    this.actionQueue.push({
      action: action,
      resolve: (v) => {
        if (resolve) resolve(v);
        value = v;
        isResolved = true;
      },
      reject: (v) => {
        if (reject) reject(v);
        isRejected = true;
        value = v;
      },
      priority: action.priority || 0,
    });

    // eslint-disable-next-line
    this.__imcache_keep = true;

    if (this.actionQueue.length === 1) this._executeNext();

    return prom;
  }

  async _executeNext() {
    const ad = this.actionQueue.reduce(
      (p, c) => (p && p.priority >= c.priority ? p : c),
      null
    );

    if (ad) {
      try {
        const action = ad.action;
        const { type } = action;

        let actionFn =
          type && strapi.services.gameaction.actions[type.toLowerCase()];

        if (!actionFn) {
          // if action is not defined try using wait_promise
          if (action.promise !== undefined)
            actionFn = strapi.services.gameaction.actions.wait_promise;
          else throw new Error(`Action ${type} is undefined`);
        }

        strapi.log.debug('Game Action', 'Executing', action);
        if (type) strapi.services.profiler.logAction(`ACTION_${type}`);
        const result = await actionFn(action);
        strapi.log.debug('Game Action', 'Executed', action);

        if (result !== false && action.then) {
          const thenAction = {
            player: action.player,
            game: this.game,
            ...action.then,
          };
          await this.execute(thenAction);
        }
        this.actionQueue = this.actionQueue.filter((x) => x !== ad);
        ad.resolve(result);
      } catch (ex) {
        this.actionQueue = this.actionQueue.filter((x) => x !== ad);
        strapi.services.profiler.logAction('ACTION_ERROR');
        strapi.services.profiler.logAction(
          `ACTION_ERROR(${ad?.action?.type || ''})`
        );

        ad.reject(ex);
      }
    }

    if (this.actionQueue.length === 0)
      // eslint-disable-next-line
      this.__imcache_keep = false;
    else this._executeNext();
  }
}

// Game executor cache
const Imcache = require('@apisc/imcache');
const cache = new Imcache((game) => {
  const gameId = game && typeof game === 'object' ? game.id : game;

  if (gameId) return new GameActionExecuter(gameId);
});
cache.getId = (item) => (item && typeof item === 'object' ? item.id : item);

// Global execution functon
async function execute(action) {
  try {
    const actionRunner = await cache.get(action.game);
    if (!actionRunner) throw new Error('Game is not defined');

    return await actionRunner.execute(action);
  } catch (ex) {
    strapi.log.error('Game Action', 'Error ', action, ex.stack);
    return false;
  }
}

module.exports = execute;
