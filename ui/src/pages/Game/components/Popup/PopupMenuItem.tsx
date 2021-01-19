import React, { ReactElement, useContext } from 'react';
import * as st from './Popup.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames';
import { PopupContext, IPopupBackend } from './PopupBackend';

export interface PopupMenuItemProps {
  onClick: (close: Function) => void;
  children: React.ReactNode;
  iconLeft?: IconProp;
  iconRight?: IconProp;
  text: boolean;
  hover: boolean;
}

function PopupMenuItem({
  onClick,
  children,
  iconLeft,
  iconRight,
  text,
  hover,
}: PopupMenuItemProps): ReactElement {
  const { closeAllPopup } = useContext(PopupContext) as IPopupBackend;

  return (
    <div
      className={classNames({
        [st.popupMenuItem]: true,
        [st.text]: text,
        [st.hover]: hover,
      })}
      onClick={() => onClick && onClick(closeAllPopup)}
    >
      {!text && <div>{iconLeft && <FontAwesomeIcon icon={iconLeft} />}</div>}
      <div>{children}</div>
      {!text && <div>{iconRight && <FontAwesomeIcon icon={iconRight} />}</div>}
    </div>
  );
}

export default PopupMenuItem;
