// services
import HeaderService from "services/headerFooter";
import ApiService from "services/api";
// import MetaService from "services/meta";
// actions
import { updatefooter } from "actions/footer";
import { updateheader, updateAnnouncement } from "actions/header";
// typings
import { Store } from "redux";
// import { AppState } from "reducers/typings";
import Api from "services/api";
const initAction: any = async (store: Store) => {
  // const state: AppState = store.getState();
  const apiCalls = [
    HeaderService.fetchHeaderDetails()
      .then(header => {
        store.dispatch(updateheader(header));
      })
      .catch(err => {
        console.log("HEADER API ERROR ==== " + err);
      }),
    HeaderService.fetchFooterDetails()
      .then(footer => {
        store.dispatch(updatefooter(footer));
      })
      .catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      }),
    Api.getAnnouncement(store.dispatch)
      .then(data => {
        store.dispatch(updateAnnouncement(data));
      })
      .catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      }),
    ApiService.getCurrency(store.dispatch).catch(err => {
      console.log("FOOTER API ERROR ==== " + err);
    })
  ];

  // if (state.cookies.tkn) {
  //   apiCalls = apiCalls.concat([
  //     MetaService.updateMeta(store.dispatch, state.cookies)
  //   ]);
  // }
  return Promise.all(apiCalls);
};
export default initAction;
