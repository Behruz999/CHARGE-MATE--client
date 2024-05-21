// reports
export type reportProps = {
  total: number;
  title: string;
  currency: string;
  quantity: number;
  price: number;
  family: {
    _id: string;
    name: string;
  };
  user: {
    _id: string;
    nickname: string;
    individual: boolean;
  };
  time: string;
  date: string;
};

export type totalProps = {
  currency: string;
  totalAmount: number;
};

export type fetchedReportsProps = {
  expensive: reportProps[];
  largeQty: reportProps[];
  reports: reportProps[];
  total: totalProps[];
};

// register
export interface userDataProps {
  nickname: string;
  password: string;
}

// profile
export interface decodedUserProps {
  exp: number;
  iat: number;
  nickname: string;
  password: string;
  role: string;
  _id: string;
}

export interface fetchedUserProps {
  _id: string;
  nickname: string;
  password: string;
  role: string;
  individual: boolean;
  family: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

// family
export interface fetchedFamilyProps {
  _id: string;
  name: string;
  password: string;
  users: [
    {
      _id: string;
      nickname: string;
    }
  ];
  members: number;
  createdAt: string;
  updatedAt: string;
}

export interface familyChargesProps {
  _id: string;
  title: string;
  category: string;
  currency: string;
  quantity: number | string;
  price: number | string;
  individual: false;
  family: {
    _id: string;
    name: string;
  };
  user: {
    _id: string;
    nickname: string;
    individual: false;
  };
  createdAt: string;
  updatedAt: string;
}

export interface fetchedUserProps {
  _id: string;
  nickname: string;
  individual: boolean;
  password: string;
  role: string;
  family: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// errHandler
export interface ErrorResponse {
  msg: string;
}

export interface familyDataProps {
  name: string;
  password: string;
  users: string[];
}

// themeProvider
export interface ThemeContextProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}
