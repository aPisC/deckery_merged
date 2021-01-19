module.exports = async function brosweContainer(action) {
  const C1 = await strapi.services.container.getContainer(action.container);

  if (!C1 || C1.container.game != action.game) return false;

  const permission = await C1.checkPermission(
    null,
    null,
    action.player,
    'BROSWE'
  );
  if (permission !== 'GRANT') return false;

  if (C1.broswe) return await C1.broswe(action.socket, action.limit);

  return false;
};
