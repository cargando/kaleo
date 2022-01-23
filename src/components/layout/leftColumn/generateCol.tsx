import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { MaterialSliders } from 'components/materialSliders';
import { ColorPicker, MaterialPicker } from 'components/platePikers';
import { SideBlock } from 'components/sideBlock';
import { MTRL } from '../../../store/types';
import { Button } from '../../button';
import { UPLOAD_IMG_MODAL } from '../../modals/uploadImage';

export interface TGenerateColProps {
  children?: React.ReactNode;
}

export const GenerateCol = observer(({ children }: TGenerateColProps) => {
  const { Materials, /* Modals, */ App }: Partial<TStore> = useStores();

  const handleClickOpenModal = useCallback(() => {
    // Modals.showModal(UPLOAD_IMG_MODAL);
    App.nextLeftStep();
  }, []);

  const handleClickResetFilters = useCallback(() => {
    Materials.resetSelectedFilters();
  }, []);

  useEffect(
    () =>
      autorun(() => {
        Materials.fetch();
      }),
    [],
  );

  return (
    <>
      <MaterialSliders />
      <SideBlock bubble={Materials.selectedCnt(MTRL.COLOR)} title="Выберите цвета" sidePadding>
        <ColorPicker sidePadding vm={Materials} />
      </SideBlock>
      <SideBlock
        bubble={Materials.selectedCnt(MTRL.ALL_TYPES)}
        title="Выберите материалы"
        sidePadding
        topPadding={false}>
        <MaterialPicker sidePadding vm={Materials} />
      </SideBlock>
      <div className="app__container" style={{ marginTop: 'auto' }}>
        <Button onClick={handleClickOpenModal} size="L" disabled={!Materials.isFilterOn}>
          Подобрать материалы
        </Button>
      </div>
      <div className="app__container" style={{ marginTop: '21px' }}>
        <Button onClick={handleClickResetFilters} outline>
          Сбросить фильтры
        </Button>
      </div>
    </>
  );
});
