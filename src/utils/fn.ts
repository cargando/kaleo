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
