export type ButtonProps = {
  id?: string;
  tabIndex?: number;
  label: string | JSX.Element;
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  ref?: any;
  stopHover?: boolean;
  type?: "button" | "submit" | "reset";
  variant:
    | "largeAquaCta"
    | "largeLightGreyCta"
    | "largeMedCharcoalCta"
    | "largeGoldCta"
    | "mediumAquaCta300"
    | "mediumAquaCta366"
    | "mediumLightGreyCta"
    | "mediumMedCharcoalCta366"
    | "outlineMediumMedCharcoalCta366"
    | "smallAquaCta"
    | "smallWhiteCta"
    | "smallMedCharcoalCta"
    | "smallGoldCta"
    | "smallLightGreyCta"
    | "outlineSmallMedCharcoalCta"
    | "outlineExtraSmallAquaCta";
};
