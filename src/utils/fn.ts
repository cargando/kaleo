import dayjs from 'dayjs';
import config, { echo, fireError } from './config';
import { mkAxios } from './api';
import {
  TContainerCoords,
  TMakeRequestParams,
  TMakeRequestResponse,
  TdefaultMoneyParams,
  TElementCoords,
  TDndFenceFrameCheck,
} from './types';

export const APP_CONF = { ...config };

export { echo, fireError };

export const ALL_IMAGES = {};
// default Money Params
const MONEY_PARAMS: TdefaultMoneyParams = {
  intDelimiter: ' ',
  floatDelimiter: '.',
  noFloat: true,
  currency: 'руб.',
  noCurrency: false,
};

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

export function printMoney(amount, params: TdefaultMoneyParams = {}) {
  const localParams: TdefaultMoneyParams = {
    ...MONEY_PARAMS,
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

export function relativeToAbsolute(valRelative: number, minAbsolute = 0, maxAbsolute = 100): number {
  const len = maxAbsolute - minAbsolute;
  const oneP = len / 100;

  return valRelative * oneP;
}

export function getCursorPosition(node: HTMLElement, e: MouseEvent): TContainerCoords {
  const rect = node.getBoundingClientRect();
  return {
    mouseTop: e.clientY,
    mouseLeft: e.clientX,
    mouseInnerTop: e.clientY - rect.top, // мышь внутри контейнера node
    mouseInnerLeft: e.clientX - rect.left,
    elementTop: rect.top, // координаты node относительно страницы
    elementLeft: rect.left,
    elementRight: rect.right,
    elementBottom: rect.bottom,
    elementWidth: node.offsetWidth, // высота/ширина
    elementHeight: node.offsetHeight,
    elementParentTop: node.offsetTop, // координаты node относительно родителя
    elementParentLeft: node.offsetLeft,
  };
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

export function checkDragOffParent(draggableCoords: TElementCoords, parentCoords: TElementCoords): boolean {
  return (
    draggableCoords.left <= parentCoords.left ||
    draggableCoords.top <= parentCoords.top ||
    draggableCoords.left + draggableCoords.width >= parentCoords.top + parentCoords.width ||
    draggableCoords.top + draggableCoords.height >= parentCoords.top + parentCoords.height
  );
}

export const dndFenceFrameCheck = ({ element, parent }: TDndFenceFrameCheck) => {
  const { top, left, height, width } = element;
  const { top: pT, left: pL, height: pH, width: pW } = parent;
  return top >= 1 && left >= 1 && top + height <= pT + pH && left + width <= pL + pW;
};
