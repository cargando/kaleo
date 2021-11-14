import React from 'react';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { FooterControlPicker } from '../../../components/platePikers/footerPlate';

export interface TMaterialTabProps {
  title?: string;
}

export const MaterialTab = ({ title }: TMaterialTabProps): React.ReactNode => {
  const { App, Materials }: Partial<TStore> = useStores();
  return (
    <>
      <div className="app__container">Material Tab {title}</div>
      <FooterControlPicker vm={Materials} />
    </>
  );
};
