async function SHUFFLE_PILE(socket, { container }) {
  strapi.services.gameaction.execute({
    type: 'SHUFFLE_PILE',
    player: socket.player,
    game: socket.gameId,
    container: container,
  });
}
module.exports = SHUFFLE_PILE;
