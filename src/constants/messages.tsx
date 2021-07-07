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
const growlItemsList = (items: string[]) => {
  const html: any = [];
  if (items) {
    items.map(item => {
      html.push(
        item.length > 35 ? (
          <li>
            {item.slice(0, 32) + "..."}
            <br />
          </li>
        ) : (
          <li>
            {item}
            <br />
          </li>
        )
      );
    });
  }
  return html;
};
export const PRODUCT_UNPUBLISHED = (items: string[]) => (
  <div style={{ textAlign: "left" }}>
    Unfortunately, the below products are unavailable - your cart has been
    updated.
    <br />
    <br />
    <ul>{growlItemsList(items)}</ul>
  </div>
);
export const PRODUCT_UNSHIPPABLE_REMOVED = (items: string[]) => (
  <div style={{ textAlign: "left" }}>
    Unfortunately, the below products are not shippable to the selected address
    - your bag has been updated.
    <br />
    <br />
    <ul>{growlItemsList(items)}</ul>
  </div>
);
export const ADD_TO_REGISTRY_SUCCESS = "Item has been added to your Registry";
export const ADD_TO_REGISTRY_FAIL = "Can't add to bag";
export const ADD_TO_REGISTRY_AGAIN = [
  "To modify or edit items in your registry please ",
  <Link
    to="/account/bridal"
    key="bridal"
    style={{ textDecoration: "underline", pointerEvents: "all" }}
  >
    manage your registry
  </Link>
];
export const REGISTRY_OWNER_CHECKOUT =
  "Looks like you are the owner of this Bridal Registry! Your order will be placed against your registry";
export const REGISTRY_MIXED_SHIPPING =
  "Note that items not part of the registry will also be shipped to registrant address unless removed from bag";
export const PREVIOUS_BASKET = (
  <>
    Some items already exist in your bag from your previously logged in session.
    <br />
    <br />
    Please review your bag before checking out.
  </>
);

export const Messages = {
  ADD_TO_BAG_SUCCESS: ADD_TO_BAG_SUCCESS,
  ADD_TO_BAG_GIFTCARD_SUCCESS: ADD_TO_BAG_GIFTCARD_SUCCESS,
  CURRENCY_CHANGED_SUCCESS: CURRENCY_CHANGED_SUCCESS,
  ALL_SESSION_LOGOUT: ALL_SESSION_LOGOUT,
  INVALID_SESSION_LOGOUT: INVALID_SESSION_LOGOUT,
  LOGOUT_SUCCESS: LOGOUT_SUCCESS,
  LOGIN_SUCCESS: LOGIN_SUCCESS,
  PRODUCT_UNPUBLISHED: PRODUCT_UNPUBLISHED,
  PRODUCT_UNSHIPPABLE_REMOVED: PRODUCT_UNSHIPPABLE_REMOVED,
  ADD_TO_REGISTRY_SUCCESS: ADD_TO_REGISTRY_SUCCESS,
  ADD_TO_REGISTRY_FAIL: ADD_TO_REGISTRY_FAIL,
  ADD_TO_REGISTRY_AGAIN: ADD_TO_REGISTRY_AGAIN,
  REGISTRY_OWNER_CHECKOUT: REGISTRY_OWNER_CHECKOUT,
  REGISTRY_MIXED_SHIPPING: REGISTRY_MIXED_SHIPPING,
  PREVIOUS_BASKET: PREVIOUS_BASKET
};
export enum MESSAGE {
  ADD_TO_BAG_SUCCESS = "ADD_TO_BAG_SUCCESS",
  ADD_TO_BAG_GIFTCARD_SUCCESS = "ADD_TO_BAG_GIFTCARD_SUCCESS",
  CURRENCY_CHANGED_SUCCESS = "CURRENCY_CHANGED_SUCCESS",
  ALL_SESSION_LOGOUT = "ALL_SESSION_LOGOUT",
  INVALID_SESSION_LOGOUT = "INVALID_SESSION_LOGOUT",
  LOGOUT_SUCCESS = "LOGOUT_SUCCESS",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  PRODUCT_UNPUBLISHED = "PRODUCT_UNPUBLISHED",
  PRODUCT_UNSHIPPABLE_REMOVED = "PRODUCT_UNSHIPPABLE_REMOVED",
  ADD_TO_REGISTRY_SUCCESS = "ADD_TO_REGISTRY_SUCCESS",
  ADD_TO_REGISTRY_FAIL = "ADD_TO_REGISTRY_FAIL",
  ADD_TO_REGISTRY_AGAIN = "ADD_TO_REGISTRY_AGAIN",
  REGISTRY_OWNER_CHECKOUT = "REGISTRY_OWNER_CHECKOUT",
  REGISTRY_MIXED_SHIPPING = "REGISTRY_MIXED_SHIPPING",
  PREVIOUS_BASKET = "PREVIOUS_BASKET"
}
