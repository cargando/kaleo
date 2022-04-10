import { action, computed, makeAutoObservable, observable, toJS } from 'mobx';
import {
  MTRL,
  TBox,
  TDataList,
  TMaterialVMProps,
  TMinMax,
  TMultiSelectedList,
  TSelectedList,
  TSelectedMaterial,
  TPetal,
} from '../types';
import { ColorsStub, GeneratedStub, MaterialStub, VeneerStub } from '../stub';
import { TDirection, TElementCoords, TElementSquare } from '../../utils/types';

export class MaterialsStoreVM implements TMaterialVMProps {
  public searchQuery = '';

  public dataList: TDataList = {};

  public selectedList: TSelectedList = {};

  public isMultiSelectList: TMultiSelectedList = {};

  public plateWithControls: number = null;

  public selectedLayerRange: TMinMax = { min: 0, max: 15 };

  public isDragging = false;

  public isGenerateButton = false;

  public isMaterialCentered = false;

  // координаты плашки для всех перетаскиваемых материалов
  public rootBox: TBox = { top: null, left: null, width: null, height: null };

  // временное хранение ширины/высоты для перетаскиваемой плашки
  private plateBox: { id?: number; width?: number; height?: number } = {};

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

  @computed public DataSorted = (tp: MTRL, field: string) => {
    return this.dataList[tp].sort((a, b) => a[field] - b[field]);
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
    const len = this.dataList[tp].length;
    for (let i = 0; i < len; i++) {
      if (this.dataList[tp][i].id === id) {
        res = this.dataList[tp][i];
        break;
      }
    }
    return res;
  }

  private sortPick = (tp: 'SQUARE' | 'COLOR') => {};

  @computed public getRootBox() {
    const { top = null, left = null, width = null, height = null } = this.rootBox;

    return {
      top,
      left,
      width,
      height,
      widthHalf: width !== null ? Math.floor(width / 2) : 1,
      heightHalf: height !== null ? Math.floor(height / 2) : 1,
    };
  }

  @action public setIsCentered(val: boolean) {
    this.isMaterialCentered = val;
  }

  @action public setRoot(box: Partial<TBox>) {
    const { top = null, left = null, width = null, height = null } = box;
    this.rootBox.top = top;
    this.rootBox.left = left;
    this.rootBox.width = width;
    this.rootBox.height = height;
  }

  @action public finishDrag() {
    this.isDragging = false;
  }

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
      isDragging = false,
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
        newVal.zIndex = zIndex ?? newVal.zIndex;
        if (moveLayer) {
          this.switchLayers(MTRL.GENERATED, newVal, moveLayer.toUpperCase() as TDirection);
        } else {
          this.dataList[MTRL.GENERATED][i] = observable({ ...newVal });
        }

        this.isDragging = isDragging;
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
    this.isDragging = false;
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

  public isOverlap = (box: Partial<TBox>, id: number): boolean => {
    const { top, left, width, height } = this.getRootBox();
    let tl = false;
    let br = false;
    if (this.plateBox.id !== id) {
      const res = this.findById(id, MTRL.GENERATED);
      this.plateBox.id = id;
      this.plateBox.width = res.width;
      this.plateBox.height = res.height;
    }
    if (top !== null && left !== null && width !== null && height !== null) {
      br = box.left + this.plateBox.width > width || box.top + this.plateBox.height > height;
      tl = box.top <= 0 || box.left <= 0;
    } else if (top !== null && left !== null) {
      tl = box.top <= 0 || box.left <= 0;
    }
    return tl || br;
  };

  public fetch = () => {
    this.fetchMaterials();
    this.fetchColors();
    this.fetchVeneer();
  };

  public centerMaterialsInContainer = () => {
    // return;
    const list = this.dataList[MTRL.GENERATED];
    const len = list.length;
    console.log('centerMaterialsInContainer');
    for (let i = 0; i < len; i++) {
      const [newLeft, newTop] = this.shiftOverlappedCords(list[i]);

      console.log(' --NEW CENTER: ', newLeft, newTop, ', OLD: ', list[i].left, list[i].top);
      list[i].left = Math.floor(newLeft);
      list[i].top = Math.floor(newTop);
    }

    this.isMaterialCentered = true;
  };

  private shiftOverlappedCords = (item: TSelectedMaterial) => {
    const {
      width: containerWidth,
      height: containerHeight,
      widthHalf: offsetLeft, // смещение созданное при центрировании
      heightHalf: offsetTop, // смещение созданное при центрировании
    } = this.getRootBox();

    if (!containerWidth || !containerHeight) {
      return [item.left, item.top];
    }

    let newRealLeft = item.left;
    const newRealTop = item.top;

    const virtualBox = {
      left: item.left + offsetLeft,
      top: item.top + offsetTop,
      right: newRealLeft + item.width + offsetLeft,
      bottom: newRealTop + item.height + offsetTop,
    };

    console.log(
      '---shiftOverlap id:',
      item.id,
      'virtualBox:',
      virtualBox.right,
      containerWidth,
      'IF_R',
      virtualBox.right > containerWidth,
      containerWidth,
      'IF_B',
      virtualBox.bottom > containerHeight,
      containerHeight,
    );

    if (virtualBox.right > containerWidth) {
      console.log('SWITCH', newRealLeft, containerWidth - (virtualBox.right + 10));
      newRealLeft -= containerWidth - (virtualBox.right + 20);
    }
    // if (virtualBox.bottom > containerHeight) {
    //   newRealTop -= containerHeight - (virtualBox.bottom + 20);
    // }

    return [newRealLeft, newRealTop];
  };

  public repositionMaterials = () => {
    this.repositionMaterialsBySquare();
  };

  public repositionMaterialsBySquare = () => {
    const len = this.dataList[MTRL.GENERATED].length;
    const listBySquare = this.dataList[MTRL.GENERATED].sort(
      (a: TSelectedMaterial, b: TSelectedMaterial) => b.square - a.square,
    );
    // const center = { left: Math.floor(containerWidth / 2), top: Math.floor(containerHeight / 2) };
    console.log('>>>>>>>>>');
    const randomAngleOffset = () => Math.floor(Math.random() * (45 - 10) + 10);

    const itemsPerLayer = this.calculatePetalsPerLayer(len); // количество лепестков/дуг (сколько на слое элементов)
    const sector = 380 / itemsPerLayer;
    let radialOffset = 0;
    let layer = 0; // "слой/этаж" расположения материалов (на одном слое может быть несколько разных zIndex)

    for (let i = 0, sectorIndex = 0; i < len; i++, sectorIndex++) {
      // const radius = 250;
      const { width, height } = listBySquare[i];
      const radius = width;
      const k = i + 1;
      // const lap = Math.ceil(k / tp); // какой круг наматывается
      if (i % itemsPerLayer === 0) {
        sectorIndex = 0;
        layer++;
        radialOffset = 30; // randomAngleOffset();
      }
      const angle = Math.floor(sector * k + radialOffset * layer);
      console.log('Reposition: ID', listBySquare[i].id, 'zIndex', k, 'floor ', layer, 'start angle', angle);
      listBySquare[i].left = Math.floor(radius * Math.cos(angle)); //  + center.left;
      listBySquare[i].top = Math.floor(radius * Math.sin(angle)); //  + center.top;
      listBySquare[i].zIndex = k;
      console.log(' -COORDS: ', listBySquare[i].left, listBySquare[i].top, 'radius', radius);
      // console.log('Reposition: ', listBySquare[i].left, listBySquare[i].top, listBySquare[i].zIndex);
    } // end of FOR

    this.isMaterialCentered = false;
  };

  @action private fetchVeneer = () => {
    this.dataList[MTRL.VENEER] = observable.array(VeneerStub);
  };

  @action private fetchMaterials = () => {
    this.dataList[MTRL.ALL_TYPES] = observable.array(MaterialStub);

    // TODO -------- SELECTED MATERIALS REMOVE ------------
    const sortedList = this.sortMaterialsByDepth(GeneratedStub, TDirection.DESC);
    this.dataList[MTRL.GENERATED] = observable.array(sortedList);
    this.isGenerateButton = true;
    // const { min, max } = this.minMaxLayers(this.dataList[MTRL.GENERATED]);
    // this.setMinMaxLayer(min, max);
    // TODO -------- END REMOVE ------------
  };

  @action private fetchColors = () => {
    this.dataList[MTRL.COLOR] = observable.array(ColorsStub);
  };

  private calculatePetalsPerLayer = (totalItems: number) => {
    let res = 3; // количество лепестков/дуг (сколько на слое элементов)

    if (Math.floor(totalItems / TPetal.SIX) >= 3) {
      res = 6;
    } else if (Math.floor(totalItems / TPetal.FOUR) >= 3) {
      res = 4;
    }
    return res;
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
        item.square = (item.width ?? 0) * (item.height ?? 0);
        return item;
      });
    this.selectedLayerRange.max = len;
    return newList;
  };

  private checkList = (tp: MTRL) => {
    if (typeof this.selectedList[tp] === 'undefined') {
      this.selectedList[tp] = observable.array([]);
    }
  };

  private switchLayers = (listType: MTRL, current: TSelectedMaterial, direction: TDirection) => {
    const len = this.dataList[listType].length;
    const zIndexToFind = direction === TDirection.UP ? current.zIndex + 1 : current.zIndex - 1;

    if (zIndexToFind < 1 || zIndexToFind > this.selectedLayerRange.max) {
      return;
    }
    let aIndex: number = null;
    let bIndex: number = null;

    for (let i = 0; i < len; i++) {
      if (current.id === this.dataList[listType][i].id) {
        aIndex = i;
      }
      if (zIndexToFind === this.dataList[listType][i].zIndex) {
        bIndex = i;
      }
    }
    const tmp = this.dataList[listType][bIndex].zIndex;
    this.dataList[listType][bIndex].zIndex = current.zIndex;
    current.zIndex = tmp;
  };

  private normalizeData = (tp: MTRL) => {
    const res: Record<string, TSelectedMaterial> = {};
    this.dataList[tp].forEach((item) => {
      res[`${item.id}`] = item;
    });
    return res;
  };

  private;
}

export const MaterialsStore = new MaterialsStoreVM();
