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
  session: boolean;
};

export type PopupResponse = {
  data: PopupData[];
};
