import React, { useEffect } from "react";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { updateAddressList } from "actions/address";
import AddressService from "services/address";
import { useDispatch } from "react-redux";

const MyAddress = (props: {
  mode: string;
  children: React.ReactNode;
  setCurrentSection: () => void;
}) => {
  const { mode, children } = props;
  props.setCurrentSection();
  const dispatch = useDispatch();
  useEffect(() => {
    AddressService.fetchAddressList(dispatch).then(addressList => {
      dispatch(updateAddressList(addressList));
    });
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
