import React from 'react';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';

export interface TKaleidoscopeTabProps {
  title?: string;
}

export const KaleidoscopeTab = ({ title }: TKaleidoscopeTabProps) => {
  const { App }: Pick<TStore, STOREs.App> = useStores();
  return <div>Kaleidoscope Tab {title}</div>;
};
