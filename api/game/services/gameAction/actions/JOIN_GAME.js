module.exports = async function (action) {
  const user = await strapi.plugins['users-permissions'].services.user.fetch({
    id: action.user,
  });
  const game = await strapi.services.game.findOne({ id: action.game });
  if (!user || !game) return null;
  return await strapi.services._game_initialize.joinGame(user, game);
};
