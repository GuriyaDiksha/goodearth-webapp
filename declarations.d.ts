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

declare const __API_HOST__: string;
