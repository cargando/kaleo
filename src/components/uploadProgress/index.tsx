import React from 'react';

export interface TUploadProgressProps {
  width: number;
  height: number;
  progress: number;
  className?: string;
  strokeWidth?: number;
  color?: string;
}

export const UploadProgress: React.FC<TUploadProgressProps> = ({
  width,
  height,
  className,
  color = 'white',
  strokeWidth = 4,
  progress = 100,
}) => {
  const onePercent = height / 100;
  const progressShift = Math.abs(+(onePercent * progress).toFixed() - 100);

  return (
    <>
      <svg
        className={className}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="theMask" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width={width} height={height} fill="#444" style={{ opacity: 0.5 }} />
            <rect x="0" y={progressShift} width={width} height={height} fill="white" />
          </mask>
        </defs>
        <g id="maskReveal" mask="url(#theMask)">
          <path
            d="M84 60V76C84 78.1217 83.1571 80.1566 81.6569 81.6569C80.1566 83.1571 78.1217 84 76 84H20C17.8783 84 15.8434 83.1571 14.3431 81.6569C12.8429 80.1566 12 78.1217 12 76V60"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M68 32L48 12L28 32"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M48 12V60" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </>
  );
};
