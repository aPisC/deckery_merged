'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */
const { identifyAll, deidentify } = require('../../../utils/identify');

/**
 * Returns the permission with the hightest priority for the searched item.
 * @param {object} params Identifiers of the searched permission. (player, card, container, container2)
 */
async function getPermission(params) {
  // Load player object and the game identifier
  let { player } = params;
  player = await deidentify(player, 'player');
  const game = player.game;

  // Load card object and the deck identifier
  let { card } = params;
  card = await deidentify(card, 'card');
  const deck = card.deck;

  // Read the ids of containers
  const { container, container2 } = identifyAll(params);

  // Fetch and return permission
  const perm = await strapi
    .query('permission')
    .model.query((qb) => {
      qb.where(() => this.where('game', game).orWhereNull('game'))
        .andWhere(() => this.where('player', player.id).orWhereNull('player'))
        .andWhere(() =>
          this.where('container', container).orWhereNull('container')
        )
        .andWhere(() =>
          this.where('container2', container2).orWhereNull('container2')
        )
        .andWhere(() => this.where('deck', deck).orWhereNull('deck'))
        .andWhere(() => this.where('card', card.id).orWhereNull('card'))
        .andWhere(() =>
          this.where('permission', params.permission).orWhereNull('permission')
        )
        .orderBy('priority', 'desc');
    })
    .fetchOne();
  return perm;
}

/**
 *
 * @param {object} params Identifiers if the permissions to fetch (game, deck, player, card, container, container2)
 * @returns {function} A function that returns the permission with the hightest priority for the searched item.
 */
async function getPermissionHandler(params) {
  const p = identifyAll(params);
  const qm = Object.keys(p)
    .map((key) => ({ key: key, value: p[key] }))
    .filter((x) => x.value != null);

  const perms = await strapi
    .query('permission')
    .model.query((qb) => {
      for (let i = 0; i < qm.length; i++) {
        qb = qb[i === 0 ? 'where' : 'andWhere'](function () {
          const key = qm[i].key;
          const value = qm[i].value;

          let qb = this.whereNull(key);

          if (Array.isArray(value))
            value.forEach((v) => {
              if (v != null) qb = qb.orWhere(key, v);
            });
          else qb = qb.orWhere(key, value);
        });
      }
      qb.orderBy('priority', 'desc');
    })
    .fetchAll({ withRelated: [] })
    .then((r) => r.toJSON());

  const getPermission = (params) => {
    const p2 = identifyAll(params);
    let _ps = perms;
    ['permission', 'container', 'container2', 'player', 'deck', 'card'].forEach(
      (key) =>
        (_ps = _ps.filter(
          (perm) =>
            perm[key] == null ||
            perm[key] == p2[key] ||
            (p[key] && !Array.isArray(p[key]))
        ))
    );
    return _ps[0] || { priority: -1, status: 'REVOKE' };
  };

  return getPermission;
}

module.exports = {
  getPermission,
  getPermissionHandler,
};
