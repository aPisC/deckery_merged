import React from 'react';
import { button } from './fields.module.scss';

export default function Button({ className, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${button} ${className}`}
    >
      {children}
    </button>
  );
}
