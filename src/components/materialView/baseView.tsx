import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSimpleDND } from 'hooks';
import { DNDActions } from 'hooks/types';
import { TSelectedMaterial } from 'store/types';
import './styles.scss';
import { ResizeCorner } from './resizeCorner';
import { ScaleCorner } from './scaleCorner';

interface TBaseMaterialViewerProps {
  item: TSelectedMaterial;
  isActive: boolean;
  onChangeCoords: (x?: number, y?: number, id?: number) => void;
  onChangeScale: (w: number, h: number, id: number) => void;
  onChangeRotation: (deg: number, id: number) => void;
  onClick: (id: number) => void;
}

export const BaseMaterialViewer = ({
  item = {} as TSelectedMaterial,
  isActive,
  onChangeCoords,
  onChangeScale,
  onChangeRotation,
  onClick,
}: TBaseMaterialViewerProps) => {
  const { id, srcLarge, bgScale, height, width, zIndex = 1, top = 15, left = 25, rotate } = item;

  const stylesFrame: Record<string, any> = { top: `${top}px`, left: `${left}px` };
  const stylesCover: Record<string, any> = {
    height,
    width,
    zIndex,
    backgroundImage: `url(${item.srcLarge}`,
    backgroundSize: bgScale ? `${bgScale}%` : 'auto',
  };

  const handleChangeActive = useCallback(() => {
    onClick(id);
  }, [isActive, id]);

  const handleResize = (dX: number, dY: number, type: string) => {
    console.log('Resize >> ', dX, dY, type);
  };

  const { elementRef, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseClick } = useSimpleDND({
    onMouseUp: onChangeCoords,
    onClick: handleChangeActive,
    id,
  });

  const renderCorners = (tp: DNDActions) => {
    const corners: Record<string, number>[] = [
      { top: 0, left: 0 },
      { top: 0, right: 0 },
      { bottom: 0, left: 0 },
      { bottom: 0, right: 0 },
    ];
    return corners.map((localItem, index) => {
      const positionTxt = Object.keys(localItem)
        .map((keyName: string) => keyName.toUpperCase())
        .join('_');
      const Component = tp === DNDActions.SCALE ? ResizeCorner : ScaleCorner;
      return <Component key={index} action={tp} styles={localItem} position={positionTxt} onChange={handleResize} />;
    });
  };

  return (
    <div ref={elementRef} className="mtrl__frame" style={{ ...stylesFrame }} data-id={id}>
      <div className={`mtrl__cover ${isActive ? 'mtrl__cover_active' : ''}`} style={stylesCover}>
        <div className="mtrl__rotator" style={null}>
          {isActive && renderCorners(DNDActions.ROTATE)}
          {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
          <div
            onMouseDown={isActive ? handleMouseDown : null}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseUp}
            onClick={handleMouseClick}
            className="mtrl__rotator-inner"
          />
        </div>
      </div>
      {isActive && renderCorners(DNDActions.SCALE)}
    </div>
  );
};
