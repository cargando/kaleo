/* инициализация axios */
import axios, { AxiosInstance } from 'axios';
import config, { fireError } from './config';

const APP_CONF = { ...config };

/* make Axios Request */
// eslint-disable-next-line import/prefer-default-export

export function mkAxios(): AxiosInstance {
  if (window.axiosAPI) {
    return window.axiosAPI;
  }

  const ax = axios.create({
    baseURL: APP_CONF.serverAddress,
    timeout: 10000,
    // headers,
    validateStatus: (status) => {
      return status >= 200 && status <= 503; // ok
    },
  });
  // let timeout = null; // таймер для повтора запроса
  // let stack = []; // стэк плохих/ошибочных запросов

  ax.interceptors.response.use(
    (response) => {
      // соединение установлено, есть какой-то ответ бэка
      if (response.status >= 400) {
        // && response.status !== 401
        fireError(`${response.data.message} ( ${response.status} )`); // сообщение об ошибке в консоль
      } /* else if (response.status === 401) { // 401 - force refresh token
			const existed = stack.find(s => (s.url === response.config.url)); // в стеке уже есть урл с ошибкой
			if (!existed) {
				delete response.config.headers.Authorization; // удалить заголовок авторизации
				stack.push(response.config);
			}

			clearTimeout(timeout);

			timeout = setTimeout(async () => {
				const res = await UserController.refreshToken();
				if (res) {
					stack.map(s => ax(s));
				}
				stack = [];
			}, 1000);
			// UserController.refreshToken();
		} else if (response.status === 430) { // logout
			; // UserController.userLogOut();
		} */ else if (
        response.status === 503
      ) {
        // TODO - server unavalable
        // history.push(SERVER_ERROR);
      }
      return response;
    },
    (error) => {
      // не удалось установить соединение
      // history.push(SERVER_ERROR);
      // fireError(String.prototype.concat(APP_CONF.connectivityError, (APP_CONF.devEnvironment ? ' [mkAxios]' : ''))); // вывести ошибку в тоастр
      fireError(error); // вывести ошибку в тоастр
      return { error, connectError: true, data: {} };
    },
  );

  // eslint-disable-next-line no-return-assign
  return (window.axiosAPI = ax);
}
