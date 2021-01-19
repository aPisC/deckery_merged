import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fabutton, active } from './fa.module.scss';

function FaButton(props) {
  return (
    <div
      onClick={props.onClick}
      className={`${fabutton} ${
        props.isActive ? props.activeClass || active : ''
      }`}
    >
      <div>
        <FontAwesomeIcon icon={props.icon} />
      </div>
    </div>
  );
}

export default FaButton;
