import React from 'react';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';

export interface TMaterialTabProps {
  title?: string;
}

export const MaterialTab = ({ title }: TMaterialTabProps): React.ReactNode => {
  const { App }: Pick<TStore, STOREs.App> = useStores();
  return <div>Material Tab {title}</div>;
};
