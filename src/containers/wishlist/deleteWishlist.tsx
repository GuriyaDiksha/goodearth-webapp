import React, { useContext } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import CloseButton from "components/Modal/components/CloseButton";
import Button from "components/Button";
import { Context } from "components/Modal/context";

interface Props {
  name: string;
  deleteWishlistName: (listName: string) => void;
}

const deleteWishlist: React.FC<Props> = ({ name, deleteWishlistName }) => {
  const { closeModal } = useContext(Context);
  const deleteWishlistNameHandler = () => {
    deleteWishlistName(name);
    closeModal();
    dataLayer.push({
      event: "delete_list_successful",
      list_name: name
    });
  };

  const cancelDeleteHandler = () => {
    closeModal();
    dataLayer.push({
      event: "delete_list_initiate",
      list_name: name ? name : "NA"
    });
  };

  return (
    <div className={cs(styles.wishlistPopupContainer)}>
      <div className={styles.header}>
        <CloseButton className={styles.closeBtn} />
      </div>
      <div className={styles.contentContainer}>
        <h2>Delete List?</h2>
        <div className={styles.contentText}>
          This will permanently delete the list and all the products saved in
          it.
        </div>
        <Button
          variant={"smallMedCharcoalCta"}
          type="submit"
          label={"YES, DELETE LIST"}
          stopHover={true}
          className={cs(styles.createBtn)}
          onClick={deleteWishlistNameHandler}
        />
        <div className={styles.deleteLink} onClick={cancelDeleteHandler}>
          NO, CANCEL
        </div>
      </div>
    </div>
  );
};

export default deleteWishlist;
