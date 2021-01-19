/*
  {
    type = 'MOVE_CARD';
    game: number;
    player: number;
    source: number;
    target: number;
    [cards: array | object;]
    [count: numebr;]
    [extra: any;]
  }
*/

module.exports = async function moveCards(action) {
  const C1 = await strapi.services.container.getContainer(action.source);
  const C2 = await strapi.services.container.getContainer(action.target);

  if (
    !C1 ||
    !C2 ||
    C1.container.game != action.game ||
    C2.container.game != action.game ||
    !action.cards
  )
    return false;

  // Lock containers
  // const unlock = await C1.lock(C2);
  try {
    // Check permission for card pulling
    const pullPermission = await C1.checkPermission(
      action.cards,
      C2.container.id,
      action.player,
      'PULL_CARD'
    );
    if (pullPermission !== 'GRANT') return false;

    // Check permission for card pushing
    const pushPermission = await C2.checkPermission(
      action.cards,
      C1.container.id,
      action.player,
      'PUSH_CARD'
    );
    if (pushPermission !== 'GRANT') return false;
    // move cards
    const [cardList, notify1] = await C1.pullCards(
      action.cards,
      action.player,
      action.extra
    );
    const [result, notify2] = await C2.pushCards(
      cardList,
      action.player,
      action.extra
    );

    // Notify card moving
    await notify1();
    await notify2();

    return result;
  } finally {
    // release locks
    // unlock();
  }
};
