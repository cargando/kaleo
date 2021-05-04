import React, { ReactElement, useLayoutEffect } from 'react';
import { observer, inject } from 'mobx-react';
import Li from 'components/li';

const App = inject('MaterialsStore')(
  observer(
    (props: any): ReactElement => {
      useLayoutEffect(() => {
        props.MaterialsStore.fetch();
      }, []); // eslint-disable-line

      const { cnt = 0, setCnt } = props.MaterialsStore;

      console.log('Props:', props.MaterialsStore);
      return (
        <div className="App">
          <Li value={cnt} onChange={setCnt} />
        </div>
      );
    },
  ),
);

export default App;
