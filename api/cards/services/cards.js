'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */
class CardUpdateManager {
  data = {};
  timeout = null;

  constructor(data) {
    this.data = data;
  }

  async _saveData() {
    while (true) {
      try {
        await strapi.services.gameaction.execute({
          type: 'UPDATE_CARD_DATA',
          priority: -100,
          game: this.data.game,
          card: this.data.id,
          promise: async () => {
            this.changed = false;
            await strapi.services.cards.update({ id: this.data.id }, this.data);
          },
        });
        break;
      } catch (error) {
        console.error('Error on saving card data: ', this.data, error);
      }
    }
    if (this.changed) {
      this.timeout = setTimeout(() => this._saveData(), 0);
    } else {
      this.timeout = null;
      // eslint-disable-next-line
      this.__imcache_keep = false;
      if (this.saveCallback) this.saveCallback();
      this.saveCallback = null;
    }
  }

  async updateData(data) {
    const handler = await cache.get(this.data.id);
    return handler._updateData(data);
  }

  async getData() {
    const handler = await cache.get(this.data.id);
    return handler._getData();
  }

  _updateData(data) {
    // update data
    if (data && typeof data === 'object') {
      Object.keys(data).forEach((k) => (this.data[k] = data[k]));
    } else {
      this.data = data;
    }

    if (this.timeout == null)
      this.timeout = setTimeout(() => this._saveData(), 0);

    this.changed = true;
    // eslint-disable-next-line
    this.__imcache_keep = true;
    return this.data;
  }

  _getData() {
    return this.data;
  }

  async waitForSave() {
    if (this.timeout == null) return;
    await new Promise((r) => {
      if (this.timeout == null) r();
      else {
        const lcb = this.saveCallback;
        this.saveCallback = () => {
          if (lcb) lcb();
          r();
        };
      }
    });
  }
}

// Create cache for card updaters
const cache = new (require('@apisc/imcache'))(async (card) => {
  const id = card && typeof card === 'object' ? card.id : card;

  if (typeof card !== 'object')
    strapi.services.profiler.logAction('DB_LOAD_CARD');

  const data =
    typeof card === 'object'
      ? card
      : await strapi.services.cards.findOne({ id: id }, []);
  return new CardUpdateManager(data);
});
cache.getId = (item) => (item && typeof item === 'object' ? item.id : item);
cache.checkTime = 2000; // Scan after 2 sec
cache.removeTime = -1; // remove unused card immediately

module.exports = {
  getCardHandler: (...p) => cache.get(...p),
  getCardHandlers: (...p) => cache.getAll(...p),
};
