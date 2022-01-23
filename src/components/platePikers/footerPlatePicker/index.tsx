import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { MTRL, TMaterial, TWood, TColor, TSelectedMaterial } from 'store/types';
import { ReactComponent as RemoveItemControl } from 'assets/icons/removeItemControl.svg';

import './styles.scss';

export interface TFooterPlatePickerProps {
  data: TSelectedMaterial[];
  selectedItems: number[];
  onItemClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onRemoveControlClick?: (id: number) => void;
}

export const BasePlatePicker: React.FC<TFooterPlatePickerProps> = observer(
  ({ data, selectedItems, onItemClick, onRemoveControlClick }) => {
    const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
      if (typeof onItemClick === 'function') {
        e.persist();
        onItemClick(e);
      }
    };

    const handleRemoveItemClick = useCallback((e: React.MouseEvent<any>) => {
      e.stopPropagation();
      e.preventDefault();
      const target = e.currentTarget as HTMLTextAreaElement;
      const id = target.getAttribute('data-id');
      onRemoveControlClick(+id);
    }, []);

    const renderPlate = (item: TSelectedMaterial, isItemSelected: boolean, index: number) => {
      const props: Record<string, any> = {
        key: item.id,
        'data-id': item.id,
        onClick: handleClickItem,
        className: `mat-picker__item ${
          isItemSelected ? `mat-picker__item-selected-footer` : ''
        } mat-picker__item-remove-ctrl`,
        style: { cursor: 'pointer' },
      };
      if (item?.src) {
        props.style.backgroundImage = `url(${item.src}`;
      } else if (item?.color) {
        props.style.backgroundColor = item.color;
        if (item.border) {
          props.style.border = `1px solid ${item.border}`;
        }
      }

      return (
        <div key={item.id} {...props} data-id={item.id} data-index={item.zIndex}>
          <RemoveItemControl
            className={`mat-picker__remove-ctrl ${isItemSelected ? 'mat-picker__remove-ctrl_active' : ''}`}
            onClick={handleRemoveItemClick}
            data-id={item.id}
          />
        </div>
      );
    };

    const plates = data?.map((item: TSelectedMaterial, index: number) =>
      renderPlate(item, selectedItems?.indexOf(item.id) !== -1, index),
    );

    return (
      <div className="mat-picker">
        <div className="mat-picker__body mat-picker__body-nomargin">{plates}</div>
      </div>
    );
  },
);
