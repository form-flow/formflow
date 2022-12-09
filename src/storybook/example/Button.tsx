import React, { ReactPropTypes } from 'react';

import './button.scss';

export const Button = (props: any) => {
  const {className, children, onClick} = props;

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

