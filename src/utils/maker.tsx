import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BasketService from "../services/basket";
import CookieService from "../services/cookie";
import { updateModal } from "actions/modal";
import { AppState } from "reducers/typings";
import { showGrowlMessage } from "./validate";
import LoginService from "services/login";

const MakerUtils: React.FC = () => {
  const dispatch = useDispatch();

  const setMakerPopupCookie = () => {
    const cookieString =
      "makerinfo=show; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
    document.cookie = cookieString;
    CookieService.setCookie("makerinfo", "show", 365);
  };
  const currency = useSelector((state: AppState) => state.currency);

  useEffect(() => {
    (window as any).$goodearth = {
      AddToBag: function(
        event: any,
        productSku: string,
        size?: string,
        quantity?: number
      ) {
        // code for size exist or not
        if (!size) {
          console.log("Size is empty");
        }

        BasketService.addToBasket(dispatch, 0, quantity || 1, productSku)
          .then((res: any) => {
            showGrowlMessage(dispatch, "Item has been added to your bag!");
            BasketService.fetchBasket(dispatch);
          })
          .catch(error => {
            if (error.response.status == 406) {
              showGrowlMessage(dispatch, error.response.data);
            }
            console.log(error);
          });
      },
      openLogin: () => {
        LoginService.showLogin(dispatch);
      },
      closeMakerPopup: function() {
        setMakerPopupCookie();
        dispatch(updateModal(false));
      },
      currency: currency
    };
  }, [currency]);

  return <></>;
};

export default MakerUtils;
