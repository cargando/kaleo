import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import './styles.scss';
import { TMaterial, MaterialsStoreVM } from '../../store/materialVM';

export interface TMaterialPickerProps {
  title: string;
  vm: MaterialsStoreVM;
}

export const MaterialPicker: React.FC<TMaterialPickerProps> = ({ title, vm }) => {
  console.log('MaterialPicker> ', vm.getData);
  return (
    <div className="mat-picker">
      <div className="mat-picker__head">
        <div className="mat-picker__title">{title}</div>
        <div className="mat-picker__title-info">
          Выбрано: <span>Миланский орех</span>
        </div>
      </div>
      <div className="mat-picker__body">
        {vm?.getData?.map((item: TMaterial) => {
          return (
            <>
              <div key={item.id} className="mat-picker__item" style={{ backgroundImage: item.src }} />
            </>
          );
        })}
      </div>
    </div>
  );
};
