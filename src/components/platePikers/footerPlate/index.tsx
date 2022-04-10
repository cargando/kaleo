import React, { useCallback, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { MTRL, TSelectedMaterial } from 'store/types';
// import { BasePlatePicker } from '../basePlatePicker';
import { TStore } from '../../../store';
import { useStores } from '../../../hooks';
import { FooterPlate } from '../footerPlatePicker';
import './styles.scss';

export interface TFooterPickerProps {
  title?: string;
  sidePadding?: boolean;
}

export const FooterPicker: React.FC<TFooterPickerProps> = observer(({ title, sidePadding = false }) => {
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
      Materials.removeGeneratedItem(id);
    },
    [Materials.Selected(MTRL.GENERATED)],
  );

  useEffect(() => {
    if (footerPickerRef.current) {
      footerPickerRef.current.style.width = `${App.mainCell.width}px`;
    }
  }, [App.mainCell.width]);

  const renderItem = (item: TSelectedMaterial) => {
    const isSelected = Materials.Selected(MTRL.GENERATED)?.indexOf(item.id) !== -1;
    return (
      <FooterPlate
        key={item.id}
        item={item}
        isSelected={isSelected}
        zIndex={item.zIndex}
        onClick={handleClickItem}
        onRemove={handleDeleteItem}
      />
    );
  };

  return (
    <div ref={footerPickerRef} className="footer-picker">
      <div className="footer-picker__body">
        {Materials?.Data?.(MTRL.GENERATED)?.length &&
          Materials.Data(MTRL.GENERATED)
            .slice()
            .sort((a, b) => b.zIndex - a.zIndex)
            .map(renderItem)}
      </div>
    </div>
  );
});
