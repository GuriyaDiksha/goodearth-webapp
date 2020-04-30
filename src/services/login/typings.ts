export type checkuserpasswordResponse = {
  resStatus: boolean;
  url: string;
  message: string;
  emailExist: boolean;
  passwordExist: boolean;
};

export type logoutResponse = {
  message?: string;
  detail?: string;
};
