import React from 'react';
import { TResponseData } from '../types';
import { action, computed, makeAutoObservable, observable, runInAction } from 'mobx';

export interface TAppVM {
  navOpened: boolean;
  topLineTab: number;
  isMainPage: boolean;
  mainCellWidth?: number; // HTMLElement;
  activeLeftStep: number;
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

  public mainCellWidth = null;

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
    return this.mainCellWidth;
  }

  public set mainCell(width: number) {
    this.mainCellWidth = width;
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
