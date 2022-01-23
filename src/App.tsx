import React, { Suspense, ReactElement, useLayoutEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { Layout } from 'components/layout';
import Spinner from 'components/spinner';

interface TAppProps {
  Materials?: any;
  children?: React.ReactNode;
}

const App = inject('Materials')(
  observer(({ Materials, children }: TAppProps): ReactElement => {
    // useLayoutEffect(() => {
    //   Materials.fetch();
    // }, []); // eslint-disable-line
    return (
      <Layout>
        <Suspense fallback={<Spinner bgColor="#efefef" width="50" fullCenter />}>{children}</Suspense>
      </Layout>
    );
  }),
);

export default App;
