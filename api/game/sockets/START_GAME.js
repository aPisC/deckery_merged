async function START_GAME(socket) {
  const game =
    socket.gameId &&
    (await strapi.services.game.findOne({ id: socket.gameId }));

  if (game.status === 'LOBBY') {
    await strapi.services.gameaction.execute({
      type: 'CHANGE_GAME_STATE',
      state: 'RUNNING',
      game: game.id,
      priority: -100,
    });
  }
}
module.exports = START_GAME;
