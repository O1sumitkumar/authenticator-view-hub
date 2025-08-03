export type UserData = {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  iss: string;
  locale: string;
  name: string;
  preferred_username: string;
};

export type AuthProp = {
  isLoader?: boolean;
  token?: string;
  role?: string;
  userData: UserData;
};

export const initialState: AuthProp = {
  isLoader: false,
  token: '',
  role: '',
  userData: {
    aud: '',
    email: '',
    email_verified: false,
    family_name: '',
    given_name: '',
    iss: '',
    locale: '',
    name: '',
    preferred_username: '',
  } as UserData,
};
