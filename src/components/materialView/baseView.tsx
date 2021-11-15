import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TSelectedMaterial } from 'store/types';
import {
  getCursorPosition,
  relativeToAbsolute,
  calcPositionFromValue,
  calcValueFromPosition,
  checkMinMax,
  convertToUserRange,
} from 'utils/fn';

import './styles.scss';
import { useDNDSubscribe } from 'hooks';
import { toJS } from 'mobx';

enum Actions {
  SCALE,
  ROTATE,
  MOVE,
}

interface TBaseMaterialViewerProps {
  item: TSelectedMaterial;
  onChangeCoords: (x: number, y: number, id: number) => void;
  onChangeScale: (w: number, h: number, id: number) => void;
  onChangeRotation: (deg: number, id: number) => void;
}
interface TMouseCoords {
  mouseDownX: number;
  mouseDownY: number;
  mouseInnerX: number;
  mouseInnerY: number;
  rectDownX: number;
  rectDownY: number;
}
const initialMouseCoords = null;

export const BaseMaterialViewer = ({
  item = {} as TSelectedMaterial,
  onChangeCoords,
  onChangeScale,
  onChangeRotation,
}: TBaseMaterialViewerProps) => {
  const { id, src, srcLarge, bgScale, height, width, zIndex = 1, top, left, rotate } = item;
  const [mouseDownAction, setMouseDownAction] = useState<Actions>(null);
  const [mouseCoords, setMouseCoords] = useState<TMouseCoords>(initialMouseCoords); // координаты MouseDown
  const frameRef = useRef(null);
  const innerRef = useRef(null);

  const stylesFrame: Record<string, any> = { top: `${top}px`, left: `${left}px` };
  const stylesCover: Record<string, any> = {
    height,
    width,
    zIndex,
    backgroundImage: `url(${item.srcLarge}`,
  };
  console.log('ITEM', toJS(item));
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.target && frameRef.current && innerRef.current) {
        const [mouseInnerX, mouseInnerY, rectDownX, rectDownY] = getCursorPosition(frameRef.current, e);
        const coords = {
          mouseDownX: e.clientX,
          mouseDownY: e.clientY,
          mouseInnerX,
          mouseInnerY,
          rectDownX,
          rectDownY,
        };
        console.log('Down', coords, top, left);
        setMouseCoords(coords);

        if (e.target === innerRef.current) {
          setMouseDownAction(Actions.MOVE);
        } else if ((e.target as HTMLTextAreaElement).classList.contains('mtrl__drag-corner')) {
          setMouseDownAction(Actions.SCALE);
        } else if ((e.target as HTMLTextAreaElement).classList.contains('mtrl__drag-cntrl')) {
          setMouseDownAction(Actions.ROTATE);
        }
      }
    },
    [mouseDownAction, mouseCoords],
  );

  const handleMouseUp = useCallback(() => {
    setMouseDownAction(null);
    setMouseCoords(initialMouseCoords);
    const crd = frameRef.current.getBoundingClientRect();
    onChangeCoords(crd.left, crd.top, id);
  }, [mouseDownAction, mouseCoords]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (mouseDownAction !== null) {
        const { clientX, clientY } = e;
        const { mouseDownX, mouseDownY, mouseInnerX, mouseInnerY, rectDownX, rectDownY } = mouseCoords;
        const offsetX = clientX - mouseDownX;
        const offsetY = clientY - mouseDownY;
        const newLeft = left + offsetX;
        const newTop = top + offsetY;
        frameRef.current.style.left = `${newLeft}px`;
        frameRef.current.style.top = `${newTop}px`;
        // onChangeCoords(newLeft, newTop, id);
      }
    },
    [mouseDownAction, mouseCoords],
  );

  useDNDSubscribe([mouseDownAction, mouseCoords], handleMouseDown, handleMouseUp, handleMouseMove);

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
