import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DNDActions } from 'hooks/types';
import { TSelectedMaterial } from 'store/types';
import './styles.scss';
import { ResizeCorner } from './resizeCorner';
import { ScaleCorner } from './scaleCorner';
import ResizableRect from 'react-resizable-rotatable-draggable';

interface TBaseMaterialViewerProps {
  item: TSelectedMaterial;
  isActive: boolean;
  onMove: (x?: number, y?: number, id?: number) => void;
  onResize: (t: number, l: number, w: number, h: number, id?: number) => void;
  onRotate: (v: number, id: number) => void;
  onChangeRotation: (deg: number, id: number) => void;
  onClick: (id: number) => void;
}

interface TBaseMaterialViewerState {
  // action: DNDActions;
  mouse?: Record<string, number>; // mouse down coords
  lastPosition: Record<string, number>;
}

interface TCornerRef {
  node: HTMLElement;
  id: string;
  lastPosition: Record<string, number>;
}

export class BaseMaterialViewer extends React.Component<TBaseMaterialViewerProps, TBaseMaterialViewerState> {
  elementRef = React.createRef<HTMLDivElement>();

  elementInnerRef = React.createRef<HTMLDivElement>();

  cornerRefs: Record<string, any> = {};

  rotorRefs: Record<string, any> = {};

  mouseMoved = false;

  action: DNDActions = null;

  pressedCorner: TCornerRef = { node: null, id: null, lastPosition: null };

  constructor(props) {
    super(props);

    this.state = {
      // action: null,
      // mouse: null,
      lastPosition: null,
    };
  }

  isInCorner = (target: EventTarget, tp: DNDActions): boolean => {
    const data = tp === DNDActions.SCALE ? this.cornerRefs : this.rotorRefs;
    if (Object.values(data).indexOf(target) !== -1) {
      return true;
    }
    return false;
  };

  resizeFrame = (dX: number, dY: number) => {
    const { x, y, w, h } = this.state.lastPosition;
    let res: any = {};
    if (this.pressedCorner.id === 'TOP_RIGHT') {
      res = {
        top: `${y + dY}px`,
        left: `${x + dX}px`,
        width: `${w + dX}px`,
        height: `${h + dY}px`,
      };
    }
    return res;
  };

  handleChangeActive = () => {
    if (!this.mouseMoved) {
      this.props.onClick(this.props.item.id);
    }
    this.mouseMoved = false;
    this.action = null;
  };

  // handleResize = (dX: number, dY: number, id: number) => {
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
    const { isActive, item = {} as TSelectedMaterial } = this.props;
    const { id, srcLarge, bgScale, height, width, zIndex = 1, top, left, angle } = item;

    const stylesFrame: Record<string, any> = { top: `${top}px`, left: `${left}px` };
    const stylesCover: Record<string, any> = {
      zIndex,
      backgroundImage: `url(${srcLarge}`,
      backgroundSize: bgScale ? `${bgScale}%` : 'auto',
    };

    return (
      // <Resizable
      //   bounds="parent"
      //   handleComponent={{ topRight: this.renderCorner() }}
      //   className="mtrl__cover mtrl__cover_active"
      //   defaultSize={{ width, height }}
      //   onResize={(e, direction, ref, d) => {
      //     this.handleResize(width + d.width, height + d.height, id);
      //   }}>
      <ResizableRect
        left={left}
        top={top}
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
        // onDragEnd={this.handleDragEnd}
      >
        111
      </ResizableRect>
    );
  }
}
