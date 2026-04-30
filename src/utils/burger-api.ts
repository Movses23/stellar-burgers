import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TOrdersResponse = TServerResponse<TOrdersData>;

export type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

type TUserResponse = TServerResponse<{
  user: TUser;
}>;

type TLogoutResponse = TServerResponse<{
  message: string;
}>;

const getAuthHeader = () => {
  const token = getCookie('accessToken');
  if (!token) return '';

  const decoded = decodeURIComponent(token);
  const clean = decoded.replace(/^Bearer\s+/, '').trim();

  return clean ? `Bearer ${clean}` : '';
};

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }

      localStorage.setItem('refreshToken', refreshData.refreshToken);

      const cleanAccessToken = refreshData.accessToken
        .replace(/^Bearer\s+/, '')
        .trim();

      setCookie('accessToken', cleanAccessToken);

      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    const msg = (err as { message?: unknown })?.message;

    const shouldRefresh =
      msg === 'jwt expired' ||
      msg === 'jwt malformed' ||
      msg === 'invalid token' ||
      msg === 'You should be authorised';

    if (shouldRefresh) {
      const refreshData = await refreshToken();

      if (options.headers) {
        const newAccessToken = refreshData.accessToken.startsWith('Bearer ')
          ? refreshData.accessToken
          : `Bearer ${refreshData.accessToken}`;

        (options.headers as Record<string, string>).authorization =
          newAccessToken;
      }

      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    }

    return Promise.reject(err);
  }
};

export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TOrdersResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const getOrdersApi = () =>
  fetchWithRefresh<TOrdersResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getAuthHeader()
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getAuthHeader()
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((resData) => {
      if (resData?.success) return resData;
      return Promise.reject(resData);
    });

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getAuthHeader()
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

export const updateUserApi = (data: {
  name: string;
  email: string;
  password?: string;
}) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getAuthHeader()
    } as HeadersInit,
    body: JSON.stringify(data)
  }).then((res) => {
    if (res?.success) return res;
    return Promise.reject(res);
  });

export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TLogoutResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
