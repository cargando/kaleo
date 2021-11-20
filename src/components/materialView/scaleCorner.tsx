import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSimpleDND } from 'hooks';
import { DNDActions } from '../../hooks/types';
import { Corner, TCornerAngleType, TCornerType } from './corner';
import { TElementCoords } from '../../utils/types';

interface TScaleCornerProps {
  styles: Record<string, string | number>;
  action: DNDActions;
  position: string;
  onChange: (deltaX: number, deltaY: number, position: string) => void;
}

export const ScaleCorner: React.FC<TScaleCornerProps> = ({ position, action, styles }) => {
  const [coords, setCoords] = useState<TElementCoords>(styles);
  return (
    <Corner
      type={TCornerType.CIRCLE}
      styles={coords as Record<string, string | number>}
      action={action}
      position={position}
    />
  );
};
