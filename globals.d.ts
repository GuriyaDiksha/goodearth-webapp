import { compose } from "redux";

type ReduxCompose = typeof compose;

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: ReduxCompose;
  }
}
