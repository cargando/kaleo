import React from 'react';
import './styles.scss';

export interface TBubbleProps {
  title: string | number;
  type?: 'primary' | 'warn' | 'alert' | 'grey' | 'muted';
}

export const Bubble: React.FC<TBubbleProps> = ({ title, type = 'primary' }) => {
  return <div className={`bubble bubble_${type}`}>{title}</div>;
};
