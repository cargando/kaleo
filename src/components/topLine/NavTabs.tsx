import React, { useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import throttle from 'lodash/throttle';
import { TopLineTabs } from 'store/vm';

export interface TNavTabItem {
  id: TopLineTabs;
  title: string;
  component: React.FunctionComponent<any>;
}

export interface NavTabsProps {
  items: TNavTabItem[];
  active?: number;
  onChange: (n: number) => void;
}

const subscribeHelper = (
  container: HTMLElement,
  callbakc: (e: React.SyntheticEvent) => void,
  action = 'subscribe',
): boolean => {
  const events = 'mousemove touchmove';
  events.split(' ').forEach((eventName) => {
    if (container?.children?.length) {
      [].slice.call(container.children).forEach((node) => {
        const a = node?.firstChild;
        if (a?.tagName?.toUpperCase() === 'A' && a?.getAttribute('role') === 'tab') {
          if (action === 'subscribe') {
            a.addEventListener(eventName, throttle(callbakc, 300));
          } else {
            a.removeEventListener(eventName, callbakc);
          }
        }
      });
    }
    // console.log('current', containerRef.current, containerRef.current.children); // .addEventListener(eventName, moveUnderline);
  });

  return false;
};

const repositionUnderline = (container: HTMLElement, underliner: HTMLElement, active: number) => {
  if (container && underliner && container?.children?.length) {
    [].slice.call(container.children).forEach((node) => {
      const a = node?.firstChild;
      console.log('active', active, a);
      if (
        a?.tagName?.toUpperCase() === 'A' &&
        a?.getAttribute('role') === 'tab' &&
        +a?.getAttribute('data-id') === active
      ) {
        console.log('active', active, node.offsetLeft);
        underliner.style.left = `${node.offsetLeft - 28}px`;
      }
    });
  }
};

export const NavTabs: React.FC<NavTabsProps> = observer(({ items, active, onChange }) => {
  const containerRef = useRef(null);
  const underlineRef = useRef(null);
  const activeItemRef = useRef(null);
  let isAlive = true;

  const moveUnderline = useCallback((e: React.SyntheticEvent) => {
    // e.persist();
    // e.preventDefault();
    // @ts-ignore
    // e.stopImmediatePropagation();
    console.log('E = ', e);
  }, []);

  const handleClickHref = useCallback((e) => {
    e.persist();
    e.preventDefault();

    if (e?.currentTarget?.tagName?.toUpperCase() === 'A') {
      const node = e.currentTarget;
      const val = node.getAttribute('data-id');

      onChange(parseInt(val, 10));
      repositionUnderline(containerRef.current, underlineRef.current, parseInt(val, 10));
    } else {
      console.warn('NavTabs, has no target');
    }
  }, []);

  useEffect(() => {
    if (containerRef.current && isAlive) {
      subscribeHelper(containerRef.current, moveUnderline);
    }

    return () => {
      subscribeHelper(containerRef.current, moveUnderline, 'undo');
      isAlive = false;
    };
  }, [isAlive, containerRef.current, underlineRef.current]);

  return (
    <nav className="top-line__icons nav">
      <ul ref={containerRef} className="nav-tabs" id="myTabs" role="tablist">
        {items.map((item, index) => {
          const Component = item.component;

          return (
            <li key={index} role="presentation" className={active === index ? 'active' : ''}>
              <a
                onClick={handleClickHref}
                href={`#${item.title}`}
                role="tab"
                data-id={item.id}
                data-index={index}
                data-toggle="tab"
                aria-controls={item.title}
                aria-expanded="true">
                <Component />
              </a>
            </li>
          );
        })}
        <li ref={underlineRef} className="nav-underline" role="presentation" />
      </ul>
    </nav>
  );
});
