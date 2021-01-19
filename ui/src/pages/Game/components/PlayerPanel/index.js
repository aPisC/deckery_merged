import React, { useRef, useState } from 'react';
import {
  playerPanelOuter,
  playerPanelInner,
  moveBtn,
} from './PlayerPanel.module.scss';
import useSelector from '../../../../core/useSelector';
import useAnimationFrame from '../../../../core/useAnimationFrame';
import {
  ownPlayerSelector,
  targetPlayerSelector,
} from '../../store/selectors/player';
import { playerContainerListSelector } from '../../store/selectors/container';
import Container from '../Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import useSettings from '../../core/useSettings';
import clamp from '../../../../core/clamp';
import { connect } from '../../../../core/connect';
import { useDrop } from 'react-dnd';
function PlayerPanel({ containers, player, isSinked }) {
  return (
    <RenderMoveArea>
      {containers.map(
        (c) => c && <Container holder={c} key={c.id} isSinked={isSinked} />
      )}
    </RenderMoveArea>
  );
}

export default connect(() => {
  const ownPlayer = useSelector(ownPlayerSelector);
  const targetPlayer = useSelector(targetPlayerSelector);
  const player = targetPlayer || ownPlayer;

  const containers = useSelector(
    playerContainerListSelector,
    player && player.id
  );

  return {
    player,
    containers,
    isSinked: useSettings('player.sinked', true)[0],
  };
})(PlayerPanel);

const RenderMoveArea = ({ children }) => {
  const [pos, setPosRaw] = useState(0);
  const setPos = (pos) => {
    if (pos < 0) setPosRaw(0);
    else if (pos > 100) setPosRaw(100);
    else setPosRaw(pos);
  };

  const playerSize = clamp(useSettings('player.size', 0)[0], -10, 10);
  const fontSize = `${playerSize / 9 + 1.4}rem`;

  const posStyle = {
    left: `${pos}%`,
    transform: `translate(${-pos}%, 0)`,
    fontSize: fontSize,
  };

  return (
    <div className={playerPanelOuter}>
      <RenderMoveAreaButton side="left" onMove={(a) => setPos(pos - a)} />
      <div style={posStyle} className={playerPanelInner}>
        {children}
      </div>
      <RenderMoveAreaButton side="right" onMove={(a) => setPos(pos + a)} />
    </div>
  );
};

const RenderMoveAreaButton = ({ side = 'left', onMove }) => {
  const isMoveRef = useRef(false);
  const isOverRef = useRef(false);

  const startMove = () => (isMoveRef.current = 1);
  const stopMove = () => (isMoveRef.current = null);

  const [, drop] = useDrop({
    accept: 'CARD',
    drop: (d) => {},
    collect: (mon) => {
      const isOver = !!mon.isOver();
      if (isOverRef.current !== isOver) {
        isOverRef.current = isOver;
        isMoveRef.current = isOver;
      }
      return {
        isOver: isOver,
        canDrop: false,
      };
    },
  });

  useAnimationFrame((p) => {
    if (isMoveRef.current) {
      isMoveRef.current =
        isMoveRef.current >= 2.5 ? 2.5 : isMoveRef.current * 1.03;
      onMove((p / 10) * isMoveRef.current);
    }
  });

  return (
    <div
      className={moveBtn}
      style={{ [side]: '0' }}
      onMouseDown={startMove}
      onMouseUp={stopMove}
      /* onDragEnter={startMove}
      onDragLeave={stopMove}
      onDragOver={stopMove}
      onDragCapture={startMove}
      onMouseLeave={stopMove}
      onPointerLeave={stopMove}
      onPointerOver={startMove}
      onPointerenter={startMove}*/
      onPointerDown={startMove}
      onPointerUp={stopMove}
      ref={drop}
    >
      <FontAwesomeIcon
        icon={side === 'left' ? faChevronLeft : faChevronRight}
      />
    </div>
  );
};
