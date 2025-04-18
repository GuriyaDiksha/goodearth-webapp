import React, { useState, useContext } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import CloseButton from "components/Modal/components/CloseButton";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import Button from "components/Button";
import { useStore, useDispatch } from "react-redux";
import WishlistService from "services/wishlist";
import { decriptdata } from "utils/validate";
import { Context } from "components/Modal/context";
import { showGrowlMessage } from "utils/validate";

interface Props {
  dataLength: number;
}

const createWishlist: React.FC<Props> = ({ dataLength }) => {
  const [listName, setListName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isenable, setIsenable] = useState(false);
  const store = useStore();
  const dispatch = useDispatch();
  const { closeModal } = useContext(Context);
  const isAlphaError = "Please enter only alphabetic characters";

  const capitalizeFirstLetter = (text: any) => {
    return text
      .split(/\s+/) // Split by whitespace
      .map((word: any) => {
        if (word.length > 0) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
      })
      .join(" ");
  };
  const onInputChange = (e: any) => {
    const value = capitalizeFirstLetter(e.currentTarget.value.trim());
    setListName(value);
    if (value) {
      setIsenable(true);
    } else {
      setIsenable(false);
      setErrorMsg("");
      setIsenable(false);
    }
  };

  const gtmPushCreateWishlist = (listName?: string) => {
    dataLayer.push({
      event: "new_list_created",
      list_name: listName
    });
  };

  const handleSubmit = async () => {
    console.log("handleSubmit fuction called....");
    try {
      console.log("try block..");
      const response = await WishlistService.addToWishlist(
        store.dispatch,
        undefined,
        listName
      );
      if (response) {
        setListName("");
        setErrorMsg("");
        setIsenable(false);
        closeModal();
        showGrowlMessage(dispatch, `New list ${listName} has been created.`);
        gtmPushCreateWishlist(listName);
        return response;
      }
    } catch (error) {
      // const data = decriptdata(error.response?.data);
      const data = error.response?.data;
      if (data.message) {
        setErrorMsg(data.message);
        console.log("error msg testing...");
      }
    }
  };

  return (
    <div className={cs(styles.wishlistPopupContainer)}>
      <div className={styles.header}>
        <CloseButton className={styles.closeBtn} />
      </div>
      <div className={styles.contentContainer}>
        {dataLength < 6 ? (
          <>
            <h2>Create New List</h2>
            <Formsy onValidSubmit={handleSubmit}>
              <FormInput
                id=""
                className={cs(styles.inputField, styles.regFormLabel, {
                  [styles.errorBorder]: errorMsg
                })}
                name="listName"
                placeholder="List Name*"
                label="List Name*"
                validations={{
                  // isWords: true,
                  maxLength: 30,
                  isExisty: true
                }}
                validationErrors={{
                  // isWords: isAlphaError,
                  maxLength: "You cannot enter more than 30 characters"
                }}
                // value={listName || ""}
                handleChange={onInputChange}
                maxlength={30}
              />
              <div className={styles.errMsgCharLimit}>
                <p className={styles.errorMsg}>{errorMsg}</p>
                <div className={styles.limitText}>
                  Character Limit:{" "}
                  {30 - listName?.length >= 0 ? 30 - listName?.length : 0}/30
                </div>
              </div>
              <Button
                variant={
                  !isenable ? "smallLightGreyCta" : "smallMedCharcoalCta"
                }
                type="submit"
                label={"CREATE LIST"}
                disabled={!isenable}
                stopHover={true}
                className={cs(styles.createBtn)}
              />
            </Formsy>
          </>
        ) : (
          <div className={styles.maxLimitReached}>
            <h3>Maximum Lists Created</h3>
            <p className={styles.contentText}>
              Only upto 5 lists can be <br />
              created to save products. You may delete <br />
              an older list to make a new one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default createWishlist;
