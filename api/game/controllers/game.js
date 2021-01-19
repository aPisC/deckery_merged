'use strict';

const { sanitizeEntity } = require('strapi-utils');
const Boom = require('boom');

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async initFromSchema(ctx) {
    const { schemaName } = ctx.params;
    return await strapi.services.game.initFromSchema(
      schemaName,
      ctx.state.user
    );
  },

  async getAvailable(ctx) {
    const user = ctx.state.user;
    if (!user) return null;
    const entries = await strapi.services.game.find(
      {
        _or: [
          {
            status: ['LOBBY', 'INITIALIZING'],
          },
          {
            owner: user.id,
          },
        ],
      },
      []
    );
    return entries;
  },

  async find(ctx) {
    const entities = await strapi.services.game.find(ctx.query, []);

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.restaurant })
    );
  },
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.restaurant.findOne({ id }, [
      'players',
      'decks',
    ]);
    return sanitizeEntity(entity, { model: strapi.models.restaurant });
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    const entry = await strapi.services.game.findOne({ id: id }, []);
    if (!entry || !user || user.id != entry.owner)
      throw Boom.unauthorized('You do not have permission to delete this game');

    const entity = await strapi.services.game.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.game });
  },
};
