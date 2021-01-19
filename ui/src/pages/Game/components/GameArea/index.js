import React from 'react';
import useSelector from '../../../../core/useSelector';
import { gameArea, board } from './gamearea.module.scss';
import { gameContainerListSelector } from '../../store/selectors/container';
import Container from '../Container';
import { connect } from '../../../../core/connect';

function GameArea({ gameContainers }) {
  return (
    <div className={gameArea}>
      <div className={board}>
        {gameContainers.map((x) => (
          <Container holder={x} key={x.id} />
        ))}
      </div>
    </div>
  );
}

export default connect(() => ({
  gameContainers: useSelector(gameContainerListSelector),
}))(GameArea);
