import { TResponseData } from '../types';
import { action, computed, makeAutoObservable, runInAction } from 'mobx';

export interface TAppVM {
  navOpened: boolean;
  topLineTab: number;
  isMainPage: boolean;
}

export enum TopLineTabs {
  MATERIAL,
  KALEIDOSCOPE,
  INTERIOR,
}

export class AppVM implements TAppVM {
  public navOpened = true;

  public isMainPage = true;

  public topLineTab: TopLineTabs = TopLineTabs.MATERIAL;

  constructor(initialState?: TResponseData) {
    makeAutoObservable(this);
  }

  @computed public get isLeftColOpened() {
    return this.navOpened;
  }

  @computed public get activeTab() {
    return this.topLineTab;
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
