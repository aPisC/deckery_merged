import React from 'react';
import { useDragLayer } from 'react-dnd';
import CardItem from '../Card/CardItem';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 200,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
};

function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export const CustomDragLayer = (props) => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  function renderItem() {
    switch (itemType) {
      case 'CARD':
        return (
          <CardItem
            cardData={item.extra.cardData}
            width={item.extra.originalWidth}
            dragged
            overNumber={3}
          />
        );
      default:
        return null;
    }
  }

  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </div>
  );
};
