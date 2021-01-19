'use strict';

/**
 * Lifecycle callbacks for the `stored-schema` model.
 */

async function renderImage(data) {
  const cardGen = new strapi.services.cardgenerator();
  data.cacheImage = await cardGen.getCard(data.image);
}

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      await renderImage(data);
    },
    beforeUpdate: async (params, data) => {
      await renderImage(data);
    },
  },
};
