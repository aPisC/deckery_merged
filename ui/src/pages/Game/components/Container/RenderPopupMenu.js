import React, { useState } from 'react';
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import PopupMenu from '../Popup/PopupMenu';
import PopupMenuItem from '../Popup/PopupMenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function RenderPopupMenu({ holder, actionRunner, children }) {
  const [isOpen, setIsPopupOpen] = useState(false);
  const onClose = () => setIsPopupOpen(false);

  const items =
    holder.actions &&
    holder.actions.filter(
      (a) =>
        a.type === 'context' &&
        (!a.filter ||
          actionRunner.execute(a.filter, {}, { containerId: holder.id }))
    );
  if (isOpen && !children && (!items || items.length === 0)) {
    setTimeout(() => onClose(), 0);
    return null;
  }
  return (
    <>
      <FontAwesomeIcon
        icon={faIcons.faBars}
        onClick={() => setIsPopupOpen(true)}
        style={{
          color: !items || items.length === 0 ? 'var(--color-hover)' : null,
        }}
      />
      {!isOpen ? null : (
        <PopupMenu onClose={() => onClose()}>
          {children}
          {items &&
            items.map((a) => (
              <PopupMenuItem
                iconLeft={faIcons[a.icon]}
                onClick={(close) => {
                  actionRunner.execute(
                    a.code,
                    {},
                    {
                      containerId: holder.id,
                    }
                  );
                  close();
                }}
                key={a.id}
              >
                {a.name}
              </PopupMenuItem>
            ))}
        </PopupMenu>
      )}
    </>
  );
}
export default RenderPopupMenu;
