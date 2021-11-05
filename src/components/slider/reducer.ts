export interface TState {
  value: number; // значение в процентах
  width: number; // значение в пикселях (активный бордер)
  mouseDown: number; // координата контрола относительно ковера, в момент нажатия
  clientX: number; // Х координата мыши
}

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
// https://stackoverflow.com/questions/48230773/how-to-create-a-partial-like-that-requires-a-single-property-to-be-set/48244432

type TAction = {
  type: number;
  payload: AtLeastOne<TState>;
};

export enum Actions {
  value,
  width,
  offset,
  mouseDown,
}

export const initialState: TState = { value: 0, width: 0, mouseDown: null, clientX: null };

export function reducer(state: TState, action: TAction): TState {
  switch (+action.type) {
    case Actions.value:
      return { ...state, ...action.payload };
    case Actions.width:
      return { ...state, ...action.payload };
    case Actions.mouseDown:
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
}
