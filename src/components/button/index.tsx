import React, { useState, useRef, useEffect } from 'react';
import './styles.scss';

export type TButtonSize = 'S' | 'M' | 'L';

export interface TButtonProps {
  size?: TButtonSize;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  color?: 'primary' | 'danger' | 'warning' | 'success' | 'secondary' | 'white';
  className?: string;
  outline?: boolean;
}
export const Button: React.FC<TButtonProps> = (props) => {
  const { onClick, outline, className = '', size = 'S', color = 'primary', disabled = false, children } = props;

  const buttonClasses = `btn btn-${color} ${
    outline ? 'btn-outline' : ''
  } btn-size-${size.toLocaleLowerCase()} ${className}`;

  return (
    <button type="button" onClick={onClick} className={buttonClasses} disabled={disabled}>
      {children}
    </button>
  );
};
