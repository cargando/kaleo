import React from 'react';
import { observer } from 'mobx-react';
import throttle from 'lodash/throttle';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { FooterControlPicker } from '../../../components/platePikers/footerPlate';
import { BaseMaterialViewer } from '../../../components/materialView';
import { MaterialsTP } from '../../../store/types';

export interface TMaterialTabProps {
  title?: string;
}

export const MaterialTab: React.FC<TMaterialTabProps> = observer(({ title }) => {
  const { App, Materials }: Partial<TStore> = useStores();

  const handleChangeCoords = (x?: number, y?: number, id?: number) => {
    // throttle(callbakc, 300)
    Materials.setMtrlPlateCoords(x, y, id);
    return null;
  };
  const handleChangeScale = (w: number, h: number) => {
    return null;
  };
  const handleChangeRotation = (deg: number) => {
    return null;
  };

  return (
    <>
      <div className="mtrl">
        <h2>Material Tab {title}</h2>
        <BaseMaterialViewer
          item={Materials?.Data?.(MaterialsTP.MTRL_GENERATED)?.[0]}
          onChangeCoords={handleChangeCoords}
          onChangeScale={handleChangeScale}
          onChangeRotation={handleChangeRotation}
        />
      </div>
      <FooterControlPicker vm={Materials} />
    </>
  );
});
