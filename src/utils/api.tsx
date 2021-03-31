import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { AnyAction, Dispatch } from "redux";
import { AppState } from "reducers/typings";
import Axios, { AxiosRequestConfig } from "axios";
import { updateCookies } from "actions/cookies";
import CookieService from "services/cookie";
import LoginService from "services/login";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";

class API {
  static async get<T>(
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    url: string
  ): Promise<T> {
    return await API.callAPI<T>(dispatch, {
      url,
      method: "GET"
    });
  }

  static post<T>(
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    url: string,
    data: any,
    headers: any = {}
  ): Promise<T> {
    return API.callAPI<T>(dispatch, {
      url,
      data,
      headers,
      method: "POST"
    });
  }

  static put<T>(
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    url: string,
    data: any,
    headers: any = {}
  ): Promise<T> {
    return API.callAPI<T>(dispatch, {
      url,
      data,
      headers,
      method: "PUT"
    });
  }

  static delete<T>(
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    url: string,
    data: any
  ): Promise<T> {
    return API.callAPI<T>(dispatch, {
      url,
      method: "DELETE",
      data: data
    });
  }

  static apiAction = function(
    callback: any
  ): ThunkAction<any, {}, {}, AnyAction> {
    return (dispatch: Dispatch, getState) => {
      const { cookies } = getState() as AppState;
      callback(cookies);
    };
  };

  static callAPI<T>(
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    options: AxiosRequestConfig
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      dispatch(
        API.apiAction((cookies: any) => {
          let requestHeaders: any = {};
          if (cookies.tkn) {
            requestHeaders["Authorization"] = `Token ${cookies.tkn}`;
          }
          if (cookies.sessionid) {
            requestHeaders["sessionid"] = cookies.sessionid;
          }

          requestHeaders = {
            ...requestHeaders,
            ...options.headers
          };
          Axios({
            ...options,
            withCredentials: true,
            headers: requestHeaders
          })
            .then(res => {
              if (cookies.sessionid != res.headers.sessionid) {
                if (typeof document != "undefined") {
                  CookieService.setCookie(
                    "sessionid",
                    res.headers.sessionid,
                    365
                  );
                }
                dispatch(updateCookies({ sessionid: res.headers.sessionid }));
              }
              if (res.status == 200 || res.status == 201) {
                resolve(res.data);
              } else {
                reject(res);
              }
            })
            .catch(err => {
              // debugger
              if (typeof document != "undefined") {
                if (err.response.status == 401) {
                  LoginService.logoutClient(dispatch);
                } else if (
                  err.response.status == 406 &&
                  err.response.data?.reason == "BACKEND_ORDER_BASKET"
                ) {
                  dispatch(
                    updateComponent(POPUP.BACKENDORDER, null, true, undefined)
                  );
                  dispatch(updateModal(true));
                  reject(err);
                } else {
                  reject(err);
                }
              } else {
                reject(err);
              }
            });
        })
      );
    });
  }
}

export default API;
