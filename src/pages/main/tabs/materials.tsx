import React, { useRef, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { TStore } from 'store';
import { useResizeObserver, useStores } from 'hooks';
import { FooterPicker } from 'components/platePikers/footerPlate';
import { BaseMaterialViewer } from 'components/materialView';
import { MTRL, TSelectedMaterial } from 'store/types';
import { toJS } from 'mobx';
import { debounce } from 'lodash';
import { AppStore, MaterialsStore } from '../../../store/vm';

export interface TMaterialTabProps {
  App: typeof AppStore;
  Materials: typeof MaterialsStore;
}

interface TMaterialState {
  some?: number;
}

class MaterialTab2 extends React.Component<TMaterialTabProps, TMaterialState> {
  canvasRef = React.createRef<HTMLDivElement>();

  constructor(props: TMaterialTabProps) {
    super(props);
    this.state = { some: 1 };
  }

  handleChangeCoords = (x?: number, y?: number, id?: number) => {
    this.props.Materials.setMaterialProps({ left: x, top: y, isDragging: true }, id);
    if (this.canvasRef.current && this.props.Materials.isOverlap({ left: x, top: y }, id)) {
      this.canvasRef.current.classList.add('mtrl_bordered-blink');
    } else {
      this.canvasRef.current.classList.remove('mtrl_bordered-blink');
    }
  };

  renderItem = (item: TSelectedMaterial) => {
    // console.log('RND:', item.id, item.top, item.left);
    return (
      <BaseMaterialViewer
        key={item.id}
        item={item}
        offsetTop={offsetTop}
        offsetLeft={offsetLeft}
        maxLayer={Materials.selectedLayerRange.max}
        activeID={Materials.plateWithControls}
        onMove={handleChangeCoords}
        onResize={handleResize}
        onRotate={handleRotate}
        onResetRotation={handleResetRotation}
        onSetLayer={handleSetLayer}
        onClick={handleChangeActive}
        onDragEnd={handleDragEnd}
      />
    );
  };

  render() {
    const content =
      this.props.Materials?.Data?.(MTRL.GENERATED)?.length &&
      this.props.Materials.Data(MTRL.GENERATED).map(this.renderItem);

    return (
      <>
        <div ref={this.canvasRef} className="mtrl" onClick={handleClearActive}>
          {content}
        </div>
        <FooterPicker />
      </>
    );
  }
}

export const MaterialTab: React.FC<TMaterialTabProps> = observer(({ title }) => {
  const { App, Materials }: Partial<TStore> = useStores();
  const canvasRef = useRef(null);
  const [containerWidth, containerHeight, containerTop, containerLeft] = useResizeObserver(canvasRef);

  const handleChangeCoords = useCallback(
    (x?: number, y?: number, id?: number) => {
      Materials.setMaterialProps({ left: x, top: y, isDragging: true }, id);
      if (canvasRef.current && Materials.isOverlap({ left: x, top: y }, id)) {
        canvasRef.current.classList.add('mtrl_bordered-blink');
      } else {
        canvasRef.current.classList.remove('mtrl_bordered-blink');
      }
    },
    [Materials],
  );

  const handleDragEnd = useCallback(() => {
    Materials.finishDrag();
  }, [Materials]);

  const handleResize = useCallback(
    (t: number, l: number, w: number, h: number, id?: number) => {
      Materials.setMaterialProps({ width: w, height: h, top: t, left: l }, id);
      return null;
    },
    [Materials],
  );

  const handleRotate = useCallback(
    (angle: number, id) => {
      Materials.setMaterialProps({ angle }, id);
    },
    [Materials],
  );

  const handleChangeActive = useCallback(
    (id: number) => {
      const res = Materials.plateWithControls && Materials.plateWithControls === id ? null : id;
      Materials.setActivePlate(res);
      Materials.setSelectedFilters(+res, MTRL.GENERATED);
    },
    [Materials],
  );

  const handleResetRotation = useCallback(
    (id: number) => {
      Materials.setMaterialProps({ angle: 0 }, id);
    },
    [Materials],
  );

  const handleSetLayer = useCallback(
    (moveLayer: string, id: number) => {
      Materials.setMaterialProps({ moveLayer }, id);
    },
    [Materials],
  );

  const handleClearActive = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.target === canvasRef.current) {
        Materials.setActivePlate(null);
        Materials.setSelectedFilters(null, MTRL.GENERATED);
      }
    },
    [Materials],
  );

  const debounceHelper = useCallback((val) => {
    console.log('useEffect:: Change ROOT BOX', val);
    Materials.setRoot(val);
    Materials.centerMaterialsInContainer();
  }, []);

  const updateRootBox = useCallback(debounce(debounceHelper, 150), [containerWidth, containerHeight]);

  useEffect(() => {
    if (canvasRef.current) {
      if (Materials.isDragging) {
        canvasRef.current.classList.add('mtrl_bordered');
      } else {
        canvasRef.current.classList.remove('mtrl_bordered');
      }
    }
  }, [Materials.isDragging]);

  useEffect(() => {
    if (canvasRef.current) {
      updateRootBox({ top: containerTop, left: containerLeft, width: containerWidth, height: containerHeight });
    }
  }, [containerWidth, containerHeight]);

  useEffect(() => {
    console.log('useEffect:: Materials.repositionMaterialsBySquare');
    Materials.repositionMaterialsBySquare();
  }, [Materials]);

  const { widthHalf: offsetLeft, heightHalf: offsetTop } = Materials.getRootBox();

  const renderItem = (item: TSelectedMaterial) => {
    // console.log('RND:', item.id, item.top, item.left);
    return (
      <BaseMaterialViewer
        key={item.id}
        item={item}
        offsetTop={offsetTop}
        offsetLeft={offsetLeft}
        maxLayer={Materials.selectedLayerRange.max}
        activeID={Materials.plateWithControls}
        onMove={handleChangeCoords}
        onResize={handleResize}
        onRotate={handleRotate}
        onResetRotation={handleResetRotation}
        onSetLayer={handleSetLayer}
        onClick={handleChangeActive}
        onDragEnd={handleDragEnd}
      />
    );
  };

  const content = Materials?.Data?.(MTRL.GENERATED)?.length && Materials.Data(MTRL.GENERATED).map(renderItem);

  return (
    <>
      <div ref={canvasRef} className="mtrl" onClick={handleClearActive}>
        {content}
      </div>
      <FooterPicker />
    </>
  );
});
