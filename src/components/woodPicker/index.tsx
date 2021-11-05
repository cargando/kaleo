import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { MaterialsStoreVM, TMaterial } from 'store/materialVM';
import { MaterialPicker } from 'components/materialPicker';
import './styles.scss';
import { observer } from 'mobx-react';
import { TStore } from '../../store';
import { useStores } from '../../hooks';

export interface TWoodPickerProps {
  title: string;
}

export const WoodPicker: React.FC<TWoodPickerProps> = observer(({ title }) => {
  const { Materials }: Pick<TStore, 'Materials'> = useStores();
  useEffect(() => {
    Materials.fetch();
  }, []);

  console.log('DATA > ', Materials.getData);
  return <MaterialPicker title="Выберите цвет" vm={Materials} />;
});
