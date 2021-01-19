const { sanitizeEntity } = require('strapi-utils');

const GameInitializer = require('./_game_initialize/GameInitializer');

module.exports = {
  init: async (...p) =>
    sanitizeEntity(await GameInitializer.init(...p), {
      model: strapi.models.game,
    }),
  joinGame: (...p) => GameInitializer.join(...p),
};
