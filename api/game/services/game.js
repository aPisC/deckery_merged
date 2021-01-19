'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const { identify } = require('../../../utils/identify');

module.exports = {
  initFromSchema: require('./_game_initialize').init,
  joinGame: async (user, game) => {
    return await strapi.services.gameaction.execute({
      type: 'JOIN_GAME',
      user: user.id,
      game: game.id,
      priority: 900,
    });
  },
  emit: (gameId, ...p) => {
    gameId = identify(gameId);
    strapi.io
      .of('/game')
      .to(`game-${gameId}`)
      .emit(...p);
  },
};
