export type Props = {
  gender: string;
  disable: boolean;
  msgGender: string;
  highlightGender: boolean;
  setGender: (gender: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};
