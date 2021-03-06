import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { autorun } from 'mobx';
import { MaterialPicker } from 'components/platePikers/materialPicker';
import './styles.scss';
import { observer } from 'mobx-react';
import { STOREs, TStore } from '../../../store';
import { useStores } from '../../../hooks';
import { BasePlatePicker } from '../basePlatePicker';
import { MTRL } from '../../../store/types';

export interface TWoodPickerProps {
  title: string;
  sidePadding?: boolean;
}

export const WoodPicker: React.FC<TWoodPickerProps> = observer(({ title, sidePadding }) => {
  const { Materials }: Pick<TStore, STOREs.Materials> = useStores();

  const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLTextAreaElement;
    const id = target.getAttribute('data-id');
    Materials.setSelectedFilters(+id, MTRL.VENEER);
  };

  useEffect(
    () =>
      autorun(() => {
        Materials.fetch();
      }),
    [],
  );
  return (
    <BasePlatePicker
      title={title}
      titleSelected={Materials.selectedName(MTRL.VENEER)}
      data={Materials?.Data(MTRL.VENEER)}
      selectedItems={Materials.Selected(MTRL.VENEER)}
      onItemClick={handleClickItem}
      isMultiSelect={Materials.Multi(MTRL.VENEER)}
      sidePadding={sidePadding}
    />
  );
  // <MaterialPicker sidePadding={props.sidePadding} title="Выберите цвет" vm={Materials} />;
});
