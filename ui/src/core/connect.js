import React from 'react';

export function connect(mapToProps) {
  return function (_Component) {
    const Component = React.memo(_Component);
    return function (props) {
      const map = mapToProps(props);
      return <Component {...props} {...map} />;
    };
  };
}
