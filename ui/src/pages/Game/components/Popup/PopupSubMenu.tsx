import React, { ReactElement, useState, useEffect } from 'react';
import * as st from './Popup.module.scss';
import PopupMenu from './PopupMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
  onClick: Function;
  children: React.ReactNode;
  title: React.ReactNode;
  icon?: IconProp;
}

function PopupSubMenu({ children, title, icon }: Props): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [delayedToggle, setDelayedToggle] = useState<Function | null>(null);

  useEffect(() => {
    let to = 0;
    if (delayedToggle) to = setTimeout(delayedToggle, 100);
    return () => void (to && clearTimeout(to));
  }, [delayedToggle]);

  return (
    <div
      className={st.popupMenuItem}
      onMouseEnter={() => {
        if (!isOpen) setDelayedToggle(() => () => setIsOpen(true));
        else if (isOpen && delayedToggle) setDelayedToggle(null);
      }}
      onMouseLeave={() => setDelayedToggle(() => () => setIsOpen(false))}
    >
      <div>{icon && <FontAwesomeIcon icon={icon} />}</div>
      <div>{title}</div>
      <div>
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
      {isOpen && (
        <PopupMenu onClose={() => setIsOpen(false)}>{children}</PopupMenu>
      )}
    </div>
  );
}

export default PopupSubMenu;
