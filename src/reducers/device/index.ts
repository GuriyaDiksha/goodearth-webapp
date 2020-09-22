import { State, DeviceActions } from "./typings.d";

const initialState: State = {
  mobile: false,
  tablet: false
};

export const device = (state: State = initialState, action: DeviceActions) => {
  switch (action.type) {
    case "UPDATE_DEVICE_INFO": {
      return { ...state, ...action.payload };
    }
  }

  return state;
};
