import React, { useMemo } from 'react';
import HandContainer from './HandContainer';
import { CardContainerContext } from './context';
import PileContainer from './PileContainer';

export default function Container({ holder, isSinked }) {
  const gridPosition = holder?.settings?.find(
    (s) => s.__component === 'container.grid-position'
  );
  const style = useMemo(
    () =>
      gridPosition && {
        gridColumn: gridPosition.column,
        gridRow: gridPosition.row,
        gridColumnEnd: gridPosition.column + gridPosition.width,
        gridRowEnd: gridPosition.row + gridPosition.height,
        marginLeft: gridPosition.floatRight ? 'auto' : undefined,
      },
    [gridPosition]
  );

  return (
    <div style={style}>
      <CardContainerContext.Provider value={holder}>
        {holder.type === 'hand' && (
          <HandContainer holder={holder} isSinked={isSinked} />
        )}
        {holder.type === 'pile' && (
          <PileContainer holder={holder} isSinked={isSinked} />
        )}
      </CardContainerContext.Provider>
    </div>
  );
}
