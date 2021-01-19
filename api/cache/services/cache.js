'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async get(type, key) {
    return await strapi.services.cache.findOne({ type, key: `${type}_${key}` });
  },
  async set(type, key, data) {
    const e = await strapi.services.cache.get(type, key);
    if (!e)
      return await strapi.services.cache.create({
        type,
        key: `${type}_${key}`,
        data: data,
      });
    return await strapi.services.cache.update({ id: e.id }, { data: data });
  },
};
