'use strict';

const { sanitizeEntity } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const service = strapi.services['stored-schema'];
    const imgRes = new strapi.services.cardimageresolver();
    const cardGen = new strapi.services.cardgenerator(imgRes);

    let entities;
    if (ctx.query._q) {
      entities = await service.search(ctx.query, []);
    } else {
      entities = await service.find(ctx.query, []);
    }

    return (
      await Promise.all(
        entities.map(async (entity) => ({
          description: entity.description,
          key: entity.key,
          name: entity.name,
          card: entity.cacheImage,
          gameSchema: undefined,
        }))
      )
    ).map((entity) =>
      sanitizeEntity(entity, { model: strapi.models['stored-schema'] })
    );
  },
};
