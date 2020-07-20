export type ConfirmResetPasswordResponse = {
  status: boolean;
  errorMessage: {
    [x: string]: string[];
  };
  bridalCurrency?: string;
  bridalId?: string;
  redirect: string;
};
