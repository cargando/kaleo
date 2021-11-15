import React, { useLayoutEffect, useEffect, useState, useRef, useCallback } from 'react';
import { MobXProviderContext } from 'mobx-react';

import { SCREEN } from 'utils/const';
import get from 'lodash/get';

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
  useEffect(() => {
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
