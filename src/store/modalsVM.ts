import React from 'react';
import { APIStatus, TResponseData } from './types';
import { action, computed, extendObservable, observable, runInAction } from 'mobx';

export const LAST_OPENED_MODAL = 'LAST_OPENED_MODAL';
export const MODAL_NOT_FOUND = 'MODAL_NOT_FOUND';

export enum TScreenType {
  isTablet,
  isDesktop,
  isDesktop992,
  isDesktop1200,
}

export interface TModalVM {
  contentRef: any;
  isFoolScreen: boolean;
  modalIDs: string[];
  screen: TScreenType;
  dataId?: null;
  data: Record<string, any>;
}

export class ModaVM implements TModalVM {
  @observable public contentRef = null;

  @observable public isFoolScreen = false;

  @observable public modalIDs = observable.array([]);

  @observable public screen = TScreenType.isDesktop;

  @observable public data = null;

  constructor(initialState?: TResponseData) {
    extendObservable(this, { ...initialState });
  }

  @computed get foolScreen() {
    return this.isFoolScreen;
  }

  @computed get modalID() {
    console.log(`modalID ${this.modalIDs}`);
    return this.modalIDs[this.modalIDs.length - 1];
  }

  @action showModal = (modalID: string, isFoolScreen = true) => {
    console.log('showModal > ', modalID);
    this.modalIDs.push(modalID);
    this.isFoolScreen = isFoolScreen;
  };

  @action closeModal = (modalID = LAST_OPENED_MODAL): string => {
    let res = MODAL_NOT_FOUND;
    const index = this.modalIDs.indexOf(modalID);
    if (index === -1 && modalID === 'LAST_OPENED_MODAL') {
      res = this.modalIDs.pop();
    } else if (index !== -1 && modalID !== LAST_OPENED_MODAL) {
      [res] = this.modalIDs.splice(index, 1);
      if (!res.length) {
        res = MODAL_NOT_FOUND;
      }
    }
    if (!this.modalIDs.length) {
      this.isFoolScreen = false;
    }

    return res;
  };

  @action closeAllModals = () => {
    this.modalIDs.length = 0;
    this.isFoolScreen = false;
  };

  @action showFoolScreen = () => {
    this.isFoolScreen = true;
  };

  @action hideFoolScreen = () => {
    this.isFoolScreen = false;
  };
}

export const ModalStore = new ModaVM();
