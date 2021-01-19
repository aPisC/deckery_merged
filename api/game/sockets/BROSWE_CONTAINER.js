async function BROSWE_CONTAINER(socket, { container, limit }) {
  strapi.services.gameaction.execute({
    type: 'BROSWE_CONTAINER',
    socket: socket.id,
    game: socket.gameId,
    container: container,
    limit: limit,
  });
}
module.exports = BROSWE_CONTAINER;
