import React from 'react';
import logoBack from './backLogo.png';
import logoBackDark from './backLogoDark.png';
import { background, backgroundCenter } from './BackgroundLayer.module.scss';
import useSettings from '../../core/useSettings';

const styleNormal = {
  backgroundImage: `url(${logoBack})`,
};
const styleDark = {
  backgroundImage: `url(${logoBackDark})`,
};

export default function BackgroundLayer() {
  const [isDark] = useSettings('base.isDark', false);
  return (
    <div className={background}>
      <div
        className={backgroundCenter}
        style={isDark ? styleDark : styleNormal}
      ></div>
    </div>
  );
}
