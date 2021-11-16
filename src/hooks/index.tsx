import React, { useLayoutEffect, useEffect, useState, useRef, useCallback } from 'react';
import { MobXProviderContext } from 'mobx-react';
import get from 'lodash/get';
import { SCREEN } from 'utils/const';
import { TContainerCoords } from 'utils/types';
import { Actions, TuseDNDProps } from './types';
import { getCursorPosition } from '../utils/fn';

export interface IWindowSize {
  width: number;
  height: number;
}

export function useResize() {
  const [windowSize, setWindowSize] = useState<IWindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTablet = windowSize.width <= SCREEN.tablet;
  const isDesktop = windowSize.width >= SCREEN.desktop && windowSize.width < SCREEN.desktop992;
  const isDesktop992 = windowSize.width >= SCREEN.desktop992 && windowSize.width < SCREEN.desktop1200;
  const isDesktop1200 = windowSize.width >= SCREEN.desktop1200;

  return [windowSize, isTablet, isDesktop, isDesktop992, isDesktop1200];
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle(callback, delay, val, path = '') {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const watchVal = path !== '' ? get(val, path) : val;

  useLayoutEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    timer.current = setTimeout(callback, delay, val) as NodeJS.Timeout;

    return () => clearTimeout(timer.current as NodeJS.Timeout);
    // eslint-disable-next-line
  }, [watchVal]);

  return timer;
}

export function useStores() {
  return React.useContext(MobXProviderContext);
}

export function useHtmlToggle(
  isOpened: boolean,
  nodeRef: React.RefObject<HTMLInputElement>,
  className: string,
  inverse = false,
) {
  const isOpenedValue = inverse ? !isOpened : isOpened;

  useEffect(() => {
    if (isOpenedValue && nodeRef.current) {
      nodeRef.current.classList.add(className);
    } else if (!isOpenedValue && nodeRef.current) {
      nodeRef.current.classList.remove(className);
    }
  }, [isOpened, nodeRef]);
}

export const useResizeObserver = (ref: React.RefObject<HTMLElement>, callback?: (entry: DOMRectReadOnly) => void) => {
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(0);

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (!Array.isArray(entries)) {
        return;
      }

      const entry = entries[0];
      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);

      if (callback) {
        callback(entry.contentRect);
      }
    },
    [callback],
  );

  useLayoutEffect(() => {
    if (!ref || !ref.current) {
      return;
    }
    let RO = new ResizeObserver((entries: ResizeObserverEntry[]) => handleResize(entries));
    RO.observe(ref.current);

    // eslint-disable-next-line consistent-return
    return () => {
      RO.disconnect();
      RO = null;
    };
  }, [ref]);

  return [width, height];
};

export const useDNDSubscribe = (
  cleanupArr: any[],
  handleMouseDown: (e: any) => void,
  handleMouseUp: (e: any) => void,
  handleMouseMove: (e: any) => void,
) => {
  useLayoutEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [...cleanupArr]);
};

export const useDND = ({
  onMouseDown,
  onMouseUp,
  onMouseMove,
  draggable: frameRef,
  clickable = null,
  parent,
  cleanupArr,
  id = null,
}: TuseDNDProps) => {
  const [mouseDownAction, setMouseDownAction] = useState<Actions>(null);
  const [mouseCoords, setMouseCoords] = useState<TContainerCoords>(null);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const innerRef = clickable || frameRef;

      if (e.target && e.button === 0 && frameRef.current && innerRef.current === e.target) {
        const coords = getCursorPosition(frameRef.current, e);
        console.log('DOWN', coords);
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
    setMouseCoords(null);
    const { offsetLeft, offsetTop } = frameRef.current;
    // console.log('UP > ', offsetLeft, offsetTop);
    if (typeof onMouseUp === 'function') {
      // onChangeCoords(offsetLeft, offsetTop - 53, id);
      onMouseUp(offsetLeft, offsetTop - 53, id);
    }
  }, [mouseDownAction, mouseCoords]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (mouseDownAction !== null) {
        const { clientX, clientY } = e;
        const { mouseLeft, mouseTop } = mouseCoords;

        const offsetX = clientX - mouseLeft;
        const offsetY = clientY - mouseTop;
        const newLeft = left + offsetX;
        const newTop = top + offsetY;

        console.log('MOVE', offsetX, offsetY);
        frameRef.current.style.left = `${newLeft}px`;
        frameRef.current.style.top = `${newTop}px`;
      }
    },
    [mouseDownAction, mouseCoords],
  );

  useDNDSubscribe(cleanupArr, onMouseDown, onMouseUp, onMouseMove);
};
