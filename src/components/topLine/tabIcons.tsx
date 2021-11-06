import React from 'react';
import { ReactComponent as KollazhBtn } from 'assets/icons/kollazh_btn.svg';
import { ReactComponent as KalaydoscopeBtn } from 'assets/icons/kaleydoscope_btn.svg';
import { ReactComponent as D3DBtn } from 'assets/icons/3d_btn.svg';

export interface TTabIconsProps {
  active: number;
  onChange: (e: React.MouseEvent<SVGSVGElement>) => any;
}

const controls = [KollazhBtn, KalaydoscopeBtn, D3DBtn];

export const TabIcons: React.FC<TTabIconsProps> = ({ active, onChange }) => {
  return (
    <>
      {controls.map((item, index) => {
        const Component = item;

        return (
          <div key={index} className={active === index ? 'top-line__icon-btn-cover' : ''}>
            <Component
              onClick={onChange}
              data-id={index}
              className={`top-line__icon-btn ${index === controls.length - 1 ? 'top-line__icon-btn_last-c' : ''} ${
                active === index ? 'top-line__icon-btn_active' : ''
              } `}
            />
          </div>
        );
      })}
    </>
  );
};
