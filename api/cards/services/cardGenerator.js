class CardGenerator {
  constructor() {
    this.deckTemplateCache = {};
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

  async getCardTemplate(name) {
    const np = name.split('.');
    const dt = await this.getDeckTemplate(np[0]);

    if (!dt) return null;

    const ct = dt.templates.find((x) => x.identifier == np[1]);
    return ct && { updated_at: dt.updated_at, ...ct };
  }

  async useDefaultTemplate(name) {
    const template = await this.getCardTemplate(name);

    const optimized = await strapi.services.cache.get('cardgen_dt', name);
    if (!optimized || optimized.updated_at < template.updated_at) {
      const data = this.sanitizeCard(
        await this.templateProcessor({ template: name }, {}, {})
      );

      if (data) await strapi.services.cache.set('cardgen_dt', name, data);
      return data;
    }

    return optimized.data;
  }

  async useDefaultCard(name) {
    const p = name.split('.');

    const dt = await this.getDeckTemplate(p[0]);
    if (!dt) return;

    const cardComp =
      p.length == 1
        ? dt.background[0]
        : dt.cards.find(
            (x) => (x.identifier || '') === p[1] || p[1] === `@${x.id}`
          );

    if (cardComp && cardComp.__component == 'deck-template.upload-card')
      return this.sanitizeCard({
        ...cardComp,
        background: {
          element: 'image',
          src: (strapi.config.server.url || '') + cardComp.background.url,
        },
      });

    if (cardComp && cardComp.__component == 'deck-template.link-card')
      return this.sanitizeCard({
        ...cardComp,
        background: {
          element: 'image',
          src: cardComp.background,
        },
      });

    if (cardComp && cardComp.__component == 'deck-template.render-card')
      return this.sanitizeCard({
        ...cardComp,
        background: await this.templateProcessor(cardComp.background, {}, {}),
      });
    return this.sanitizeCard(cardComp);
  }

  sanitizeCard(card) {
    if (!card || typeof card != 'object') return card;
    const c = {};
    ['id', 'name', 'background', 'border', 'count'].forEach((key) => {
      if (card[key] != null) c[key] = card[key];
    });
    return c;
  }

  async resolveVariable(name, vars) {
    if (name && typeof name == 'string') {
      if (name.startsWith('$')) {
        const p = name.substr(1).split('||');
        return vars[p[0]] || (await this.resolveVariable(p[1], vars));
      }
      if (name.startsWith('@@')) {
        const p = name.substr(2).split('.');
        let card = await this.useDefaultTemplate(name.substr(2));
        card = card && card.background;
        for (let i = 2; i < p.length && card; i++) card = card && card[p[i]];
        return card;
      }
      if (name.startsWith('@')) {
        const p = name.substr(1).split('.');
        let card = await this.useDefaultCard(name.substr(1));
        card = card && card.background;
        for (let i = 2; i < p.length && card; i++) card = card && card[p[i]];
        return card;
      }
    }
    return name;
  }

  async resolveObjectVariables(content, vars) {
    if (!content || typeof content != 'object' || Array.isArray(content))
      return content;
    let c = {};
    for (const key in content) {
      c = await this.resolveMember(key, content[key], c, vars);
    }
    return c;
  }

  async resolveMember(key, value, data, vars) {
    if (key === '$extend') {
      if (!Array.isArray(value)) value = [value];
      for (const v of value) {
        const e = await this.resolveVariable(v, vars);
        if (typeof e === 'object' && e) data = { ...data, ...e };
      }
    } else data[key] = await this.resolveVariable(value, vars);

    return data;
  }

  async templateProcessor(content, vars, usedTemplates = {}) {
    if (typeof content !== 'object' || !content)
      return this.resolveVariable(content, vars);

    content = await this.resolveObjectVariables(content, vars);

    if (Array.isArray(content))
      return await Promise.all(
        content.map((c) => this.templateProcessor(c, vars, usedTemplates))
      );

    if (content.template && typeof content.template == 'string') {
      if (usedTemplates[content.template])
        throw new Error('Template resolving found recursion');
      const template = await this.getCardTemplate(content.template);
      const p = content.template.split('.');

      let data = await this.templateProcessor(
        template.background,
        { ...vars, ...content },
        {
          ...usedTemplates,
          [content.template]: true,
        }
      );
      for (let i = 2; i < p.length && data; i++) data = data && data[p[i]];
      return data;
    }

    let c = {};
    for (const key in content) {
      const val = content[key];
      if (Array.isArray(val))
        c[key] = await Promise.all(
          val.map((v) => this.templateProcessor(v, vars, usedTemplates))
        );
      else if (val && typeof val == 'object')
        c[key] = await this.templateProcessor(val, vars, usedTemplates);
      else c = await this.resolveMember(key, content[key], c, vars);
    }
    return c;
  }

  async getCard(data) {
    if (data && typeof data == 'string') {
      const name = data;
      if (name.startsWith('@@')) {
        const card = await this.useDefaultTemplate(name.substr(2));
        return card;
      }
      if (name.startsWith('@')) {
        const card = await this.useDefaultCard(name.substr(1));
        return card;
      }
      if (data.startsWith('http://') || data.startsWith('https://')) {
        return { background: { element: 'image', src: data } };
      }
    }

    const card = await this.templateProcessor(data);
    return this.sanitizeCard(card);
  }
}

module.exports = CardGenerator;
