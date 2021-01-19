async function MOVE_CARD(socket, { from, to, cards, extra }) {
  strapi.services.gameaction.execute({
    type: 'MOVE_CARD',
    player: socket.player,
    game: socket.gameId,
    cards: cards,
    source: from,
    target: to,
    extra: extra,
  });
}
module.exports = MOVE_CARD;