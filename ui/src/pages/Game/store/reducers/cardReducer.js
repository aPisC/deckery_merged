import {
  updateCardAction,
  changeCardPositionAction,
  setCardSelectedAction,
} from '../actions/card';
import { updateContainerAction } from '../actions/container';

function updateCardHandler({ action: { card, data }, state }) {
  return {
    ...state,
    cards: {
      ...state.cards,
      [card]: {
        ...state.cards[card],
        ...data,
      },
    },
  };
}

function changeCardPositionHandler({
  action: { card, position },
  state,
  dispatch,
}) {
  const container = Object.values(state.containers).find(
    (c) =>
      !!(
        c.cards && c.cards.find((x) => x.id === card.id && x._id === card.__id)
      )
  );
  if (container) {
    const ncard = container.cards.find(
      (x) => x.id === card.id && x._id === card.__id
    );
    const cards = [...container.cards].filter((x) => x !== ncard);

    cards.splice(position, 0, ncard);
    dispatch(
      updateContainerAction(container, {
        cards: cards,
      })
    );
  }
}

function setCardSelectedHandler({ state, action: { card, selected } }) {
  if (!!selected === !!state.selectedCards[card]) return state;
  return {
    ...state,
    selectedCards: {
      ...state.selectedCards,
      [card]: selected,
    },
  };
}

export default {
  [updateCardAction.type]: updateCardHandler,
  [changeCardPositionAction.type]: changeCardPositionHandler,
  [setCardSelectedAction.type]: setCardSelectedHandler,
};
