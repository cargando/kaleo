import { TResponseData } from '../types';
import { action, makeAutoObservable, runInAction } from 'mobx';

export interface TAppVM {
  navOpened: boolean;
  topLineTab: number;
  isMainPage: boolean;
}

export class AppVM implements TAppVM {
  public navOpened = true;

  public isMainPage = true;

  public topLineTab = 0;

  constructor(initialState?: TResponseData) {
    makeAutoObservable(this);
  }

  public get isLeftColOpened() {
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
