import React, {
  useContext,
  useEffect,
  FunctionComponent,
  useRef,
  useState,
  Children,
} from 'react';
import ReactDOM from 'react-dom';
import { PopupContext, IPopupBackend } from './PopupBackend';
import * as st from './Popup.module.scss';
import classNames from 'classnames';
import clamp from '../../../../core/clamp';

type Position = {
  x: number;
  y: number;
};

type PopupMenuProps = {
  children: React.ReactNode;
  onClose: Function;
  pos?: Position;
};

const PopupMenu: FunctionComponent<PopupMenuProps> = ({
  children,
  onClose,
  pos,
}) => {
  const { layerRef, openedPopup, closedPopup } = useContext(
    PopupContext
  ) as IPopupBackend;

  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeHandler = () => {
      if (onClose) onClose();
    };
    if (Children.count(children) === 0) {
      closedPopup(closeHandler);
      return;
    }
    openedPopup(closeHandler);
    return () => closedPopup(closeHandler);
    // eslint-disable-next-line
  }, []);

  const [pos2, setPos2] = useState<Position | null>(null);

  const _area = pos || (anchorRef.current?.getBoundingClientRect() as DOMRect);
  const area2 = document.body.getBoundingClientRect() as DOMRect;

  const area = _area && { x: _area.x, y: _area.y };
  if (area) {
    area.x = clamp(area.x, 16, area2.width - 16);
    area.y = clamp(area.y, 0, area2.height);
  }

  if (area && !pos2) setPos2(area);

  const isUp = pos2 != null && pos2.y > area2.height / 2;
  const isRight = pos2 != null && pos2.x < area2.width / 2;

  return (
    <>
      <div className={st.popupAnchor} ref={anchorRef}></div>
      {layerRef.current &&
        ReactDOM.createPortal(
          <div
            className={classNames({
              [st.popupMenuContainer]: true,
              [st.isUp]: isUp,
            })}
            style={{
              position: 'fixed',
              top: pos2?.y,
              left: pos2?.x,
              display: 'flex',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={classNames({
                [st.popupMenuArrow]: true,
                [st.isUp]: isUp,
              })}
            ></div>
            <div
              className={classNames({
                [st.popupMenu]: true,
                [st.isUp]: isUp,
                [st.isRight]: isRight,
              })}
            >
              <div className={st.popupMenuInner}>{children}</div>
            </div>
          </div>,
          layerRef.current
        )}
    </>
  );
};
export default PopupMenu;
