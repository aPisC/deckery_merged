import React from 'react';
import useSettings from '../core/useSettings';
import palette from '../core/palette';
import { createGlobalStyle } from 'styled-components';
import useSelector from '../../../core/useSelector';
import {
  ownPlayerSelector,
  targetPlayerSelector,
} from '../store/selectors/player';
import { connect } from '../../../core/connect';

const GS = createGlobalStyle`
  html {
    --color-fore: ${(props) => props.color};
    --color-base: ${(props) => props.base};
    --color-hover: ${(props) => props.hover};
    --color-back: ${(props) => props.back};
    --color-opposite: ${(props) => props.opposite};
    --color-forealt: ${(props) => props.color2};
    --color-forealt2: ${(props) => props.color3};
    --color-shadow: ${(props) => props.shadow};
    color: ${(props) => props.opposite};
  }
  body {
    color: ${(props) => props.opposite};
    transition: color .15s ease-in-out,
      background-color .15s ease-in-out,
      border-color .15s ease-in-out,
      box-shadow .15s ease-in-out;
  }
`;

function GlobalStyle({ player, isDark }) {
  const color = player ? player.color : 'gray';

  const cp = isDark
    ? palette.getDarkPalette(color)
    : palette.getLightPalette(color);
  return <GS {...cp} />;
}

export default connect(() => {
  const ownPlayer = useSelector(ownPlayerSelector);
  const targetPlayer = useSelector(targetPlayerSelector);
  return {
    player: targetPlayer || ownPlayer,
    isDark: useSettings('base.isDark', false)[0],
  };
})(GlobalStyle);
