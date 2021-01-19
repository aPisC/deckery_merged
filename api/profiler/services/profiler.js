'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

const dTime = 60000;

const cache = new (require('@apisc/imcache'))(
  async (id) => ({ __id: id }),
  dTime,
  dTime,
  false
);
cache.onRemove = async function (data) {
  const ts = new Date(data.__id * dTime);
  delete data.__id;
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (total)
    await strapi.services.profiler.create({
      data: data,
      timestamp: ts,
      total: total,
    });
};

module.exports = {
  async logAction(actionName) {
    const actions = await cache.get(Math.floor(+new Date() / dTime));
    actions[actionName] = (actions[actionName] || 0) + 1;
  },
};
