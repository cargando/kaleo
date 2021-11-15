export enum MaterialsTP {
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
  MTRL_TYPE, // все виды материалов
  MTRL_GENERATED, // сгенерированный набор материалов
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

export type TDataList = Partial<Record<MaterialsTP, any[]>>;
export type TSelectedList = Partial<Record<MaterialsTP, number[]>>;
export type TMultiSelectedList = Partial<Record<MaterialsTP, boolean>>;

export interface TMaterialVMProps extends TResponseData {
  // veneerData: any;
  // colorData: any;
  searchQuery: string;
  // multiSelectVeneer?: boolean;
  // multiSelectColor?: boolean;
  // elementsCount?: number;
  // textureCount?: number;
  // elementsColors?: number[];
  // elementsMaterials?: number[];
  // selectedColor?: number[];
  // selectedVeneer?: number[];
  dataList?: TDataList;
  selectedList?: TSelectedList;
  isMultiSelect?: TMultiSelectedList;
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
  bgScale?: number;
  rotate?: number;
  width?: number;
  height?: number;
  zIndex?: number;
  top?: number;
  left?: number;
}
