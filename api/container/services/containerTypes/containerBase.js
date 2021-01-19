class ContainerBase {
  container = null;
  timestamp = 0;
  constructor(container) {
    this.container = container;
    this.timestamp = +new Date();
    this.__lockQueue = [];
  }

  // eslint-disable-next-line
  async pullCards(cards, player) {
    throw new Error('PullCards is not implemented');
  }

  // eslint-disable-next-line
  async pushCards(cards, player) {
    throw new Error('PushCards is not implemented');
  }

  async checkPermission(cards, otherContainerId, player, permission) {
    if (typeof cards === 'number')
      return this.permissionHandler({
        permission: permission,
        container2: otherContainerId,
        player: player,
      }).status;

    if (Array.isArray(cards))
      return cards
        .map(
          (c) =>
            this.permissionHandler({
              card: c.id,
              deck: c.deck,
              container2: otherContainerId,
              permission: permission,
              player: player,
            }).status
        )
        .reduce(strapi.services.permission.permStatusReducer, null);
    if (cards && typeof cards === 'object')
      return this.permissionHandler({
        permission: permission,
        card: cards.id,
        deck: cards.deck,
        container2: otherContainerId,
        player: player,
      }).status;
    if (cards == null) {
      return this.permissionHandler({
        permission: permission,
        container2: otherContainerId,
        player: player,
      }).status;
    }
    return 'REVOKE';
  }

  /**
   * returns the initialization data of the container
   */
  async getInitData() {
    throw new Error('GetInitData is not implemented');
  }

  /**
   * Loads additional info for container
   */
  async fetchAdditional() {
    this.permissionHandler = await strapi.services.permissionhandler.getPermissionHandler(
      {
        game: this.container.game,
        container: this.container.id,
      }
    );
  }

  getSettings(name, def = {}) {
    return this.container.settings.find((x) => x.__component === name) || def;
  }

  /**
   * Creates a container locking request
   * Returns a promise that is resolved when the code can enter locked state
   */

  async lock(lockWith = []) {
    // eslint-disable-next-line
    this.__imcache_keep = true;

    // sorting dependencies
    if (!Array.isArray(lockWith)) lockWith = [lockWith];
    lockWith = lockWith.sort((a, b) => a.container.id - b.container.id);

    // Lock containers with lower id
    for (let i = 0; i < lockWith.length; i++) {
      const e = lockWith[i];
      if (e.container.id < this.container.id) await e.lock();
    }

    // Wait for self lock
    await new Promise((r) => {
      this.__lockQueue.push(r);
      if (this.__lockQueue.length === 1) r();
    });

    // Lock containers with greater id
    for (let i = 0; i < lockWith.length; i++) {
      const e = lockWith[i];
      if (e.container.id > this.container.id) await e.lock();
    }

    return () => {
      lockWith.forEach((e) => e.unlock());
      this.unlock();
    };
  }

  /**
   * Leaves the current locked state
   */

  unlock() {
    this.__lockQueue.shift();
    if (this.__lockQueue.length !== 0) this.__lockQueue[0]();
    // eslint-disable-next-line
    else this.__imcache_keep = false;
  }

  async broswe() {
    throw new Error('Broswe is not implemented');
  }

  keepLoaded(promise) {
    if (!promise) return;
    // eslint-disable-next-line
    this.__imcache_keep = true;
    // eslint-disable-next-line
    const np = (this.__cache_keep_promise = !this.__cache_keep_promise
      ? Promise.all([promise])
      : Promise.all([promise, this.__cache_keep_promise]));
    this.__cache_keep_promise.then(() => {
      if (this.__cache_keep_promise == np) {
        // eslint-disable-next-line
        this.__cache_keep_promise = null;
        // eslint-disable-next-line
        this.__imcache_keep = false;
      }
    });
  }
}

module.exports = ContainerBase;
