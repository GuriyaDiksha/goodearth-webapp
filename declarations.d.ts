declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare const __API_HOST__: string;
