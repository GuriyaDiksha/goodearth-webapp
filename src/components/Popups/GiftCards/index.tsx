import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import style from "./index.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import GiftCardCard from "./GiftCardCard";
import BasketService from "services/basket";
import {
  GiftCard,
  SortBy,
  SortType
} from "containers/myAccount/components/MyCreditNotes/typings";
import { useHistory } from "react-router";
import CheckoutService from "services/checkout";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import AccountService from "services/account";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import { showGrowlMessage } from "utils/validate";
import { updateCheckoutLoader } from "actions/info";

type Props = {
  data: GiftCard[];
  setIsactivegiftcard: (x: boolean) => void;
  gc_code?: string;
};

const GiftCards: React.FC<Props> = ({ data, setIsactivegiftcard, gc_code }) => {
  const { closeModal } = useContext(Context);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [giftcardList, setgiftcardList] = useState<GiftCard[]>([]);

  const [error, setError] = useState<{ key: string }[]>([]);
  const {
    currency,
    device: { mobile },
    user: { isLoggedIn },
    basket: { giftCards }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const bodyRef = useRef<any>([]);

  const fetchGiftCards = () => {
    AccountService.fetchGiftCards(dispatch, "expiring_date", "asc", 1, true)
      .then(response => {
        const { results } = response;
        setgiftcardList(results.filter(ele => ele?.type !== "GC"));
      })
      .catch(e => {
        console.log("fetch credit notes API failed =====", e);
      });
  };

  const giftcards = useMemo(() => {
    return giftCards?.filter(ele => ele.cardType === "GIFTCARD");
  }, [giftCards]);

  useEffect(() => {
    fetchGiftCards();
    const cns = giftcards?.map(ele => ele?.cardId);
    setCheckedIds([...cns]);
  }, []);

  const applyGC = async (gc: string, isGCApplied?: boolean) => {
    dispatch(updateCheckoutLoader(true));
    const data: any = {
      cardId: gc,
      type: "GIFTCARD"
    };

    const gift: any = await CheckoutService.applyGiftCard(dispatch, data);
    if (gift.status) {
      setError({ ...error, [gc]: "" });

      setCheckedIds([...checkedIds, gc]);

      fetchGiftCards();

      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "eventsToSend",
          eventAction: "giftCard",
          eventCategory: "promoCoupons",
          eventLabel: data.cardId
        });
        dataLayer.push({
          event: "gift_card_or_credit_note",
          click_type: "GIFTCARD",
          gift_card_code: data.cardId
        });
      }

      const basketRes = await BasketService.fetchBasket(
        dispatch,
        "checkout",
        history,
        isLoggedIn
      );

      if (basketRes) {
        dispatch(updateCheckoutLoader(false));
      }

      //Show  Growl Messsage
      if (isGCApplied) {
        const msg = "Success. Gift Card Code Activated & Applied!";
        showGrowlMessage(dispatch, msg, 7000);
        AccountService.fetchGC_CN_Ammount(dispatch);
      }
    } else {
      setError({ ...error, [gc]: gift?.message });
      dispatch(updateCheckoutLoader(false));
      //Show  Growl Messsage
      if (isGCApplied) {
        const msg = "Success. Gift Card Code Activated!";
        showGrowlMessage(dispatch, msg, 7000);
      }
    }
  };

  useEffect(() => {
    if (gc_code) {
      applyGC(gc_code, true);
      // aplly GA events after activated gc successfully
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "gift_card_activated",
          gift_card_code: gc_code
        });
      }
    }
  }, [gc_code && gc_code]);

  const removeGC = async (gc: string) => {
    dispatch(updateCheckoutLoader(true));
    const data: any = {
      cardId: gc,
      type: "GIFTCARD"
    };
    const res = await CheckoutService.removeGiftCard(dispatch, data);
    if (res) {
      fetchGiftCards();
      setError({ ...error, [gc]: "" });
      setCheckedIds([...checkedIds.filter(ele => ele !== gc)]);
      const basketRes = await BasketService.fetchBasket(
        dispatch,
        "checkout",
        history,
        isLoggedIn
      );
      if (basketRes) {
        dispatch(updateCheckoutLoader(false));
      }
    }
  };

  const onCheck = (isApplied: boolean, entry_code: string) => {
    if (isApplied) {
      removeGC(entry_code);
    } else {
      applyGC(entry_code);
    }
  };

  const onClose = () => {
    closeModal();
    if (giftcards.length === 0) {
      setIsactivegiftcard(false);
    }
  };

  //This is for expired or balance over cards
  const toggleActive = (key: string) => {
    const currentBody = bodyRef?.current?.[activeKey];
    const newBody = bodyRef?.current?.[key];

    //Collapse current state
    if (activeKey !== "" && currentBody) {
      currentBody.style.maxHeight = 0 + "px";
    }

    if (newBody) {
      if (activeKey !== key) {
        newBody.style.maxHeight = newBody.scrollHeight + 20 + "px"; //Expand new state
      } else {
        newBody.style.maxHeight = 0 + "px"; //collapase new state
      }
    }

    setActiveKey(activeKey !== key ? key : "");
  };

  const activatePopup = () => {
    dispatch(updateComponent(POPUP.ACTIVATEGIFTCARD, false));
    dispatch(updateModal(true));
    if (giftcards.length === 0) {
      setIsactivegiftcard(false);
    }
  };

  //filtered giftcard list by currency and without over balance
  const filteredgiftcardList = giftcardList?.filter(
    giftcardList =>
      giftcardList.currency == currency && giftcardList.message == ""
  );

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.popUpHeight,
          { [styles.centerpageDesktopFs]: !mobile },
          globalStyles.textCenter,
          { [styles.centerpageDesktopFsWidth]: mobile }
        )}
      >
        <div className={styles.headWrp}>
          <div className={style.creditNoteHead}>Apply gift card</div>
          <div
            className={cs(styles.cross, styles.deliveryIcon)}
            onClick={onClose}
          >
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCrossNarrowBig,
                styles.icon,
                styles.iconCross,
                styles.freeShippingPopup
              )}
            ></i>
          </div>
        </div>

        <div className={cs(style.cnBody)}>
          <div className={style.boxWrp}>
            <div className={style.activateBox} onClick={activatePopup}>
              + ACTIVATE NEW GIFT CARD
            </div>
            {filteredgiftcardList.map(giftcard => (
              <GiftCardCard
                key={giftcard?.entry_code}
                giftCardData={giftcard}
                onCheck={onCheck}
                checkedIds={checkedIds}
                activeKey={activeKey}
                setActiveKey={toggleActive}
                ref={bodyRef}
                error={error}
              />
            ))}
          </div>
        </div>

        <div className={styles.footerWrp}>
          <div onClick={onClose}>SAVE & CLOSE</div>
        </div>
      </div>
    </div>
  );
};

export default GiftCards;
