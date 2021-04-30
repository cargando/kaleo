// СООБЩЕНИЯ
export const MSG = {
  attentionHdr: 'Внимание',
  noDataForIdMsg: 'Не удалось загрузить данные для записи с идеентификатором: ',
  connectivityErrorData:
    'Не удалось загрузить данные по причине ошибки сетевого соединения. Проверьте соединение с интернет.',
  connectivityError: 'Возникла ошибка сети. Проверьте соединение с интернет.',
  unknownError: 'Возникла ошибка. Свяжитесь с администратором.',
  mandatoryField: 'Это поле обязательно для заполнения.',
  filterDataFailMsg: 'Не удалось найти записи удовлетворяющие критерям поиска',
  downloadFailMsg: 'Не удалось загрузить файл/изображение',
  page403Text: 'У вас недостаточно прав для доступа к этой странице.',
  // ERRORS:
  errorHdr: 'Возникла ошибка',
  errorSaveMsg: 'Не удалось сохранить внесенные изменения',
  errorAddMsg: 'Не удалось внести или добавить запись',
  // SUCCESS:
  successHdr: 'Успех',
  successSignUp: 'Вы успешно зарегистрировались.',
  successSaveMsg: 'Изменения сохранены',
  successCreateMsg: 'Объект создан',
  successCreateMsg1: 'Запись добавлена',
  // WARNINGS:
  warningHdr: 'Внимание',
  warnNotSavedMsg: 'Данные не сохранены! Проверьте правильность введенной информации.',
  warnNoDataMsg: 'Данные отсутствуют.',
  //
  infoHdr: 'Уведомление',
  noRecordsShort: 'Ничего не найдено',
};

/*  формирует объект с настройками + вытаскивает из симплекса адрес сервера (среду дев/прод) */
const appConfig = (() => {
  const serverAddresses = {
    DEV: `anima.local:8888`,
    PROD: `anima.ipromote.ru`,
  };

  const serverCode = 'DEV';
  const showServer = false;

  return {
    apiName: 'axiosAPI',
    serverAddress: `http://${serverAddresses[serverCode]}`,
    serverCode,
    showServer,
    basicAuthToken: 'Basic ',
    authType: 'Bearer ',
    phoneCountryCode: '7',
    printCity: false,
    fieldsLengths: { name: 3 },
    searchItemMaxLen: 20,
    notFound: 'NOT_FOUND',
    noData: 'NO_DATA',
    defaultOnPage: 10,
    defaultSortOrder: 'DESC',
    dtLocation: 'ru',
    timeZone: 'Europe/Moscow',
    showSpinnerOverSkeleton: false,
    devEnvironment: process.env.NODE_ENV === 'development',
    // coockieDomain: `.${serverDomain}`,
    dataReloadTime: 30000,
    ...MSG,
  };
})();

// console log
export const echo = (...args) => {
  if (!appConfig.devEnvironment) {
    return null;
  }
  console.log.apply(this, args);
  return null;
};

/* выдать сообщение об ошибке */
export function fireError(msg = appConfig.unknownError) {
  // Ts(msg, 'err');
  echo('ОШИБКА: ', msg);
}

export default appConfig;
