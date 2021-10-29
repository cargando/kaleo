import React from 'react';
import { ReactComponent as CloudBtn } from 'assets/icons/cloud_btn.svg';
import { ReactComponent as SaveBtn } from 'assets/icons/save_btn.svg';
import { ReactComponent as PrinterBtn } from 'assets/icons/printer_btn.svg';

// export interface TControlIconsProps {}

const controls = [CloudBtn, SaveBtn, PrinterBtn];

export const ControlIcons: React.FC = () => {
  return (
    <>
      {controls.map((item, index) => {
        const Component = item;

        return (
          <Component
            key={index}
            className={`top-line__icon-btn ${index === controls.length - 1 ? 'top-line__icon-btn_last-r' : ''}`}
          />
        );
      })}
    </>
  );
};
