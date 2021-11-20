import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import throttle from 'lodash/throttle';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { FooterControlPicker } from '../../../components/platePikers/footerPlate';
import { BaseMaterialViewer } from '../../../components/materialView';
import { MaterialsTP } from '../../../store/types';
import { toJS } from 'mobx';

export interface TMaterialTabProps {
  title?: string;
}

export const MaterialTab: React.FC<TMaterialTabProps> = observer(({ title }) => {
  const { App, Materials }: Partial<TStore> = useStores();
  const canvasRef = useRef(null);

  const handleChangeCoords = (x?: number, y?: number, id?: number) => {
    Materials.setMtrlPlateCoords(x, y, id);
    // console.log('DONE: ', toJS(Materials?.Data?.(MaterialsTP.MTRL_GENERATED)?.[0]));
    return null;
  };
  const handleChangeScale = (w: number, h: number) => {
    return null;
  };
  const handleChangeRotation = (deg: number) => {
    return null;
  };

  const handleChangeActive = (id: number) => {
    const res = Materials.plateWithControls && Materials.plateWithControls === id ? null : id;
    Materials.setActivePlate(res);
    return null;
  };

  const handleClearActive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === canvasRef.current) {
      Materials.setActivePlate(null);
    }
    return null;
  };

  return (
    <>
      <div ref={canvasRef} className="mtrl" onClick={handleClearActive}>
        <BaseMaterialViewer
          item={Materials?.Data?.(MaterialsTP.MTRL_GENERATED)?.[0]}
          isActive={Materials.plateWithControls}
          onChangeCoords={handleChangeCoords}
          onChangeScale={handleChangeScale}
          onChangeRotation={handleChangeRotation}
          onClick={handleChangeActive}
        />
      </div>
      <FooterControlPicker vm={Materials} />
    </>
  );
});
