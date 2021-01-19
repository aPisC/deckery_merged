const emitters = require('../emitters');

async function connection(socket) {
  try {
    strapi.services.profiler.logAction('SOCKET_CONNECT');
    const { token, gameId } = socket.handshake.query;
    strapi.log.debug('Socket connection arrived. Game: ', gameId);

    // Get user for socket connection
    const { id } = await strapi.plugins[
      'users-permissions'
    ].services.jwt.verify(token);
    const user = await strapi.plugins['users-permissions'].services.user.fetch({
      id,
    });

    // Get game for socket connection
    const game = await strapi.services.game.findOne({ id: gameId });
    if (!game) {
      strapi.log.debug(
        'Socket connection terminated (Game not found) ',
        gameId
      );
      throw new Error('Game not found');
    }

    // Check if user is in the players of the game
    let player = await strapi.services.player.findOne({
      game: gameId,
      user: user.id,
    });
    if (
      !player &&
      (game.status === 'LOBBY' || game.status === 'INITIALIZING')
    ) {
      player = await strapi.services.game.joinGame(user, game);
      strapi.log.debug('Player joined to game', gameId, user.username);
      strapi.services.game.emit(gameId, 'PLAYER_JOINED', player);
    } else if (!player) {
      strapi.log.debug(
        'Socket connection terminated (Player not found, and the game is not in lobby mode)',
        gameId,
        user.username
      );
      throw new Error('Player not listed on the game');
    }

    // Store game and user data in socket object
    socket.gameId = gameId;
    socket.user = user;
    socket.player = player.id;

    // Join socket to rooms
    socket.join(`game-${gameId}`);
    socket.join(`player-${player.id}`);

    // initialize socket emitter
    socket.emitters = {};
    Object.keys(emitters).forEach((key) => {
      socket.emitters[key] = async (...p) => {
        const val = await emitters[key].call(socket, ...p);
        if (val != null) socket.emit(key, val);
      };
    });

    strapi.log.debug('Socket connection established', gameId, user.username);
    socket.emitters.initialize();
  } catch (ex) {
    strapi.log.debug(
      'Socket conenction closed on connection attempt',
      ex.message
    );
    socket.disconnect();
  }
}
module.exports = connection;
