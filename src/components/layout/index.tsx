import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { TStore } from 'store';
import { useStores } from '../../hooks/index';
import { TopLine } from '../topLine';

export interface TLayoutProps {
  children?: React.ReactNode;
}

export const Layout = observer(({ children }: TLayoutProps) => {
  const { App }: Pick<TStore, 'App'> = useStores();
  const leftRef = React.useRef(null);

  useEffect(() => {
    if (leftRef.current) {
      leftRef.current.classList.toggle('app-left-col_opened');
    }
  }, [App.isNavOpened]);

  // btnRef.current.classList.toggle('top-line__nav-btn-inner_active');
  return (
    <div className="app">
      <div ref={leftRef} className={`app-left-col ${App.isNavOpened ? 'app-left-col_opened' : ''}`}>
        <div>1</div>
      </div>
      <div className="app-right-col">
        <TopLine />
        <div className="container app-right-col-down">{children}</div>
      </div>
    </div>
  );
});

export default Layout;
