import React, { PureComponent } from 'react';
import { getLength, getAngle, getCursor } from '../utils';
import StyledRect from './StyledRect';
import { ReactComponent as Compass } from 'assets/icons/svgs/regular/compass.svg';
import { ReactComponent as LiftUP } from 'assets/icons/svgs/solid/long-arrow-alt-up2.svg';
import { ReactComponent as MoveDOWN } from 'assets/icons/svgs/solid/long-arrow-alt-down2.svg';

const MIN_WH = 20;

const zoomableMap = {
  n: 't',
  s: 'b',
  e: 'r',
  w: 'l',
  ne: 'tr',
  nw: 'tl',
  se: 'br',
  sw: 'bl',
};

export interface TRectProps {
  styles: Record<string, any>;
  zoomable: string;
  rotatable: boolean;
  onResizeStart: (...arg) => void;
  onResize: (...arg) => void;
  onResizeEnd: (...arg) => void;
  onRotateStart: (...arg) => void;
  onRotate: (...arg) => void;
  onResetRotation?: (...arg) => void;
  onRotateEnd: (...arg) => void;
  onDragStart: (...arg) => void;
  onDrag: (...arg) => void;
  onDragEnd: (...arg) => void;
  onSetLayer?: (...arg) => void;
  parentRotateAngle: number;
  onClick?: (...arg) => void;
  onDoubleClick?: (...arg) => void;
  className?: string;
  color?: string;
  zIndex?: number;
}

export default class Rect extends PureComponent<TRectProps> {
  // static propTypes = {
  //   styles: PropTypes.object,
  //   zoomable: PropTypes.string,
  //   rotatable: PropTypes.bool,
  //   onResizeStart: PropTypes.func,
  //   onResize: PropTypes.func,
  //   onResizeEnd: PropTypes.func,
  //   onRotateStart: PropTypes.func,
  //   onRotate: PropTypes.func,
  //   onRotateEnd: PropTypes.func,
  //   onDragStart: PropTypes.func,
  //   onDrag: PropTypes.func,
  //   onDragEnd: PropTypes.func,
  //   parentRotateAngle: PropTypes.number
  // }
  $element = null;

  _isMouseDown = null;

  setElementRef = (ref) => {
    this.$element = ref;
  };

  // Drag
  startDrag = (e) => {
    let { clientX: startX, clientY: startY } = e;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.props.onDragStart && this.props.onDragStart();
    this._isMouseDown = true;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const onMove = (e) => {
      if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      this.props.onDrag(deltaX, deltaY);
      startX = clientX;
      startY = clientY;
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (!this._isMouseDown) return;
      this._isMouseDown = false;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.props.onDragEnd && this.props.onDragEnd();
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // Rotate
  startRotate = (e) => {
    if (e.button !== 0) return;
    const { clientX, clientY } = e;
    const {
      styles: {
        transform: { rotateAngle: startAngle },
      },
    } = this.props;
    const rect = this.$element.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const startVector = {
      x: clientX - center.x,
      y: clientY - center.y,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.props.onRotateStart && this.props.onRotateStart();
    this._isMouseDown = true;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const onMove = (e) => {
      if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { clientX, clientY } = e;
      const rotateVector = {
        x: clientX - center.x,
        y: clientY - center.y,
      };
      const angle = getAngle(startVector, rotateVector);
      this.props.onRotate(angle, startAngle);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (!this._isMouseDown) return;
      this._isMouseDown = false;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.props.onRotateEnd && this.props.onRotateEnd();
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // Resize
  startResize = (e, cursor) => {
    if (e.button !== 0) return;
    document.body.style.cursor = cursor;
    const {
      styles: {
        position: { centerX, centerY },
        size: { width, height },
        transform: { rotateAngle },
      },
    } = this.props;
    const { clientX: startX, clientY: startY } = e;
    const rect = { width, height, centerX, centerY, rotateAngle };
    const type = e.target.getAttribute('class').split(' ')[0];
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.props.onResizeStart && this.props.onResizeStart();
    this._isMouseDown = true;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const onMove = (e) => {
      if (!this._isMouseDown) return; // patch: fix windows press win key during mouseup issue
      e.stopImmediatePropagation();
      const { clientX, clientY } = e;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      const alpha = Math.atan2(deltaY, deltaX);
      const deltaL = getLength(deltaX, deltaY);
      const isShiftKey = e.shiftKey;
      this.props.onResize(deltaL, alpha, rect, type, isShiftKey);
    };

    const onUp = () => {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (!this._isMouseDown) return;
      this._isMouseDown = false;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.props.onResizeEnd && this.props.onResizeEnd();
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  handleResetRotation = () => {
    if (typeof this.props.onResetRotation === 'function') {
      this.props.onResetRotation();
    }
  };

  handleSetLayer = (e: React.MouseEvent) => {
    const moveTo = (e.target as HTMLTextAreaElement).getAttribute('data-To');
    if (typeof this.props.onSetLayer === 'function') {
      this.props.onSetLayer(moveTo);
    }
  };

  render() {
    const {
      styles: {
        position: { centerX, centerY },
        size: { width, height },
        transform: { rotateAngle },
      },
      zoomable,
      rotatable,
      parentRotateAngle,
      color,
      zIndex,
    } = this.props;
    const style = {
      width: Math.abs(width),
      height: Math.abs(height),
      transform: `rotate(${rotateAngle}deg)`,
      left: centerX - Math.abs(width) / 2,
      top: centerY - Math.abs(height) / 2,
      zIndex: zIndex + 1,
      cursor: 'move',
    };
    const direction = zoomable
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d); // TODO: may be speed up

    return (
      <StyledRect
        color={color}
        ref={this.setElementRef}
        onMouseDown={this.startDrag}
        className="rect single-resizer"
        style={style}>
        <div className="controls_plate">
          <div className="control__box compass" />
          <div
            className="control__box compass"
            style={{ transform: `rotate(-${rotateAngle + 45}deg)` }}
            aria-label="Вращение">
            {rotatable && rotateAngle !== 0 && (
              <Compass fill={color} onClick={this.handleResetRotation} style={{ width: '21px' }} />
            )}
          </div>

          {rotatable && (
            <div
              className="control__box rotate"
              onMouseDown={this.startRotate}
              style={{ transform: `rotate(-${rotateAngle}deg)` }}>
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.536 3.464A5 5 0 1 0 11 10l1.424 1.425a7 7 0 1 1-.475-9.374L13.659.34A.2.2 0 0 1 14 .483V5.5a.5.5 0 0 1-.5.5H8.483a.2.2 0 0 1-.142-.341l2.195-2.195z"
                  fill={color}
                  fillRule="nonzero"
                />
              </svg>
            </div>
          )}
          <div
            className="control__box liftUP"
            style={{ transform: `rotate(-${rotateAngle}deg)`, width: '22px', height: '22px' }}>
            <LiftUP fill={color} onClick={this.handleResetRotation} style={{ height: '22px' }} data-to="UP" />
          </div>
          <div
            className="control__box moveDOWN"
            style={{ transform: `rotate(-${rotateAngle}deg)`, width: '22px', height: '22px' }}>
            <MoveDOWN fill={color} onClick={this.handleResetRotation} style={{ height: '22px' }} data-to="DOWN" />
          </div>
        </div>

        {direction.map((d) => {
          const cursor = `${getCursor(rotateAngle + parentRotateAngle, d)}-resize`;
          return (
            <div
              key={d}
              style={{ cursor }}
              className={`${zoomableMap[d]} resizable-handler`}
              onMouseDown={(e) => this.startResize(e, cursor)}
            />
          );
        })}

        {direction.map((d) => {
          return <div key={d} className={`${zoomableMap[d]} square`} />;
        })}
      </StyledRect>
    );
  }
}
