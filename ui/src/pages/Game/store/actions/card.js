export const updateCardAction = (card, data) => ({
  type: updateCardAction.type,
  card,
  data,
});
updateCardAction.type = 'CARD_UPDATE_DATA';

export const changeCardPositionAction = (card, position) => ({
  type: changeCardPositionAction.type,
  card: card,
  position: position,
});
changeCardPositionAction.type = 'CARD_CHANGE_POSITION';

export const setCardSelectedAction = (card, selected) => ({
  type: setCardSelectedAction.type,
  card: typeof card === 'object' ? `${card.id || 0}-${card._id || 0}` : card,
  selected: selected,
});
setCardSelectedAction.type = 'CARD_SET_SELECTED';
