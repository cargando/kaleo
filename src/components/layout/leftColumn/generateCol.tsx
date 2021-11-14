import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { MaterialSliders } from 'components/materialSliders';
import { ColorPicker, MaterialPicker } from 'components/platePikers';
import { SideBlock } from 'components/sideBlock';
import { LeftCol } from './leftCol';
import { MaterialsTP } from '../../../store/types';
import { Button } from '../../button';
import { UPLOAD_IMG_MODAL } from '../../modals/uploadImage';

export interface TGenerateColProps {
  children?: React.ReactNode;
}

export const GenerateCol = observer(({ children }: TGenerateColProps) => {
  const { Materials, Modals }: Partial<TStore> = useStores();

  const handleClickOpenModal = () => {
    Modals.showModal(UPLOAD_IMG_MODAL);
  };
  useEffect(
    () =>
      autorun(() => {
        Materials.fetch();
      }),
    [],
  );

  return (
    <LeftCol>
      <MaterialSliders />
      <SideBlock bubble={Materials.selectedCnt(MaterialsTP.COLOR)} title="Выберите цвета" sidePadding>
        <ColorPicker sidePadding vm={Materials} />
      </SideBlock>
      <SideBlock bubble={Materials.selectedCnt(MaterialsTP.MTRL_TYPE)} title="Выберите материалы" sidePadding>
        <MaterialPicker sidePadding vm={Materials} />
      </SideBlock>
      <div className="app__container" style={{ marginTop: 'auto' }}>
        <Button onClick={handleClickOpenModal} size="L">
          Добавить материал в калейдоскоп
        </Button>
      </div>
    </LeftCol>
  );
});
