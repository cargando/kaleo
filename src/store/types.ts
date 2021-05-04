export enum APIStatus {
  DONE,
  LOADING,
  ERROR,
}

export interface TResponseData {
  searchQuery: string;
  status: APIStatus;
  data: any;
  selected?: [] | [number];
  message?: string;
  cnt?: number;
}
