import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { Portal } from './portalModal';

export interface TFullScreenProps {
  name: string;
  bgColor: string;
  opacity: number;
  padding: string;
  children?: React.ReactNode;
}

export const FullScreen = observer(({ children, name, bgColor = null, opacity = null, padding = null }) => {
  const { Modals }: Pick<TStore, STOREs.Modals> = useStores();

  useEffect(() => {
    return () => {
      Modals.closeModal();
    };
  }, [Modals]);

  return Modals.foolScreen ? (
    <Portal bgColor={bgColor} padding={padding} opacity={opacity}>
      {children}
    </Portal>
  ) : (
    children
  );
});
