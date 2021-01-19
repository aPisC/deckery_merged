import React, { useContext } from 'react';
import { panel } from '../panels.module.scss';
import {
  EditorEnvironment,
  EditorFieldConnector,
} from '@apisc/react-editor-form';
import { SettingsContext } from '../../../../core/useSettings';
// import Button from './fields/Button';
// import ButtonToggle from './fields/ButtonToggle';
import { group, primary } from '../../../Fields/fields.module.scss';
import initialSettings from '../../../../core/initialSettings';
import ButtonCheck from '../../../Fields/ButtonCheck';
import Button from '../../../Fields/Button';
// import ColorToggle from './fields/ColorToggle';
// import palette from '../../../../core/palette';

export default function Settings() {
  const [settings, updateSettings] = useContext(SettingsContext);
  return (
    <div className={panel}>
      <EditorEnvironment externalState={[settings, updateSettings]}>
        <div className={group}>
          <label>Asztal méretezése</label>
          <EditorFieldConnector
            component="input"
            type="range"
            min="-10"
            max="10"
            member="board.size"
          />
        </div>
        <div className={group}>
          <label>Player panel méretezése</label>
          <EditorFieldConnector
            component="input"
            type="range"
            min="-10"
            max="10"
            member="player.size"
          />
        </div>
        <div className={group}>
          <label>Dark mode</label>
          <EditorFieldConnector component={ButtonCheck} member="base.isDark" />
        </div>
        <div className={group}>
          <label>Háttér mozgatás invertálása</label>
          <EditorFieldConnector
            component={ButtonCheck}
            member="board.joystick.inverted"
          />
        </div>
        <div className={group}>
          <label>Háttér mozgató joystick</label>
          <EditorFieldConnector
            component={ButtonCheck}
            member="board.joystick.enabled"
          />
        </div>
        <div className={group}>
          <label>Player panel süllyesztése </label>
          <EditorFieldConnector
            component={ButtonCheck}
            member="player.sinked"
          />
        </div>
        <div className={group}>
          <label>Developer mode </label>
          <EditorFieldConnector
            component={ButtonCheck}
            member="developerMode"
          />
        </div>
        <div className={group}>
          <Button
            className={primary}
            onClick={() => updateSettings(initialSettings)}
          >
            Minden beállítás alaphelyzetbe
          </Button>
        </div>

        {/*
        <div className={group}>
          <label>Háttér mozgatás invertálása</label>
          <EditorFieldConnector
            member="testnum"
            component={ButtonToggle}
            options={[
              { content: 'asdasd', value: 1 },
              { content: 'asdasd', value: 2 },
              { content: 'asdasd', value: 3 },
              { content: 'asdasd', value: 4 },
              { content: 'asdasd', value: 5 },
              { content: 'asdasd', value: 6 },
              { content: 'asdasd', value: 4 },
            ]}
          />
        </div>
        <div className={group}>
          <label>Color scheme</label>
          <EditorFieldConnector
            component={ColorToggle}
            member="board.color"
            colors={palette
              .getColors()
              .map((c) => palette.getLightPalette(c).color)}
          />
            </div>
        */}
      </EditorEnvironment>
    </div>
  );
}
