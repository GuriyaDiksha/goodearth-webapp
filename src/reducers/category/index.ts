import { CategoryState, CategoryActions } from "./typings";

const initialState: CategoryState = {
  shopthelook1: {},
  shopthelook2: {},
  editSection: {},
  topliving: {},
  peoplebuying: {},
  newarrival: {}
};

export const category = (
  state: CategoryState = initialState,
  action: CategoryActions
) => {
  switch (action.type) {
    case "ADD_CATEGORY_DATA": {
      const newState = { ...state };
      newState.shopthelook1 = action.payload.shopthelook1 || initialState;
      newState.shopthelook2 = action.payload.shopthelook2 || initialState;
      newState.editSection = action.payload.editSection || initialState;
      newState.topliving = action.payload.topliving || initialState;
      newState.peoplebuying = action.payload.peoplebuying || initialState;
      newState.newarrival = action.payload.newarrival || initialState;
      {
        return { ...newState };
      }
    }
  }
  return state;
};
