import React, { useCallback, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { MTRL } from 'store/types';
import './styles.scss';
import { BasePlatePicker } from '../basePlatePicker';
import { TStore } from '../../../store';
import { useStores } from '../../../hooks';

export interface TFooterControlPickerProps {
  title?: string;
  sidePadding?: boolean;
}

export const FooterControlPicker: React.FC<TFooterControlPickerProps> = observer(({ title, sidePadding = false }) => {
  const { App, Materials }: Partial<TStore> = useStores();
  const footerPickerRef = useRef(null);

  const handleClickItem = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const target = e.currentTarget as HTMLTextAreaElement;
      const id = target.getAttribute('data-id');
      Materials.setActivePlate(id ? +id : null);
      Materials.setSelectedFilters(+id, MTRL.GENERATED);
    },
    [Materials.Selected(MTRL.GENERATED)],
  );

  const handleDeleteItem = useCallback(
    (id: number) => {
      console.log('DELETE', id);
      Materials.removeGeneratedItem(id);
    },
    [Materials.Selected(MTRL.GENERATED)],
  );

  useEffect(() => {
    if (footerPickerRef.current) {
      footerPickerRef.current.style.width = `${App.mainCell}px`;
    }
  }, [App.mainCell]);

  return (
    <div ref={footerPickerRef} className="footer-picker">
      <div className="footer-picker__body">
        <BasePlatePicker
          title={title}
          titleSelected={Materials.selectedName(MTRL.GENERATED)}
          data={Materials?.Data(MTRL.GENERATED)}
          selectedItems={Materials.Selected(MTRL.GENERATED)}
          onItemClick={handleClickItem}
          onRemoveControlClick={handleDeleteItem}
          isMultiSelect={Materials.Multi(MTRL.GENERATED)}
          isFooter
        />
      </div>
    </div>
  );
});
