import { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { CardContext } from '..';
import { DispatchContext } from '../../../contexts';
import { changeCardPositionAction } from '../../../store/actions/card';
import useCardStateSync from './useCardStateSync';

export default function CardOrderModule({ orderIndex, onOrderCard }) {
  const { card, state, ref } = useContext(CardContext);
  const dispatch = useContext(DispatchContext);

  useCardStateSync('orderIndex', orderIndex);

  onOrderCard =
    onOrderCard ||
    ((card, pos) => dispatch(changeCardPositionAction(card, pos)));

  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      if (!ref.current) return;
      if (item.container !== state.holderId) return;
      if (item.cards.length !== 1) return;

      const source = item.cards[0];
      if (source.id === card.id && source._id === card._id) return;

      let orderIndex = state.orderIndex;
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      if (hoverClientX > hoverMiddleX) orderIndex++;

      if (source.orderIndex === orderIndex) return;
      if (onOrderCard) {
        onOrderCard(source, orderIndex);
        source.orderIndex = orderIndex;
      }
    },
  });

  drop(ref);

  return null;
}
