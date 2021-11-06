import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { TStore } from 'store';
import { Accordion, AccordionContainer } from 'components/Accordion';
import { useHtmlToggle, useStores } from '../../hooks/index';
import { TopLine } from '../topLine';
import { Button } from '../button';
import { DropDown } from '../dropdown';
import { ALL_IMAGES, matchURLvsNames } from '../../utils/fn';
import { WoodPicker } from '../woodPicker';

export interface TLayoutProps {
  children?: React.ReactNode;
}

export const Layout = observer(({ children }: TLayoutProps) => {
  const { App }: Pick<TStore, 'App'> = useStores();
  const leftRef = React.useRef(null);

  useHtmlToggle(App.isLeftColOpened, leftRef, 'app__left-col_opened');

  console.log('Props:', App);

  return (
    <div className="app">
      <div ref={leftRef} className={`app__left-col ${App.isLeftColOpened ? 'app__left-col_opened' : ''}`}>
        <AccordionContainer>
          <Accordion title="Выбранные материалы">
            some textsome textsome textsome textsome textsome textsome textsome textsome text
          </Accordion>
          <Accordion isOpened title="Загрузка своего образца">
            <Button size="L" outline>
              Выбрать текстуру...
            </Button>
          </Accordion>
        </AccordionContainer>
        <AccordionContainer size="sm">
          <Accordion sidePadding isOpened title="Выбор из каталога материалов">
            <div className="accordion__padding-sm">
              <DropDown title="Категория" subTitle="Шпон" titleImg={ALL_IMAGES?.['./shpon_13.png']?.default} />
            </div>
            <WoodPicker sidePadding title="Выберите цвет" />

            <div className="accordion__padding-sm">
              <DropDown title="Уровень влияния" subTitle="Шпон" titleImg={ALL_IMAGES?.['./shpon_13.png']?.default} />
            </div>
          </Accordion>
        </AccordionContainer>
      </div>
      <div className="app__right-col">
        <TopLine />
        <div className="container app__right-col-down">{children}</div>
      </div>
    </div>
  );
});

export default Layout;
