import { HeaderState, DeviceActions } from "./typings";

const initialState: HeaderState = {
  data: []
};

export const header = (
  state: HeaderState = initialState,
  action: DeviceActions
) => {
  switch (action.type) {
    case "UPDATE_HEADER": {
      const newState = { ...state };
      newState.data = action.payload;
      {
        return { ...newState };
      }
    }
  }
  return state;
};
