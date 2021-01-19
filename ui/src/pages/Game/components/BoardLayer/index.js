import React, { useState } from 'react';
import { boardLayer, boardInner, boardArea } from './BoardLayer.module.scss';
import useSettings from '../../core/useSettings';
import clamp from '../../../../core/clamp';

export default function BoardLayer({ children, joystickHandlerRef }) {
  const [boardPos, setBoardPos] = useState({ x: 0, y: 0 });
  const [boardJoystickInverted] = useSettings('board.joystick.inverted', false);

  const boardJoystickMultiplier = boardJoystickInverted ? -1 : 1;

  joystickHandlerRef.current = ({ x, y }) => {
    setBoardPos((boardPos) => ({
      x: clamp(boardPos.x + (boardJoystickMultiplier * x) / 100, 0, 100),
      y: clamp(boardPos.y + (boardJoystickMultiplier * y) / 100, 0, 100),
    }));
  };

  return (
    <>
      <BoardLayerWrapper {...boardPos}>{children}</BoardLayerWrapper>
    </>
  );
}

function BoardLayerWrapper({ x, y, children }) {
  x = clamp(x, 1, 99);
  y = clamp(y, 1, 99);

  const boardSize = clamp(useSettings('board.size', 0)[0], -10, 10);
  const fontSize = `${boardSize / 9 + 1.4}rem`;

  const style = {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(${-x}%, ${-y}%)`,
    fontSize: fontSize,
  };

  return (
    <div className={boardLayer}>
      <div className={boardArea}>
        <div className={boardInner} style={style}>
          {children}
        </div>
      </div>
    </div>
  );
}
