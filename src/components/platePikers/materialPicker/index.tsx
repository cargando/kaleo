import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { MaterialsStoreVM } from 'store/vm/materialVM';
import { MaterialsTP, TMaterial } from 'store/types';
import { BasePlatePicker } from '../basePlatePicker';

export interface TMaterialPickerProps {
  title?: string;
  vm: MaterialsStoreVM;
  sidePadding?: boolean;
}

export const MaterialPicker: React.FC<TMaterialPickerProps> = observer(({ title, sidePadding = false, vm }) => {
  const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLTextAreaElement;
    const id = target.getAttribute('data-id');
    vm.setSelected(+id, MaterialsTP.MTRL_TYPE);
  };
  return (
    <BasePlatePicker
      title={title}
      titleSelected={vm.selectedName(MaterialsTP.MTRL_TYPE)}
      data={vm.Data(MaterialsTP.MTRL_TYPE)}
      selectedItems={vm.Selected(MaterialsTP.MTRL_TYPE)}
      onItemClick={handleClickItem}
      isMultiSelect={vm.Multi(MaterialsTP.MTRL_TYPE)}
      sidePadding={sidePadding}
      twoCols
      shiftTop
    />
  );
});
