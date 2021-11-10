import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
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
  let action = '';

  const isOpenedValue = inverse ? !isOpened : isOpened;
  console.log('useHtmlToggle', isOpened, nodeRef);
  useEffect(() => {
    if (isOpenedValue && nodeRef.current) {
      nodeRef.current.classList.add(className);
      action = 'ADD';
    } else if (!isOpenedValue && nodeRef.current) {
      nodeRef.current.classList.remove(className);
      action = 'REMOVE';
    }
  }, [isOpened, nodeRef]);

  return action;
}
