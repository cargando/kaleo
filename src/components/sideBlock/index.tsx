import React from 'react';
import { SideContainer } from 'components/layout/leftColumn/container';
import { Accordion } from '../Accordion';

export interface TSideBlockProps {
  title: string;
  bubble?: number | null;
  children?: React.ReactNode;
}

export const SideBlock: React.FC<TSideBlockProps> = ({ title, children, bubble = null }) => {
  let isBubble = false;
  if (bubble !== null) {
    isBubble = true;
  }
  return (
    <SideContainer>
      <Accordion title={title} bubble={isBubble} bubbleCnt={bubble} hideOpener>
        {children}
      </Accordion>
    </SideContainer>
  );
};
