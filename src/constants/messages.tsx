import React from "react";
import { Link } from "react-router-dom";

export const ADD_TO_BAG_SUCCESS = (
  <p>
    This product has been added to your bag
    <br />{" "}
    <Link
      to="/cart"
      style={{ textDecoration: "underline", pointerEvents: "all" }}
    >
      VIEW BAG
    </Link>
  </p>
);
export const ADD_TO_BAG_GIFTCARD_SUCCESS = "Gift Card added to your bag";
export const CURRENCY_CHANGED_SUCCESS =
  "Standard conversion rate is not followed in case of currency change. You will be charged as per the currency specific catalog. Please note that some items like gift cards may get affected by the change of currency.";
export const ALL_SESSION_LOGOUT = "You have been logged out of all sessions.";
export const INVALID_SESSION_LOGOUT =
  "You have been logged out of all sessions. Please login again";
export const LOGOUT_SUCCESS = "You have successfully been logged out!";
export const LOGIN_SUCCESS = "Welcome to Good Earth!";
export const PRODUCT_UNPUBLISHED =
  "Due to unavailability of some products your cart has been updated.";
export const ADD_TO_REGISTRY_SUCCESS = "Item has been added to your Registry";
export const ADD_TO_REGISTRY_FAIL = "Can't add to bag";
export const ADD_TO_REGISTRY_AGAIN = [
  "To modify or edit items in your registry please ",
  <Link to="/bridal" key="bridal">
    manage your registry
  </Link>
];
export const REGISTRY_OWNER_CHECKOUT =
  "Looks like you are the owner of this Bridal Registry! Your order will be placed against your registry";
export const REGISTRY_MIXED_SHIPPING =
  "Note that items not part of the registry will also be shipped to registrant address unless removed from bag";
