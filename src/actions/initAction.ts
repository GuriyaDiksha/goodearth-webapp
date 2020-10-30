// services
import HeaderService from "services/headerFooter";
import ApiService from "services/api";
import MetaService from "services/meta";
// typings
import { Store } from "redux";
import { AppState } from "reducers/typings";
import Api from "services/api";
import AddressService from "services/address";
import LoginService from "services/login";
import { updatePinCodeList, updateCountryData } from "./address";
import { updateCurrencyList } from "./info";

const initAction: any = async (store: Store) => {
  const state: AppState = store.getState();
  let apiCalls = [
    HeaderService.fetchHeaderDetails(store.dispatch)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log("HEADER API ERROR ==== " + err);
      }),
    HeaderService.fetchFooterDetails(store.dispatch)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      }),
    HeaderService.getCurrencyList(store.dispatch)
      .then(data => {
        store.dispatch(updateCurrencyList(data));
      })
      .catch(err => {
        console.log("CURRENCY LIST API ERROR ==== " + err);
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
        console.log(data);
      })
      .catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      }),
    ApiService.getCurrency(store.dispatch).catch(err => {
      console.log("FOOTER API ERROR ==== " + err);
    }),
    ApiService.getSalesStatus(store.dispatch).catch(err => {
      console.log("Sales Api Status ==== " + err);
    }),
    ApiService.getPopupBgUrl(store.dispatch).catch(err => {
      console.log("Popup Bg Api Status ==== " + err);
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
