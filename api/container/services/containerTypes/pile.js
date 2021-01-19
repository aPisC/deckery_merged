const ContainerBase = require('./containerBase');

class PileContainer extends ContainerBase {
  constructor(container) {
    super(container);
    this.topCard = null;
  }

  async fetchAdditional() {
    await super.fetchAdditional();

    // load Top card data by cards (if available)
    const cards =
      this.container.cards ||
      (await strapi.services.cards.find({
        container: this.container.id,
        _limit: -1,
      }));

    this.cards = cards.map((c) => ({ id: c.id, position: c.position }));
  }

  getTopCard() {
    return this.cards.reduce(
      (a, b) =>
        !a ||
        (a.position === b.position ? a.id - b.id : b.position - a.position) > 0
          ? b
          : a,
      null
    );
  }

  // eslint-disable-next-line
  async pullCards(cards, player, extra) {
    const cardList = [];
    let topCardChanged = false;

    if (typeof cards === 'number')
      cards = { length: cards >= 0 ? cards : this.cards.length };

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      // Get card handler
      const cid =
        card && card.id
          ? this.cards.find((c) => c.id == card.id) && card
          : this.getTopCard();
      if (!cid) continue;

      const C = await strapi.services.cards.getCardHandler(cid.id);
      const c = C && (await C.getData());

      // remove selected card from container
      await C.updateData({ container: null });
      this.cards = this.cards.filter((x) => x.id != c.id);

      // Add selected cards to list
      cardList.push(C);
      topCardChanged = true;
    }

    return [
      cardList,
      async () => {
        if (topCardChanged) await this.notifyTopCard();
      },
    ];
  }

  async pushCards(cards, player, extra) {
    const container = this.container;

    let topCardChanged = true;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const mode =
        (extra && extra.pushMode) ||
        this.getSettings('container.pile-mode').mode;

      const nd = {
        container: container.id,
        position: +new Date(),
      };
      if (mode == 'bottom') nd.position = -nd.position;
      else if (mode === 'random')
        nd.position = Math.floor(Math.random() * 2 * nd.position - nd.position);

      const data = await card.updateData(nd);
      this.cards = [...this.cards, { id: data.id, position: data.position }];

      topCardChanged = true;
    }

    return [
      null,
      () => {
        if (topCardChanged) this.notifyTopCard();
      },
    ];
  }

  async notifyTopCard() {
    const container = this.container;
    const cid = this.getTopCard();
    const CH = cid && (await strapi.services.cards.getCardHandler(cid.id));
    const C = CH && (await CH.getData());

    const players = await strapi.services.player.getPlayersOfGame(
      container.game
    );

    players.forEach((pid) => {
      const cardVisible1 =
        C &&
        this.permissionHandler({
          player: pid,
          game: container.game,
          deck: C.deck,
          card: C.id,
          container: container.id,
          permission: 'SEE_CARD',
        }).status === 'GRANT';

      strapi.services.player.emit(pid, 'CARD_SET_TOP', {
        // create visibility data for cards
        card: C && {
          visible: cardVisible1,
          id: cardVisible1 ? C.id : null,
          deck: C.deck,
          count: this.cards.length > 3 ? 3 : this.cards.length,
        },
        container: container.id,
      });
    });
  }

  async getInitData() {
    const container = this.container;
    const getCardRef = (card) => {
      const isVisible =
        this.permissionHandler({
          card: card.id,
          permission: 'SEE_CARD',
        }).status === 'GRANT';

      return {
        id: isVisible ? card.id : null,
        visible: isVisible,
        deck: card.deck,
        count: this.cards.length > 3 ? 3 : this.cards.length,
      };
    };

    const c = this.getTopCard();
    const card = c && (await strapi.services.cards.getCardHandler(c.id));

    return {
      ...container,
      cards: null,
      top: card && getCardRef(await card.getData()),
    };
  }

  async shuffle() {
    const t = +new Date();
    const getPosition = () => (Math.random() * 2 - 1) * t;

    let tc = null;

    const cards = this.cards;

    for (const card of cards) {
      const ch = await strapi.services.cards.getCardHandler(card.id);
      if ((await ch.getData()).container != this.container.id) continue;
      const p = getPosition();
      if (
        tc == null ||
        tc.position < p ||
        (tc.position == p && tc.id > card.id)
      )
        tc = {
          ...card,
          position: p,
        };
      card.position = p;
      await ch.updateData({ position: p });
      this.keepLoaded(ch.waitForSave());
    }

    this.topCard = tc;
    this.notifyTopCard();

    return true;
  }

  getCardsOrdered() {
    return this.cards.sort((a, b) =>
      a.position === b.position ? a.id - b.id : b.position - a.position
    );
  }

  async broswe(socket, limit) {
    let cards = this.getCardsOrdered();
    cards = cards.map((x) => x.id);
    if (limit) cards = cards.filter((_, i) => i < limit);
    strapi.services.player.emitSocket(socket, 'BROSWE_CONTAINER', {
      cards: cards,
      container: this.container.id,
    });
  }
}

module.exports = PileContainer;
