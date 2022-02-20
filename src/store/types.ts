export enum MTRL {
  VENEER, // шпон
  WOOD, // тип дерева (береза, дуб, и пр)
  COLOR, // цвет
  STONE,
  TEXSTILE,
  PLASTER, // штукатурка
  CONCRETE, // бетон
  PLASTIC,
  METAL,
  PAPER,
  ALL_TYPES, // все виды материалов
  GENERATED, // сгенерированный набор материалов
}

export enum APIStatus {
  DONE,
  LOADING,
  ERROR,
}

export interface TResponseData {
  data?: any;
  selected?: [] | [number];
  message?: string;
  cnt?: number;
}

export interface TMinMax {
  min: number;
  max: number;
}

export type TDataList = Partial<Record<MTRL, any[]>>;
export type TSelectedList = Partial<Record<MTRL, number[]>>;
export type TMultiSelectedList = Partial<Record<MTRL, boolean>>;

export type TBox = { top: number; left: number; width: number; height: number };

export interface TMaterialVMProps extends TResponseData {
  searchQuery: string;
  dataList?: TDataList;
  selectedList?: TSelectedList;
  isMultiSelect?: TMultiSelectedList;
  plateWithControls?: number;
  selectedLayerRange?: TMinMax;
  isDragging?: boolean;
  rootBox: TBox;
}
// const partitions: Record<string, { [key: string]: TTableStatus }> = {};

export interface TWood {
  id: number;
  src?: any;
  title?: string;
}

export interface TColor {
  id: number;
  color?: string;
  title?: string;
  border?: string;
}

export interface TMaterial extends TWood, TColor {}

export interface TSelectedMaterial extends TMaterial {
  srcLarge?: any;
  bgScale?: number | string;
  angle?: number;
  width?: number;
  height?: number;
  bgWidth?: number;
  bgHeight?: number;
  zIndex?: number;
  top?: number;
  left?: number;
  active?: boolean;
  square?: number;
}
