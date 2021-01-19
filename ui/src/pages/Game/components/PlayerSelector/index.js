import React, { useState, useRef, useContext } from 'react';
import {
  playersIcon,
  playersOverlay,
  closeIcon,
  playersOverlayBackground,
  playerIcon,
  playerArea,
  playerNameTag,
} from './playerSelector.module.scss';
import * as overlayTransition from './overlayTransition.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faTimes,
  faUser,
  faStepForward,
} from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';
import { useDrop } from 'react-dnd';
import useBodyEvent from '../../../../core/useBodyEvent';
import useSelector from '../../../../core/useSelector';
import {
  playerListSelector,
  targetPlayerSelector,
} from '../../store/selectors/player';
import { DispatchContext, StateContext } from '../../contexts';
import { selectTargetPlayerAction } from '../../store/actions/player';
import { connect } from '../../../../core/connect';
import { startGameAction } from '../../store/actions/game';

const PlayerIcon = ({ player, deg, onSelect }) => {
  const [, drop] = useDrop({
    accept: 'CARD',
    canDrop: () => false,
    hover: () => {
      onSelect();
    },
  });

  const x = Math.cos(deg) * 50 + 50;
  const y = Math.sin(deg) * 50 + 50;

  const posStyle = {
    top: `${y}%`,
    left: `${x}%`,
    backgroundColor: player.color,
  };
  const lastPlayerRef = useRef(null);
  lastPlayerRef.current = player;

  return (
    <div className={playerIcon} style={posStyle} onClick={onSelect} ref={drop}>
      <FontAwesomeIcon icon={faUser} />
      <div className={playerNameTag}>{player.name}</div>
    </div>
  );
};

export const PlayersIcon = ({ onActivate, playersIconRef }) => {
  const [, drop] = useDrop({
    accept: 'CARD',
    canDrop: () => false,
    hover: () => {
      onActivate();
    },
  });
  return (
    <div
      className={playersIcon}
      onClick={onActivate}
      ref={(el) => {
        drop.current = el;
        if (drop.call) drop.call(null, el);
        if (playersIconRef) playersIconRef.current = el;
      }}
    >
      <FontAwesomeIcon icon={faUsers} />
    </div>
  );
};

const CloseIcon = ({ onClose }) => {
  const [, drop] = useDrop({
    accept: 'CARD',
    canDrop: () => false,
    hover: () => {
      onClose();
    },
  });
  return (
    <div className={closeIcon} onClick={onClose} ref={drop}>
      <FontAwesomeIcon icon={faTimes} />
    </div>
  );
};
const StartIcon = ({ onClick }) => {
  return (
    <div className={closeIcon} onClick={onClick}>
      <FontAwesomeIcon icon={faStepForward} />
    </div>
  );
};

const PlayersOverlay = ({
  onClose,
  playersIconRef,
  players,
  dispatch,
  targetPlayer,
  closeButton,
}) => {
  const playerAreaRef = useRef();
  let alpha = 0;
  if (playerAreaRef.current && playersIconRef.current) {
    const playersIconRect = playersIconRef.current.getBoundingClientRect();
    const playersIconCenter = {
      x: playersIconRect.x + playersIconRect.width / 2,
      y: playersIconRect.y + playersIconRect.width / 2,
    };
    const playersAreaRect = playerAreaRef.current.getBoundingClientRect();
    const playersAreaCenter = {
      x: playersAreaRect.x + playersAreaRect.width / 2,
      y: playersAreaRect.y + playersAreaRect.width / 2,
    };

    const zerovec = {
      x: playersIconCenter.x - playersAreaCenter.x,
      y: playersIconCenter.y - playersAreaCenter.y,
    };
    alpha = Math.atan2(zerovec.y, zerovec.x);
  }

  return (
    <div className={playersOverlay} onClick={onClose}>
      <div className={playersOverlayBackground} />
      {closeButton}
      <div className={playerArea} ref={playerAreaRef}>
        {players &&
          players.map((p, i) => (
            <PlayerIcon
              key={`${i}-${p.id}`}
              player={p}
              deg={alpha + (2 * 3.1415 * (i + 1)) / (players.length + 1)}
              onSelect={() => {
                if (targetPlayer !== p)
                  dispatch(selectTargetPlayerAction(p.id));
                onClose();
              }}
            />
          ))}
      </div>
    </div>
  );
};

function PlayerSelector({
  playersIconRef,
  playersHandlerRef,
  gameStatus,
  players,
  dispatch,
  targetPlayer,
}) {
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  const openOverlay = () => {
    if (!isOverlayActive) setIsOverlayActive(true);
  };

  const closeOverlay = () => {
    if (isOverlayActive) setIsOverlayActive(false);
  };

  playersHandlerRef.current = openOverlay;
  useBodyEvent('keydown', (event) => {
    if (isOverlayActive && event.key === 'Escape') {
      closeOverlay();
      event.stopImmediatePropagation();
    }
  });

  return (
    <>
      <CSSTransition
        classNames={overlayTransition}
        in={
          isOverlayActive ||
          gameStatus === 'LOBBY' ||
          gameStatus === 'INITIALIZING'
        }
        timeout={300}
      >
        <PlayersOverlay
          onClose={closeOverlay}
          playersIconRef={playersIconRef}
          players={players}
          dispatch={dispatch}
          targetPlayer={targetPlayer}
          closeButton={
            gameStatus === 'LOBBY' ? (
              <StartIcon onClick={() => dispatch(startGameAction())} />
            ) : (
              gameStatus === 'RUNNING' && <CloseIcon onClose={closeOverlay} />
            )
          }
        />
      </CSSTransition>
    </>
  );
}

export default connect(() => {
  const state = useContext(StateContext);

  const gameStatus = state && state.game && state.game.status;
  const players = useSelector(playerListSelector);

  const dispatch = useContext(DispatchContext);
  const targetPlayer = useSelector(targetPlayerSelector);

  return {
    gameStatus,
    players,
    dispatch,
    targetPlayer,
  };
})(PlayerSelector);
