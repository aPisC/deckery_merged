import { useContext } from 'react';
import { useDrag } from 'react-dnd';
import { CardContext } from '..';
import useDragEmptyImage from '../../../core/useDragEmptyImage';
import useCardStateSync from './useCardStateSync';

export default function CardDragModule({
  onDragBegin,
  onDragEnd,
  canDrag,
  dragProps,
}) {
  const card = useContext(CardContext);

  const getDragItem = () => {
    const d = card.getDragItem();
    return { ...d, dragProps: dragProps };
  };

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'CARD' },
    begin: () => {
      if (onDragBegin) onDragBegin();
      return getDragItem();
    },
    end: (item, mon) => {
      if (onDragEnd) onDragEnd(mon.didDrop());
    },
    canDrag: () => !!card && (canDrag == null || canDrag(card)),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  useDragEmptyImage(preview);

  useCardStateSync('isDragging', isDragging);

  drag(card.ref);

  return null;
}
