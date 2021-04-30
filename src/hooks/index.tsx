import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { SCREEN } from 'utils/const';
import get from 'lodash/get';

export function useResize() {
  const [windowSize, setWindowSize] = useState({
    width: null,
    height: null,
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

export function useThrottle(callback, delay, val, path = null) {
  const timer = useRef(0);

  const watchVal = path !== null ? get(val, path) : val;

  useLayoutEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(callback, delay, val);

    return () => clearTimeout(timer.current);
  }, [watchVal]);

  return timer;
}
