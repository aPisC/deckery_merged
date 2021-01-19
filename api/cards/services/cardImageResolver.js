class CardImageResolver {
  constructor(transaction) {
    this.transacting = transaction && { transacting: transaction };
    this.deckTemplateCache = {};
  }

  static async getImageUrl(url) {
    const resolver = new CardImageResolver();
    return await resolver.getImageUrl(url);
  }

  async getImageUrl(url) {
    if (url?.startsWith('@')) {
      const nurl = url.substr(1).split('.');

      const dt = await this.getDeckTemplate(nurl[0]);
      if (!dt) return url;

      const getBg = (ct) => {
        if (ct && typeof ct.background === 'string') return ct.background;
        else if (ct && ct.background && typeof ct.background === 'object')
          if (ct.__component === 'deck-template.upload-card')
            return (strapi.config.server.url || '') + ct.background.url;
          else if (ct.__component) return ct.background;
        return ct;
      };

      if (nurl.length === 1) return getBg(dt.background[0]) || url;
      else if (nurl.length === 2) {
        return (
          getBg(
            dt.cards.find(
              (x) => (x.identifier || '') === nurl[1] || nurl[1] === `@${x.id}`
            )
          ) || url
        );
      }
    }
    return url;
  }

  async getDeckTemplate(name) {
    if (this.deckTemplateCache[name] == null) {
      this.deckTemplateCache[name] = await strapi.services[
        'deck-template'
      ].findOne({
        name: name,
      });
      if (!this.deckTemplateCache[name]) this.deckTemplateCache[name] = false;
    }
    return this.deckTemplateCache[name];
  }

  setTransaction(transaction) {
    this.transacting = { transacting: transaction };
  }

  async getCardTemplate(name) {
    const np = name.split('.');
    const dt = await this.getDeckTemplate(np[0]);

    if (!dt) return null;

    const ct = dt.templates.find((x) => x.identifier == np[1]);
    return ct && ct.template;
  }
}

module.exports = CardImageResolver;
