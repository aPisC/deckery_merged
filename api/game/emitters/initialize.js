const objectify = require('../../../utils/objectify');

async function initialize() {
  const game = await strapi.services.game.findOne(
    { id: this.gameId },
    ['containers',
      'containers.cards',
      'containers.actions',
      'containers.settings',
      'players',
      'players.user',
      'cards',
      'decks'
    ]
  );

  game.players.forEach(p => {
    p.name = p.user.username;
    p.user = p.user.id;
  });

  const permH = await strapi.services.permissionhandler.getPermissionHandler({
    player: this.player,
    game: this.gameId,
    container: game.containers.map(c => c.id),
  });

  const gameIsRunning = game.status === 'RUNNING';

  const g = {
    containers: gameIsRunning && objectify(
      await Promise.all(game.containers.map(c => strapi.services.container.getInitData(c, permH)))
    ),
    cards: gameIsRunning && objectify(game.cards.map(c => ({ ...c, container: undefined }))),
    players: objectify(game.players),
    decks: gameIsRunning && objectify(game.decks),
    game: {
      status: game.status,
    }
  };

  return g;
}
module.exports = initialize;