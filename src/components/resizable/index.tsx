import React, { Component } from 'react';
import Rect from './Rect';
import { centerToTL, tLToCenter, getNewStyle, degToRadian } from './utils';

const MIN_WH = 20;
const DEFAULT_COLOR = '#333333';
const DEFAULT_ZINDEX = 1;

export interface TResizableRectProps {
  left: number;
  top: number;
  width: number;
  height: number;
  rotatable?: boolean;
  rotateAngle?: number;
  parentRotateAngle?: number;
  zoomable?: string;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: any; // boolean | false
  onRotateStart?: (...args) => void;
  onRotate?: (...args) => void;
  onResetRotation?: (...args) => void;
  onSetLayer?: (...args) => void;
  onRotateEnd?: (...args) => void;
  onResizeStart?: (...args) => void;
  onResize?: (...args) => void;
  onResizeEnd?: (...args) => void;
  onDragStart?: (...args) => void;
  onDrag?: (...args) => void;
  onDragEnd?: (...args) => void;
  onClick?: (...args) => void;
  onDoubleClick?: (...args) => void;
  className?: string;
  color?: string;
  children?: React.ReactNode;
  zIndex?: number;
}

export default class ResizableRect extends Component<TResizableRectProps> {
  static defaultProps = {
    parentRotateAngle: 0,
    rotateAngle: 0,
    rotatable: true,
    zoomable: '',
    minWidth: 10,
    minHeight: 10,
  };

  handleRotate = (angle, startAngle) => {
    if (!this.props.onRotate) return;
    let rotateAngle = Math.round(startAngle + angle);
    if (rotateAngle >= 360) {
      rotateAngle -= 360;
    } else if (rotateAngle < 0) {
      rotateAngle += 360;
    }
    if (rotateAngle > 356 || rotateAngle < 4) {
      rotateAngle = 0;
    } else if (rotateAngle > 86 && rotateAngle < 94) {
      rotateAngle = 90;
    } else if (rotateAngle > 176 && rotateAngle < 184) {
      rotateAngle = 180;
    } else if (rotateAngle > 266 && rotateAngle < 274) {
      rotateAngle = 270;
    }
    this.props.onRotate(rotateAngle);
  };

  handleResize = (length, alpha, rect, type, isShiftKey) => {
    if (!this.props.onResize) return;
    const { rotateAngle, aspectRatio, minWidth = MIN_WH, minHeight = MIN_WH, parentRotateAngle } = this.props;
    const beta = alpha - degToRadian(rotateAngle + parentRotateAngle);
    const deltaW = length * Math.cos(beta);
    const deltaH = length * Math.sin(beta);
    const ratio = isShiftKey && !aspectRatio ? rect.width / rect.height : aspectRatio;
    const {
      position: { centerX, centerY },
      size: { width, height },
    } = getNewStyle(type, { ...rect, rotateAngle }, deltaW, deltaH, ratio, minWidth, minHeight);

    this.props.onResize(centerToTL({ centerX, centerY, width, height, rotateAngle }), isShiftKey, type);
  };

  handleDrag = (deltaX, deltaY) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.props.onDrag && this.props.onDrag(deltaX, deltaY);
  };

  render() {
    const {
      top,
      left,
      width,
      height,
      rotateAngle,
      parentRotateAngle,
      zoomable,
      rotatable,
      onRotate,
      onResizeStart,
      onResizeEnd,
      onRotateStart,
      onRotateEnd,
      onDragStart,
      onDragEnd,
      color = DEFAULT_COLOR,
      zIndex = DEFAULT_ZINDEX,
      onResetRotation = null,
      onSetLayer = null,
    } = this.props;

    const styles = tLToCenter({ top, left, width, height, rotateAngle });

    return (
      <Rect
        styles={styles}
        zoomable={zoomable}
        rotatable={Boolean(rotatable && onRotate)}
        parentRotateAngle={parentRotateAngle}
        onResizeStart={onResizeStart}
        onResize={this.handleResize}
        onResizeEnd={onResizeEnd}
        onRotateStart={onRotateStart}
        onRotate={this.handleRotate}
        onResetRotation={onResetRotation}
        onSetLayer={onSetLayer}
        onRotateEnd={onRotateEnd}
        onDragStart={onDragStart}
        onDrag={this.handleDrag}
        onDragEnd={onDragEnd}
        color={color}
        zIndex={zIndex}
      />
    );
  }
}
