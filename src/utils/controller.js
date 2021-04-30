import { makeRequest } from './fn';

class DataController {
  /* загрузить каталог */
  getCatalogItems(requestData = {}, callback) {
    return makeRequest('get', '/API/CATALOG/FIND', requestData, callback);
  }

  getCatalogCategories(requestData = {}, callback) {
    return makeRequest('get', '/API/CATEGORY/FIND', requestData, callback);
  }
}

export default new DataController();
