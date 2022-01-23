import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { MTRL, TMaterial, TWood, TColor, TSelectedMaterial } from 'store/types';
import { ReactComponent as RemoveItemControl } from 'assets/icons/removeItemControl.svg';

import './styles.scss';

export interface TBasePlatePickerProps {
  title?: string;
  titleSelected?: string;
  isMultiSelect?: boolean;
  data: TSelectedMaterial[];
  selectedItems: number[];
  onItemClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onRemoveControlClick?: (id: number) => void;
  sidePadding?: boolean;
  twoCols?: boolean;
  shiftTop?: boolean;
  isFooter?: boolean;
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
    isFooter = false,
  }) => {
    const handleClickItem = (e: React.MouseEvent<HTMLElement>) => {
      if (typeof onItemClick === 'function') {
        e.persist();
        onItemClick(e);
      }
    };
    const smallItemsCls = twoCols ? '-small' : '';
    const footerClass = isFooter ? '-footer' : '';

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
          isItemSelected ? `mat-picker__item-selected${smallItemsCls || footerClass}` : ''
        } ${twoCols ? 'mat-picker__item-small' : ''} ${isFooter ? 'mat-picker__item-remove-ctrl' : ''}`,
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

      return twoCols ? (
        <div key={item.id} className="mat-picker__item-cover">
          <div className="flex">
            <div {...props} />
            <span onClick={handleClickItem} data-id={item.id} className={`mat-picker__item-small-title `}>
              {item.title}
            </span>
          </div>
        </div>
      ) : (
        <div key={item.id} {...props} data-id={item.id} data-index={item.zIndex}>
          {isFooter ? (
            <RemoveItemControl
              className={`mat-picker__remove-ctrl ${isItemSelected ? 'mat-picker__remove-ctrl_active' : ''}`}
              onClick={handleRemoveItemClick}
              data-id={item.id}
            />
          ) : null}
        </div>
      );
    };

    const plates = data?.map((item: TSelectedMaterial, index: number) =>
      renderPlate(item, selectedItems?.indexOf(item.id) !== -1, index),
    );

    return (
      <div className="mat-picker rrr">
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
            isFooter ? 'mat-picker__body-nomargin' : ''
          }`}>
          {plates}
        </div>
      </div>
    );
  },
);
