import { APIStatus, TResponseData } from './types';
import { action, computed, extendObservable, observable } from 'mobx';

import Img1 from 'assets/materials/shpon_01.png';
import Img2 from 'assets/materials/shpon_02.png';
import Img3 from 'assets/materials/shpon_03.png';
import Img4 from 'assets/materials/shpon_04.png';
import Img5 from 'assets/materials/shpon_05.png';
import Img6 from 'assets/materials/shpon_06.png';
import Img7 from 'assets/materials/shpon_07.png';
import Img8 from 'assets/materials/shpon_08.png';
import Img9 from 'assets/materials/shpon_09.png';
import Img10 from 'assets/materials/shpon_10.png';
import Img11 from 'assets/materials/shpon_11.png';
import Img12 from 'assets/materials/shpon_12.png';
import Img13 from 'assets/materials/shpon_13.png';
import Img14 from 'assets/materials/shpon_14.png';
import Img15 from 'assets/materials/shpon_15.png';
import Img16 from 'assets/materials/shpon_16.png';
import Img17 from 'assets/materials/shpon_17.png';

export interface TMaterial {
  id: number;
  src: any;
  title: string;
}
const MaterialStub: TMaterial[] = [
  {
    id: 1,
    src: Img1,
    title: 'Дуб темный',
  },
  {
    id: 2,
    src: Img2,
    title: 'Дуб темный',
  },
  {
    id: 3,
    src: Img3,
    title: 'Дуб темный',
  },
  {
    id: 4,
    src: Img4,
    title: 'Дуб темный',
  },
  {
    id: 5,
    src: Img5,
    title: 'Дуб темный',
  },
  {
    id: 6,
    src: Img6,
    title: 'Дуб темный',
  },
  {
    id: 7,
    src: Img7,
    title: 'Дуб темный',
  },
  {
    id: 8,
    src: Img8,
    title: 'Дуб темный',
  },
  {
    id: 9,
    src: Img9,
    title: 'Дуб темный',
  },
  {
    id: 10,
    src: Img10,
    title: 'Дуб темный',
  },
  {
    id: 11,
    src: Img11,
    title: 'Дуб темный',
  },
  {
    id: 12,
    src: Img12,
    title: 'Дуб темный',
  },
  {
    id: 13,
    src: Img13,
    title: 'Дуб темный',
  },
  {
    id: 14,
    src: Img14,
    title: 'Дуб темный',
  },
  {
    id: 15,
    src: Img15,
    title: 'Дуб темный',
  },
  {
    id: 16,
    src: Img16,
    title: 'Дуб темный',
  },
  {
    id: 17,
    src: Img17,
    title: 'Дуб темный',
  },
];

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

  @observable public selected: number[];

  @observable public message: boolean | undefined;

  @observable public cnt: number | undefined;

  constructor(initialState?: TResponseData) {
    extendObservable(this, { ...MaterialsStoreVM.defaultState, ...initialState });
  }

  @computed get getSearch() {
    return this.searchQuery;
  }

  @computed get getData() {
    console.log('getData ', this.data);
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
    // this.fetchMaterials();

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

  private fetchMaterials() {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    console.log('CLS> ', MaterialStub);
    this.updateData(MaterialStub);
  }
}

export const MaterialsStore = new MaterialsStoreVM();
