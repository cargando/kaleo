import React, { useLayoutEffect, useEffect, useState, useRef, useCallback } from 'react';
import { MobXProviderContext } from 'mobx-react';
import get from 'lodash/get';
import { SCREEN } from 'utils/const';
import { dndFenceFrameCheck, getCursorPosition } from 'utils/fn';
import { TContainerCoords, TElementCoords } from 'utils/types';
import { DNDActions, TuseDNDProps, IWindowSize, TUseSimpleDND, TUseSimpleDNDProps } from './types';

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
  // const [width, setWidth] = useState<number>(0);
  // const [height, setHeight] = useState<number>(0);
  const [{ width, height, top, left, right, bottom }, setRect] = useState<Record<string, number>>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (!Array.isArray(entries)) {
        return;
      }

      const entry = entries[0];
      setRect({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
        top: entry.contentRect.top,
        left: entry.contentRect.left,
        right: entry.contentRect.right,
        bottom: entry.contentRect.bottom,
      });

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

  return [Math.round(width), Math.round(height), top, left, right, bottom];
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

// ------------------------------------------------------------------

export const useSimpleDND = (props: TUseSimpleDNDProps = {}) => {
  const elementRef = useRef(null);
  const parentFrameRef = useRef<TElementCoords>(null);
  const [dragInfo, setDragInfo] = useState<TUseSimpleDND>({
    action: null,
    preventClick: false,
    mouse: { x: 0, y: 0 },
    lastPosition: { x: 0, y: 0 },
  });

  useLayoutEffect(() => {
    if (elementRef.current) {
      const { offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h } = elementRef.current; // .getBoundingClientRect();
      setDragInfo({
        ...dragInfo,
        lastPosition: { x, y, w, h },
      });
      if (typeof props?.fenceFrame === 'string' && props.fenceFrame?.length) {
        const { parentNode } = elementRef.current;
        if (parentNode.classList.exists(props.fenceFrame)) {
          const rect = parentNode.getBoundingClientRect();
          parentFrameRef.current = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
        }
      }
    }
  }, []);

  const { action } = dragInfo;
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }

    const { clientX: x, clientY: y } = e;
    if (!action)
      setDragInfo({
        ...dragInfo,
        action: DNDActions.MOVE,
        mouse: { x, y },
      });
    if (typeof props.onMouseDown === 'function') {
      props.onMouseDown(x, y, DNDActions.MOVE);
    }
    return false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    const { clientX: x, clientY: y } = e;
    if (action === DNDActions.MOVE) {
      if (props.onClick && !dragInfo.preventClick) {
        setDragInfo({ ...dragInfo, preventClick: true });
      }

      const { mouse, lastPosition } = dragInfo;
      const newX = lastPosition.x + (x - mouse.x);
      const newY = lastPosition.y + (y - mouse.y);
      elementRef.current.style.left = `${newX}px`;
      elementRef.current.style.top = `${newY}px`;
      if (props.fenceFrame) {
        dndFenceFrameCheck({
          element: { left: newX, top: newY, width: lastPosition.w, height: lastPosition.h },
          parent: { ...parentFrameRef.current },
        });
      }
      if (typeof props.onMouseMove === 'function') {
        props.onMouseMove(x, y);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    if (action !== null) {
      const { offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h } = elementRef.current; // .getBoundingClientRect();
      setDragInfo({
        ...dragInfo,
        action: null,
        lastPosition: { x, y, w, h },
      });
      if (typeof props.onMouseUp === 'function') {
        props.onMouseUp(x, y, props.id);
      }
    }
    return false;
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (props.onClick && !dragInfo.preventClick) {
      props.onClick();
    }
    setDragInfo({ ...dragInfo, preventClick: false });
  };

  // useDNDSubscribe([elementRef, ...(props.cleanupArr || []), handleMouseDown, handleMouseUp, handleMouseMove);

  return {
    elementRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseClick,
  };
};

export interface TUseResizeContainer extends TUseSimpleDNDProps {
  onResize?: (...rest: any[]) => void;
}
// export const useResizeContainer = ({ onResize }: TUseResizeContainer) => {
//   const { elementRef, handleMouseDown, handleMouseMove, handleMouseUp } = useSimpleDND({});
//
//   return {
//     elementRef,
//     handleMouseDown,
//     handleMouseMove,
//     handleMouseUp,
//   };
// };
