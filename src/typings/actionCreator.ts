import { Reducer } from "redux";

export type Action = <T extends string, S>(
  type: T,
  payload: S
) => {
  type: T;
  payload: S;
};

export type ActionCreator<T> = {
  [x: string]: (...args: any) => ReturnType<Action>;
};

export type ActionType<T extends ActionCreator<T>> = ReturnType<T[keyof T]>;

export type StateType<T extends Reducer<any>> = ReturnType<ReturnType<T>>;
