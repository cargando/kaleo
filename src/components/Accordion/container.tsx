import React from 'react';

export interface TAccordionContainerProps {
  size?: 'sm' | 'm';
  children?: React.ReactNode;
}

export const AccordionContainer: React.FC<TAccordionContainerProps> = ({ size = 'm', children }) => {
  const classes = size === 'm' ? 'app__container accordions' : 'app__container app__container-sm accordions-sm';
  return <div className={classes}>{children}</div>;
};
