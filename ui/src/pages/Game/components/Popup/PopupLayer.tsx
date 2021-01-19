import React, { ReactElement, useContext } from 'react';
import { IPopupBackend, PopupContext } from './PopupBackend';
import * as st from './Popup.module.scss';
import cn from 'classnames';
import { useDrop } from 'react-dnd';
import combineRefs from '../../../../core/combineRefs';

export default function PopupLayer(): ReactElement {
  const { layerRef, isLayerOpen, closeAllPopup, setDropData } = useContext(
    PopupContext
  ) as IPopupBackend;

  const [, drop] = useDrop({
    accept: 'CARD',
    drop: (d) => setDropData(d),
    collect: () => ({}),
  });

  return (
    <div
      onClick={() => closeAllPopup()}
      className={cn({
        [st.popupLayer]: true,
        [st.show]: isLayerOpen,
      })}
      ref={combineRefs(layerRef, drop)}
    ></div>
  );
}
