import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSimpleDND } from 'hooks';
import { DNDActions } from '../../hooks/types';

export enum TCornerType {
  CIRCLE,
  SQUARE,
}

export enum TCornerAngleType {
  LEFT,
  RIGHT,
}

interface TResizeCornerProps {
  type: TCornerType;
  angle?: TCornerAngleType;
  styles: Record<string, string | number>;
  action: DNDActions;
  position: string;
  onMouseDown?: (...rest: any[]) => void;
  onMouseMove?: (...rest: any[]) => void;
  onMouseUp?: (...rest: any[]) => void;
}

const CoverCorner = React.forwardRef<HTMLInputElement, TResizeCornerProps>(
  ({ type, position, action, styles, onMouseDown, onMouseMove, onMouseUp }, ref: React.Ref<HTMLDivElement>) => {
    const cursorCls =
      position === 'TOP_RIGHT' || position === 'BOTTOM_LEFT' ? 'resize-cursor__right' : 'resize-cursor__left';
    const shapeCls = type === TCornerType.SQUARE ? 'mtrl__drag-corner' : 'mtrl__rotator-cntrl';

    return (
      <div
        ref={ref}
        className={`${shapeCls} ${cursorCls}`}
        style={styles}
        data-action={action}
        data-position={position}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    );
  },
);

export const Corner = CoverCorner;
