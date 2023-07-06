export type ButtonProps = {
  label: string;
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
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
