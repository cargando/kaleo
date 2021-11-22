import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { FooterControlPicker } from 'components/platePikers/footerPlate';
import { BaseMaterialViewer } from 'components/materialView';
import { MaterialsTP } from 'store/types';
import { toJS } from 'mobx';

export interface TMaterialTabProps {
  title?: string;
}

export const MaterialTab: React.FC<TMaterialTabProps> = observer(({ title }) => {
  const { App, Materials }: Partial<TStore> = useStores();
  const canvasRef = useRef(null);

  const handleChangeCoords = (x?: number, y?: number, id?: number) => {
    Materials.setMtrlPlateCoords({ left: x, top: y }, id);
    // console.log('DONE: ', toJS(Materials?.Data?.(MaterialsTP.MTRL_GENERATED)?.[0]));
    return null;
  };
  const handleResize = (w: number, h: number, id?: number) => {
    Materials.setMtrlPlateCoords({ width: w, height: h }, id);
    return null;
  };
  const handleChangeRotation = (deg: number) => {
    return null;
  };

  const handleChangeActive = (id: number) => {
    const res = Materials.plateWithControls && Materials.plateWithControls === id ? null : id;
    Materials.setActivePlate(res);
    console.log('Materials. ', Materials.plateWithControls);
    return null;
  };

  const handleClearActive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === canvasRef.current) {
      Materials.setActivePlate(null);
      console.log('Materials. ', Materials.plateWithControls);
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
          onResize={handleResize}
          onChangeRotation={handleChangeRotation}
          onClick={handleChangeActive}
        />
      </div>
      <FooterControlPicker vm={Materials} />
    </>
  );
});
