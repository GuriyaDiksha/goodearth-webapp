export type ApiResponse = {
  success: boolean;
  message: string;
};

export type PopupData = {
  heading: string;
  icon: string;
  content: string;
  pageUrl: string;
  ctaLabel: string;
  ctaColor: string;
  ctaLink: string;
  session: boolean;
  template: string;
  image: string;
  bgImage: string;
  ctaLink2: string;
  ctaLabel2: string;
  ctaColor2: string;
  disclaimer: string;
};

export type PopupResponse = {
  data: PopupData[];
};
