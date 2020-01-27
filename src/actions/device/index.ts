import { actionCreator } from "src/utils/actionCreator";

export const updateDeviceInfo = (mobile: boolean, tablet: boolean) =>
  actionCreator("UPDATE_DEVICE_INFO", { mobile, tablet });
