import { StateContext } from '../../contexts';

/**
 * Returns a card by an id
 * @param {object} state State of the game
 * @param {int} cardId Id of the card
 */
export function cardSelector(state, cardId) {
  if (cardId && typeof cardId === 'object') cardId = cardId.id;
  return state.cards[cardId];
}
cardSelector.contexts = [StateContext];
cardSelector.deps = (state, cardId) => [
  cardId && cardId.id,
  cardId && cardId.deck,
  state.cards &&
    cardId &&
    state.cards[cardId && cardId === 'object' ? cardId.id : cardId],
];

/**
 * Returns a card by an id
 * @param {object} state State of the game
 * @param {int} cardId Id of the card
 */
export function cardBackSelector(state, card) {
  const deck = card && state.decks[card.deck];
  return { background: deck && deck.background };
}
cardBackSelector.contexts = [StateContext];
cardBackSelector.deps = (state, card) => [
  card && state.decks && state.decks[card.deck],
];

/**
 * returns all cards of the given container
 * @param {object} state State of the game
 * @param {int} containerId Id of the container
 */
export function containerCardListSelector(state, containerId) {
  return state.containers[containerId].cards.map((c) => cardSelector(state, c));
}
containerCardListSelector.contexts = [StateContext];
containerCardListSelector.deps = (state, containerId) => [
  containerId,
  state.containers[containerId].cards,
  state.cards,
];

/**
 * returns all cards of the given container
 * @param {object} state State of the game
 * @param {int} containerId Id of the container
 */
export function containerSelectedCardListSelector(state, containerId) {
  return state.containers[containerId].cards?.filter((c) =>
    isCardSelectedSelector(state, c)
  );
}
containerSelectedCardListSelector.contexts = [StateContext];
containerSelectedCardListSelector.deps = (state, containerId) => [
  containerId,
  state.containers[containerId].cards,
  state.cards,
  state.selectedCards,
];
/**
 * Returns all available card in the given deck
 * @param {object} state State of the game
 * @param {int} deckId Id of the deck
 */
export function deckCardListSelector(state, deckId) {
  return Object.values(state.cards).filter((c) => c.deck === deckId);
}
deckCardListSelector.contexts = [StateContext];
deckCardListSelector.deps = (state, deckId) => [state.cards, deckId];

export function isCardSelectedSelector(state, card) {
  const ccid =
    typeof card === 'object' ? `${card.id || 0}-${card._id || 0}` : card;
  return !!state.selectedCards[ccid];
}
isCardSelectedSelector.contexts = [StateContext];
isCardSelectedSelector.deps = (state, card) => [state.selectedCards, card];
