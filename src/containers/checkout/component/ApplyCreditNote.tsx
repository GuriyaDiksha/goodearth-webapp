import React, { useEffect, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import CheckboxWithLabel from "components/CheckboxWithLabel";
import { useDispatch, useSelector } from "react-redux";
import ModalStyles from "components/Modal/styles.scss";
import AccountService from "services/account";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import { AppState } from "reducers/typings";
import GiftCardItem from "./giftDetails";
import CheckoutService from "services/checkout";
import BasketService from "services/basket";
import { useHistory } from "react-router";
import bootstrapStyles from "styles/bootstrap/bootstrap-grid.scss";

const ApplyCreditNote = () => {
  const [isactivecreditnote, setIsactivecreditnote] = useState(false);
  const {
    basket,
    currency,
    device: { mobile },
    user: { isLoggedIn }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    setIsactivecreditnote(
      !!basket?.giftCards?.filter(ele => ele.cardType === "CREDITNOTE")?.length
    );
  }, [basket?.giftCards?.length]);

  const fetchCreditNotes = () => {
    AccountService.fetchCreditNotes(dispatch, "expiring_date", "desc", 1, true)
      .then(response => {
        const { results } = response;

        dispatch(
          updateComponent(
            POPUP.CREDITNOTES,
            {
              data: results
            },
            false,
            mobile ? ModalStyles.bottomAlignSlideUp : "",
            mobile ? "slide-up-bottom-align" : ""
          )
        );
        dispatch(updateModal(true));
      })
      .catch(e => {
        console.log("fetch credit notes API failed =====", e);
      });
  };

  const onCreditNoteToggle = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
    isEdit?: boolean
  ) => {
    if (!isactivecreditnote || isEdit) {
      fetchCreditNotes();
    } else {
      for await (const giftcard of basket?.giftCards?.filter(
        ele => ele?.cardType === "CREDITNOTE"
      )) {
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
    setIsactivecreditnote(isEdit || !isactivecreditnote);
  };

  const onClose = async (code: string, type: string) => {
    const data: any = {
      cardId: code,
      type: type
    };

    const gift: any = await CheckoutService.removeGiftCard(dispatch, data);
    if (gift.status) {
      await BasketService.fetchBasket(
        dispatch,
        "checkout",
        history,
        isLoggedIn
      );
    }
  };

  return (
    <div className={globalStyles.marginT20}>
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
          onChange={onCreditNoteToggle}
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

        {isactivecreditnote && !!basket.giftCards?.length && (
          <div
            className={styles.edit}
            onClick={e => onCreditNoteToggle(e, true)}
          >
            Edit
          </div>
        )}
      </div>

      <div>
        {isactivecreditnote &&
          !!basket.giftCards?.length &&
          basket.giftCards
            ?.filter(ele => ele.cardType === "CREDITNOTE")
            ?.map(ele => (
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
