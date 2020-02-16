import rootReducer from "./root";
import { StateType } from "typings/actionCreator";

export type AppState = StateType<typeof rootReducer>;
