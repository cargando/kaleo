import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { reducer, initialState, Actions } from './reducer';
import {
  getCursorPosition,
  relativeToAbsolute,
  calcPositionFromValue,
  calcValueFromPosition,
  checkMinMax,
  convertToUserRange,
} from 'utils/fn';
import { TContainerCoords } from 'utils/types';
import { useDNDSubscribe } from 'hooks';
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
  absoluteResult?: boolean;
}

export const Slider: React.FC<ISliderProps> = ({
  shiftY = 0,
  onChange,
  sidePadding = null,
  value,
  minVal = 0,
  maxVal = 100,
  absoluteResult = false,
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
      const coords = getCursorPosition(e.currentTarget, e as any);
      const newVal = calcValueFromPosition(e.currentTarget.offsetWidth, coords.mouseInnerLeft);
      dispatch({ type: Actions.value, payload: { value: parseInt(newVal, 10) } });
    },
    [dispatch],
  );

  const handleMouseDown = useCallback(
    (e?: MouseEvent /* React.MouseEvent<HTMLElement, MouseEvent> */) => {
      if (e.target && e.target === controlRef.current) {
        const coords = getCursorPosition(coverRef.current, e);
        dispatch({ type: Actions.mouseDown, payload: { mouseDown: coords.mouseInnerLeft, clientX: e.clientX } });
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

  useDNDSubscribe([state.mouseDown], handleMouseDown, handleMouseUp, handleMouseMove);

  useEffect(() => {
    dispatch({ type: Actions.value, payload: { value } });
  }, []);

  useEffect(() => {
    // change CSS DOM position in accordance to state.value
    if (controlRef.current && borderRef.current && activeBorderRef.current) {
      const userRangeValue = convertToUserRange(minVal, maxVal, state.value);
      const position = calcPositionFromValue(borderRef.current, state.value);
      controlRef.current.style.left = `${position - 10}px`;
      activeBorderRef.current.style.width = `${position - 10}px`;
      if (typeof onChange === 'function') {
        onChange(absoluteResult ? relativeToAbsolute(userRangeValue, 0, 100) : userRangeValue);
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
