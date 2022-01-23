import React from 'react';
import { observer } from 'mobx-react';
import { MaterialsStoreVM } from 'store/vm/materialVM';
import { MTRL, TMaterial } from 'store/types';
import './styles.scss';
import { BasePlatePicker } from '../basePlatePicker';

export interface TColorPickerProps {
  title?: string;
  vm: MaterialsStoreVM;
  sidePadding?: boolean;
}

export const ColorPicker: React.FC<TColorPickerProps> = observer(({ title, sidePadding = false, vm }) => {
  const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLTextAreaElement;
    const id = target.getAttribute('data-id');
    vm.setSelectedFilters(+id, MTRL.COLOR);
  };

  return (
    <BasePlatePicker
      title={title}
      titleSelected={vm.selectedName(MTRL.COLOR)}
      data={vm?.Data(MTRL.COLOR)}
      selectedItems={vm.Selected(MTRL.COLOR)}
      onItemClick={handleClickItem}
      isMultiSelect={vm.Multi(MTRL.COLOR)}
      sidePadding={sidePadding}
      shiftTop
    />
  );
});
