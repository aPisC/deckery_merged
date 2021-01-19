import React from 'react';
import { buttonPanel, primary } from './fields.module.scss';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function ButtonCheck({ value, onUpdate }) {
  return (
    <div className={buttonPanel} data-toggle="buttons">
      <Button
        className={value === false ? primary : ''}
        onClick={() => {
          if (onUpdate) onUpdate(false);
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </Button>
      <Button
        className={value === true ? primary : ''}
        onClick={() => {
          if (onUpdate) onUpdate(true);
        }}
      >
        <FontAwesomeIcon icon={faCheck} />
      </Button>
    </div>
  );
}
