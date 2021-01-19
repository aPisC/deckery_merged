import React from 'react';
import { buttonPanel, primary } from './fields.module.scss';
import Button from './Button';

export default function ButtonToggle({ options, value, onUpdate }) {
  return (
    <div className={buttonPanel} data-toggle="buttons">
      {options &&
        options.map((o, i) => (
          <Button
            key={`${i}-${o.value}`}
            className={value === o.value ? primary : ''}
            onClick={() => onUpdate(o.value)}
          >
            {o.content}
          </Button>
        ))}
    </div>
  );
}
