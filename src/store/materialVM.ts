import { action, computed, extendObservable, observable, toJS } from 'mobx';
import { APIStatus, TMaterialVMProps } from './types';
import { MaterialStub } from './stub';

export class MaterialsStoreVM {
  private static defaultState: TMaterialVMProps = {
    searchQuery: '',
    data: null,
    selected: [1],
    multiSelect: false,
    cnt: 0,
  };

  // @observable - поля стейта
  @observable public searchQuery: string | undefined;

  @observable public data: any;

  @observable public selected: number[];

  @observable public message: boolean | undefined;

  @observable public cnt: number | undefined;

  @observable public multiSelect: boolean;

  constructor(initialState?: TMaterialVMProps) {
    extendObservable(this, { ...MaterialsStoreVM.defaultState, ...initialState });
  }

  @computed public get selectedName() {
    if (!this?.data) {
      return null;
    }
    let res = null;
    /* eslint-disable-next-line */
    for (const val of this.data) {
      if (this.selected.indexOf(val.id) !== -1) {
        res = val.title;
        break;
      }
    }
    return res;
  }

  // @action - аналог ридакс-экшенов, в том числе асинхронные
  @action public setSearch = (query: string) => {
    this.searchQuery = query;

    this.fetchData();
  };

  @action public setCnt = (n: number) => {
    this.cnt = n;

    this.fetchData();
  };

  @action public setSelected = (id: number) => {
    const index = this.selected.indexOf(id);
    if (index !== -1) {
      this.selected.splice(index, 1);
    } else {
      if (!this.multiSelect) {
        this.selected.length = 0;
      }
      this.selected.push(id);
    }
  };

  public fetch = () => {
    this.fetchMaterials();
    // this.fetchData();
  };

  @action private updateData = (data: Array<any>) => {
    this.data = data;
  };

  private fetchData = () => {
    /* makeRequest({
      url: 'http://api.tvmaze.com/search/shows',
      requestData: { q: this.searchQuery },
    }) */

    fetch(`https://api.tvmaze.com/search/shows?q=batman${this.searchQuery}`)
      .then((response) => {
        return response.json();
      })
      .then((data: any) => {
        this.updateData(data);
      })
      .catch((err) => {
        // err
        console.log('Error:', err);
      });
  };

  private fetchMaterials = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.updateData(MaterialStub);
  };
}

export const MaterialsStore = new MaterialsStoreVM();
