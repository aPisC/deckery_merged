const prefabs = {
  shuffle: () => ({
    type: 'context',
    name: 'Shuffle',
    icon: 'faRandom',
    code: 'container.shufflePile(container.getContainer())',
    filter: 'container.hasCard()',
  }),
  browse: (type) => {
    const limit = type.split(':')[1];
    const act = {
      type: 'context',
      name: 'Broswe',
      icon: 'faSearch',
      code: 'container.browseContainer(container.getContainer())',
      filter: 'container.hasCard()',
    };
    if (limit === 'prompt') {
      act.code =
        // eslint-disable-next-line max-len
        'ui.openModal({type: "CardAmountSelector", callback: function (v) {container.browseContainer(container.getContainer(), v)}, selectAll: function () {container.browseContainer(container.getContainer())}})';
    } else if (limit) {
      act.name += ` Top ${limit}`;
      act.code = `container.browseContainer(container.getContainer(), ${limit})`;
    }
    return act;
  },
  click: (type, ...p) => {
    const type2 = type.substr(6);
    const type3 = type2.split(':')[0];
    const data = prefabs[type3] && prefabs[type3](type2, ...p);
    if (data) data.type = 'click';
    return data;
  },
  doubleclick: (type, ...p) => {
    const type2 = type.substr(6);
    const type3 = type2.split(':')[0];
    const data = prefabs[type3] && prefabs[type3](type2, ...p);
    if (data) data.type = 'doubleclick';
    return data;
  },
  selectAll: () => ({
    type: 'context',
    name: 'Select all',
    code:
      'container.getContainer().cards.forEach(function(c){card.setCardSelected(c, true)})',
  }),
  deselectAll: () => ({
    type: 'context',
    name: 'Deselect all',
    code:
      'container.getContainer().cards.forEach(function(c){card.setCardSelected(c, false)})',
  }),
  shuffleBack: (type) => {
    const p = type.split(':');
    const target = p[1] || 'pile';
    return {
      type: 'context',
      icon: 'faRedo',
      name: 'Shuffle Back',
      // eslint-disable-next-line max-len
      code: `container.moveCard(-1, container.getContainer(), "${target}"); container.shufflePile("${target}")`,
      filter: 'container.hasCard()',
    };
  },
  discardAll: (type) => {
    const p = type.split(':');
    const target = p[1] || 'discard';

    return {
      type: 'context',
      icon: 'faTrash',
      name: 'DiscardAll',
      // eslint-disable-next-line max-len
      code: `container.moveCard(-1, container.getContainer(), "${target}");`,
      filter: 'container.hasCard()',
    };
  },
  pullAll: (type) => {
    const p = type.split(':');
    const target = p[1] || 'hand';

    return {
      type: 'context',
      icon: 'faArrowDown',
      name: 'Pull All',
      // eslint-disable-next-line max-len
      code: `container.moveCard(-1, container.getContainer(), "${target}");`,
      filter: 'container.hasCard()',
    };
  },
  moveCard: (type) => {
    const p = type.split(':');
    const target = p[1] || 'discard';

    return {
      type: 'context',
      icon: 'faArrowUp',
      name: 'Auto Move Card',
      // eslint-disable-next-line max-len
      code: `container.moveCard([card.getCard()], container.getContainer(), "${target}");`,
      filter: '!!card.getCard()',
    };
  },
};

module.exports = prefabs;
