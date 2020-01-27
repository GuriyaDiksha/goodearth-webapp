import { Action } from "../typings/actionCreator";

export const actionCreator: Action = (name, data) => {
  return {
    type: name,
    payload: data
  };
};
