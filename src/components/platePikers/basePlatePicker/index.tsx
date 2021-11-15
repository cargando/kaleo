import React from 'react';
import { observer } from 'mobx-react';
import { MaterialsTP, TMaterial, TWood, TColor } from 'store/types';
import { ReactComponent as RemoveItemControl } from 'assets/icons/removeItemControl.svg';

import './styles.scss';

export interface TBasePlatePickerProps {
  title?: string;
  titleSelected?: string;
  isMultiSelect?: boolean;
  data: TMaterial[];
  selectedItems: number[];
  onItemClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onRemoveControlClick?: (e: React.MouseEvent<any>) => void;
  sidePadding?: boolean;
  twoCols?: boolean;
  singleLine?: boolean;
  shiftTop?: boolean;
}

export const BasePlatePicker: React.FC<TBasePlatePickerProps> = observer(
  ({
    title,
    titleSelected,
    data,
    selectedItems,
    onItemClick,
    onRemoveControlClick,
    isMultiSelect = false,
    sidePadding = false,
    twoCols = false,
    shiftTop = false,
    singleLine = false,
  }) => {
    const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
      if (typeof onItemClick === 'function') {
        e.persist();
        onItemClick(e);
      }
    };
    const smallItemsCls = twoCols ? '-small' : '';

    const renderPlate = (item: TMaterial, isItemSelected: boolean, index: number) => {
      const props: Record<string, any> = {
        key: item.id,
        'data-id': item.id,
        onClick: handleClickItem,
        className: `mat-picker__item ${isItemSelected ? `mat-picker__item-selected${smallItemsCls}` : ''} ${
          twoCols ? 'mat-picker__item-small' : ''
        } ${singleLine ? 'mat-picker__item-remove-ctrl' : ''}`,
        style: {},
      };
      if (item?.src) {
        props.style.backgroundImage = `url(${item.src}`;
      } else if (item?.color) {
        props.style.backgroundColor = item.color;
        if (item.border) {
          props.style.border = `1px solid ${item.border}`;
        }
      }

      return twoCols ? (
        <div key={item.id} className="mat-picker__item-cover">
          <div className="flex">
            <div {...props} />
            <span
              className={`mat-picker__item-small-title ${
                isItemSelected ? 'mat-picker__item-small-title-selected' : ''
              }`}>
              {item.title}
            </span>
          </div>
        </div>
      ) : (
        <div {...props}>
          {singleLine ? <RemoveItemControl className="mat-picker__remove-ctrl" onClick={onRemoveControlClick} /> : null}
        </div>
      );
    };

    const plates = data?.map((item: TMaterial, index: number) =>
      renderPlate(item, selectedItems?.indexOf(item.id) !== -1, index),
    );

    return (
      <div className="mat-picker">
        {title && (
          <div className={`mat-picker__head ${sidePadding ? 'mat-picker__padding-sm' : ''}`}>
            <div className="mat-picker__title">{title}</div>
            <div className="mat-picker__title-info">
              {!isMultiSelect && (
                <>
                  Выбрано: <span>{titleSelected}</span>
                </>
              )}
            </div>
          </div>
        )}
        <div
          className={`mat-picker__body ${shiftTop ? 'mat-picker__body-shift-top' : ''} ${
            singleLine ? 'mat-picker__body-nomargin' : ''
          }`}>
          {plates}
        </div>
      </div>
    );
  },
);
