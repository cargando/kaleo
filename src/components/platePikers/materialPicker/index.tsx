import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { MaterialsStoreVM } from 'store/vm/materialVM';
import { MTRL, TMaterial } from 'store/types';
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
    vm.setSelectedFilters(+id, MTRL.ALL_TYPES);
  };
  return (
    <BasePlatePicker
      title={title}
      titleSelected={vm.selectedName(MTRL.ALL_TYPES)}
      data={vm.Data(MTRL.ALL_TYPES)}
      selectedItems={vm.Selected(MTRL.ALL_TYPES)}
      onItemClick={handleClickItem}
      isMultiSelect={vm.Multi(MTRL.ALL_TYPES)}
      sidePadding={sidePadding}
      twoCols
      shiftTop
    />
  );
});
