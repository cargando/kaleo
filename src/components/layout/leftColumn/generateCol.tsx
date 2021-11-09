import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { STOREs, TStore } from 'store';
import { useStores } from '../../../hooks';

export interface TGenerateColProps {
  children?: React.ReactNode;
}

export const GenerateCol = observer(({ children }: TGenerateColProps) => {
  const { App }: Pick<TStore, STOREs.App> = useStores();
  return <div>{children}</div>;
});
