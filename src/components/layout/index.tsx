import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { TStore } from 'store';
import { Accordion } from 'components/Accordion';
import { useStores } from '../../hooks/index';
import { TopLine } from '../topLine';
import { Button } from '../button';
import { DropDown } from '../dropdown';
import { matchURLvsNames } from '../../utils/fn';

export interface TLayoutProps {
  children?: React.ReactNode;
}

export const Layout = observer(({ children }: TLayoutProps) => {
  const { App }: Pick<TStore, 'App'> = useStores();
  const leftRef = React.useRef(null);

  const img1 = matchURLvsNames(['assets/materials/shpon_12.png']);

  useEffect(() => {
    if (leftRef.current) {
      leftRef.current.classList.toggle('app__left-col_opened');
    }
  }, [App.isNavOpened]);

  // btnRef.current.classList.toggle('top-line__nav-btn-inner_active');
  return (
    <div className="app">
      <div ref={leftRef} className={`app__left-col ${App.isNavOpened ? 'app__left-col_opened' : ''}`}>
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
            <DropDown title="Категория" subTitle="Шпон" titleImg={img1} />
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
