import { actionCreator } from "utils/actionCreator";

export const updateDeviceInfo = (
  mobile: boolean,
  tablet: boolean,
  orientation: "portrait" | "landscape"
) => actionCreator("UPDATE_DEVICE_INFO", { mobile, tablet, orientation });
