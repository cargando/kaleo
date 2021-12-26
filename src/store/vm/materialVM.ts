import { action, computed, makeAutoObservable, observable } from 'mobx';
import {
  MaterialsTP,
  TDataList,
  TMaterialVMProps,
  TMultiSelectedList,
  TSelectedList,
  TSelectedMaterial,
  TMinMax,
} from '../types';
import { ColorsStub, GeneratedStub, MaterialStub, VeneerStub } from '../stub';
import { TDirections, TElementCoords, TElementSquare } from '../../utils/types';

export class MaterialsStoreVM implements TMaterialVMProps {
  public searchQuery = '';

  public dataList: TDataList = observable({});

  public selectedList: TSelectedList = observable({});

  public isMultiSelectList: TMultiSelectedList = observable({});

  public plateWithControls: number = null;

  public selectedLayerRange: TMinMax = observable({ min: 0, max: 0 });

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

  @computed public sortGenerated = (): TElementSquare[] => {
    const list = this.dataList[MaterialsTP.MTRL_GENERATED];
    const len = this.dataList[MaterialsTP.MTRL_GENERATED].length;
    if (!len) return [];
    const tmp: TElementSquare[] = [];
    for (let i = 0; i < len; i++) {
      tmp.push({
        square: list[i].width * list[i].height,
        id: list[i].id,
        index: i,
      });
    }

    return tmp.sort((a, b) => a.square - b.square);
  };

  @computed public findById(id: number, tp: MaterialsTP) {
    let res = null;
    const len = this.dataList[MaterialsTP.MTRL_GENERATED].length;
    for (let i = 0; i < len; i++) {
      if (this.dataList[MaterialsTP.MTRL_GENERATED][i].id === id) {
        res = this.dataList[MaterialsTP.MTRL_GENERATED][i];
        break;
      }
    }
    return res;
  }

  private sortPick = (tp: 'SQUARE' | 'COLOR') => {};

  @action public setMaterialProps = (coords: TElementCoords, id: number) => {
    const {
      left = null,
      top = null,
      width = null,
      height = null,
      angle = null,
      zIndex = null,
      moveLayer = null,
    } = coords;
    const len = this.dataList[MaterialsTP.MTRL_GENERATED].length;
    for (let i = 0; i < len; i++) {
      if (this.dataList[MaterialsTP.MTRL_GENERATED][i].id === id) {
        const newVal = this.dataList[MaterialsTP.MTRL_GENERATED][i];
        newVal.top = top ?? newVal.top;
        newVal.left = left ?? newVal.left;
        newVal.width = width ?? newVal.width;
        newVal.height = height ?? newVal.height;
        newVal.angle = angle ?? newVal.angle;
        if (moveLayer) {
          newVal.zIndex = this.getCorrectLayerIndex(
            this.dataList[MaterialsTP.MTRL_GENERATED],
            newVal.id,
            newVal.zIndex ?? 0,
            moveLayer.toUpperCase() as TDirections,
          );
          console.log('newVal', newVal.zIndex);
        } else {
          newVal.zIndex = zIndex ?? newVal.zIndex;
        }
        this.dataList[MaterialsTP.MTRL_GENERATED][i] = observable({ ...newVal });

        break;
      }
    }
  };

  @action public setMinMaxLayer = (min: number, max: number) => {
    this.selectedLayerRange.min = min;
    this.selectedLayerRange.max = max;
  };

  @action public setActivePlate = (id: number) => {
    this.plateWithControls = id;
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

    // TODO -------- SELECTED MATERIALS REMOVE ------------
    this.dataList[MaterialsTP.MTRL_GENERATED] = observable.array(GeneratedStub);
    const { min, max } = this.minMaxLayers(this.dataList[MaterialsTP.MTRL_GENERATED]);
    this.setMinMaxLayer(min, max);
    // TODO -------- END REMOVE ------------
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

  private minMaxLayers = (list: TSelectedMaterial[]) => {
    const len = list.length;
    let min = list[0].zIndex;
    let minId = 0;
    let max = list[0].zIndex;
    let maxId = 0;

    for (let i = 0; i < len; i++) {
      if (list[i].zIndex < min) {
        min = list[i].zIndex;
        minId = list[i].id;
      }
      if (list[i].zIndex > max) {
        max = list[i].zIndex;
        maxId = list[i].id;
      }
    }

    return {
      min,
      minId,
      max,
      maxId,
    };
  };

  private getCorrectLayerIndex = (list: TSelectedMaterial[], id: number, curLayer: number, direction: TDirections) => {
    const { min, minId, max, maxId } = this.minMaxLayers(list);

    if (direction === TDirections.UP && id !== maxId) {
      return curLayer + 1;
    } else if (direction === TDirections.UP && id === maxId) {
      return max;
    }

    if (direction === TDirections.DOWN && id !== minId) {
      return curLayer - 1;
    }

    return min;
  };
}

export const MaterialsStore = new MaterialsStoreVM();
