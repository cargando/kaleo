import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { ALL_IMAGES } from 'utils/fn';
import { Accordion } from 'components/Accordion';
import { SideContainer } from 'components/layout/leftColumn/container';
import { Button } from 'components/button';
import { DropDown } from 'components/dropdown';
import { WoodPicker } from 'components/platePikers/woodPicker';
import { UPLOAD_IMG_MODAL } from '../../modals/uploadImage';

export interface TMaterialColProps {
  children?: React.ReactNode;
}

export const MaterialCol = observer(({ children }: TMaterialColProps) => {
  const { Modals, App }: Partial<TStore> = useStores();

  const handleClickOpenModal = useCallback(() => {
    Modals.showModal(UPLOAD_IMG_MODAL);
  }, []);

  const handleClickBack2Filters = useCallback(() => {
    App.prevLeftStep();
  }, []);
  return (
    <>
      <SideContainer>
        <Accordion title="Выбранные материалы">
          some textsome textsome textsome textsome textsome textsome textsome textsome text
        </Accordion>
        <Accordion isOpened title="Загрузка своего образца">
          <Button size="L" outline>
            Выбрать текстуру...
          </Button>
        </Accordion>
      </SideContainer>
      <SideContainer size="sm">
        <Accordion sidePadding isOpened title="Выбор из каталога материалов">
          <div className="accordion__padding-sm">
            <DropDown title="Категория" subTitle="Шпон" titleImg={ALL_IMAGES?.['./shpon_13.png']?.default} />
          </div>
          <WoodPicker sidePadding title="Выберите цвет" />

          <div className="accordion__padding-sm">
            <DropDown
              slider
              title="Уровень влияния"
              subTitle="Шпон"
              titleImg={ALL_IMAGES?.['./shpon_13.png']?.default}
            />
          </div>
        </Accordion>
      </SideContainer>
      <div className="app__container" style={{ marginTop: 'auto' }}>
        <Button onClick={handleClickOpenModal} size="L">
          Добавить материал в калейдоскоп
        </Button>
      </div>
      <div className="app__container" style={{ marginTop: '21px' }}>
        <Button onClick={handleClickBack2Filters} outline>
          Вернуться к фильтрам
        </Button>
      </div>
    </>
  );
});
