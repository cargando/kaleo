import React from 'react';
import { observer } from 'mobx-react';
import { TopLine } from '../topLine';
import { GenerateCol, MaterialCol } from './leftColumn';
import { UploadImages } from '../modals/uploadImage';

export interface TLayoutProps {
  children?: React.ReactNode;
}

export const Layout = observer(({ children }: TLayoutProps) => {
  return (
    <>
      <UploadImages />
      <div className="app">
        <GenerateCol />
        <div className="app__right-col">
          <TopLine />
          <div className="container app__right-col-down">{children}</div>
        </div>
      </div>
    </>
  );
});

export default Layout;
