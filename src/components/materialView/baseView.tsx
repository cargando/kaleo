import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DNDActions } from 'hooks/types';
import { TSelectedMaterial } from 'store/types';
import './styles.scss';
import { ResizeCorner } from './resizeCorner';
import { ScaleCorner } from './scaleCorner';
import { Resizable } from 'components/resizable';

interface TBaseMaterialViewerProps {
  item: TSelectedMaterial;
  isActive: boolean;
  onChangeCoords: (x?: number, y?: number, id?: number) => void;
  onResize: (w: number, h: number, id: number) => void;
  onChangeRotation: (deg: number, id: number) => void;
  onClick: (id: number) => void;
}

interface TBaseMaterialViewerState {
  // action: DNDActions;
  mouse: Record<string, number>; // mouse down coords
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
      mouse: null,
      lastPosition: null,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mouseup', this.handleMouseUp, true);
    document.addEventListener('mousemove', this.handleMouseMove);

    if (this.elementRef.current) {
      const { offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h } = this.elementRef.current;
      this.setState({ lastPosition: { x, y, w, h } });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
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

  handleMouseDown = (e: MouseEvent) => {
    const { clientX: x, clientY: y, target, button } = e;

    if (!this.action && button === 0) {
      this.setState({ mouse: { x, y } });
      if (target === this.elementInnerRef.current) {
        this.action = DNDActions.MOVE;
      } else if (this.isInCorner(target, DNDActions.SCALE)) {
        this.action = DNDActions.SCALE;
      } else if (this.isInCorner(target, DNDActions.ROTATE)) {
        this.action = DNDActions.ROTATE;
      }
      if (this.action === DNDActions.ROTATE || this.action === DNDActions.SCALE) {
        this.pressedCorner.node = target as HTMLElement;
        this.pressedCorner.id = (target as HTMLTextAreaElement).getAttribute('data-position');
        // eslint-disable-next-line @typescript-eslint/no-redeclare
        const { offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h } = target as HTMLElement;
        this.pressedCorner.lastPosition = { x, y, w, h };
      }
      console.log('this.action', this.action, target, this.cornerRefs);
    }
    return false;
  };

  handleMouseMove = (e: MouseEvent) => {
    const { clientX: x, clientY: y } = e;
    if (this.props.isActive) {
      this.mouseMoved = true;
      const { mouse, lastPosition } = this.state;
      const frame = this.elementRef.current;
      if (this.action === DNDActions.MOVE) {
        const newX = lastPosition.x + (x - mouse.x);
        const newY = lastPosition.y + (y - mouse.y);
        frame.style.left = `${newX}px`;
        frame.style.top = `${newY}px`;
      } else if (this.action === DNDActions.SCALE) {
        const { target } = e;
        const newXs = this.pressedCorner.lastPosition.x + (x - mouse.x);
        const newYs = this.pressedCorner.lastPosition.y + (y - mouse.y);
        (target as HTMLElement).style.left = `${newXs}px`;
        (target as HTMLElement).style.top = `${newYs}px`;

        const newCoords = this.resizeFrame(newXs, newYs);
        console.log('Delta', newXs, newYs, newCoords, this.action);

        // frame.style.left = newCoords.left;
        // frame.style.top = newCoords.top;
        // frame.style.width = newCoords.width;
        // frame.style.height = newCoords.height;

        // s
      }
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    if (this.action !== null) {
      const { offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h } = this.elementRef.current;
      this.setState({ lastPosition: { x, y, w, h } });
    }
    this.action = null;
    return false;
    this.pressedCorner.node = null;
    this.pressedCorner.id = null;
  };

  handleResize = (dX: number, dY: number, id: number) => {
    this.props.onResize(dX, dY, id);
    console.log('Resize >> ', dX, dY, id);
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
    const { id, srcLarge, bgScale, height, width, zIndex = 1, top, left, rotate } = item;

    const stylesFrame: Record<string, any> = { top: `${top}px`, left: `${left}px` };
    const stylesCover: Record<string, any> = {
      zIndex,
      backgroundImage: `url(${srcLarge}`,
      backgroundSize: bgScale ? `${bgScale}%` : 'auto',
    };

    return (
      <Resizable
        bounds="parent"
        handleComponent={{ topRight: this.renderCorner() }}
        className="mtrl__cover mtrl__cover_active"
        defaultSize={{ width, height }}
        onResize={(e, direction, ref, d) => {
          this.handleResize(width + d.width, height + d.height, id);
        }}>
        <div ref={this.elementRef} className="mtrl__frame" data-id={id}>
          <div className={`mtrl__cover ${isActive ? 'mtrl__cover_active' : ''}`} style={stylesCover}>
            <div className="mtrl__buffer">
              <div className="mtrl__rotator" style={null}>
                {isActive && this.renderCorners(DNDActions.ROTATE)}
                <div
                  ref={this.elementInnerRef}
                  onClick={this.handleChangeActive}
                  className={`mtrl__rotator-inner ${isActive ? 'mtrl__rotator-inner_active' : ''}`}
                />
              </div>
            </div>
          </div>
          {isActive && this.renderCorners(DNDActions.SCALE)}
        </div>
      </Resizable>
    );
  }
}
