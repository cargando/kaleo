import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DNDActions } from 'hooks/types';
import { TSelectedMaterial } from 'store/types';
import './styles.scss';
import { ResizeCorner } from './resizeCorner';
import { ScaleCorner } from './scaleCorner';
import ResizableRect from 'components/resizable';
// import ResizableRect from 'react-resizable-rotatable-draggable';

interface TBaseMaterialViewerProps {
  item: TSelectedMaterial;
  activeID: number;
  offsetLeft?: number; // смещение для центрирования по Х
  offsetTop?: number; // смещение для центрирования по Y
  maxLayer?: number;
  onMove: (x?: number, y?: number, id?: number) => void;
  onResize: (t: number, l: number, w: number, h: number, id?: number) => void;
  onRotate: (v: number, id: number) => void;
  onResetRotation?: (id: number) => void;
  onDragEnd?: () => void;
  onSetLayer?: (v: string, id: number) => void;
  onClick: (id: number) => void;
}

export class BaseMaterialViewer extends React.Component<TBaseMaterialViewerProps> {
  elementRef = React.createRef<HTMLDivElement>();

  elementInnerRef = React.createRef<HTMLDivElement>();

  cornerRefs: Record<string, any> = {};

  rotorRefs: Record<string, any> = {};

  mouseMoved = false;

  action: DNDActions = null;

  componentDidMount() {
    console.log('BaseMaterialViewer DONE');
  }

  handleChangeActive = () => {
    if (!this.mouseMoved) {
      this.props.onClick(this.props.item.id);
    }
    this.mouseMoved = false;
    this.action = null;
  };

  handleResetRotation = () => {
    this.props.onResetRotation(this.props.item.id);
  };

  handleSetLayer = (v: string) => {
    this.props.onSetLayer(v, this.props.item.id);
  };

  handleResize = (t: number, l: number, w: number, h: number, id?: number) => {
    this.props.onResize(t, l, w, h, id);
  };

  renderCorners = (tp: DNDActions) => {
    const corners: Record<string, number>[] = [
      { top: 0, left: 0 },
      { top: 0, right: 0 },
      { bottom: 0, left: 0 },
      { bottom: 0, right: 0 },
    ];
    return corners.map((localItem, index) => {
      const positionTxt = Object.keys(localItem)
        .map((keyName: string) => keyName.toUpperCase())
        .join('_');
      const Component = tp === DNDActions.SCALE ? ResizeCorner : ScaleCorner;

      const cursorCls =
        positionTxt === 'TOP_RIGHT' || positionTxt === 'BOTTOM_LEFT' ? 'resize-cursor__right' : 'resize-cursor__left';
      const shapeCls = tp === DNDActions.SCALE ? 'mtrl__drag-corner' : 'mtrl__rotator-cntrl';

      return (
        <div
          key={index}
          ref={(ref) => {
            this.cornerRefs[positionTxt] = ref;
          }}
          className={`${shapeCls} ${cursorCls}`}
          style={localItem}
          data-action={tp}
          data-position={positionTxt}
        />
      );
    });
  };

  renderCorner = () => {
    return (
      <div className="flex flex-centr" style={{ width: '100%', height: '100%' }}>
        <div className="mtrl__drag-corner" />
      </div>
    );
  };

  render() {
    const { activeID, item = {} as TSelectedMaterial, maxLayer = 0, offsetLeft = null, offsetTop = null } = this.props;
    const { id, srcLarge, bgScale, height, width, zIndex = 1, top = 0, left = 0, angle = 0 } = item;

    let backgroundSize = 'auto';
    if (typeof bgScale === 'number') {
      backgroundSize = `${bgScale}%`;
    } else if (typeof bgScale === 'string') {
      backgroundSize = bgScale;
    }

    const topWithOffset = top + (offsetTop === null ? 0 : offsetTop);
    const leftWithOffset = left + (offsetLeft === null ? 0 : offsetLeft);

    const stylesCover: Record<string, any> = {
      top: `${topWithOffset}px`,
      left: `${leftWithOffset}px`,
      width: `${width}px`,
      height: `${height}px`,
      backgroundImage: `url(${srcLarge}`,
      transform: `rotate(${angle}deg)`,
      backgroundSize,
      zIndex,
      padding: '20px',
    };

    const isActive = activeID === id;

    return (
      <>
        <div data-id={id} className="mtrl__cover" style={stylesCover} onClick={this.handleChangeActive}>
          {id}
          {/*
          <div
            ref={this.elementInnerRef}
            onClick={this.handleChangeActive}
            className={`mtrl__rotator-inner ${isActive ? 'mtrl__rotator-inner_active' : ''}`}
          />
          */}
        </div>
        {isActive && (
          <ResizableRect
            left={leftWithOffset}
            top={topWithOffset}
            width={width}
            height={height}
            rotateAngle={angle}
            aspectRatio={false}
            minWidth={20}
            minHeight={20}
            zoomable="n, w, s, e, nw, ne, se, sw"
            rotatable
            // onRotateStart={this.handleRotateStart}
            onRotate={(ang: number) => {
              this.props.onRotate(ang, id);
            }}
            onResetRotation={this.handleResetRotation}
            onSetLayer={this.handleSetLayer}
            // onRotateEnd={this.handleRotateEnd}
            // onResizeStart={this.handleResizeStart}
            onResize={(style, isShiftKey, type) => {
              this.handleResize(style.top, style.left, style.width, style.height, id);
            }}
            // onResizeEnd={this.handleUp}
            // onDragStart={this.handleDragStart}
            onDrag={(dX, dY) => {
              this.props.onMove(left + dX, top + dY, id);
            }}
            onDragEnd={this.props.onDragEnd}
            className="mtrl__cover_active"
            color="#0038ff"
            zIndex={maxLayer + 1}
          />
        )}
      </>
    );
  }
}
