import {
  insertedCardAction,
  removedCardAction,
  setTopCardAction,
} from '../actions/container';
import { containerSelector } from '../selectors/container';
import localId from '../../../../core/localId';
import { isCardSelectedSelector } from '../selectors/card';
import { setCardSelectedAction } from '../actions/card';

export function CARD_REMOVED({ dispatch, state, params: [action] }) {
  const { container, cards } = action;
  const cardsToRemove = [];
  cards.forEach((card) => {
    if (card.id == null) {
      const co = containerSelector(state, container);
      const ca = co.cards
        .sort(
          (c2, c1) =>
            (isCardSelectedSelector(state, c1) ? 1 : -1) -
            (isCardSelectedSelector(state, c2) ? 1 : -1)
        )
        .find(
          (c) =>
            c.id == null && c.deck === card.deck && !cardsToRemove.includes(c)
        );
      card = ca;
      if (!card) return;
    }
    cardsToRemove.push(card);
  });
  cardsToRemove.forEach((card) => {
    if (!card) return;
    if (isCardSelectedSelector(state, card))
      dispatch(setCardSelectedAction(card, false));
    dispatch(removedCardAction(card, container));
  });
}

export function CARD_ADDED({ dispatch, params: [action], state }) {
  const { container, cards } = action;
  cards.forEach((card) => {
    if (card.id == null) card._id = localId();
    dispatch(insertedCardAction(card, container));
  });
}

export function CARD_SET_TOP({ dispatch, params: [action], state }) {
  const { container, card } = action;
  const co = containerSelector(state, container);

  // exit if the top card is the same
  if (co.top == null && card == null) return;
  if (
    co.top &&
    card &&
    card.count === co.top.count &&
    ((card.id != null && co.top.id === card.id) ||
      (card.id == null && co.top.id == null && co.top.deck === card.deck))
  )
    return;

  dispatch(setTopCardAction(card, container));
}
