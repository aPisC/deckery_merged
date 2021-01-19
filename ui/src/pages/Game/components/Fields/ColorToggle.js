import React from 'react';
import { colorButton, colorGroup, button } from './fields.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const ColorButton = ({ onClick, color, active, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${colorButton} ${button}`}
      style={{ backgroundColor: color }}
    >
      {!disabled && active && <FontAwesomeIcon icon={faCheck} />}
      {disabled && <FontAwesomeIcon icon={faTimes} />}
    </button>
  );
};

export default function ColorToggle({ value, onUpdate, colors }) {
  return (
    <div className={colorGroup}>
      {colors &&
        colors.map((c, i) => (
          <ColorButton
            color={c}
            key={`${i}-${c}`}
            active={value === c}
            onClick={() => {
              if (onUpdate) onUpdate(c);
            }}
          />
        ))}
    </div>
  );
}
