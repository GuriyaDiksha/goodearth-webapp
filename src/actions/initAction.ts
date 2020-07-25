// services
import HeaderService from "services/headerFooter";
import MetaService from "services/meta";
// actions
import { updatefooter } from "actions/footer";
import { updateheader } from "actions/header";
// typings
import { Store } from "redux";
import { AppState } from "reducers/typings";

const initAction: any = async (store: Store) => {
  const state: AppState = store.getState();
  let apiCalls = [
    HeaderService.fetchHeaderDetails().then(header => {
      store.dispatch(updateheader(header));
    }),
    HeaderService.fetchFooterDetails().then(footer => {
      store.dispatch(updatefooter(footer));
    })
  ];

  if (state.cookies.tkn) {
    apiCalls = apiCalls.concat([
      MetaService.updateMeta(store.dispatch, state.cookies)
    ]);
  }
  return Promise.all(apiCalls);
};
export default initAction;
