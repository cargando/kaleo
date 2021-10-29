import React, { ReactElement, useLayoutEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { Layout } from 'components/layout';

interface TAppProps {
  Materials?: any;
  children?: React.ReactNode;
}

const App = inject('Materials')(
  observer(
    ({ Materials, children }: TAppProps): ReactElement => {
      useLayoutEffect(() => {
        Materials.fetch();
      }, []); // eslint-disable-line
      return <Layout>{children}</Layout>;
    },
  ),
);

export default App;
