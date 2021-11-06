import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { autorun } from 'mobx';
import { MaterialPicker } from 'components/materialPicker';
import './styles.scss';
import { observer } from 'mobx-react';
import { TStore } from '../../store';
import { useStores } from '../../hooks';

export interface TWoodPickerProps {
  title: string;
  sidePadding?: boolean;
}

export const WoodPicker: React.FC<TWoodPickerProps> = observer((props: any) => {
  const { Materials }: Pick<TStore, 'Materials'> = useStores();
  useEffect(
    () =>
      autorun(() => {
        Materials.fetch();
      }),
    [],
  );
  console.log('WoodPicker, ', props.sidePadding);
  return <MaterialPicker sidePadding={props.sidePadding} title="Выберите цвет" vm={Materials} />;
});
