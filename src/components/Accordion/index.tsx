import React, { useState, useRef, useEffect } from 'react';
import { useHtmlToggle } from '../../hooks';
import { Bubble } from '../bubble/inde';
import './styles.scss';

// export * from '../layout/leftColumn/container';

export interface TAccordionProps {
  title: string;
  isOpened?: boolean;
  onOpen?: (e?: React.MouseEvent<HTMLElement>) => void;
  onClose?: (e?: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  sidePadding?: boolean;
  hideOpener?: boolean;
  bubble?: boolean;
  bubbleCnt?: number;
  pTop?: 'S' | 'M' | 'L';
}

export const Accordion: React.FC<TAccordionProps> = ({
  title,
  isOpened = false,
  onOpen,
  onClose,
  sidePadding = false,
  hideOpener = false,
  bubble = false,
  bubbleCnt = 0,
  pTop = 'L',
  style,
  children,
}) => {
  const [opened, setOpened] = useState<boolean>(isOpened);
  const controlRef = useRef(null);
  const bodyRef = useRef(null);

  useHtmlToggle(opened, bodyRef, 'accordion__body_opened');
  useHtmlToggle(opened, controlRef, 'active', true);

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

  const controlProps: Record<string, string> = {};
  if (!hideOpener) {
    controlProps.role = 'button';
  }
  return (
    <div className="accordion">
      <div className={`accordion__cover ${sidePadding ? 'accordion__padding-sm' : ''}`}>
        <span className="accordion__title">{title}</span>
        <div
          className={`accordion__opener ${bubble ? 'accordion__opener-bubble' : ''}`}
          onClick={handleControlClick}
          {...controlProps}>
          {!hideOpener && <div ref={controlRef} className="accordion__opener-inner active" />}
          {bubble && <Bubble title={bubbleCnt} />}
        </div>
      </div>
      <div className={`accordion__border ${sidePadding ? 'accordion__padding-sm' : ''}`} />
      <div ref={bodyRef} className="accordion__body">
        <div className={`accordion__body-content ${pTop === 'M' ? 'accordion__body-content_small' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
