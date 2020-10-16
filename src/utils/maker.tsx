import React, { useEffect } from "react";
import { showMessage } from "actions/growlMessage";
import { useDispatch } from "react-redux";
import BasketService from "../services/basket";
import CookieService from "../services/cookie";
import { updateModal } from "actions/modal";

const MakerUtils: React.FC = () => {
  const dispatch = useDispatch();

  const setMakerPopupCookie = () => {
    const cookieString =
      "makerinfo=show; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
    document.cookie = cookieString;
    CookieService.setCookie("makerinfo", "show", 365);
  };
  useEffect(() => {
    (window as any).$goodearth = {
      AddToBag: function(
        event: any,
        productSku: number,
        size: string,
        quantity?: number
      ) {
        // code for size exist or not
        if (!size) {
          console.log("Size is empty");
        }

        BasketService.addToBasket(dispatch, productSku, quantity || 1)
          .then((res: any) => {
            if (res.status == 200) {
              dispatch(showMessage("Item has been added to your bag!"));
              BasketService.fetchBasket(dispatch);
            } else {
              dispatch(showMessage("Can't add to bag"));
            }
          })
          .catch(error => {
            if (error.response.status == 406) {
              dispatch(showMessage(error.response.data.reason));
            }
            console.log(error);
          });
      },
      closeMakerPopup: function() {
        setMakerPopupCookie();
        dispatch(updateModal(false));
      }
    };
  }, []);

  return <></>;
};

export default MakerUtils;
