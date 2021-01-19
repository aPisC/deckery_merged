module.exports = async function moveCards(action) {
  const C1 = await strapi.services.container.getContainer(action.container);

  if (!C1 || C1.container.game != action.game) return false;

  try {
    const permission = await C1.checkPermission(
      null,
      null,
      action.player,
      'SHUFFLE_PILE'
    );
    if (permission !== 'GRANT') return false;

    if (C1.shuffle) return await C1.shuffle();

    return false;
  } catch (ignored) {}
  return false;
};
