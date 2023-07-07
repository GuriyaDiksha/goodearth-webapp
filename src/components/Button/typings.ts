export type ButtonProps = {
  label: string;
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
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
