import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  cardSelector,
  cardBackSelector,
  containerSelectedCardListSelector,
} from '../../store/selectors/card';
import useSelector from '../../../../core/useSelector';
import CardItem from './CardItem';
import { CardContainerContext } from '../Container/context';
import { connect } from '../../../../core/connect';
import { DispatchContext, StateGetterContext } from '../../contexts';
import { openModalAction } from '../../store/actions/ui';
import useCardStateSync from './Modules/useCardStateSync';

export const CardContext = React.createContext();

function Card(props) {
  const dispatch = useContext(DispatchContext);
  const getState = useContext(StateGetterContext);

  const [state, setState] = useState({ style: {} });

  /*********************
   * Props
   *********************/
  const card = props.card;
  const cardData = props.cardData;

  useCardStateSync('holderId', props.holderId, setState);
  useCardStateSync('width', props.width, setState);
  useCardStateSync('overIcon', props.overIcon, setState);
  useCardStateSync('noShadow', props.noShadow, setState);
  useCardStateSync('selectable', props.selectable, setState);

  /**************
   * Card Events
   ****************/
  const eventsRef = useRef({
    onClick: (event) => {
      event.stopPropagation();
      if (events.setIsSelected) events.setIsSelected((selected) => !selected);
    },

    onDoubleClick: (event) => {
      event.stopPropagation();
      dispatch(
        openModalAction({
          type: 'CardModal',
          cardData: cardData,
        })
      );
    },

    onContextMenu: (event) => {
      // setContextMenuPos({ x: event.clientX, y: event.clientY });
      event.preventDefault();
    },
  });
  const events = eventsRef.current;

  const cardRef = useRef();

  const getDraggedItem = () => ({
    type: 'CARD',
    container: state.holderId,
    card: { ...card, container: state.holderId, orderIndex: state.orderIndex },
    extra: {
      cardData,
      originalWidth:
        cardRef.current && cardRef.current.getBoundingClientRect().width,
    },
    cards: [
      ...(!state.selected
        ? [{ ...card, container: state.holderId, orderIndex: state.orderIndex }]
        : []),
      ...(containerSelectedCardListSelector(getState(), state.holderId) || []),
    ],
  });

  const cardContext = {
    card: card,
    ref: cardRef,
    state: state,
    events: eventsRef.current,
    setEvent: (key, event) => {
      eventsRef.current[key] = event;
    },
    setState: useCallback(
      (key, value) =>
        setState((state) => ({
          ...state,
          [key]: typeof value === 'function' ? value(state[key]) : value,
        })),
      [setState]
    ),
    getDragItem: getDraggedItem,
  };

  return (
    <CardContext.Provider value={cardContext}>
      <div
        ref={cardRef}
        onClick={(...p) => void (events.onClick && events.onClick(...p))}
        onContextMenu={(...p) =>
          void (events.onContextMenu && events.onContextMenu(...p))
        }
        onDoubleClick={(...p) =>
          void (events.onDoubleClick && events.onDoubleClick(...p))
        }
        onWheel={(...p) => void (events.onWheel && events.onWheel(...p))}
        style={state.style}
      >
        <CardItem
          // marked={contextMenuPos}
          selected={state.isDragging || state.selected}
          cardData={cardData}
          overIcon={state.overIcon}
          dropTarget={state.dropTarget}
          noShadow={state.noShadow}
          width={state.width}
        >
          {props.children}
        </CardItem>
      </div>
    </CardContext.Provider>
  );
}

export default connect(({ card, holderId, cardData, selected }) => {
  const cardFore = card && useSelector(cardSelector, card /* id */);
  const cardBack = card && useSelector(cardBackSelector, card);

  cardData = cardData || cardFore || cardBack;

  const holder = useContext(CardContainerContext);

  return {
    cardData,
    holderId: holderId || (holder && holder.id),
    selected: selected,
  };
})(Card);
