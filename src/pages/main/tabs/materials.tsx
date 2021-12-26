import React, { useRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import { STOREs, TStore } from 'store';
import { useStores } from 'hooks';
import { FooterControlPicker } from 'components/platePikers/footerPlate';
import { BaseMaterialViewer } from 'components/materialView';
import { MaterialsTP, TSelectedMaterial } from 'store/types';
import { toJS } from 'mobx';

export interface TMaterialTabProps {
  title?: string;
}

export const MaterialTab: React.FC<TMaterialTabProps> = observer(({ title }) => {
  const { App, Materials }: Partial<TStore> = useStores();
  const canvasRef = useRef(null);

  const handleChangeCoords = useCallback((x?: number, y?: number, id?: number) => {
    Materials.setMaterialProps({ left: x, top: y }, id);
  }, []);

  const handleResize = useCallback((t: number, l: number, w: number, h: number, id?: number) => {
    Materials.setMaterialProps({ width: w, height: h, top: t, left: l }, id);
    return null;
  }, []);

  const handleRotate = useCallback((angle: number, id) => {
    Materials.setMaterialProps({ angle }, id);
  }, []);

  const handleChangeActive = useCallback((id: number) => {
    const res = Materials.plateWithControls && Materials.plateWithControls === id ? null : id;
    Materials.setActivePlate(res);
  }, []);

  const handleResetRotation = useCallback((id: number) => {
    Materials.setMaterialProps({ angle: 0 }, id);
  }, []);

  const handleSetLayer = useCallback((moveLayer: string, id: number) => {
    Materials.setMaterialProps({ moveLayer }, id);
  }, []);

  const handleClearActive = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === canvasRef.current) {
      Materials.setActivePlate(null);
    }
  }, []);

  const renderItem = (item: TSelectedMaterial) => {
    return (
      <BaseMaterialViewer
        key={item.id}
        item={item}
        activeID={Materials.plateWithControls}
        onMove={handleChangeCoords}
        onResize={handleResize}
        onRotate={handleRotate}
        onResetRotation={handleResetRotation}
        onSetLayer={handleSetLayer}
        onClick={handleChangeActive}
      />
    );
  };

  return (
    <>
      <div ref={canvasRef} className="mtrl" onClick={handleClearActive}>
        {Materials?.Data?.(MaterialsTP.MTRL_GENERATED)?.length &&
          Materials.Data(MaterialsTP.MTRL_GENERATED).slice(4, 8).map(renderItem)}
      </div>
      <FooterControlPicker vm={Materials} activeID={Materials.plateWithControls} />
    </>
  );
});
