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
      newState.shopthelook1 = action.payload.shopthelook1;
      newState.shopthelook2 = action.payload.shopthelook2;
      newState.editSection = action.payload.editSection;
      newState.topliving = action.payload.topliving;
      newState.peoplebuying = action.payload.peoplebuying;
      newState.newarrival = action.payload.newarrival;
      {
        return { ...newState };
      }
    }
  }
  return state;
};
