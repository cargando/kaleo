import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSimpleDND } from 'hooks';
import { DNDActions } from '../../hooks/types';
import { Corner, TCornerAngleType, TCornerType } from './corner';
import { TElementCoords } from '../../utils/types';

interface TResizeCornerProps {
  styles: Record<string, string | number>;
  action: DNDActions;
  position: string;
  onChange: (dX: number, dY: number, position: string) => void;
}

export const ResizeCorner: React.FC<TResizeCornerProps> = ({ position, action, styles, onChange }) => {
  const [coords, setCoords] = useState<TElementCoords>(styles);

  const handleResizeParent = (dX: number, dY: number) => {
    onChange(dX, dY, position);
  };

  const { elementRef } = useSimpleDND({
    onMouseMove: handleResizeParent,
    targetID: '',
  });

  return (
    <Corner
      ref={elementRef}
      type={TCornerType.SQUARE}
      styles={coords as Record<string, string | number>}
      action={action}
      position={position}
    />
  );
};
