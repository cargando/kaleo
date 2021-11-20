export interface IWindowSize {
  width: number;
  height: number;
}

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

export enum DNDControlsActions {
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
}

export enum DNDActions {
  SCALE,
  ROTATE,
  MOVE,
}

export interface TUseSimpleDND {
  action: DNDActions;
  preventClick?: boolean;
  mouse: Record<string, number>; // mouse down coords
  lastPosition: Record<string, number>;
}

export interface TUseSimpleDNDProps {
  onMouseDown?: (...rest: any[]) => void;
  onMouseMove?: (...rest: any[]) => void;
  onMouseUp?: (...rest: any[]) => void;
  onClick?: (...rest: any[]) => void;
  fenceFrame?: string;
  id?: number;
  cleanupArr?: any[];
  containerTargetID?: string;
  targetID?: string;
}
