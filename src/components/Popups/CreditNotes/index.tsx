import React, { useContext, useEffect, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import style from "./index.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import Button from "components/Button";
import CreditNoteCard from "./CreditNoteCard";
import BasketService from "services/basket";
import { CreditNote } from "containers/myAccount/components/MyCreditNotes/typings";
import { useHistory } from "react-router";
import CheckoutService from "services/checkout";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

type Props = {
  data: CreditNote[];
};

const CreditNotes: React.FC<Props> = ({ data }) => {
  const { closeModal } = useContext(Context);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const {
    device: { mobile },
    user: { isLoggedIn },
    basket: { giftCards }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const cns = giftCards
      ?.filter(ele => ele?.cardType === "CREDITNOTE")
      ?.map(ele => ele?.cardId);
    return setCheckedIds([...cns]);
  }, []);

  const onContinue = async () => {
    setError("");

    for await (const cn of checkedIds) {
      const data: any = {
        cardId: cn,
        type: "CREDITNOTE"
      };

      const gift: any = await CheckoutService.applyGiftCard(dispatch, data);
      if (gift.status) {
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
      } else {
        setError(gift?.message);
      }
    }

    await BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
    closeModal();
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
            onClick={closeModal}
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
                setCheckedIds={setCheckedIds}
                checkedIds={checkedIds}
              />
            ))}
          </div>
          {!!error && <p className={styles.error}>{error}</p>}
          <Button
            variant="mediumMedCharcoalCta366"
            label={"Continue"}
            onClick={onContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default CreditNotes;
