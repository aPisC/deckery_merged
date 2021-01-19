import React from 'react';
import FaButton from './FaButton';

function FaToggle(props) {
  return !props.value ? (
    <FaButton icon={props.icon} onClick={props.onClick} />
  ) : (
    <FaButton
      icon={props.icon2 || props.icon}
      isActive={props.isActive}
      onClick={props.onClick}
    />
  );
}

export default FaToggle;
