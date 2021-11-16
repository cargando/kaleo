import { action, computed, makeAutoObservable, observable, toJS } from 'mobx';
import {
  TDataList,
  TSelectedList,
  TMultiSelectedList,
  MaterialsTP,
  TMaterialVMProps,
  TSelectedMaterial,
} from '../types';
import { ColorsStub, GeneratedStub, MaterialStub, VeneerStub } from '../stub';

export class MaterialsStoreVM implements TMaterialVMProps {
  public searchQuery = '';

  public dataList: TDataList = observable({});

  public selectedList: TSelectedList = observable({});

  public isMultiSelectList: TMultiSelectedList = observable({});

  constructor() {
    makeAutoObservable(this);

    this.isMultiSelectList[MaterialsTP.VENEER] = false;
    this.isMultiSelectList[MaterialsTP.COLOR] = true;
    this.isMultiSelectList[MaterialsTP.MTRL_TYPE] = true;
    this.isMultiSelectList[MaterialsTP.MTRL_GENERATED] = true;
  }

  @computed public Data = (tp: MaterialsTP) => {
    return this.dataList[tp];
  };

  @computed public Selected = (tp: MaterialsTP) => {
    this.checkList(tp);
    return this.selectedList[tp];
  };

  @computed public Multi = (tp: MaterialsTP) => {
    return this.isMultiSelectList[tp] || false;
  };

  @computed public selectedName = (tp: MaterialsTP) => {
    if (!this?.dataList?.[tp]) {
      return null;
    }
    let res = null;
    /* eslint-disable-next-line */
    for (const val of this.dataList[tp]) {
      if (this.dataList[tp].indexOf(val.id) !== -1) {
        res = val.title;
        break;
      }
    }
    return res;
  };

  @computed public selectedCnt = (tp: MaterialsTP): number => {
    return this?.selectedList?.[tp]?.length;
  };

  @action public setMtrlPlateCoords = (left: number, top: number, id: number) => {
    const len = this.dataList[MaterialsTP.MTRL_GENERATED].length;

    for (let i = 0; i < len; i++) {
      if (this.dataList[MaterialsTP.MTRL_GENERATED][i].id === id) {
        const newVal = this.dataList[MaterialsTP.MTRL_GENERATED][i];
        newVal.top = top;
        newVal.left = left;
        this.dataList[MaterialsTP.MTRL_GENERATED][i] = { ...newVal };
        break;
      }
    }
  };

  @action public setSearch = (query: string) => {
    this.searchQuery = query;
  };

  @action public setSelected = (id: number, tp: MaterialsTP) => {
    this.checkList(tp);
    const index = this.selectedList[tp].indexOf(id);
    if (index !== -1) {
      this.selectedList[tp].splice(index, 1);
    } else {
      if (!this.isMultiSelectList[tp]) {
        this.selectedList[tp].length = 0;
      }
      this.selectedList[tp].push(id);
    }
  };

  public fetch = () => {
    this.fetchMaterials();
    this.fetchColors();
    this.fetchVeneer();
  };

  @action private fetchVeneer = () => {
    this.dataList[MaterialsTP.VENEER] = observable.array(VeneerStub);
  };

  @action private fetchMaterials = () => {
    this.dataList[MaterialsTP.MTRL_TYPE] = observable.array(MaterialStub);

    this.dataList[MaterialsTP.MTRL_GENERATED] = observable.array(GeneratedStub);
  };

  @action private fetchColors = () => {
    this.dataList[MaterialsTP.COLOR] = observable.array(ColorsStub);
  };

  private checkList = (tp: MaterialsTP) => {
    if (typeof this.selectedList[tp] === 'undefined') {
      this.selectedList[tp] = observable.array([]);
    }
  };

  private normalizeData = (tp: MaterialsTP) => {
    const res: Record<string, TSelectedMaterial> = {};
    this.dataList[tp].forEach((item) => {
      res[`${item.id}`] = item;
    });
    return res;
  };
}

export const MaterialsStore = new MaterialsStoreVM();
