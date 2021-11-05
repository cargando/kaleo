import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ReactComponent as ArrowBtn } from 'assets/icons/arrow.svg';
import { useHtmlToggle } from 'hooks';
import './styles.scss';
import { Slider } from '../slider';

export interface TDropDownProps {
  isOpened?: boolean;
  children?: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  renderImage?: (...rest) => React.ReactNode;
  title: string;
  subTitle?: string;
  titleImg?: React.ReactNode;
}

export const DropDown: React.FC<TDropDownProps> = (props) => {
  const { title, subTitle, titleImg = null, onClick, isOpened = false, children } = props;
  const [opened, setOpened] = useState<boolean>(isOpened);
  const [textVal, setTextVal] = useState<number>(0);
  const iconRef = useRef(null);

  useHtmlToggle(opened, iconRef, 'active');

  const handleIconClick = useCallback(
    (e?: React.MouseEvent<HTMLElement>) => {
      setOpened(!opened);
    },
    [opened],
  );

  const handleChangeSlider = useCallback(
    (val: number) => {
      setTextVal(val);
    },
    [setTextVal],
  );

  // const buttonClasses = `drop-down ${className}`;
  const titleColStyle: Record<string, any> = {};
  if (!titleImg) {
    titleColStyle.paddingLeft = '13px';
  }

  return (
    <div className="drop-down">
      <div onClick={onClick} className="drop-down__cover">
        {titleImg && (
          <div className="drop-down__material-col">
            <div className="drop-down__material-ico" style={{ backgroundImage: `url(${titleImg})` }} />
          </div>
        )}
        <div className="drop-down__title-col-cover" style={titleColStyle}>
          <div className="drop-down__title-col">
            <div className="drop-down__title-1">{title}</div>
            <div className="drop-down__title-2">
              {subTitle} - {textVal}%
            </div>
          </div>
        </div>
        <div className="drop-down__control-col">
          <button onClick={handleIconClick} className="drop-down__control">
            <ArrowBtn ref={iconRef} className="drop-down__control-ico" />
          </button>
        </div>
        {children}
      </div>
      <Slider value={14} sidePadding={10} shiftY={-6} onChange={handleChangeSlider} />
    </div>
  );
};
