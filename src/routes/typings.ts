import { InitAction, MetaAction } from "typings/actions";

export const enum ROUTES {
  HOME = "/",
  CollectionLanding = "/allcollection/:level1/:id",
  CollectionSpecific = "/collection/:slug",
  PDP = "/catalogue/:slug",
  PLP = "/catalogue/category/",
  CATEGORY = "/category_landing/:slug",
  FB = "/account/facebook/login/?next=/",
  GOOGLE = "/account/google/login/?next=/",
  SEARCH = "/search",
  ACCOUNT = "/account",
  CAREERDETAIL = "/careers-detail/:jobId",
  CAREER = "/careers",
  WISHLIST = "/wishlist",
  SHAREDWISHLIST = "/shared-wishlist",
  GIFTCARD = "/giftcard",
  ResetPassword = "/password-reset/confirm/:uid/:token",
  STATIC = "/customer-assistance/",
  CHECKOUT = "/order/checkout",
  GCCHECKOUT = "/order/gc_checkout",
  SHOP = "/Cafe-Shop/:city?",
  ORDERCONFIRMATION = "/order/orderconfirmation/:oid",
  DESIGNJOURNAL = "/designjournal",
  DESIGNJOURNALBOOK = "/designjournalbook/",
  CARTPAGE = "/cart/",
  PressStories = "/press-stories",
  ABOUTUS = "/about-us",
  APPOINTMENTS = "/brand",
  SAFETYMEASURES = "/safety-measures",
  CORPORATEGIFTING = "/corporate-gifts-catalogue",
  GIFTINGLANDING = "/gifting",
  // BRIDAL = "/the-good-earth-registry",
  REGISTERY = "/the-good-earth-registry",
  LOYALTYLANDING = "/cerise",
  ERROR = "/error-page",
  ERR404 = "/404",
  BACKENDERROR = "/backend-order-error",
  PUSHPANJALI = "/puspanjali-festive-2020",
  MAINTENANCE = "/maintenance",
  BRIDALPUBLIC = "/registry/:id",
  MUBARAK = "/mubaarak-hour-notification",
  // WITHMAKER = "/withmaker",
  WITHOUTMAKER = "/withoutmaker",
  MICROSITE = "/microsite/:id?",
  VIRTUAL = "/flowers-fragrance-anita-lal",
  SHOPPER = "/personal-shopper-form",
  INSTORE = "/instoreservices",
  THANKYOU = "/homepage",
  MUMTAZ = "/mumtaz-virtual-appointment",
  // GCEMAIL = "/send-giftcard",
  AUTH = "/auth",
  SITEMAP = "/sitemap",
  WORKSHOPS = "/workshops",
  ERROR404 = "/404",
  DEVIKANARAIN = "/art-of-decorating-devika-narain",
  MARUTSIKHA = "/perfect-menu-marut-sikka",
  NEHAKAPUR = "/festive-style-neha-kapur-kunal-nayyar",
  SABINASINGH = "/setting-the-vibe-ad-sabina-singh",
  DEEPSHIKHA = "/thoughtful-gifts-deepshika-khanna",
  EESHAAN = "/toast-eeshaan-kashyap",
  GUEST = "/be-my-guest-entertaining-guide",
  IFRAME = "/iframe-testing",
  TASTINGROOM = "/high-tea-at-the-tasting-room",
  MIRAGESHOP = "/mirageshop",
  MIRAGE = "/mirage",
  MAGHREB = "/tangier",
  TANGIER = "/tangier/shop",
  MAKERTEST = "/makertest",
  ANINDIANSUMMER = "/anindiansummer",
  TANGIERBYRICHARDHAMILTON = "/TangierbyRichardHamilton",
  NEWSLETTERS = "/newsletters",
  ARTOFENTERTAINING = "/artofentertaining",
  MATERIALCULTURE = "/materialculture",
  VINITACHAITANYA = "/artofgifting-VinitaChaitanya",
  VASUDHARAI = "/artofgifting-VasudhaRai",
  BOSPORUSMETALDECOR = "/Bosporus_Metal_Decor",
  TELLINGSTORIES = "/telling-stories-through-textiles",
  VIRTUALSHOPPINGSALON = "/virtual-shopping-salon",
  GUIDETOLIGHTING = "/guide-to-lighting-your-home",
  INNERSPACE = "/inner-spaces",
  LILANURPARFUMS = "/lilanur-parfums",
  PEHCHAANNAQASHI = "/pehchaan-naqashi-of-kashmir",
  INTERNATIONALSALE = "/internationalsale",
  ANNUALSALE = "/annualsale",
  SIGNUPS25 = "/signups25",
  MEMORYKEEPERS = "/memory-keepers",
  MEMORYKEEPERSTWO = "/memory-keepers-2",
  HARVESTATTHETABLE = "/harvest-at-the-table",
  INNERSPACEKONKONASENSHARMA = "/inner-spaces-KonkonaSenSharma",
  INNERSPACEKONABHANARAINLAMBAH = "/inner-spaces-AbhaNarainLambah",
  INNERSPACESUNHILSIPPY = "/inner-spaces-SunhilSippy",
  CORPORATECATALOGUE = "/goodearth-corporate-catalogue",
  UAESHOP = "/uaeshop"
}

export type RouteConfig = RouteObject[];

export type RouteMap = {
  [x in ROUTES]?: RouteObject;
};

export type RouteParams = {
  [x: string]: string;
  location?: any;
};

export type RouteObject = {
  path: ROUTES;
  component: React.ComponentType<any>;
  action: InitAction;
  meta?: MetaAction;
  exact?: boolean;
};
