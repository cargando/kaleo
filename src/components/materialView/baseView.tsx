import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSimpleDND } from 'hooks';
import { DNDActions } from 'hooks/types';
import { TSelectedMaterial } from 'store/types';
import './styles.scss';
import { ResizeCorner } from './resizeCorner';
import { ScaleCorner } from './scaleCorner';
import { dndFenceFrameCheck } from '../../utils/fn';

interface TBaseMaterialViewerProps {
  item: TSelectedMaterial;
  isActive: boolean;
  onChangeCoords: (x?: number, y?: number, id?: number) => void;
  onChangeScale: (w: number, h: number, id: number) => void;
  onChangeRotation: (deg: number, id: number) => void;
  onClick: (id: number) => void;
}

interface TBaseMaterialViewerState {
  action: DNDActions;
  mouse: Record<string, number>; // mouse down coords
  lastPosition: Record<string, number>;
}

export class BaseMaterialViewer extends React.Component<TBaseMaterialViewerProps, TBaseMaterialViewerState> {
  elementRef = React.createRef<HTMLDivElement>();

  elementInnerRef = React.createRef<HTMLDivElement>();

  mouseMoved = false;

  constructor(props) {
    super(props);

    this.state = {
      action: null,
      mouse: null,
      lastPosition: null,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mouseup', this.handleMouseUp, true);
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleChangeActive = () => {
    console.log('CLICKED', this.mouseMoved);

    if (!this.mouseMoved) {
      this.props.onClick(this.props.item.id);
    }
    this.mouseMoved = false;
  };

  handleMouseDown = (e: MouseEvent) => {
    const { clientX: x, clientY: y } = e;
    if (!this.state.action) {
      this.setState({ action: DNDActions.MOVE, mouse: { x, y } });
    }
    return false;
  };

  handleMouseMove = (e: MouseEvent) => {
    const { clientX: x, clientY: y } = e;

    if (this.state.action === DNDActions.MOVE) {
      this.mouseMoved = true;
      const { mouse, lastPosition } = this.state;
      const newX = lastPosition.x + (x - mouse.x);
      const newY = lastPosition.y + (y - mouse.y);
      this.elementRef.current.style.left = `${newX}px`;
      this.elementRef.current.style.top = `${newY}px`;
      // if (props.fenceFrame) {
      //   dndFenceFrameCheck({
      //     element: { left: newX, top: newY, width: lastPosition.w, height: lastPosition.h },
      //     parent: { ...parentFrameRef.current },
      //   });
      // }
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    if (this.state.action !== null) {
      const { offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h } = this.elementRef.current; // .getBoundingClientRect();
      this.setState({ action: null, lastPosition: { x, y, w, h } });
    }
    return false;
  };

  handleResize = (dX: number, dY: number, type: string) => {
    console.log('Resize >> ', dX, dY, type);
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
      return (
        <Component key={index} action={tp} styles={localItem} position={positionTxt} onChange={this.handleResize} />
      );
    });
  };

  render() {
    const { isActive, item = {} as TSelectedMaterial } = this.props;
    const { id, srcLarge, bgScale, height, width, zIndex = 1, top, left, rotate } = item;

    const stylesFrame: Record<string, any> = { top: `${top}px`, left: `${left}px` };
    const stylesCover: Record<string, any> = {
      height,
      width,
      zIndex,
      backgroundImage: `url(${srcLarge}`,
      backgroundSize: bgScale ? `${bgScale}%` : 'auto',
    };

    return (
      <div ref={this.elementRef} className="mtrl__frame" style={{ ...stylesFrame }} data-id={id}>
        <div className={`mtrl__cover ${isActive ? 'mtrl__cover_active' : ''}`} style={stylesCover}>
          <div className="mtrl__rotator" style={null}>
            {isActive && this.renderCorners(DNDActions.ROTATE)}
            <div ref={this.elementInnerRef} onClick={this.handleChangeActive} className="mtrl__rotator-inner" />
          </div>
        </div>
        {isActive && this.renderCorners(DNDActions.SCALE)}
      </div>
    );
  }
}
