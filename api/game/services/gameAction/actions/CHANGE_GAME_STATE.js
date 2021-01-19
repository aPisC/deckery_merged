module.exports = async function (action) {
  await strapi.services.game.update(
    { id: action.game },
    { status: action.state }
  );
  strapi.services.game.emit(action.game, 'GAME_STATUS_CHANGED', action.state);
};
