import { TResponseData } from '../types';
import { action, computed, makeAutoObservable, observable, runInAction } from 'mobx';

export interface TAppVM {
  navOpened: boolean;
  topLineTab: number;
  isMainPage: boolean;
  // mainCellWidth?: number; // HTMLElement;
  mainCellData?: any;
  activeLeftStep: number;
}
// some changes 1
export enum TopLineTabs {
  MATERIAL,
  KALEIDOSCOPE,
  INTERIOR,
}

type Dimension = {
  width?: number;
  height?: number;
  radius?: number;
};

export class AppVM implements TAppVM {
  public navOpened = true;

  public isMainPage = true;

  public topLineTab: TopLineTabs = TopLineTabs.MATERIAL;

  public mainCellData: Dimension = {};

  public activeLeftStep = 0;

  constructor(initialState?: TResponseData) {
    makeAutoObservable(this);
  }

  public get isLeftColOpened() {
    return this.navOpened;
  }

  public get activeTab() {
    return this.topLineTab;
  }

  public get leftColStep() {
    return this.activeLeftStep;
  }

  public set leftColStep(step) {
    this.activeLeftStep = step;
  }

  @computed public get mainCell() {
    return this.mainCellData;
  }

  public set mainCell({ width, height }: Dimension) {
    this.mainCellData.width = width;
    this.mainCellData.height = height;
  }

  @action toggleNav = () => {
    this.navOpened = !this.navOpened;
  };

  @action setTopLineTab = (tabID: number) => {
    runInAction(() => {
      this.topLineTab = tabID;
    });
  };

  @action nextLeftStep = () => {
    this.activeLeftStep += 1;
  };

  @action prevLeftStep = () => {
    this.activeLeftStep -= 1;
  };

  // @action.bound private updateData(data: Array<any>) {
  //   this.data = data;
  // }
}

export const AppStore = new AppVM();
