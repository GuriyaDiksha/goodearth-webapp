import React, { useState, useContext } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import CloseButton from "components/Modal/components/CloseButton";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import Button from "components/Button";
import WishlistService from "services/wishlist";
import { useDispatch } from "react-redux";
import { updateComponent, updateModal } from "../../actions/modal";
import { POPUP } from "constants/components";
import { Context } from "components/Modal/context";
import { decriptdata } from "utils/validate";

interface Props {
  id: number;
  name: string;
  updateWishlistData: any;
  deleteWishlistName: (listName: string) => void;
}

const editName: React.FC<Props> = ({
  id,
  name,
  updateWishlistData,
  deleteWishlistName
}) => {
  const [listName, setListName] = useState(name);
  const [errorMsg, setErrorMsg] = useState("");
  const [isenable, setIsenable] = useState(false);
  const { closeModal } = useContext(Context);
  const dispatch = useDispatch();

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
    const data = { id, listName };
    WishlistService.updateWishlistName(dispatch, data)
      .then(res => {
        updateWishlistData();
        setErrorMsg("");
        closeModal();
      })
      .catch((error: any) => {
        const data = decriptdata(error.response?.data);
        console.log(error);
        if (data.success == false) {
          if (data.message == "Wishlist name already taken!") {
            setErrorMsg("List with same name exists");
          }
        }
      });
  };

  const deleteConfirmPopup = async () => {
    dispatch(
      updateComponent(POPUP.DELETEWISHLIST, { name, deleteWishlistName }, false)
    );
    dispatch(updateModal(true));
  };

  return (
    <div className={cs(styles.wishlistPopupContainer)}>
      <div className={styles.header}>
        <CloseButton className={styles.closeBtn} />
      </div>
      <div className={styles.contentContainer}>
        <h2>Edit List</h2>
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
            variant={!isenable ? "smallLightGreyCta" : "smallMedCharcoalCta"}
            type="submit"
            label={"SAVE CHANGES"}
            disabled={!isenable}
            stopHover={true}
            className={cs(styles.createBtn)}
          />
        </Formsy>
        <div className={styles.deleteLink} onClick={deleteConfirmPopup}>
          DELETE THE LIST
        </div>
      </div>
    </div>
  );
};

export default editName;
