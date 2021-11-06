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
}

export interface TMaterial {
  id: number;
  src: any;
  title: string;
}
