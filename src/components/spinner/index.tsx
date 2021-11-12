import React from 'react';
import './styles.scss';

interface TSpinnerProps {
  fullCenter?: boolean; // центр по вертикали
  centerVertical?: boolean; // центр по вертикали
  center?: boolean; // центр по горизонту
  width?: string; // диаметр спинера
  text?: string; // текст внутри (Loading)
  color?: string; // цвет спинера (css класс)
  bgColor?: string; // цвет фона, по умолчанию прозрачный (css класс)
  shiftTop?: string; // отступ сверху
  outerHeight?: string; // высота внешнего блока, посреди которого надо отцентровать по вертикали
}

const Spinner: React.FC<TSpinnerProps> = ({
  bgColor = 'transparent',
  fullCenter = false,
  centerVertical = false,
  center = false,
  width = '65',
  text = null,
  color: spinnerColor = 'primary',
  shiftTop = 0,
}) => {
  const spinner = (
    <svg
      style={{ marginBottom: `-${shiftTop}px`, marginLeft: '10px', marginRight: '10px' }}
      className="ggl-spinner"
      width={`${width}px`}
      height={`${width}px`}
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg">
      <circle
        className={`spnr__path-${spinnerColor}`}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      />
    </svg>
  );
  const loadingText = text && <div>{text}</div>;
  if (fullCenter) {
    return (
      <div className="spnr__center" style={{ backgroundColor: bgColor }}>
        {spinner} {loadingText}
      </div>
    );
  } else if (center) {
    return <div className="spnr__center-h">{spinner}</div>;
  } else if (centerVertical) {
    return <div className="spnr__center-v">{spinner}</div>;
  }
  return spinner;
};

export default React.memo(Spinner);
