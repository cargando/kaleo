import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { MaterialsStoreVM } from 'store/vm/materialVM';
import { TMaterial } from 'store/types';
import './styles.scss';

export interface TMaterialPickerProps {
  title: string;
  vm: MaterialsStoreVM;
  sidePadding?: string;
}

export const MaterialPicker: React.FC<TMaterialPickerProps> = observer(({ title, sidePadding = false, vm }) => {
  const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLTextAreaElement;
    const id = target.getAttribute('data-id');
    vm.setSelected(+id);
  };

  return (
    <div className="mat-picker">
      <div className={`mat-picker__head ${sidePadding ? 'mat-picker__padding-sm' : ''}`}>
        <div className="mat-picker__title">{title}</div>
        <div className="mat-picker__title-info">
          {!vm.multiSelect && (
            <>
              Выбрано: <span>{vm.selectedName}</span>
            </>
          )}
        </div>
      </div>
      <div className="mat-picker__body">
        {vm?.data?.map((item: TMaterial, index: number) => {
          const isItemSelected = vm.selected.indexOf(item.id) !== -1;
          return (
            <div
              key={`${index}${item.id}`}
              data-id={item.id}
              onClick={handleClickItem}
              className={`mat-picker__item ${isItemSelected ? 'mat-picker__item-selected' : ''}`}
              style={{ backgroundImage: `url(${item.src}` }}>
              {/* vm.selected.indexOf(item.id) !== -1 && (
                <div data-id={item.id} data-frame="1" className="mat-picker__item-selected" />
              ) */}
            </div>
          );
        })}
      </div>
    </div>
  );
});
