import { observable, computed, action, extendObservable } from 'mobx';
// import { makeRequest } from 'utils/fn';
import { MaterialsStore } from './materialVM';
import { RouterStore } from 'mobx-react-router';
import { AppStore } from './appVM';

export enum StoreTypes {
  App = 'App',
  Materials = 'Materials',
  Modals = 'Modals',
}

export interface TStore {
  routing: RouterStore;
  [StoreTypes.Materials]?: typeof MaterialsStore;
  [StoreTypes.App]?: typeof AppStore;
  [StoreTypes.Modals]?: any;
}

export const createStore = (routingStore: RouterStore): TStore => {
  return {
    routing: routingStore,
    [StoreTypes.Materials]: MaterialsStore,
    [StoreTypes.App]: AppStore,
    [StoreTypes.Modals]: null,
  };
};
