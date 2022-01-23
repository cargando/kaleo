import React from 'react';
import { SideContainer } from 'components/layout/leftColumn/container';
import { Accordion } from '../Accordion';

export interface TSideBlockProps {
  title: string;
  bubble?: number | null;
  children?: React.ReactNode;
  sidePadding?: boolean;
  topPadding?: boolean;
}

export const SideBlock: React.FC<TSideBlockProps> = ({ title, sidePadding, topPadding, children, bubble = null }) => {
  let isBubble = false;
  if (bubble !== null) {
    isBubble = true;
  }
  return (
    <SideContainer size={sidePadding ? 'sm' : 'm'}>
      <Accordion
        title={title}
        bubble={isBubble}
        bubbleCnt={bubble}
        hideOpener
        isOpened
        sidePadding={sidePadding}
        pTop={!topPadding ? 'M' : 'S'}>
        <div className="flex">{children}</div>
      </Accordion>
    </SideContainer>
  );
};
