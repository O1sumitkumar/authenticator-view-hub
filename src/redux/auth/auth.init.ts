export type UserData = {
  aud?: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  iss: string;
  locale: string;
  name: string;
  preferred_username: string;
  sub?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  groups?: string[];
  avatar?: string;
  lastLogin?: string;
};

export type AuthProp = {
  isLoader?: boolean;
  token?: string;
  role?: string;
  roles?: string[];
  userData: UserData;
  isAuthenticated?: boolean;
};

export const initialState: AuthProp = {
  isLoader: false,
  token: '',
  role: '',
  roles: [],
  isAuthenticated: false,
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
    sub: '',
    realm_access: { roles: [] },
    resource_access: {},
    groups: [],
  } as UserData,
};
