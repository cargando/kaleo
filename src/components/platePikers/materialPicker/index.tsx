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
    vm.setSelected(+id, MaterialsTP.ALL_MATERIALS);
  };

  return (
    <BasePlatePicker
      title={title}
      titleSelected={vm.selectedName(MaterialsTP.ALL_MATERIALS)}
      data={vm.Data(MaterialsTP.ALL_MATERIALS)}
      selectedItems={vm.Selected(MaterialsTP.ALL_MATERIALS)}
      onItemClick={handleClickItem}
      isMultiSelect={vm.Multi(MaterialsTP.ALL_MATERIALS)}
      sidePadding={sidePadding}
      shiftTop
    />
  );
});
