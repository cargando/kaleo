import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { LeftCol } from './leftCol';
import { SideBlock } from '../../sideBlock';

export interface TGenerateColProps {
  children?: React.ReactNode;
}

export const GenerateCol = observer(({ children }: TGenerateColProps) => {
  const { App }: Pick<TStore, STOREs.App> = useStores();
  return (
    <LeftCol>
      <SideBlock bubble={5} title="Задайте установки для генерации">
        {children}
      </SideBlock>
    </LeftCol>
  );
});
