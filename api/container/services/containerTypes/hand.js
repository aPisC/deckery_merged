const ContainerBase = require('./containerBase');

class HandContainer extends ContainerBase {
  constructor(container) {
    super(container);
  }

  // Ids of the cards
  cards = [];

  async fetchAdditional() {
    await super.fetchAdditional();

    // Load card list from data or db
    if (this.container.cards) {
      this.cards = this.container.cards.map((c) => c.id);
      delete this.container.cards;
    } else
      this.cards = (
        await strapi.services.cards.find({ container: this.container.id })
      ).map((c) => c.id);
  }

  // eslint-disable-next-line
  async pullCards(cards, player, extra) {
    const cardList = [];
    const cardDatas = [];

    const allCardHandlers = await strapi.services.cards.getCardHandlers(
      this.cards
    );
    const allCardDatas = await Promise.all(
      allCardHandlers.map((c) => c.getData())
    );

    if (typeof cards === 'number')
      cards = { length: cards >= 0 ? cards : this.cards.length };

    // Select cards
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const availableCards =
        // select all card if pulling by amount
        !card
          ? allCardDatas.filter((c) => c.container == this.container.id)
          : // select invisible cards if pulling directly without id
          card.id == null
          ? allCardDatas.filter(
              (c) =>
                (!c.deck || c.deck == card.deck) &&
                c.container == this.container.id &&
                this.permissionHandler({
                  player: player,
                  permission: 'SEE_CARD',
                  card: c.id,
                }).status !== 'GRANT'
            )
          : // select visible cards if pulling directly with id
            allCardDatas.filter(
              (c) =>
                extra?.direct ||
                (c.id == card.id &&
                  c.container == this.container.id &&
                  this.permissionHandler({
                    player: player,
                    permission: 'SEE_CARD',
                    card: c.id,
                  }).status === 'GRANT')
            );

      // Generate selected card id
      const c =
        availableCards.length == 0
          ? null
          : availableCards[Math.floor(Math.random() * availableCards.length)];
      if (c) {
        const C = await strapi.services.cards.getCardHandler(c);

        // Remove selected card from container
        this.cards = this.cards.filter((x) => x !== c.id);
        const cardData = await C.updateData({ container: null });
        cardDatas.push(cardData);
        cardList.push(C);
      }
    }

    return [
      cardList,
      async () => {
        await this.notifyChange('CARD_REMOVED', cardDatas);
      },
    ];
  }

  async notifyChange(mode, cards) {
    const players = await strapi.services.player.getPlayersOfGame(
      this.container.game
    );
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      strapi.services.player.emit(player, mode, {
        cards: cards.map((C) => {
          const cardVisible1 =
            this.permissionHandler({
              player: player,
              card: C.id,
              deck: C.deck,
              permission: 'SEE_CARD',
            }).status === 'GRANT';
          return {
            visible: cardVisible1,
            id: cardVisible1 ? C.id : null,
            deck: C.deck,
          };
        }),
        container: this.container.id,
      });
    }
  }

  // eslint-disable-next-line
  async pushCards(cards, player, extra) {
    // Update container of cards and collect data
    const cardDatas = [];
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const data = await card.updateData({ container: this.container.id });
      this.cards.push(data.id);
      cardDatas.push(data);
    }

    return [null, async () => await this.notifyChange('CARD_ADDED', cardDatas)];
  }

  async getInitData(permissionHandler) {
    const getCardRef = (card) => {
      const isVisible =
        permissionHandler({
          container: card.container,
          card: card.id,
          permission: 'SEE_CARD',
        }).status === 'GRANT';

      return {
        id: isVisible ? card.id : null,
        visible: isVisible,
        deck: card.deck,
      };
    };

    return {
      ...this.container,
      cards: await Promise.all(
        this.cards.map(async (c) => {
          const C = await strapi.services.cards.getCardHandler(c);
          return getCardRef(await C.getData());
        })
      ),
    };
  }
  async broswe(socket, limit) {
    let cards = this.cards;
    if (limit) cards = cards.slice(0, limit);
    strapi.services.player.emitSocket(socket, 'BROSWE_CONTAINER', {
      cards: cards,
      container: this.container.id,
    });
  }
}

module.exports = HandContainer;
