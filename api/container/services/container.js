'use strict';
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */
const Imcache = require('@apisc/imcache');

async function loadContainer(containerId) {
  // Load container
  if (typeof containerId !== 'object')
    strapi.services.profiler.logAction('DB_LOAD_CONTAINER');

  const containerData =
    typeof containerId === 'object'
      ? containerId
      : await strapi.services.container.findOne({ id: containerId }, [
          'settings',
          'cards',
        ]);

  if (!containerData) throw new Error(`Container not found: ${containerId}`);
  const wrapperType = strapi.services.containertypes[containerData.type];
  if (!wrapperType)
    throw new Error(
      `There is no handler class for this container type: ${containerData.type}`
    );

  const container = new wrapperType(containerData);
  await container.fetchAdditional();

  return container;
}

const cache = new Imcache(loadContainer);
cache.getId = (item) => (item && typeof item === 'object' ? item.id : item);

module.exports = {
  getContainer: (...p) => cache.get(...p),
  pullCards: async (container, cards, permissionHandler, player) => {
    const c = await cache.get(container);
    if (c) return await c.pullCards(cards, permissionHandler, player);

    // return value: [cards, releaseCardsLock]
    return [[], () => {}];
  },

  pushCards: async (container, cards, permissionHandler) => {
    const c = await cache.get(container);
    if (c) return await c.pushCards(cards, permissionHandler);

    // return value: [cards, releaseCardsLock]
    return false;
  },

  getInitData: async (container, permissionHandler) => {
    const c = await cache.get(container);
    if (c) return await c.getInitData(permissionHandler);
    return container;
  },
};
