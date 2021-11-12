import { TResponseData } from '../types';
import { action, computed, makeAutoObservable, observable, runInAction } from 'mobx';

export interface TAppVM {
  navOpened: boolean;
  topLineTab: number;
  isMainPage: boolean;
}

export class AppVM implements TAppVM {
  @observable public navOpened = false;

  @observable public isMainPage = true;

  @observable public topLineTab = 0;

  constructor(initialState?: TResponseData) {
    makeAutoObservable(this);
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
