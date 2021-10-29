import { APIStatus, TResponseData } from './types';
import { action, computed, extendObservable, observable } from 'mobx';

export class MaterialsStoreVM {
  private static defaultState: TResponseData = {
    searchQuery: '',
    status: APIStatus.DONE,
    data: null,
    selected: [],
    message: '',
    cnt: 0,
  };

  // @observable - поля стейта
  @observable public searchQuery: string | undefined;

  @observable public data: any;

  @observable public status: boolean | undefined;

  @observable public selected: boolean | undefined;

  @observable public message: boolean | undefined;

  @observable public cnt: number | undefined;

  constructor(initialState?: TResponseData) {
    extendObservable(this, { ...MaterialsStoreVM.defaultState, ...initialState });
  }

  @computed get getSearch() {
    return this.searchQuery;
  }

  @computed get getData() {
    return this.data;
  }

  @computed get getStatus() {
    return this.status;
  }

  @computed get getSelected() {
    return this.selected;
  }

  @computed get getMessage() {
    return this.message;
  }

  // @action - аналог ридакс-экшенов, в том числе асинхронные
  @action.bound public setSearch = (query: string) => {
    this.searchQuery = query;

    this.fetchData();
  };

  @action.bound public setCnt = (n: number) => {
    this.cnt = n;

    this.fetchData();
  };

  @action.bound public fetch() {
    this.fetchData();
  }

  @action.bound private updateData(data: Array<any>) {
    this.data = data;
  }

  private fetchData() {
    /* makeRequest({
      url: 'http://api.tvmaze.com/search/shows',
      requestData: { q: this.searchQuery },
    }) */

    fetch(`https://api.tvmaze.com/search/shows?q=${this.searchQuery}`)
      .then((response: any) => {
        this.updateData(response.data);
      })
      .catch((err) => {
        // err
        console.log('Error:', err);
      });
  }
}

export const MaterialsStore = new MaterialsStoreVM();
