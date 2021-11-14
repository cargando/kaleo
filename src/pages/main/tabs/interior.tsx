import React from 'react';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';

export interface TInteriorTabProps {
  title?: string;
}

export const InteriorTab = ({ title }: TInteriorTabProps) => {
  const { App }: Pick<TStore, STOREs.App> = useStores();
  return <div>Interior Tab {title}</div>;
};
