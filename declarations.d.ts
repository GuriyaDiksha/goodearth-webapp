declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.svg";
declare module "*.png";
declare module "*.ico";
declare module "*.jpg";
declare module "*.ttf";
declare module "maker-enhance";
declare module "@loadable/component";
declare module "@loadable/server";
declare module "rc-slider";
declare module "react-google-recaptcha";
declare module "react-absolute-grid";
declare module "react-html-parser";
declare module "react-facebook-login/dist/facebook-login-render-props";

declare const __API_HOST__: string;
declare const __DOMAIN__: string;
declare const __OMNI_HOST__: string;
