import { observable, computed, action, extendObservable } from 'mobx';
// import { makeRequest } from 'utils/fn';
import { MaterialsStore } from './vm/materialVM';
import { RouterStore } from 'mobx-react-router';
import { AppStore } from './vm/appVM';
import { ModalStore } from './vm/modalsVM';

export enum STOREs {
  routing = 'routing',
  App = 'App',
  Materials = 'Materials',
  Modals = 'Modals',
}

export interface TStore {
  [STOREs.routing]: RouterStore;
  [STOREs.Materials]?: typeof MaterialsStore;
  [STOREs.App]?: typeof AppStore;
  [STOREs.Modals]?: typeof ModalStore;
}

export const createStore = (routingStore: RouterStore): TStore => {
  return {
    [STOREs.routing]: routingStore,
    [STOREs.Materials]: MaterialsStore,
    [STOREs.App]: AppStore,
    [STOREs.Modals]: ModalStore,
  };
};
