import React, { useCallback } from 'react';
import { TSelectedMaterial } from 'store/types';
import { ReactComponent as RemoveItemControl } from 'assets/icons/removeItemControl.svg';
import { observer } from 'mobx-react';

// import './styles.scss';

export interface TFooterPlateProps {
  item: TSelectedMaterial;
  isSelected: boolean;
  zIndex: number;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  onRemove: (id: number) => void;
}

export const FooterPlate: React.FC<TFooterPlateProps> = ({ item, isSelected, zIndex, onClick, onRemove }) => {
  const handleClickItem = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (typeof onClick === 'function') {
      e.persist();
      onClick(e);
    }
  }, []);

  const handleRemoveItem = useCallback((e: React.MouseEvent<any>) => {
    e.stopPropagation();
    e.preventDefault();
    const target = e.currentTarget as HTMLTextAreaElement;
    const id = target.getAttribute('data-id');
    onRemove(+id);
  }, []);

  const props: Record<string, any> = {
    key: item.id,
    'data-id': item.id,
    onClick: handleClickItem,
    className: `footer-picker__item ${isSelected ? `footer-picker__item-selected` : ''}`,
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
    <div key={item.id} {...props} data-id={item.id} data-index={zIndex}>
      {isSelected && (
        <RemoveItemControl className="footer-picker__remove-ctrl" onClick={handleRemoveItem} data-id={item.id} />
      )}
    </div>
  );
};
