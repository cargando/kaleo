import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { STOREs, TStore } from 'store';
import { useHtmlToggle, useStores } from '../../../hooks';

export interface TLeftColProps {
  children?: React.ReactNode;
}

export const LeftCol = observer(({ children }: TLeftColProps) => {
  const { App }: Pick<TStore, STOREs.App> = useStores();
  const leftRef = React.useRef(null);

  const res = useHtmlToggle(App.isLeftColOpened, leftRef, 'app__left-col_opened');

  return (
    <div ref={leftRef} className="app__left-col">
      {children}
    </div>
  );
});
