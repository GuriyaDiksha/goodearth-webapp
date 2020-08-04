export type ConfirmResetPasswordResponse = {
  message: string;
  errorMessage: {
    [x: string]: string[];
  };
  bridalCurrency?: string;
  bridalId?: string;
  redirect?: string;
};
