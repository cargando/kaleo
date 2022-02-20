import dayjs from 'dayjs';

export enum TDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGT = 'RIGT',
  DESC = 'DESC',
  ASC = 'ASC',
}

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
  zIndex?: number;
  moveLayer?: string;
  eSource?: ElementSource;
  isDragging?: boolean;
}

export enum ElementSource {
  FIRE,
  WATER,
  AIR,
  EARTH,
}
export enum ElementSourceColor {
  YELLOW, //      желтый
  ORANGE, //      оранжевый
  ROSE, //        розовый, алый
  RED, //         красный
  WHITE_BLACK, // белый, черный, золотой
  VIOLET, //      фиолетовый
  BLUE, //        синий
  LIGHT_BLUE, //  голубой
  SEA_WAVE, //    ультрамарин
  GREEN, //       зеленый
  EMERALD, //    изумрудный
}

export interface TDndFenceFrameCheck {
  element: TElementCoords;
  parent: TElementCoords;
}

export interface TElementSquare {
  square: number;
  id: number;
  index: number;
}
