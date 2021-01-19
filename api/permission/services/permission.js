'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async create(data) {
    // drop rule if has container2 but no container
    if (data.container2 && !data.container) return;

    // Calculate the priority if not exits
    if (!data.priority) {
      data.priority = this.getPriority(data);
    }

    const entry = await strapi.query('permission').create(data);
    return entry;
  },

  getPriority(data) {
    let p = 0;
    if (data.game) p += 1;
    if (data.player) p += 2;
    if (data.container) p += 4;
    if (data.container2) p += 8;
    if (data.deck) p += 16;
    if (data.card) p += 32;
    if (data.temporary) p += 64;
    return p;
  },

  permStatusReducer: (last, curr) => {
    if (!last) last = 'GRANT';
    if (curr === 'INTERACTION' && last === 'GRANT') return curr;
    if (curr == 'REVOKE') return curr;
    return last;
  },
};
