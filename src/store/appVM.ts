import { APIStatus, TResponseData } from './types';
import { action, computed, extendObservable, observable, runInAction } from 'mobx';

export interface TAppVM {
  navOpened: boolean;
  topLineTab: number;
}

export class AppVM {
  private static defaultState: TAppVM = {
    navOpened: true,
    topLineTab: 0,
  };

  @observable public navOpened = true;

  @observable public topLineTab = 0;

  constructor(initialState?: TResponseData) {
    extendObservable(this, { ...AppVM.defaultState, ...initialState });
  }

  @computed get isLeftColOpened() {
    return this.navOpened;
  }

  @action.bound toggleNav() {
    this.navOpened = !this.navOpened;
  }

  @action.bound setTopLineTab(tabID: number) {
    runInAction(() => {
      this.topLineTab = tabID;
    });
  }

  // @action.bound private updateData(data: Array<any>) {
  //   this.data = data;
  // }
}

export const AppStore = new AppVM();
