import React, { useRef } from 'react';
import SidePanel from './components/SidePanel';
import { CustomDragLayer } from './components/DragLayer';
import BackgroundLayer from './components/BackgroundLayer';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import BoardLayer from './components/BoardLayer';
import { AnimationFrameBackend } from '../../core/useAnimationFrame';
import SocketReducerBackend from './core/SocketReducerBackend';
import useSettings, { SettingsBackend } from './core/useSettings';
import initialSettings from './core/initialSettings';
import GlobalStyle from './components/GlobalStyle';
import GameArea from './components/GameArea';
import PlayerSelector, { PlayersIcon } from './components/PlayerSelector';
import {
  hwrap,
  vwrap,
  wrapfill,
  hfade,
  bfade,
  fill,
} from './style/gamepage.module.scss';
import PlayerPanel from './components/PlayerPanel';
import Joystick from './components/Joystick';
import PopupBackend from './components/Popup/PopupBackend';
import PopupLayer from './components/Popup/PopupLayer';
import { StorageBackend } from '../../core/useStorage';
import ActionsBackend from './components/Actions/ActionsBackend';
import ModalHandler from './components/Modal/ModalHandler';
import ConsoleActionConnector from './components/ConsoleActionConnector';

function GamePage(props) {
  return (
    <RenderBackends>
      <RenderContent />
    </RenderBackends>
  );
}

const RenderContent = () => {
  const joystickHandlerRef = useRef();
  const playersHandlerRef = useRef();
  const playersIconRef = useRef();

  const [isJoystickEnabled] = useSettings('board.joystick.enabled', true);

  return (
    <>
      <BackgroundLayer />
      <CustomDragLayer />
      <ModalHandler />
      <PopupLayer />
      <PlayerSelector
        playersHandlerRef={playersHandlerRef}
        playersIconRef={playersIconRef}
      />
      <div className={`${vwrap} ${fill}`}>
        <div className={`${hwrap} ${wrapfill}`}>
          <SidePanel />
          <div className={`${fill} ${hfade}`}>
            <div className={`${bfade} ${fill}`}>
              <BoardLayer joystickHandlerRef={joystickHandlerRef}>
                <GameArea />;
              </BoardLayer>
            </div>
          </div>
          <div className={vwrap}>
            <div>
              <PlayersIcon
                onActivate={(...p) => playersHandlerRef.current(...p)}
                playersIconRef={playersIconRef}
              />
            </div>
            <div className={wrapfill}></div>
            <div>
              {isJoystickEnabled && (
                <Joystick onMove={(...p) => joystickHandlerRef.current(...p)} />
              )}
            </div>
          </div>
        </div>

        <div className={hfade}>
          <PlayerPanel />
        </div>
      </div>
    </>
  );
};

const RenderBackends = ({ children }) => (
  <SocketReducerBackend>
    <DndProvider options={HTML5toTouch} backend={MultiBackend}>
      <AnimationFrameBackend>
        <PopupBackend>
          <StorageBackend>
            <ActionsBackend>
              <SettingsBackend initialSettings={initialSettings}>
                <GlobalStyle />
                <ConsoleActionConnector />
                {children}
              </SettingsBackend>
            </ActionsBackend>
          </StorageBackend>
        </PopupBackend>
      </AnimationFrameBackend>
    </DndProvider>
  </SocketReducerBackend>
);

export default GamePage;
