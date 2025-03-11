import React, { useEffect, useMemo, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import CheckboxWithLabel from "components/CheckboxWithLabel";
import { useDispatch, useSelector } from "react-redux";
import AccountService from "services/account";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import { AppState } from "reducers/typings";
import GiftCardItem from "./giftDetails";
import CheckoutService from "services/checkout";
import BasketService from "services/basket";
import { useHistory } from "react-router";
import bootstrapStyles from "styles/bootstrap/bootstrap-grid.scss";
import { CreditNote } from "containers/myAccount/components/MyCreditNotes/typings";
import { displayPriceWithSeparation } from "utils/utility";
import { updateCheckoutLoader } from "actions/info";

type Props = {
  amountCN: any;
};

const ApplyCreditNote: React.FC<Props> = ({ amountCN }) => {
  const [isactivecreditnote, setIsactivecreditnote] = useState(false);
  const [creditnoteList, setCreditnoteList] = useState<CreditNote[]>([]);
  const {
    basket: { giftCards },
    currency,
    user: { isLoggedIn }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const creditNotes = useMemo(() => {
    return giftCards?.filter(ele => ele.cardType === "CREDITNOTE");
  }, [giftCards]);

  // const fetchCreditNotes = () => {
  //   AccountService.fetchCreditNotes(dispatch, "expiring_date", "asc", 1, true)
  //     .then(response => {
  //       const { results } = response;
  //       setCreditnoteList(results.filter(ele => ele?.type !== "GC"));
  //     })
  //     .catch(e => {
  //       console.log("fetch credit notes API failed =====", e);
  //     });
  // };

  // useEffect(() => {
  //   fetchCreditNotes();
  // }, []);

  useEffect(() => {
    setIsactivecreditnote(!!creditNotes?.length);
  }, [creditNotes?.length]);

  const onCreditNoteToggle = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
    isEdit?: boolean
  ) => {
    //Open popup and fetch data : On checked true
    if (!isactivecreditnote || isEdit) {
      dispatch(
        updateComponent(
          POPUP.CREDITNOTES,
          {
            data: creditnoteList,
            setIsactivecreditnote
          },
          false
        )
      );
      dispatch(updateModal(true));
    } else {
      //Close popupand remove all CN : On checked false
      for await (const giftcard of creditNotes) {
        const data: any = {
          cardId: giftcard?.cardId,
          type: giftcard?.cardType
        };

        await CheckoutService.removeGiftCard(dispatch, data);
      }

      await BasketService.fetchBasket(
        dispatch,
        "checkout",
        history,
        isLoggedIn
      );
    }
    //Set true or false for checkbox
    setIsactivecreditnote(isEdit || !isactivecreditnote);
  };

  //Onclose of individual CN
  const onClose = async (code: string, type: string) => {
    dispatch(updateCheckoutLoader(true));
    const data: any = {
      cardId: code,
      type: type
    };

    const gift: any = await CheckoutService.removeGiftCard(dispatch, data);
    if (gift.status) {
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

  // if (creditnoteList?.length === 0) {
  //   return null;
  // }

  return (
    <div
      className={cs(globalStyles.marginT20, {
        [styles.disableSate]: amountCN <= 0
      })}
    >
      <div
        className={cs(
          bootstrapStyles.colMd6,
          styles.inputContainer,
          styles.creditNoteInputContainer
        )}
      >
        <CheckboxWithLabel
          id="applyCN"
          checked={isactivecreditnote}
          className={amountCN <= 0 ? styles.disabledLabel : ""}
          onChange={amountCN > 0 ? onCreditNoteToggle : () => null}
          label={[
            <label
              key="applyCN"
              htmlFor="applyCN"
              className={cs(styles.formSubheading, styles.lineHeightLable)}
            >
              Apply Credit Note
            </label>
          ]}
        />

        {isactivecreditnote && !!creditNotes.length && (
          <div
            className={styles.edit}
            onClick={e => onCreditNoteToggle(e, true)}
          >
            Apply more
          </div>
        )}
      </div>

      {!isactivecreditnote && (
        <div className={styles.gcMsg}>
          {amountCN > 0 ? (
            <p
              className={styles.aquaText}
            >{`Credit Note(s) worth ${displayPriceWithSeparation(
              amountCN,
              currency
            )} available`}</p>
          ) : (
            <p className={styles.greyText}>No Credit Note balance available</p>
          )}
        </div>
      )}

      <div>
        {isactivecreditnote &&
          !!creditNotes.length &&
          creditNotes?.map(ele => (
            <GiftCardItem
              isLoggedIn={isLoggedIn}
              {...ele}
              onClose={onClose}
              currency={currency}
              type="crd"
              currStatus={"success"}
              key={ele?.code}
            />
          ))}
      </div>
    </div>
  );
};

export default ApplyCreditNote;
