import dayjs from 'dayjs';
import config, { echo, fireError } from './config';
import { mkAxios } from './api';

export const APP_CONF = { ...config };

export { echo, fireError };

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

interface TdefaultMoneyParams {
  intDelimiter?: string;
  floatDelimiter?: string;
  noFloat?: boolean;
  currency?: string;
  noCurrency?: boolean;
}

export const ALL_IMAGES = {};

const importAllImages = (requireContext) =>
  requireContext.keys().forEach((key) => {
    ALL_IMAGES[key] = requireContext(key);
  });
// @ts-ignore
importAllImages(require.context('assets/materials', true, /.*\.(png|jpg)$/i));

// Object.keys(ALL_IMAGES).forEach((key) => console.log(ALL_IMAGES[key]));

export const matchURLvsNames = (names) => {
  const reg = /(\/static\/media\/)(.*)\.(png|jpg)/i;
  const res = [];

  Object.keys(ALL_IMAGES).forEach((key) => {
    names.forEach((localItem, localIndex) => {
      const webpackFileName = String(ALL_IMAGES?.[key]?.default).match(reg);
      // console.log('localItem', localItem, webpackFileName);
      if (webpackFileName?.[2]) {
        const webpackFile = webpackFileName[2].substr(0, webpackFileName[2].lastIndexOf('.')); // real image name without extension
        const propsFileName = localItem.substr(0, localItem.lastIndexOf('.'));

        if (webpackFile === propsFileName) {
          res[localIndex] = ALL_IMAGES[key];
        }
      }
    });
  });

  return res;
};

/* проверка является ли ответ ошибкой */
export function handleError(response) {
  if (response instanceof Error) {
    throw response;
  }
  throw new Error(response.data.message || 'Unknown error');
}

/* АПИ запросов */
export function makeRequest(props: TMakeRequestParams): Promise<any> {
  const { method = 'GET', url, requestData = null, callback = null, okStatus = 200, getImage = false } = props;

  if (!window.axiosAPI) {
    mkAxios();
  }
  const ax = window.axiosAPI;
  const requestParams: any = { method, url }; // , withCredentials: true
  if (Object.keys(requestData).length) {
    requestParams.data = requestData;
  }

  return new Promise((resolve) => {
    if (okStatus === 201 && getImage) {
      // если надо получить картинку в base64
      requestParams.responseType = 'arraybuffer';
    }
    ax(requestParams)
      .then((response) => {
        const { connectError = false, status, data = {} } = response;
        const error = status !== okStatus;

        if (callback && typeof callback === 'function') {
          callback(response);
        }
        const result: TMakeRequestResponse = {
          status, // статус ответа
          connectError, // ошибка сети
          error, // ошибка (если статус ответа !== okStatus)
          data, // данные
          requestDt: dayjs(), // время ответа
        };
        resolve(result);
      })
      .catch(handleError);
  }); // end of Promise
}

export function hexToRgbA(hex, opacity) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    // eslint-disable-next-line no-bitwise
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')}, ${opacity})`;
  }
  return '';
}

const defaultMoneyParams: TdefaultMoneyParams = {
  intDelimiter: ' ',
  floatDelimiter: '.',
  noFloat: true,
  currency: 'руб.',
  noCurrency: false,
};

export function printMoney(amount, params: TdefaultMoneyParams = {}) {
  const localParams: TdefaultMoneyParams = {
    ...defaultMoneyParams,
    ...params,
  };

  let a = String(amount).split('.', 2);
  const d = String(a[1]);
  let i = parseInt(a[0], 10);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(i)) {
    return '';
  }

  const numberSign = i < 0 ? '-' : '';

  i = Math.abs(i);
  let n = String(i);
  a = [];
  while (n.length > 3) {
    const nn = n.substr(n.length - 3);
    a.unshift(nn);
    n = n.substr(0, n.length - 3);
  }

  if (n.length > 0) {
    a.unshift(n);
  }
  n = a.join(localParams.intDelimiter);
  const floatMoney = localParams.noFloat ? '' : `${localParams.floatDelimiter}${d}`;
  const currency = localParams.noCurrency ? '' : ` ${localParams.currency}`;
  return `${numberSign}${n}${d.length < 1 ? '' : `${floatMoney}`}${currency}`;
}

// ////////// merge state List
export const mergeStateList = (oldData, newData, noId = false, print = false) => {
  const merge = { ...oldData, ...newData };
  if (!newData?.data) {
    return merge;
  }
  const data = [...(oldData?.data || []), ...(newData?.data || [])];

  if (noId) {
    merge.data = data;
    merge.data.forEach((item, index) => {
      if (!item.id && item.url) {
        const code = item.url.toString().match(/^\/?(\d+)-/);
        merge.data[index].id = parseInt(code[1], 10);
      }
    });
    return merge;
  }
  const result: Array<any> = [];
  const map = new Map();
  // eslint-disable-next-line no-restricted-syntax
  for (const item of data) {
    if (!map.has(item.id)) {
      map.set(item.id, true); // set any value to Map
      result.push(item);
    }
  }
  merge.data = result;

  if (print) {
    console.info('>> mergeStateArticles', JSON.parse(JSON.stringify(oldData)), JSON.parse(JSON.stringify(newData)));
    console.info('>> merged', JSON.parse(JSON.stringify(merge)));
  }
  return merge;
};

export function relativeToAbsolute(valRelative: number, minAbsolute = 0, maxAbsolute = 100): number {
  const len = maxAbsolute - minAbsolute;
  const oneP = len / 100;

  return valRelative * oneP;
}

export function getCursorPosition(node: HTMLElement, e: MouseEvent) {
  const rect = node.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return [x, y, rect.left, rect.top];
}

export function calcPositionFromValue(node: HTMLElement, value: number) {
  const rectBorder = node.getBoundingClientRect();
  const totalLen = rectBorder.width;
  const onePercent = totalLen / 100;
  const res = onePercent * value;
  // eslint-disable-next-line no-nested-ternary
  return res < 0 ? 0 : res > totalLen ? totalLen : res;
}

export function calcValueFromPosition(nodeWidth: number | string, position: number) {
  const totalLen = typeof nodeWidth === 'string' ? parseInt(nodeWidth, 10) : nodeWidth;
  const onePercent = totalLen / 100;

  return (position / onePercent).toFixed(2);
}

export function checkMinMax(val: number, min: number, max: number): number {
  if (val < min) {
    return 0;
  } else if (val > max) {
    return max;
  }
  return val;
}

export function convertToUserRange(min: number, max: number, value: number) {
  const total = max - min;
  const oneP = +(total / 100).toFixed(2);
  return +(value * oneP + min).toFixed(2);
}
