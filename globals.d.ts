import { compose } from "redux";
import { AppState } from "reducers/typings";

type ReduxCompose = typeof compose;

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: ReduxCompose;
    state: AppState;
    MakerEmbeds: any;
  }
}
