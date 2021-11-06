import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { reducer, initialState, Actions } from './reducer';
import './styles.scss';

interface ISliderProps {
  width?: string;
  height?: string;
  value: number;
  onChange?: (val: number) => void;
  sidePadding?: number;
  minVal?: number;
  maxVal?: number;
  shiftY?: number;
}

export const Slider: React.FC<ISliderProps> = ({
  shiftY = 0,
  onChange,
  sidePadding = null,
  value,
  minVal = 0,
  maxVal = 100,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const controlRef = useRef(null);
  const borderRef = useRef(null);
  const coverRef = useRef(null);
  const activeBorderRef = useRef(null);

  const handleMouseClick = useCallback(
    (e?: React.MouseEvent<HTMLElement>) => {
      if (e.currentTarget !== e.target) {
        return;
      }
      const [x] = getCursorPosition(e.currentTarget, e as any);
      const newVal = calcValueFromPosition(e.currentTarget.offsetWidth, x);
      dispatch({ type: Actions.value, payload: { value: parseInt(newVal, 10) } });
    },
    [dispatch],
  );

  const handleMouseDown = useCallback(
    (e?: MouseEvent /* React.MouseEvent<HTMLElement, MouseEvent> */) => {
      if (e.target && e.target === controlRef.current) {
        const [x] = getCursorPosition(coverRef.current, e);
        dispatch({ type: Actions.mouseDown, payload: { mouseDown: x, clientX: e.clientX } });
      }
    },
    [state.mouseDown],
  );

  const handleMouseUp = useCallback(() => {
    dispatch({ type: Actions.mouseDown, payload: { mouseDown: null } });
  }, [state.mouseDown]);

  const handleMouseMove = useCallback(
    (e?: MouseEvent) => {
      if (state.mouseDown !== null) {
        const offset = e.clientX - state.clientX;
        let newLeft = state.mouseDown + offset;
        newLeft = checkMinMax(newLeft, 0, parseInt(borderRef.current.offsetWidth, 10));
        // controlRef.current.style.left = `${newLeft - 10}px`;
        const newValue = calcValueFromPosition(borderRef.current.offsetWidth, newLeft);
        dispatch({ type: Actions.value, payload: { value: +newValue } });
      }
    },
    [state.mouseDown, state.clientX],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [state.mouseDown]);

  useEffect(() => {
    dispatch({ type: Actions.value, payload: { value } });
  }, []);

  useEffect(() => {
    // change CSS DOM position in accordance to state.value
    if (controlRef.current && borderRef.current && activeBorderRef.current) {
      const position = calcPositionFromValue(borderRef.current, state.value);
      controlRef.current.style.left = `${position - 10}px`;
      activeBorderRef.current.style.width = `${position - 10}px`;
      if (typeof onChange === 'function') {
        onChange(convertToUserRange(minVal, maxVal, state.value));
      }
    }
  }, [state.value, controlRef.current, borderRef.current, activeBorderRef.current]);

  const sliderStyle: Record<string, string> = {};
  if (sidePadding) {
    sliderStyle.paddingLeft = `${sidePadding}px`;
    sliderStyle.paddingRight = `${sidePadding}px`;
  }
  if (shiftY) {
    sliderStyle.marginTop = `${shiftY}px`;
  }

  // console.log('YO', sliderStyle);
  return (
    <div className="slider" style={sliderStyle}>
      <div ref={coverRef} className="slider__cover">
        <div ref={borderRef} className="slider__border" />
        <div ref={activeBorderRef} className="slider__active-border" />
        <div ref={controlRef} className="slider__control" />
      </div>
    </div>
  );
};

// //
// //
// //
// ////////////////////////

function getCursorPosition(node: HTMLElement, e: MouseEvent) {
  const rect = node.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return [x, y, rect.left, rect.top];
}

function calcPositionFromValue(node: HTMLElement, value: number) {
  const rectBorder = node.getBoundingClientRect();
  const totalLen = rectBorder.width;
  const onePercent = totalLen / 100;
  const res = onePercent * value;
  // eslint-disable-next-line no-nested-ternary
  return res < 0 ? 0 : res > totalLen ? totalLen : res;
}

function calcValueFromPosition(nodeWidth: number | string, position: number) {
  const totalLen = typeof nodeWidth === 'string' ? parseInt(nodeWidth, 10) : nodeWidth;
  const onePercent = totalLen / 100;

  return (position / onePercent).toFixed(2);
}

function checkMinMax(val: number, min: number, max: number): number {
  if (val < min) {
    return 0;
  } else if (val > max) {
    return max;
  }
  return val;
}

function convertToUserRange(min: number, max: number, value: number) {
  const total = max - min;
  const oneP = +(total / 100).toFixed(2);
  return +(value * oneP + min).toFixed(2);
}
