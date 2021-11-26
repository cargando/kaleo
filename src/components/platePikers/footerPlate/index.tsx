import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { MaterialsStoreVM } from 'store/vm/materialVM';
import { MaterialsTP, TMaterial } from 'store/types';
import './styles.scss';
import { BasePlatePicker } from '../basePlatePicker';
import { STOREs, TStore } from '../../../store';
import { useResizeObserver, useStores } from '../../../hooks';

export interface TFooterControlPickerProps {
  title?: string;
  vm: MaterialsStoreVM;
  sidePadding?: boolean;
  activeID: number;
}

export const FooterControlPicker: React.FC<TFooterControlPickerProps> = observer(
  ({ title, activeID = null, sidePadding = false, vm }) => {
    const { App }: Pick<TStore, STOREs.App> = useStores();
    const footerPickerRef = useRef(null);

    const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
      const target = e.currentTarget as HTMLTextAreaElement;
      const id = target.getAttribute('data-id');
      vm.setSelected(+id, MaterialsTP.MTRL_GENERATED);
    };

    useEffect(() => {
      if (footerPickerRef.current) {
        footerPickerRef.current.style.width = `${App.mainCell}px`;
      }
    }, [App.mainCell, App.mainCell]);

    return (
      <div ref={footerPickerRef} className="footer-picker">
        <div className="footer-picker__body">
          <BasePlatePicker
            title={title}
            titleSelected={vm.selectedName(MaterialsTP.MTRL_GENERATED)}
            data={vm?.Data(MaterialsTP.MTRL_GENERATED)}
            selectedItems={vm.Selected(MaterialsTP.MTRL_GENERATED)}
            onItemClick={handleClickItem}
            isMultiSelect={vm.Multi(MaterialsTP.MTRL_GENERATED)}
            singleLine
            shiftTop
          />
        </div>
      </div>
    );
  },
);
