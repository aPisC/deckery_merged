'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const { identifyAll } = require('../../../utils/identify');

const Imcache = require('@apisc/imcache');

async function loadPlayers(game) {
  let players = [];

  if (game && typeof game === 'object' && game.players)
    players = game.players.map((x) => x.id);
  else if (game && typeof game === 'object' && !game.players) {
    players = await strapi.query('player').find({ game: game.id });
    players = players.map((x) => x.id);
  } else if (game) {
    players = await strapi.query('player').find({ game: game });
    players = players.map((x) => x.id);
  }

  return players;
}

const cache = new Imcache(loadPlayers);
cache.getId = (item) => (item && typeof item === 'object' ? item.id : item);

module.exports = {
  getPlayersOfGame: async function (game) {
    return await cache.get(game);
  },
  emit: function (players, ...params) {
    if (!Array.isArray(players)) {
      players = [players];
    }
    players = identifyAll(players);
    players.forEach((p) => {
      strapi.io
        .of('/game')
        .to(`player-${p}`)
        .emit(...params);
    });
  },

  emitAll: async function (game, ...params) {
    this.emit(await this.getPlayersOfGame(game), ...params);
  },

  emitSocket: function (socketId, ...params) {
    strapi.io
      .of('/game')
      .to(socketId)
      .emit(...params);
  },
};
