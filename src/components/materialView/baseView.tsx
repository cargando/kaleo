import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TSelectedMaterial } from 'store/types';
import {
  getCursorPosition,
  relativeToAbsolute,
  calcPositionFromValue,
  calcValueFromPosition,
  checkMinMax,
  convertToUserRange,
} from 'utils/fn';
import { TContainerCoords } from 'utils/types';

import './styles.scss';
import { useDND } from 'hooks';
import { Actions } from 'hooks/types';

interface TBaseMaterialViewerProps {
  item: TSelectedMaterial;
  onChangeCoords: (x?: number, y?: number, id?: number) => void;
  onChangeScale: (w: number, h: number, id: number) => void;
  onChangeRotation: (deg: number, id: number) => void;
}

export const BaseMaterialViewer = ({
  item = {} as TSelectedMaterial,
  onChangeCoords,
  onChangeScale,
  onChangeRotation,
}: TBaseMaterialViewerProps) => {
  const { id, src, srcLarge, bgScale, height, width, zIndex = 1, top, left, rotate } = item;
  const frameRef = useRef(null);
  const innerRef = useRef(null);

  const stylesFrame: Record<string, any> = { top: `${top}px`, left: `${left}px` };
  const stylesCover: Record<string, any> = {
    height,
    width,
    zIndex,
    backgroundImage: `url(${item.srcLarge}`,
  };
  // console.log('ITEM', toJS(item));

  useDND({
    onMouseUp: (...rest) => {
      onChangeCoords(...rest);
    },
    draggable: frameRef,
    clickable: innerRef,
    // parent,
    id,
  });

  useLayoutEffect(() => {
    console.log('LAYOUT x,y', frameRef?.current?.offsetLeft, frameRef?.current?.offsetTop);
  }, [mouseDownAction]);

  const renderCorners = (tp: Actions) => {
    const corners: Record<string, number>[] = [
      { top: 0, left: 0 },
      { top: 0, right: 0 },
      { bottom: 0, left: 0 },
      { bottom: 0, right: 0 },
    ];
    return corners.map((localItem, index) => (
      <div
        key={index}
        className={`${tp === Actions.SCALE ? 'mtrl__drag-corner' : 'mtrl__rotator-cntrl'}`}
        style={localItem}
      />
    ));
  };

  return (
    <div ref={frameRef} className="mtrl__frame" style={stylesFrame} data-id={id}>
      <div className="mtrl__cover" style={stylesCover}>
        <div className="mtrl__rotator" style={null}>
          {renderCorners(Actions.ROTATE)}
          <div ref={innerRef} className="mtrl__rotator-inner" />
        </div>
      </div>
      {renderCorners(Actions.SCALE)}
    </div>
  );
};
