const initialize = require('./initialize');

async function m2() {
  return 'helloworld';
}

async function cardRemoved(container, card) {
  const players = await strapi.services.player.find({ game: this.gameId });
  players.forEach(p =>
    strapi.io.of('/game').to(`player-${p.id}`)
      .emit('CARD_REMOVED', { card: card.id, container: container.id })
  );
}
async function cardAdded(container, card) {
  const players = await strapi.services.player.find({ game: this.gameId });
  players.forEach(p =>
    strapi.io.of('/game').to(`player-${p.id}`)
      .emit('CARD_ADDED', { card: card.id, container: container.id })
  );
}
module.exports = { initialize, m2, cardRemoved, cardAdded };