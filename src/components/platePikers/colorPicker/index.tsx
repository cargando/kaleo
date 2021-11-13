import React from 'react';
import { observer } from 'mobx-react';
import { MaterialsStoreVM } from 'store/vm/materialVM';
import { MaterialsTP, TMaterial } from 'store/types';
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
    vm.setSelected(+id, MaterialsTP.COLOR);
  };

  return (
    <BasePlatePicker
      title={title}
      titleSelected={vm.selectedName(MaterialsTP.COLOR)}
      data={vm?.Data(MaterialsTP.COLOR)}
      selectedItems={vm.Selected(MaterialsTP.COLOR)}
      onItemClick={handleClickItem}
      isMultiSelect={vm.Multi(MaterialsTP.COLOR)}
      sidePadding={sidePadding}
      shiftTop
    />
  );
});
