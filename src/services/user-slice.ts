import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TUser } from '../utils/types';
import {
  getUserApi,
  updateUserApi,
  logoutApi,
  loginUserApi
} from '../utils/burger-api';
import { deleteCookie, setCookie } from '../utils/cookie';

type TPatchUserPayload = { name: string; email: string; password?: string };

type TUserState = {
  user: TUser | null;

  // важно для ProtectedRoute: "проверка авторизации завершена"
  isAuthChecked: boolean;

  isLoading: boolean;
  error: string | null;

  updateUserRequest: boolean;
  updateUserError: string | null;

  logoutRequest: boolean;
  logoutError: string | null;
};

const initialState: TUserState = {
  user: null,

  isAuthChecked: false,

  isLoading: false,
  error: null,

  updateUserRequest: false,
  updateUserError: null,

  logoutRequest: false,
  logoutError: null
};

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: string }).message)
          : 'Не удалось получить данные пользователя';
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string }
>('user/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await loginUserApi({ email, password });

    // refreshToken -> localStorage
    localStorage.setItem('refreshToken', data.refreshToken);

    // accessToken -> cookie
    setCookie('accessToken', data.accessToken);

    return data.user;
  } catch (err) {
    const message =
      typeof err === 'object' && err !== null && 'message' in err
        ? String((err as { message: string }).message)
        : 'Ошибка входа';
    return rejectWithValue(message);
  }
});

export const patchUser = createAsyncThunk<
  TUser,
  TPatchUserPayload,
  { rejectValue: string }
>('user/patchUser', async (data, { rejectWithValue }) => {
  try {
    const payload: TPatchUserPayload = {
      name: data.name,
      email: data.email
    };
    if (data.password) payload.password = data.password;

    const res = await updateUserApi(payload);
    return res.user;
  } catch (err) {
    const message =
      typeof err === 'object' && err !== null && 'message' in err
        ? String((err as { message: string }).message)
        : 'Не удалось обновить данные пользователя';
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();

      // чистим токены
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: string }).message)
          : 'Не удалось выйти из аккаунта';
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.error = null;
      state.updateUserError = null;
      state.logoutError = null;
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch user
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки пользователя';
        state.user = null;
        state.isAuthChecked = true;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка входа';
        state.user = null;
        state.isAuthChecked = true;
      })

      // update user
      .addCase(patchUser.pending, (state) => {
        state.updateUserRequest = true;
        state.updateUserError = null;
      })
      .addCase(patchUser.fulfilled, (state, action) => {
        state.updateUserRequest = false;
        state.user = action.payload;
      })
      .addCase(patchUser.rejected, (state, action) => {
        state.updateUserRequest = false;
        state.updateUserError = action.payload ?? 'Ошибка обновления профиля';
      })

      // logout
      .addCase(logoutUser.pending, (state) => {
        state.logoutRequest = true;
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutRequest = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutRequest = false;
        state.logoutError = action.payload ?? 'Ошибка выхода';
      });
  }
});

export const { resetUserState } = userSlice.actions;
export const userReducer = userSlice.reducer;
