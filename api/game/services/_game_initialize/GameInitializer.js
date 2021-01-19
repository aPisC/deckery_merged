const Boom = require('boom');

const actionPrefabs = require('./actionPrefabs');
const palette = require('./palette');

class GameInitializer {
  static async init(schemaName, user) {
    const db = strapi.connections.default;

    // Check user limits before initialization
    if (user == null)
      throw Boom.forbidden('User is required for game initialization');
    if (
      (await strapi.services.game.count({
        owner: user.id,
        status: 'INITIALIZING',
      })) >= 1
    )
      throw Boom.forbidden(
        'A game initialization is in progress for this user'
      );
    if ((await strapi.services.game.count({ owner: user.id })) >= 10)
      throw Boom.forbidden(
        'You have reached the maximum amount of games. Delete one before initializaton.'
      );

    const initializer = new GameInitializer(schemaName);
    const [game, dataInit] = await initializer.init(user);

    if (!game) return null;

    const transaction = db.transaction(async (trx) => {
      initializer.setTransaction(trx);
      dataInit();
      GameInitializer.join(user, game);
      strapi.services.gameaction.execute({
        type: 'INITIALIZE_GAME_CLOSED',
        game: game.id,
        promise: async () => await transaction,
      });

      strapi.services.gameaction.execute({
        type: 'CHANGE_GAME_STATE',
        state: 'LOBBY',
        game: game.id,
        priority: 530,
      });

      await strapi.services.gameaction.execute({
        type: 'INITIALIZE_GAME_FINISHED',
        game: game.id,
        promise: () => null,
      });
    });

    return game;
  }

  static async join(user, game) {
    const db = strapi.connections.default;
    const initializer = new GameInitializer(null, null);
    initializer.game = game;

    const [player, initPlayerData] = await initializer.join(user);

    strapi.services.gameaction.execute({
      type: 'INITIALIZE_PLAYER_START',
      promise: () => {
        const transaction = db.transaction(async (trx) => {
          initializer.setTransaction(trx);

          initPlayerData();

          strapi.services.gameaction.execute({
            type: 'INITIALIZE_PLAYER_CLOSED',
            game: game.id,
            promise: async () => await transaction,
          });

          await strapi.services.gameaction.execute({
            type: 'INITIALIZE_PLAYER_FINISHED',
            game: game.id,
            promise: () => null,
          });
        });
      },
      game: game.id,
    });

    return player;
  }

  constructor(schemaName, transaction) {
    this.schemaName = schemaName;

    const t = +new Date();
    this.getPosition = () => (Math.random() * 2 - 1) * t;

    this.cardGenerator = new strapi.services.cardgenerator();
    this.setTransaction(transaction);
  }

  setTransaction(transaction) {
    this.transaction = transaction && { transacting: transaction };
  }

  async join(user) {
    const player = await this.createPlayer({
      game: this.game.id,
      user: user.id,
      color: palette[this.game.players.length % palette.length],
    });
    player.name = user.username;
    player.user = user.id;

    const initPlayerData = async () => {
      let containers = null;
      strapi.services.gameaction.execute({
        type: 'INITIALIZE_PLAYER_CONTAINERS',
        game: this.game.id,
        promise: async () =>
          (containers = await this.initContainers(
            this.game.gameSchema.playerContainers,
            player
          )),
      });

      strapi.services.gameaction.execute({
        type: 'SETUP_PLAYER_CONTAINER',
        game: this.game.id,
        promise: async () => {
          // Initialize player containers

          for (
            let i = 0;
            this.game.gameSchema.playerContainers &&
            i < this.game.gameSchema.playerContainers.length;
            i++
          ) {
            const containerSchema = this.game.gameSchema.playerContainers[i];
            const container = containers[i];

            if (containerSchema.initialize) {
              strapi.services.gameaction.execute({
                type: 'SETUP_PLAYER_CONTAINER',
                game: this.game.id,
                promise: async () =>
                  await this._playerContainerInitializer(
                    container,
                    containerSchema.initialize
                  ),
              });
            }
          }
        },
      });
    };

    return [player, initPlayerData];
  }

  async _playerContainerInitializer(container, initialize) {
    initialize = Array.isArray(initialize) ? initialize : [initialize];

    for (const init of initialize) {
      let sourceContainer = await strapi
        .query('container')
        .find({ game: this.game.id }, [], this.transaction);
      sourceContainer = sourceContainer[init.container];
      if (!sourceContainer) continue;
      let sourceCards = await strapi
        .query('cards')
        .find(
          { container: sourceContainer.id, _limit: -1 },
          [],
          this.transaction
        );

      const selectedCards = [];
      for (let i = 0; i < init.count && sourceCards.length > 0; i++) {
        const card =
          sourceCards[Math.floor(Math.random() * sourceCards.length)];
        sourceCards = sourceCards.filter((x) => x.id !== card.id);
        selectedCards.push(card.id);
      }
      await Promise.all(
        selectedCards.map((card) =>
          strapi
            .query('cards')
            .update({ id: card }, { container: container.id }, this.transaction)
        )
      );
    }
  }

  async init(user) {
    const _schema = await this.getStoredSchema(this.schemaName);
    if (!_schema) return [];
    const schema = _schema.gameSchema;

    schema.name = schema.name || _schema.name;

    this.game = await this.initGame(schema, user);

    const initGameData = async () => {
      // await deck initialization
      strapi.services.gameaction.execute({
        type: 'INITIALIZE_DECKS',
        game: this.game.id,
        promise: async () => (this.game.decks = await this.initDecks()),
      });

      // await game container init
      strapi.services.gameaction.execute({
        type: 'INITIALIZE_GAME_CONTAINERS',
        game: this.game.id,
        promise: async () =>
          (this.game.containers = await this.initContainers(
            this.game.gameSchema.gameContainers
          )),
      });
      strapi.services.gameaction.execute({
        type: 'INITIALIZE_GAME_CARD',
        game: this.game.id,
        promise: async () => this.initCards(),
      });
    };

    return [this.game, initGameData];
  }

  async initGame(schema, user) {
    strapi.services.profiler.logAction('INITIALIZE_GAME');
    // Create game
    const game = await this.createGame({
      gameSchema: schema,
      status: 'INITIALIZING',
      owner: user.id,
      name: typeof schema.name === 'string' ? schema.name : 'UNKNOWN',
      ownerName: user.username,
    });

    if (schema.permissions) {
      await Promise.all(
        schema.permissions.map((p) =>
          this.createPermission({
            permission: p.permission,
            status: p.status,
            game: game.id,
            isBasePerm: false,
          })
        )
      );
    }
    return game;
  }

  async initDecks() {
    const dSchemas = this.game.gameSchema.decks;

    // Process implemented templates
    for (let did = 0; did < dSchemas.length; did++) {
      const deckSchema = dSchemas[did];

      if (deckSchema.implements) {
        if (!Array.isArray(deckSchema.implements))
          deckSchema.implements = [deckSchema.implements];

        for (let i = 0; i < deckSchema.implements.length; i++) {
          const template = await this.getDeckTemplate(deckSchema.implements[i]);
          if (i === 0 && !deckSchema.background)
            deckSchema.background = `@${template.name}`;

          deckSchema.cards = [
            ...template.cards.map((cd) => ({
              ...cd,
              background: `@${template.name}.@${cd.id}.background`,
            })),
            ...(deckSchema.cards || []),
          ];
        }
        delete deckSchema.implements;
      }

      deckSchema.background = await this.cardGenerator.templateProcessor(
        deckSchema.background,
        {}
      );
      deckSchema.background =
        (deckSchema.background && deckSchema.background.background) ||
        deckSchema.background;
    }

    // Create decks
    const decks = [];
    for (const d of dSchemas) {
      decks.push(
        await this.createDeck({
          ...d,
          game: this.game.id,
          container: undefined,
          cards: undefined,
        })
      );
    }

    return decks;
  }

  async initContainers(containersSchema, player = null) {
    const containers = [];
    if (!containersSchema) return [];
    for (const c of containersSchema) {
      const container = await this.createContainer({
        ...c,
        actions:
          (c.actions &&
            c.actions
              .map((a) => {
                if (typeof a !== 'string') return a;
                const type = a.split(':')[0];
                if (typeof actionPrefabs[type] === 'function')
                  return actionPrefabs[type](a);
                return actionPrefabs[type];
              })
              .filter((x) => x)) ||
          [],
        game: this.game.id,
        player: player && player.id,
        permissions: undefined,
      });

      if (c.permissions) {
        await Promise.all(
          c.permissions.map((p) =>
            this.createPermission({
              permission: p.permission,
              status: p.status,
              game: this.game.id,
              container: container.id,
              deck: p.deck != null ? this.game.decks[p.deck] : null,
              player: p.self && player ? player : null,
              isBasePerm: false,
            })
          )
        );
      }
      containers.push(container);
    }

    return containers;
  }

  async initCards() {
    for (let did = 0; did < this.game.decks.length; did++) {
      const deck = this.game.decks[did];
      const deckSchema = this.game.gameSchema.decks[did];
      const container = this.game.containers.filter((x) => x.player == null)[
        deckSchema.container
      ];
      if (!container) continue;
      for (const cardSchema of deckSchema.cards || []) {
        const cardGen = await this.cardGenerator.getCard(cardSchema);

        for (let i = 0; i < (cardGen.count || 1); i++) {
          strapi.services.gameaction.execute({
            type: 'INITIALIZE_GAME_CARD',
            game: this.game.id,
            promise: async () =>
              this.createCard({
                ...cardGen,
                container: container.id,
                game: deck.game.id,
                deck: deck.id,
                position: this.getPosition(),
              }),
          });
        }
      }
    }
  }

  async createCard(card) {
    return await strapi.query('cards').create(card, this.transaction);
  }

  async createPermission(perm) {
    perm.priority = strapi.services.permission.getPriority(perm);
    return await strapi.query('permission').create(perm, this.transaction);
  }

  async createContainer(cont) {
    return await strapi.query('container').create(cont, this.transaction);
  }

  async createGame(game) {
    return await strapi.query('game').create(game /* , this.transaction */);
  }

  async createDeck(deck) {
    return await strapi.query('deck').create(deck, this.transaction);
  }

  async createPlayer(player) {
    return await strapi.query('player').create(player /* this.transaction*/);
  }

  async getStoredSchema(schemaName) {
    return await strapi
      .query('stored-schema')
      .findOne({ key: schemaName }, [], this.transaction);
  }

  async getDeckTemplate(name) {
    return await this.imageResolver.getDeckTemplate(name);
  }
}

module.exports = GameInitializer;
