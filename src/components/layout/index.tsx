import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { TStore } from 'store';
import { Accordion } from 'components/Accordion';
import { useHtmlToggle, useStores } from '../../hooks/index';
import { TopLine } from '../topLine';
import { Button } from '../button';
import { DropDown } from '../dropdown';
import { ALL_IMAGES, matchURLvsNames } from '../../utils/fn';

export interface TLayoutProps {
  children?: React.ReactNode;
}

export const Layout = observer(({ children }: TLayoutProps) => {
  const { App }: Pick<TStore, 'App'> = useStores();
  const leftRef = React.useRef(null);

  useHtmlToggle(App.isLeftColOpened, leftRef, 'app__left-col_opened');

  return (
    <div className="app">
      <div ref={leftRef} className={`app__left-col ${App.isLeftColOpened ? 'app__left-col_opened' : ''}`}>
        <div className="app__container accordions">
          <Accordion title="Выбранные материалы">
            some textsome textsome textsome textsome textsome textsome textsome textsome text
          </Accordion>
          <Accordion isOpened title="Загрузка своего образца">
            <Button size="L" outline>
              Выбрать текстуру...
            </Button>
          </Accordion>
          <Accordion isOpened title="Выбор из каталога материалов">
            <DropDown title="Категория" subTitle="Шпон" titleImg={ALL_IMAGES?.['./shpon_13.png']?.default} />
          </Accordion>
        </div>
      </div>
      <div className="app__right-col">
        <TopLine />
        <div className="container app__right-col-down">{children}</div>
      </div>
    </div>
  );
});

export default Layout;
