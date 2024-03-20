import { InitAction } from "typings/actions";

const initActionRegistery: InitAction = async store => {
  // const dispatch = store.dispatch;
  try {
    console.log("everything fine!!");
  } catch (err) {
    console.log(err);
  }
};

export default initActionRegistery;
