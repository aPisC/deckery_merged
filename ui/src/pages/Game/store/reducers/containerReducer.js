import {
  insertedCardAction,
  removedCardAction,
  setTopCardAction,
  updateContainerAction,
} from '../actions/container';

// Inserting card to a holder
// Parameters: payload, holder
function insertedCardHandler({ state, action }) {
  const newCard = action.payload;
  const cards = state.containers[action.holder].cards;
  if (
    cards.find(
      (c) =>
        (c.id != null && c.id === newCard.id) ||
        (c._id != null && c._id === newCard._id)
    )
  )
    return state;
  return {
    ...state,
    containers: {
      ...state.containers,
      [action.holder]: {
        ...state.containers[action.holder],
        cards: [...cards, newCard],
      },
    },
  };
}

// Removing card from a holder
// Parameters: payload, holder
function removedCardHandler({ state, action }) {
  const old = action.payload;
  const cards = state.containers[action.holder].cards;
  return {
    ...state,
    containers: {
      ...state.containers,
      [action.holder]: {
        ...state.containers[action.holder],
        cards: cards.filter(
          (c) =>
            (c.id == null || c.id !== old.id) &&
            (c._id == null || c._id !== old._id)
        ),
      },
    },
  };
}

// Removing card from a holder
// Parameters: payload, holder
function setTopCardHandler({ state, action }) {
  return {
    ...state,
    containers: {
      ...state.containers,
      [action.container]: {
        ...state.containers[action.container],
        top: action.card,
      },
    },
  };
}

function updateContainerHandler({ state, action: { container, data } }) {
  return {
    ...state,
    containers: {
      ...state.containers,
      [container]: {
        ...state.containers[container],
        ...data,
      },
    },
  };
}

export default {
  [insertedCardAction.type]: insertedCardHandler,
  [removedCardAction.type]: removedCardHandler,
  [setTopCardAction.type]: setTopCardHandler,
  [updateContainerAction.type]: updateContainerHandler,
};
