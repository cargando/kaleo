import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { TopLine } from '../topLine';
import { GenerateCol, MaterialCol, LeftCol } from './leftColumn';
import { UploadImages } from '../modals/uploadImage';
import { STOREs, TStore } from '../../store';
import { useResizeObserver, useStores } from '../../hooks';
import { StepSlider } from '../stepSlider';

const LEFT_COL_STEPS: React.ReactNode[] = [GenerateCol, MaterialCol];

export interface TLayoutProps {
  children?: React.ReactNode;
}

export const Layout = observer(({ children }: TLayoutProps) => {
  const { App }: Pick<TStore, STOREs.App> = useStores();
  const mainCellRef = useRef(null);
  const [width, height] = useResizeObserver(mainCellRef);

  useEffect(() => {
    if (mainCellRef.current) {
      App.mainCell = { width, height };
    }
  }, [mainCellRef.current, width, height]);
  // useEffect(() => {
  //   console.log('Layout DONE');
  // }, []);

  return (
    <>
      <UploadImages />
      <div className="app">
        <LeftCol>
          <StepSlider content={LEFT_COL_STEPS} />
        </LeftCol>
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
