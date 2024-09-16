import { InitAction } from "typings/actions";

const initActionCatalogue: InitAction = async store => {
  // const dispatch = store.dispatch;
  try {
    console.log("everything fine!!");
  } catch (err) {
    console.log(err);
  }
};

export default initActionCatalogue;
