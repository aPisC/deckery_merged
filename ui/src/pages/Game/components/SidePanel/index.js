import React, { useContext, useState } from 'react';
import {
  faHome,
  faCog,
  faDiceFive,
  faSignOutAlt,
  faHistory,
  faCommentAlt,
  faTimes,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons';
import panelTransition from './transitions/panelTransition.module.scss';
import overlayTransition from './transitions/overlayTransition.module.scss';
import barTransition from './transitions/barTransition.module.scss';
import {
  bar,
  group,
  bottom,
  side,
  panel,
  panelHeader,
  active,
  panelLabel,
  panelBody,
  overlay,
  panelWrapper,
} from './SidePanel.module.scss';
import FaButton from '../../../../sharedComponents/fa/FaButton';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import Settings from './panels/Settings';
import useBodyEvent from '../../../../core/useBodyEvent';
import Terminal from './panels/Terminal';
import useSettings from '../../core/useSettings';
import { useHistory } from 'react-router-dom';
import { DispatchContext } from '../../contexts';
import { selectTargetPlayerAction } from '../../store/actions/player';

const RenderPanel = ({ isOpen, faIcon, onClose, children, name }) => {
  return (
    <div className={panelWrapper}>
      <CSSTransition classNames={panelTransition} in={isOpen} timeout={300}>
        <div
          className={classNames({
            [panel]: true,
          })}
          onClick={onClose}
        >
          <div className={panelHeader}>
            {name}
            <div className={panelLabel}>
              <FaButton icon={faIcon || faTimes} activeClass={active} />
            </div>
          </div>
          <div className={panelBody} onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

const RenderBar = ({ isOpen, children }) => {
  return (
    <CSSTransition classNames={barTransition} in={isOpen} timeout={300}>
      <div className={bar}>{children}</div>
    </CSSTransition>
  );
};

const RenderBarGroup = ({ children, isBottom }) => (
  <div className={classNames({ [group]: true, [bottom]: isBottom })}>
    {children}
  </div>
);

const RenderOverlay = ({ isOpen, onClick }) => (
  <CSSTransition classNames={overlayTransition} in={isOpen} timeout={300}>
    <div className={overlay} onClick={onClick}></div>
  </CSSTransition>
);

const RenderBarItem = ({ icon, onClick }) => (
  <FaButton icon={icon} onClick={onClick} activeClass={active} />
);
const RenderBarSingle = ({ isBottom, icon, onClick }) => (
  <RenderBarGroup isBottom={isBottom}>
    <RenderBarItem icon={icon} onClick={onClick} />
  </RenderBarGroup>
);

function SidePanel(props) {
  const [panelOpen, setPanelOpen] = useState(null);

  const closePanel = () => setPanelOpen(null);

  useBodyEvent('keydown', (event) => {
    if (panelOpen && event.key === 'Escape') {
      setPanelOpen(null);
      event.stopImmediatePropagation();
    }
  });

  const isDev = useSettings('developerMode', false)[0];
  const history = useHistory();

  const dispatch = useContext(DispatchContext);

  return (
    <>
      <div className={side}>
        <RenderBar isOpen={panelOpen == null}>
          <RenderBarSingle
            icon={faCommentAlt}
            onClick={() => setPanelOpen('interactions')}
          />
          <RenderBarSingle
            icon={faHistory}
            onClick={() => setPanelOpen('log')}
          />
          <RenderBarGroup isBottom>
            <RenderBarItem
              icon={faHome}
              onClick={() => dispatch(selectTargetPlayerAction('me'))}
            />
            <RenderBarItem
              icon={faCog}
              onClick={() => setPanelOpen('options')}
            />
            <RenderBarItem
              icon={faDiceFive}
              onClick={() => setPanelOpen('dice')}
            />
            <RenderBarItem
              icon={faSignOutAlt}
              onClick={() => history.push('/games')}
            />
            {isDev && (
              <RenderBarItem
                icon={faTerminal}
                onClick={() => setPanelOpen('terminal')}
              />
            )}
          </RenderBarGroup>
        </RenderBar>
        <RenderOverlay
          isOpen={panelOpen != null}
          onClick={() => setPanelOpen(null)}
        ></RenderOverlay>
        <RenderPanel
          isOpen={panelOpen === 'interactions'}
          onClose={closePanel}
          faIcon={faCommentAlt}
        />
        <RenderPanel
          isOpen={panelOpen === 'log'}
          onClose={closePanel}
          faIcon={faHistory}
        />
        <RenderPanel
          isOpen={panelOpen === 'options'}
          onClose={closePanel}
          faIcon={faCog}
          name={'Settings'}
        >
          <Settings />
        </RenderPanel>
        <RenderPanel
          isOpen={panelOpen === 'dice'}
          onClose={closePanel}
          faIcon={faDiceFive}
        />
        {isDev && (
          <RenderPanel
            isOpen={panelOpen === 'terminal'}
            onClose={closePanel}
            faIcon={faTerminal}
            name="Terminal"
          >
            <Terminal />
          </RenderPanel>
        )}
      </div>
    </>
  );
}

export default SidePanel;
