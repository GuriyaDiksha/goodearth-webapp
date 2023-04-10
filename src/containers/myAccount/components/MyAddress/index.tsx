import React, { useEffect } from "react";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { updateAddressList } from "actions/address";
import AddressService from "services/address";
import { useDispatch, useSelector } from "react-redux";
import { pageViewGTM } from "utils/validate";
import { AppState } from "reducers/typings";

const MyAddress = (props: {
  mode: string;
  children: React.ReactNode;
  setCurrentSection: () => void;
}) => {
  const { mode, children } = props;
  const {
    user: { isLoggedIn }
  } = useSelector((state: AppState) => state);
  props.setCurrentSection();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    AddressService.fetchAddressList(dispatch).then(addressList => {
      dispatch(updateAddressList(addressList));
    });
    pageViewGTM("MyAccount");
  }, []);

  return (
    <div className={bootstrapStyles.row}>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          { [bootstrapStyles.colMd8]: mode != "list" },
          { [bootstrapStyles.offsetMd2]: mode != "list" },
          { [bootstrapStyles.colMd10]: mode == "list" },
          { [bootstrapStyles.offsetMd1]: mode == "list" }
        )}
      >
        <div className={styles.formHeading}>Manage Your Addresses</div>
        <div className={styles.formSubheading}>
          Add multiple billing and shipping addresses.
        </div>
        {children}
      </div>
    </div>
  );
};

export default MyAddress;
