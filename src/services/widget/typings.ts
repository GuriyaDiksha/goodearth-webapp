export type Consent = {
  id: string;
  name: string;
  description: string;
  value: boolean;
  is_editable: boolean;
  functionalities: string;
};

export type WidgetDetail = {
  id: string;
  name: string;
  region: string;
  consents: Consent[];
};

export type ConsentDetail = {
  ip: string;
  consents: string;
  country: string;
  widget_name: string;
  email: string;
};

export type RegionDetail = {
  region: string;
  ip: string;
  country: string;
};
