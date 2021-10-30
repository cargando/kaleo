import React, { useState, useRef, useEffect } from 'react';
import './styles.scss';

export interface TAccordionProps {
  title: string;
  isOpened?: boolean;
  onOpen?: (e?: React.MouseEvent<HTMLElement>) => void;
  onClose?: (e?: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

export const Accordion: React.FC<TAccordionProps> = ({ title, isOpened = false, onOpen, onClose, children }) => {
  const [opened, setOpened] = useState<boolean>(isOpened);
  const controlRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current && controlRef.current) {
      if (opened) {
        bodyRef.current.classList.add('accordion__body_opened');
        controlRef.current.classList.remove('active');
      } else {
        bodyRef.current.classList.remove('accordion__body_opened');
        controlRef.current.classList.add('active');
      }
    }
  }, [opened]);

  const handleControlClick = (e: React.MouseEvent<HTMLElement>) => {
    setOpened(!opened);
    if (bodyRef.current.classList.contains('accordion__body_opened')) {
      if (typeof onOpen === 'function') {
        onOpen(e);
      }
    } else {
      if (typeof onClose === 'function') {
        onClose(e);
      }
    }
  };

  return (
    <div className="accordion">
      <div className="accordion__cover">
        <span className="accordion__title">{title}</span>
        <div className="accordion__opener" onClick={handleControlClick} role="button">
          <div ref={controlRef} className="accordion__opener-inner active" />
        </div>
      </div>
      <div className="accordion__border" />
      <div ref={bodyRef} className="accordion__body">
        <div className="accordion__body-content">{children}</div>
      </div>
    </div>
  );
};
