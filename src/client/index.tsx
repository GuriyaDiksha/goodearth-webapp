import { configureStore } from "store/configure";

const store = configureStore(true);

console.log(store.getState());
