import React, { useEffect, useState } from "react";
import styles from "./../styles.scss";
import AddressService from "services/address";
import { useDispatch, useSelector } from "react-redux";
import { updateAddressList } from "actions/address";
import { AddressData } from "components/Address/typings";
import AddressList from "components/Address/AddressList";
import { AppState } from "reducers/typings";

const Address = () => {
  const [address, setAddress] = useState<AddressData[]>([]);
  const { currency } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    AddressService.fetchAddressList(dispatch).then(addressList => {
      setAddress(
        addressList.filter(
          address =>
            address.isDefaultForShipping && currency === address?.currency
        )
      );
      dispatch(updateAddressList(addressList));
    });
  }, []);

  return (
    <div className={styles.ceriseAddressWrp}>
      <p className={styles.heading}>My Address</p>
      <p className={styles.description}>
        Your selected default address will be used for reward related purposes &
        communication.
      </p>

      {address?.length && (
        <AddressList
          addressDataList={address}
          isBridal={false}
          currentCallBackComponent={"cerise"}
          showAddressInBridalUse={false}
          isGcCheckout={false}
        />
      )}
    </div>
  );
};

export default Address;
