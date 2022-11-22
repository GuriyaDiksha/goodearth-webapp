import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./../styles.scss";
import AddressService from "services/address";
import { useDispatch } from "react-redux";
import { updateAddressList } from "actions/address";
import { AddressData } from "components/Address/typings";

const Address = () => {
  const [address, setAddress] = useState<AddressData[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    AddressService.fetchAddressList(dispatch).then(addressList => {
      setAddress(addressList.filter(address => address.isDefaultForShipping));
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
      {address?.length ? (
        <div className={styles.addressContainer}>
          <div className={styles.firstSection}>
            <div className={styles.leftSection}>
              <div className={styles.radioButtonWrp}>
                <input type="radio" className={styles.radioButton} />
                <span></span>
              </div>
              <p className={styles.name}>
                {address?.[0]?.firstName} {address?.[0]?.lastName}
              </p>
            </div>
            <p className={styles.defaultAddress}>Default Address</p>
          </div>
          <div className={styles.secondSection}>
            <div className={styles.address}>
              <p>{address?.[0]?.line1} </p>
              <p>
                {" "}
                {address?.[0]?.line2}, {address?.[0]?.city}
              </p>
              <p>
                {" "}
                {address?.[0]?.state}, {address?.[0]?.countryName} -{" "}
                {address?.[0]?.postCode}
              </p>
              <p>
                {" "}
                M:{address?.[0]?.phoneCountryCode} {address?.[0]?.phoneNumber}
              </p>
            </div>
            <NavLink to="/account/address" className={styles.editAddress}>
              EDIT
            </NavLink>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Address;
