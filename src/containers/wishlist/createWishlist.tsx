import React, { useState, useContext } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import CloseButton from "components/Modal/components/CloseButton";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import Button from "components/Button";
import { useStore } from "react-redux";
import WishlistService from "services/wishlist";
import { decriptdata } from "utils/validate";
import { Context } from "components/Modal/context";

interface Props {
  dataLength: number;
  updateWishlistData: any;
}

const createWishlist: React.FC<Props> = ({
  dataLength,
  updateWishlistData
}) => {
  const [listName, setListName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isenable, setIsenable] = useState(false);
  const store = useStore();
  const { closeModal } = useContext(Context);

  const onInputChange = (e: any) => {
    const value = e.currentTarget.value.trim();
    setListName(value);
    if (value) {
      setIsenable(true);
    } else {
      setIsenable(false);
      setErrorMsg("");
      setIsenable(false);
    }
  };

  const handleSubmit = () => {
    WishlistService.addToWishlist(store.dispatch, undefined, listName)
      .then(res => {
        setListName(listName);
        setErrorMsg("");
        setIsenable(false);
        closeModal();
        updateWishlistData();
      })
      .catch((error: any) => {
        const data = decriptdata(error.response?.data);
        console.log(error);
        if (data.success == false) {
          if (data.message == "Wishlist name already exist!") {
            setErrorMsg("List with same name exists");
          }
        }
      });
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
                  maxLength: 30,
                  isExisty: true
                }}
                validationErrors={{
                  maxLength: "You can not enter more than 30 characters"
                }}
                value={listName || ""}
                handleChange={onInputChange}
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
              Only upto 5 lists can be created to save products. You may delete
              an older list to make a new one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default createWishlist;
