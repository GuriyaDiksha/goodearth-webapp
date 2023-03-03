import loadable from "@loadable/component";
import CerisePopup from "components/Popups/CerisePopup";

const CurrencyPopup = loadable(() =>
  import("../components/Popups/CurrencyPopup")
);
const BackendOrderPopup = loadable(() =>
  import("components/BackendOrderPopup/confirm")
);
const PincodePopup = loadable(() => import("components/Popups/pincodePopup"));
const FreeShipping = loadable(() => import("components/Popups/freeShipping"));
const LoginForm = loadable(() => import("components/signin/Login"));
const RegisterForm = loadable(() => import("components/signin/register"));
const ForgotPasswordForm = loadable(() =>
  import("components/signin/forgotPassword")
);
const Quickview = loadable(() => import("components/Quickview"));
const ProfileUpdater = loadable(() =>
  import("components/signin/profileUpdater")
);
const NotifyMePopup = loadable(() => import("components/NotifyMePopup"));
const InfoPopup = loadable(() => import("components/Popups/InfoPopup"));
const ShippingPopup = loadable(() =>
  import("../containers/checkout/component/shippingPopup")
);
const Zoom = loadable(() => import("components/Zoom"));
const SizeChartPopup = loadable(() =>
  import("containers/pdp/components/sizeChartPopup")
);
const WallpaperPopup = loadable(() =>
  import("containers/pdp/components/wallpaperPopup")
);
const ThirdPartyEnquiryPopup = loadable(() =>
  import("components/ThirdPartyEnquiryPopup")
);
const BridalMobile = loadable(() =>
  import("containers/bridal/bridalItemMobile")
);
const EditRegistry = loadable(() =>
  import("containers/myAccount/components/Bridal/EditRegistry")
);
const BridalMobileProductUpdate = loadable(() =>
  import("containers/myAccount/components/Bridal/BridalMobileProductUpdate")
);
const BridalPop = loadable(() =>
  import("containers/myAccount/components/Bridal/BridalPop")
);
const ShareLink = loadable(() =>
  import("containers/myAccount/components/Bridal/ShareLink")
);
const Delivery = loadable(() => import("components/Popups/DeliveryPopup"));

const CMSPopup = loadable(() => import("components/Popups/CMSPopup"));

const MakerPopup = loadable(() => import("components/Popups/MakerPopup"));

const ResendGcPopup = loadable(() => import("components/Popups/ResendGcPopup"));

const VideoPopup = loadable(() => import("components/Popups/VideoPopup"));

const HelloarPopup = loadable(() => import("components/Popups/HelloarPopup"));
const OrientationPopup = loadable(() =>
  import("components/Popups/OrientationPopup")
);

const BillingGST = loadable(() => import("components/Popups/BillingGST"));
const ShippingTerms = loadable(() => import("components/Popups/ShippingTerms"));

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
  thirdPartyEnquiryPopup: ThirdPartyEnquiryPopup,
  bridalMobile: BridalMobile,
  editRegistry: EditRegistry,
  bridalMobileProductUpdate: BridalMobileProductUpdate,
  bridalPop: BridalPop,
  shareLink: ShareLink,
  delivery: Delivery,
  cmsPopup: CMSPopup,
  cerise: CerisePopup,
  maker: MakerPopup,
  resendGc: ResendGcPopup,
  videoPopup: VideoPopup,
  helloarPopup: HelloarPopup,
  orientationPopup: OrientationPopup,
  billingGST: BillingGST,
  shippingTerms: ShippingTerms
};

export const enum POPUP {
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
  THIRDPARTYENQUIRYPOPUP = "thirdPartyEnquiryPopup",
  BRIDALMOBILE = "bridalMobile",
  EDITREGISTRY = "editRegistry",
  BRIDALMOBILEPRODUCTUPDATE = "bridalMobileProductUpdate",
  BRIDALPOP = "bridalPop",
  SHARELINK = "shareLink",
  DELIVERY = "delivery",
  CMSPOPUP = "cmsPopup",
  CERISE = "cerise",
  MAKER = "maker",
  RESENDGC = "resendGc",
  VIDEOPOPUP = "videoPopup",
  HELLOARPOPUP = "helloarPopup",
  ORIENTATIONPOPUP = "orientationPopup",
  BILLINGGST = "billingGST",
  SHIPPINGTERMS = "shippingTerms"
}
