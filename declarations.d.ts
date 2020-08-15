declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.svg";
declare module "*.png";
declare module "*.ico";
declare module "*.jpg";
declare module "*.ttf";
declare module "@loadable/component";
declare module "@loadable/server";
declare module "rc-slider";
declare module "react-google-recaptcha";
declare module "react-absolute-grid";
declare module "jquery";
declare module "turn.js";
declare module "react-html-parser";
declare module "react-facebook-login/dist/facebook-login-render-props";

declare const __API_HOST__: string;
declare const __DOMAIN__: string;
declare const __CDN_HOST__: string;
declare const __OMNI_HOST__: string;
declare const dataLayer: any[];
declare const __FB_APP_ID__: string;
declare const __GOOGLE_CLIENT_ID__: string;
