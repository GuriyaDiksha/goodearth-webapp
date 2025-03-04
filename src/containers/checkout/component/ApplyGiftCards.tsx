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
import { GiftCard } from "containers/myAccount/components/MyCreditNotes/typings";
import { displayPriceWithSeparation } from "utils/utility";
import { updateCheckoutLoader } from "actions/info";

type Props = {
  amountGC: any;
  hasGC: boolean;
};

const ApplyCreditNote: React.FC<Props> = ({ hasGC, amountGC }) => {
  const [isactivegiftcard, setIsactivegiftcard] = useState(false);
  const [giftcardList, setGiftcardList] = useState<GiftCard[]>([]);
  const {
    basket: { giftCards },
    currency,
    user: { isLoggedIn }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const giftCard = useMemo(() => {
    return giftCards?.filter(ele => ele.cardType === "GIFTCARD");
  }, [giftCards]);

  // const fetchGiftCards = () => {
  //     AccountService.fetchGiftCards(dispatch, "expiring_date", "asc", 1, true)
  //     .then(response => {
  //       const { results } = response;
  //       setGiftcardList(results.filter(ele => ele?.type !== "GC"));
  //     })
  //     .catch(e => {
  //       console.log("fetch credit notes API failed =====", e);
  //     });
  // };

  // useEffect(() => {
  //   fetchGiftCards();
  // }, []);

  useEffect(() => {
    setIsactivegiftcard(!!giftCard?.length);
  }, [giftCard?.length]);

  const onGiftCardToggle = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
    isEdit?: boolean
  ) => {
    //Open popup and fetch data : On checked true
    if (!isactivegiftcard || isEdit) {
      dispatch(
        updateComponent(
          POPUP.GIFTCARDS,
          {
            data: giftcardList,
            setIsactivegiftcard
          },
          false
        )
      );
      dispatch(updateModal(true));
    } else {
      //Close popupand remove all CN : On checked false
      for await (const giftcard of giftCard) {
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
    setIsactivegiftcard(isEdit || !isactivegiftcard);
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

  // if (giftcardList?.length === 0) {
  //   return null;
  // }

  const activatePopup = () => {
    dispatch(updateComponent(POPUP.ACTIVATEGIFTCARD, false));
    dispatch(updateModal(true));
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
          id="applyGC"
          checked={isactivegiftcard}
          onChange={hasGC && amountGC > 0 ? onGiftCardToggle : activatePopup}
          label={[
            <label
              key="applyGC"
              htmlFor="applyGC"
              className={cs(styles.formSubheading, styles.lineHeightLable)}
            >
              Apply Gift Card
            </label>
          ]}
        />

        {isactivegiftcard && !!giftCard.length && (
          <div className={styles.edit} onClick={e => onGiftCardToggle(e, true)}>
            Apply more
          </div>
        )}
      </div>

      {giftCard.length <= 0 && (
        <div className={styles.gcMsg}>
          {hasGC ? (
            amountGC > 0 ? (
              <p
                className={styles.aquaText}
              >{`Gift Card(s) worth ${displayPriceWithSeparation(
                amountGC,
                currency
              )} available`}</p>
            ) : (
              <p className={styles.greyText}>
                {`No <${currency}> balance available for linked Gift Cards.`}
                <br />
                <span className={styles.activateLink} onClick={activatePopup}>
                  Activate Gift Card
                </span>
              </p>
            )
          ) : (
            <p className={styles.greyText}>
              No active Gift Cards linked with your account. <br />
              <span className={styles.activateLink} onClick={activatePopup}>
                Activate Gift Card
              </span>
            </p>
          )}
        </div>
      )}

      <div>
        {isactivegiftcard &&
          !!giftCard.length &&
          giftCard?.map(ele => (
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
