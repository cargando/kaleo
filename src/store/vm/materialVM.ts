import { action, computed, makeAutoObservable, observable } from 'mobx';
import {
  MTRL,
  TDataList,
  TMaterialVMProps,
  TMultiSelectedList,
  TSelectedList,
  TSelectedMaterial,
  TMinMax,
} from '../types';
import { ColorsStub, GeneratedStub, MaterialStub, VeneerStub } from '../stub';
import { TDirection, TElementCoords, TElementSquare } from '../../utils/types';

export class MaterialsStoreVM implements TMaterialVMProps {
  public searchQuery = '';

  public dataList: TDataList = observable({});

  public selectedList: TSelectedList = observable({});

  public isMultiSelectList: TMultiSelectedList = observable({});

  public plateWithControls: number = null;

  public selectedLayerRange: TMinMax = observable({ min: 0, max: 15 });

  constructor() {
    makeAutoObservable(this);

    this.isMultiSelectList[MTRL.VENEER] = false;
    this.isMultiSelectList[MTRL.COLOR] = true;
    this.isMultiSelectList[MTRL.ALL_TYPES] = true;
    this.isMultiSelectList[MTRL.GENERATED] = false;
  }

  @computed public Data = (tp: MTRL) => {
    return this.dataList[tp];
  };

  @computed public Selected = (tp: MTRL) => {
    this.checkList(tp);
    return this.selectedList[tp];
  };

  @computed public Multi = (tp: MTRL) => {
    return this.isMultiSelectList[tp] || false;
  };

  @computed public selectedName = (tp: MTRL) => {
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

  @computed public selectedCnt = (tp: MTRL): number => {
    return this?.selectedList?.[tp]?.length;
  };

  @computed public get isFilterOn(): boolean {
    return !!(this?.selectedList?.[MTRL.COLOR]?.length || this?.selectedList?.[MTRL.ALL_TYPES]?.length);
  }

  @computed public sortGenerated = (): TElementSquare[] => {
    const list = this.dataList[MTRL.GENERATED];
    const len = this.dataList[MTRL.GENERATED].length;
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

  @computed public findById(id: number, tp: MTRL) {
    let res = null;
    const len = this.dataList[MTRL.GENERATED].length;
    for (let i = 0; i < len; i++) {
      if (this.dataList[MTRL.GENERATED][i].id === id) {
        res = this.dataList[MTRL.GENERATED][i];
        break;
      }
    }
    return res;
  }

  private sortPick = (tp: 'SQUARE' | 'COLOR') => {};

  @action public removeGeneratedItem(id: number) {
    const newList = this.dataList[MTRL.GENERATED].filter((item) => item.id !== id);

    this.dataList[MTRL.GENERATED] = observable.array(newList);
  }

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
    const len = this.dataList[MTRL.GENERATED].length;
    for (let i = 0; i < len; i++) {
      if (this.dataList[MTRL.GENERATED][i].id === id) {
        const newVal = this.dataList[MTRL.GENERATED][i];
        newVal.top = top ?? newVal.top;
        newVal.left = left ?? newVal.left;
        newVal.width = width ?? newVal.width;
        newVal.height = height ?? newVal.height;
        newVal.angle = angle ?? newVal.angle;
        if (moveLayer) {
          newVal.zIndex = this.getCorrectLayerIndex(
            this.dataList[MTRL.GENERATED],
            newVal.id,
            newVal.zIndex ?? 0,
            moveLayer.toUpperCase() as TDirection,
          );
          console.log('newVal', newVal.zIndex);
        } else {
          newVal.zIndex = zIndex ?? newVal.zIndex;
        }
        this.dataList[MTRL.GENERATED][i] = observable({ ...newVal });

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

  @action public setSelectedFilters = (id: number, tp: MTRL) => {
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

  @action public resetSelectedFilters = () => {
    Object.keys(this.selectedList).forEach((key) => {
      this.selectedList[key].length = 0;
    });
  };

  public fetch = () => {
    this.fetchMaterials();
    this.fetchColors();
    this.fetchVeneer();
  };

  @action private fetchVeneer = () => {
    this.dataList[MTRL.VENEER] = observable.array(VeneerStub);
  };

  @action private fetchMaterials = () => {
    this.dataList[MTRL.ALL_TYPES] = observable.array(MaterialStub);

    // TODO -------- SELECTED MATERIALS REMOVE ------------
    const sortedList = this.sortMaterialsByDepth(GeneratedStub, TDirection.DESC);
    this.dataList[MTRL.GENERATED] = observable.array(sortedList);
    // const { min, max } = this.minMaxLayers(this.dataList[MTRL.GENERATED]);
    // this.setMinMaxLayer(min, max);
    // TODO -------- END REMOVE ------------
    console.log('Sorted: ', sortedList);
  };

  @action private fetchColors = () => {
    this.dataList[MTRL.COLOR] = observable.array(ColorsStub);
  };

  private sortMaterialsByDepth = (
    list: TSelectedMaterial[],
    direction: TDirection = TDirection.ASC,
  ): TSelectedMaterial[] => {
    const len = list.length;
    const newList = list
      .sort((a, b) => {
        return direction === TDirection.ASC ? +a.zIndex - +b.zIndex : +b.zIndex - +a.zIndex;
      })
      .map((item: TSelectedMaterial, index) => {
        item.zIndex = direction === TDirection.ASC ? index : len - index;
        return item;
      });

    return newList;
  };

  private checkList = (tp: MTRL) => {
    if (typeof this.selectedList[tp] === 'undefined') {
      this.selectedList[tp] = observable.array([]);
    }
  };

  private normalizeData = (tp: MTRL) => {
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
    this.setMinMaxLayer(min, max);
    return {
      min,
      minId,
      max,
      maxId,
    };
  };

  private getCorrectLayerIndex = (list: TSelectedMaterial[], id: number, curLayer: number, direction: TDirection) => {
    const { min, minId, max, maxId } = this.minMaxLayers(list);

    if (direction === TDirection.UP && id !== maxId) {
      return curLayer + 1;
    } else if (direction === TDirection.UP && id === maxId) {
      return max;
    }

    if (direction === TDirection.DOWN && id !== minId) {
      return curLayer - 1;
    }

    return min;
  };
}

export const MaterialsStore = new MaterialsStoreVM();
