export enum APIStatus {
  DONE,
  LOADING,
  ERROR,
}

export interface TResponseData {
  data: any;
  selected?: [] | [number];
  message?: string;
  cnt?: number;
}

export interface TMaterialVMProps extends TResponseData {
  searchQuery: string;
  multiSelect?: boolean;
  elementsCount?: number;
  textureCount?: number;
  elementsColors?: number[];
  elementsMaterials?: number[];
  selectedVeneer?: number[];
}

export interface TMaterial {
  id: number;
  src: any;
  title: string;
}
