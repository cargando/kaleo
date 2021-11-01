export interface TState {
  value: number;
  width: number;
  offset: number;
  mouseDown: number;
}

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
// https://stackoverflow.com/questions/48230773/how-to-create-a-partial-like-that-requires-a-single-property-to-be-set/48244432

type TAction = {
  type: string;
  payload: AtLeastOne<TState>;
};

export const Actions = {
  value: 'VALUE',
  width: 'WIDTH',
  offset: 'OFFSET',
  mouseDown: 'MOUSEDOWN',
};

export const initialState: TState = { value: 0, width: 0, offset: 0, mouseDown: null };

export function reducer(state: TState, action: TAction): TState {
  switch (action.type) {
    case Actions.value:
      return { ...state, value: action.payload.value };
    case Actions.width:
      return { ...state, width: action.payload.width };
    case Actions.offset:
      return { ...state, offset: action.payload.offset };
    case Actions.mouseDown:
      return { ...state, mouseDown: action.payload.mouseDown };
    default:
      throw new Error();
  }
}
