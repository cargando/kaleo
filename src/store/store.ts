import { observable, computed, action, extendObservable } from 'mobx';
// import { makeRequest } from 'utils/fn';
import { MaterialsStore } from './materialVM';
import { RouterStore } from 'mobx-react-router';
import { AppStore } from './appVM';

export interface TStore {
  routing: RouterStore;
  Materials?: typeof MaterialsStore;
  App?: typeof AppStore;
}

export const createStore = (routingStore: any): TStore => {
  return {
    routing: routingStore,
    Materials: MaterialsStore,
    App: AppStore,
  };
};
