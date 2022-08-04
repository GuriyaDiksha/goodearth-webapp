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
