import dayjs from 'dayjs';

export interface TContainerCoords {
  mouseInnerTop: number;
  mouseInnerLeft: number;
  elementTop: number;
  elementLeft: number;
  elementRight: number;
  elementBottom: number;
  elementParentTop: number;
  elementParentLeft: number;
  elementWidth: number;
  elementHeight: number;
  mouseTop: number;
  mouseLeft: number;
}

export interface TMakeRequestParams {
  method?: string;
  url: string;
  requestData?: any;
  callback?: (p) => any | null;
  okStatus?: number;
  getImage?: boolean;
}

export interface TMakeRequestResponse {
  status: number;
  connectError: boolean;
  error: boolean;
  data: any;
  requestDt: dayjs.Dayjs;
}

export interface TdefaultMoneyParams {
  intDelimiter?: string;
  floatDelimiter?: string;
  noFloat?: boolean;
  currency?: string;
  noCurrency?: boolean;
}

export interface TElementCoords {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  width?: number;
  height?: number;
  angle?: number;
}
export interface TDndFenceFrameCheck {
  element: TElementCoords;
  parent: TElementCoords;
}
