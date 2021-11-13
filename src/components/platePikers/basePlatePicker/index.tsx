import React from 'react';
import { observer } from 'mobx-react';
import { MaterialsTP, TMaterial, TWood, TColor } from 'store/types';
import './styles.scss';

export interface TBasePlatePickerProps {
  title?: string;
  titleSelected?: string;
  isMultiSelect?: boolean;
  data: TMaterial[];
  selectedItems: number[];
  onItemClick?: (e: React.MouseEvent<HTMLElement>) => void;
  sidePadding?: boolean;
  twoCols?: boolean;
  shiftTop?: boolean;
}

export const BasePlatePicker: React.FC<TBasePlatePickerProps> = observer(
  ({
    title,
    titleSelected,
    data,
    selectedItems,
    onItemClick,
    isMultiSelect = false,
    sidePadding = false,
    twoCols = false,
    shiftTop = false,
  }) => {
    const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
      if (typeof onItemClick === 'function') {
        e.persist();
        onItemClick(e);
      }
    };

    const renderPlate = (item: TMaterial, isItemSelected) => {
      const props: Record<string, any> = {
        key: item.id,
        'data-id': item.id,
        onClick: handleClickItem,
        className: `mat-picker__item ${isItemSelected ? 'mat-picker__item-selected' : ''}`,
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
      return <div {...props} />;
    };

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
        <div className={`mat-picker__body ${shiftTop ? 'mat-picker__body-shift-top' : ''}`}>
          {data?.map((item: TMaterial) => renderPlate(item, selectedItems?.indexOf(item.id) !== -1))}
        </div>
      </div>
    );
  },
);
