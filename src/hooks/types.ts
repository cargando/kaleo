export interface TuseDNDProps {
  onMouseDown?: (...rest: any[]) => void;
  onMouseUp?: (...rest: any[]) => void;
  onMouseMove?: (...rest: any[]) => void;
  draggable: any;
  clickable?: any;
  parent?: any;
  cleanupArr: any[];
  id?: number;
}

export enum Actions {
  SCALE,
  ROTATE,
  MOVE,
}
