import React, { ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
import * as st from './Card.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { BackendUrl } from '../../../../constants';

interface Props {
  dragged?: boolean;
  selected?: boolean;
  marked?: boolean;
  dropTarget: boolean;
  noShadow: boolean;
  cardData: any;
  width?: string;
  overIcon?: IconProp | number;
  children?: ReactNode;
  overNumber?: number | string;
}

export default function CardItem({
  dragged,
  selected,
  marked,
  dropTarget,
  noShadow,
  cardData,
  width,
  overIcon,
  overNumber,
  children,
}: Props): ReactElement | null {
  const style: any = {};
  if (width) style.width = width;

  if (!cardData) return null;
  return (
    <div>
      <div
        className={classNames({
          [st.card]: true,
          [st.dragged]: dragged,
          [st.selected]: selected,
          [st.marked]: marked,
          [st.dropTarget]: dropTarget,
          [st.noShadow]: noShadow,
        })}
        style={style}
      >
        {cardData.background && (
          <img
            src={
              (cardData.background.startsWith('/') ? BackendUrl : '') +
              cardData.background
            }
            alt=""
          />
        )}
        {cardData.content && <div>{cardData.content}</div>}
        {overIcon && (
          <div className={st.iconOverlay}>
            {typeof overIcon != 'number' && <FontAwesomeIcon icon={overIcon} />}
            {typeof overIcon == 'number' && <span>{overIcon}</span>}
          </div>
        )}
        {overNumber != null && (
          <div className={st.iconOverlay}>
            <div>{overNumber}</div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
