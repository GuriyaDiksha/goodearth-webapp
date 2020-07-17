declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "maker-enhance";
declare module "@loadable/component";
declare module "@loadable/server";
declare module "rc-slider";
declare module "react-google-recaptcha";
declare module "react-absolute-grid";

declare const __API_HOST__: string;
declare const __DOMAIN__: string;
