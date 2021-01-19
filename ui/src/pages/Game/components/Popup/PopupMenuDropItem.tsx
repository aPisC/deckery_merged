import React, { ReactElement, useContext } from 'react';
import { PopupContext, IPopupBackend } from './PopupBackend';
import PopupMenuItem, { PopupMenuItemProps } from './PopupMenuItem';
import { useDrop } from 'react-dnd';

interface Props extends PopupMenuItemProps {
  dropAccept?: string;
  onDrop: Function;
  canDrop: () => boolean;
}

function PopupMenuDropItem(props: Props): ReactElement {
  const { closeAllPopup, getDropData } = useContext(
    PopupContext
  ) as IPopupBackend;

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: props.dropAccept || 'CARD',
    drop: (d) => props.onDrop && props.onDrop(d, closeAllPopup),
    canDrop: props.canDrop,
    collect: (mon) => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });
  return (
    <div ref={drop}>
      <PopupMenuItem
        {...props}
        hover={isOver && canDrop}
        onClick={(c) => props.onDrop && props.onDrop(getDropData(), c)}
      ></PopupMenuItem>
    </div>
  );
}

export default PopupMenuDropItem;
