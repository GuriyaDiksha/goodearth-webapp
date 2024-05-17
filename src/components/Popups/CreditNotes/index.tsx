import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import style from "./index.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import CreditNoteCard from "./CreditNoteCard";
import BasketService from "services/basket";
import { CreditNote } from "containers/myAccount/components/MyCreditNotes/typings";
import { useHistory } from "react-router";
import CheckoutService from "services/checkout";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

type Props = {
  data: CreditNote[];
  setIsactivecreditnote: (x: boolean) => void;
};

const CreditNotes: React.FC<Props> = ({ data, setIsactivecreditnote }) => {
  const { closeModal } = useContext(Context);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [error, setError] = useState<{ key: string }[]>([]);
  const {
    device: { mobile },
    user: { isLoggedIn },
    basket: { giftCards }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const bodyRef = useRef<any>([]);

  const creditNotes = useMemo(() => {
    return giftCards?.filter(ele => ele.cardType === "CREDITNOTE");
  }, [giftCards]);

  useEffect(() => {
    const cns = creditNotes?.map(ele => ele?.cardId);
    return setCheckedIds([...cns]);
  }, []);

  const applyCN = async (cn: string) => {
    const data: any = {
      cardId: cn,
      type: "CREDITNOTE"
    };

    const gift: any = await CheckoutService.applyGiftCard(dispatch, data);
    if (gift.status) {
      setError({ ...error, [cn]: "" });

      setCheckedIds([...checkedIds, cn]);

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
          click_type: "CREDITNOTE",
          gift_card_code: data.cardId
        });
      }

      await BasketService.fetchBasket(
        dispatch,
        "checkout",
        history,
        isLoggedIn
      );
    } else {
      setError({ ...error, [cn]: gift?.message });
    }
  };

  const removeCN = async (cn: string) => {
    const data: any = {
      cardId: cn,
      type: "CREDITNOTE"
    };
    const res = await CheckoutService.removeGiftCard(dispatch, data);
    if (res) {
      setCheckedIds([...checkedIds.filter(ele => ele !== cn)]);
      await BasketService.fetchBasket(
        dispatch,
        "checkout",
        history,
        isLoggedIn
      );
    }
  };

  const onCheck = (isApplied: boolean, entry_code: string) => {
    if (isApplied) {
      removeCN(entry_code);
    } else {
      applyCN(entry_code);
    }
  };

  const onClose = () => {
    closeModal();
    if (creditNotes.length === 0) {
      setIsactivecreditnote(false);
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

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          { [styles.centerpageDesktopFs]: !mobile },
          globalStyles.textCenter,
          { [styles.centerpageDesktopFsWidth]: mobile }
        )}
      >
        <div className={styles.headWrp}>
          <div className={style.creditNoteHead}>Apply credit note</div>
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
            {data?.map(creditNote => (
              <CreditNoteCard
                key={creditNote?.entry_code}
                creditNote={creditNote}
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
      </div>
    </div>
  );
};

export default CreditNotes;
