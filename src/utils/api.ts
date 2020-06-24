import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { AnyAction, Dispatch } from "redux";
import { AppState } from "reducers/typings";
import Axios, { AxiosRequestConfig } from "axios";

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
          let requestHeaders = cookies.tkn
            ? {
                Authorization: `Token ${cookies.tkn || ""}`
              }
            : {};
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
              resolve(res.data);
            })
            .catch(err => {
              reject(err);
            });
        })
      );
    });
  }
}

export default API;
