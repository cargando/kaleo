import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import { reducer, initialState, Actions } from './reducer';
import './styles.scss';

interface ISliderProps {
  width?: string;
  height?: string;
  value: number;
  onChange?: () => void;
}

export const Slider: React.FC<ISliderProps> = ({ value }) => {
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
      const newVal = calcValueFromPosition(e.currentTarget, x);
      dispatch({ type: Actions.value, payload: { value: parseInt(newVal, 10) } });
    },
    [dispatch],
  );

  const handleMouseDown = useCallback(
    (e?: MouseEvent /* React.MouseEvent<HTMLElement, MouseEvent> */) => {
      console.log('handleMouseDown target', e.target, ', current', e.currentTarget);
      if (e.target && e.target === controlRef.current) {
        const [x] = getCursorPosition(coverRef.current, e);
        dispatch({ type: Actions.mouseDown, payload: { mouseDown: x } });
        // setMouseDown(x);
        console.log('handleMouseDown IN', x, e.clientX);
      }
    },
    [state.mouseDown],
  );

  const handleMouseUp = useCallback(
    (e?: MouseEvent) => {
      console.log('handleMouseUp', e);
      dispatch({ type: Actions.mouseDown, payload: { mouseDown: null } });
      // setMouseDown(null);
    },
    [state.mouseDown],
  );

  const handleMouseMove = useCallback(
    (e?: MouseEvent) => {
      if (state.mouseDown !== null) {
        const offset = e.clientX - state.mouseDown;
        // console.log('mouseDown ', mouseDown, ' offset', offset, 'clientX', e.clientX);
        let newLeft = state.mouseDown + offset;
        newLeft = checkMinMax(newLeft, 0, parseInt(borderRef.current.offsetWidth, 10));
        const newVal = calcValueFromPosition(borderRef.current, newLeft);

        // setVal(parseInt(newVal, 10));
        // setMouseDown(parseInt(newVal, 10));
        controlRef.current.style.left = `${newLeft - 10}px`;
        // console.log('mouseDown', mouseDown, ' newVal ', newVal, 'newLeft', newLeft);
        console.log('mouseDown', state.mouseDown, 'clientX', e.clientX, 'newLeft', newLeft, 'offset', offset);
      }
    },
    [state.mouseDown],
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
    if (controlRef.current && borderRef.current && activeBorderRef.current) {
      const position = calcPositionFromValue(borderRef.current, state.value);
      controlRef.current.style.left = `${position - 10}px`;
    }
  }, [state.value, value, controlRef.current, borderRef.current]);

  return (
    <div className="slider">
      <div ref={coverRef} className="slider__cover">
        <div ref={borderRef} className="slider__border" />
        <div ref={controlRef} className="slider__control" />
        <div ref={activeBorderRef} className="slider__active-border" />
      </div>
    </div>
  );
};

function getCursorPosition(node: HTMLElement, e: MouseEvent) {
  const rect = node.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return [x, y];
}

function calcPositionFromValue(node: HTMLElement, value) {
  const rectBorder = node.getBoundingClientRect();
  const totalLen = rectBorder.width;
  const onePercent = totalLen / 100;
  const res = onePercent * value;
  // eslint-disable-next-line no-nested-ternary
  return res < 0 ? 0 : res > totalLen ? totalLen : res;
}

function calcValueFromPosition(node: HTMLElement, position) {
  const rectBorder = node.getBoundingClientRect();
  const totalLen = rectBorder.width;
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
