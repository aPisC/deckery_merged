import React from 'react';
import { group } from './fields.module.scss';

export default function FieldGroup({ children, noPadding }) {
  const style = {};
  if (noPadding) style.padding = '0';
  return (
    <div className={group} style={style}>
      {children}
    </div>
  );
}
