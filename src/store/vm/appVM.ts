import { TResponseData } from '../types';
import { action, computed, extendObservable, observable, runInAction } from 'mobx';

export interface TAppVM {
  navOpened: boolean;
  topLineTab: number;
  isMainPage: boolean;
}

export class AppVM implements TAppVM {
  @observable public navOpened = true;

  @observable public isMainPage = true;

  @observable public topLineTab = 0;

  constructor(initialState?: TResponseData) {
    extendObservable(this, { ...initialState });
  }

  @computed get isLeftColOpened() {
    return this.navOpened;
  }

  @action toggleNav = () => {
    this.navOpened = !this.navOpened;
  };

  @action setTopLineTab = (tabID: number) => {
    runInAction(() => {
      this.topLineTab = tabID;
    });
  };

  // @action.bound private updateData(data: Array<any>) {
  //   this.data = data;
  // }
}

export const AppStore = new AppVM();
