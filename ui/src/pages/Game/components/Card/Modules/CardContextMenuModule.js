import React, { useCallback, useState } from 'react';
import PopupMenu from '../../Popup/PopupMenu';
import useCardEventSync from './useCardEventSync';

export default function CardContextMenuModule({ children }) {
  const [contextMenuPos, setContextMenuPos] = useState(null);

  useCardEventSync(
    'onContextMenu',
    useCallback(
      (event) => {
        event.preventDefault();
        setContextMenuPos({ x: event.clientX, y: event.clientY });
      },
      [setContextMenuPos]
    )
  );

  return (
    contextMenuPos && (
      <PopupMenu onClose={() => setContextMenuPos(null)} pos={contextMenuPos}>
        {children}
      </PopupMenu>
    )
  );
}
