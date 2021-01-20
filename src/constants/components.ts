import loadable from "@loadable/component";
import CurrencyPopup from "../components/Popups/CurrencyPopup";
import BackendOrderPopup from "components/BackendOrderPopup/confirm";
import PincodePopup from "components/Popups/pincodePopup";
const FreeShipping = loadable(() => import("components/Popups/freeShipping"));
const LoginForm = loadable(() => import("components/signin/Login"));
const RegisterForm = loadable(() => import("components/signin/register"));
const ForgotPasswordForm = loadable(() =>
  import("components/signin/forgotPassword")
);
const Quickview = loadable(() => import("components/Quickview"));
import ProfileUpdater from "components/signin/profileUpdater";
import NotifyMePopup from "components/NotifyMePopup";
import InfoPopup from "components/Popups/InfoPopup";
import ShippingPopup from "../containers/checkout/component/shippingPopup";
import Zoom from "components/Zoom";
import SizeChartPopup from "containers/pdp/components/sizeChartPopup";
import WallpaperPopup from "containers/pdp/components/wallpaperPopup";
import ThirdPartyEnquiryPopup from "components/ThirdPartyEnquiryPopup";

export const popupComponents: { [x: string]: React.ComponentType<any> } = {
  currency: CurrencyPopup,
  backendOrder: BackendOrderPopup,
  freeShipping: FreeShipping,
  pincodePopup: PincodePopup,
  loginForm: LoginForm,
  registerForm: RegisterForm,
  forgotPasswordForm: ForgotPasswordForm,
  profileUpdater: ProfileUpdater,
  notifyMePopup: NotifyMePopup,
  infoPopup: InfoPopup,
  shippingPopup: ShippingPopup,
  quickview: Quickview,
  zoom: Zoom,
  sizeChartPopup: SizeChartPopup,
  wallpaperPopup: WallpaperPopup,
  thirdPartyEnquiryPopup: ThirdPartyEnquiryPopup
};

export enum POPUP {
  CURRENCY = "currency",
  BACKENDORDER = "backendOrder",
  FREESHIPPING = "freeShipping",
  PINCODEPOPUP = "pincodePopup",
  LOGINFORM = "loginForm",
  REGISTERFORM = "registerForm",
  FORGOTPASSWORDFORM = "forgotPasswordForm",
  PROFILEUPDATER = "profileUpdater",
  NOTIFYMEPOPUP = "notifyMePopup",
  INFOPOPUP = "infoPopup",
  SHIPPINGPOPUP = "shippingPopup",
  QUICKVIEW = "quickview",
  ZOOM = "zoom",
  SIZECHARTPOPUP = "sizeChartPopup",
  WALLPAPERPOPUP = "wallpaperPopup",
  THIRDPARTYENQUIRYPOPUP = "thirdPartyEnquiryPopup"
}
