import dayjs from 'dayjs';

export interface TContainerCoords {
  mouseInnerTop: number;
  mouseInnerLeft: number;
  elementScreenTop: number;
  elementScreenLeft: number;
  elementParentTop: number;
  elementParentLeft: number;
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
