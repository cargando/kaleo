import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { TopLine } from '../topLine';
import { GenerateCol, MaterialCol } from './leftColumn';
import { UploadImages } from '../modals/uploadImage';
import { STOREs, TStore } from '../../store';
import { useResizeObserver, useStores } from '../../hooks';

export interface TLayoutProps {
  children?: React.ReactNode;
}

export const Layout = observer(({ children }: TLayoutProps) => {
  const { App }: Pick<TStore, STOREs.App> = useStores();
  const mainCellRef = useRef(null);
  const [width] = useResizeObserver(mainCellRef);

  useEffect(() => {
    if (mainCellRef.current) {
      App.mainCell = width;
    }
  }, [mainCellRef.current, width]);

  return (
    <>
      <UploadImages />
      <div className="app">
        <GenerateCol />
        <div className="app__right-col">
          <TopLine />
          <div className="app__splitter" />
          <div ref={mainCellRef} className="container app__main-cell">
            {children}
          </div>
        </div>
      </div>
    </>
  );
});

export default Layout;
