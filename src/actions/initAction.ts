// services
import HeaderService from "services/headerFooter";
import ApiService from "services/api";
import MetaService from "services/meta";
// actions
import { updatefooter } from "actions/footer";
import { updateheader, updateAnnouncement } from "actions/header";
// typings
import { Store } from "redux";
import { AppState } from "reducers/typings";
import Api from "services/api";
import AddressService from "services/address";
import LoginService from "services/login";
import { updatePinCodeList, updateCountryData } from "./address";

const initAction: any = async (store: Store) => {
  const state: AppState = store.getState();
  let apiCalls = [
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
    AddressService.fetchPinCodeData(store.dispatch)
      .then(data => {
        const pinCodeList = Object.keys(data);
        store.dispatch(updatePinCodeList(data, pinCodeList));
      })
      .catch(err => {
        console.log("PINCODE API ERROR ====" + err);
      }),
    LoginService.fetchCountryData(store.dispatch)
      .then(data => {
        store.dispatch(updateCountryData(data));
      })
      .catch(err => {
        console.log("COUNTRYSTATE API ERROR ====" + err);
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
    }),
    ApiService.getSalesStatus(store.dispatch).catch(err => {
      console.log("Sales Api Status ==== " + err);
    })
  ];

  if (state.cookies.tkn) {
    apiCalls = apiCalls.concat([
      MetaService.updateMeta(store.dispatch, state.cookies).catch(err => {
        console.log("META API ERROR ==== " + err);
      })
    ]);
  }
  return Promise.all(apiCalls);
};
export default initAction;
