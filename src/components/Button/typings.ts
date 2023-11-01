export type ButtonProps = {
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
    | "mediumAquaCta"
    | "mediumLightGreyCta"
    | "mediumMedCharcoalCta"
    | "smallAquaCta"
    | "smallMedCharcoalCta"
    | "smallGoldCta"
    | "outlineSmallMedCharcoalCta"
    | "outlineExtraSmallAquaCta";
};
