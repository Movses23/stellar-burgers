import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';
import { getCookie } from '../utils/cookie';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export type TOrdersResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  message?: string;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('profileOrders/fetchProfileOrders', async (_, { rejectWithValue }) => {
  try {
    console.log('THUNK START');

    const token = getCookie('accessToken');
    console.log('TOKEN:', token);

    const res = await fetch('https://norma.education-services.ru/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: token ? decodeURIComponent(token) : ''
      }
    });

    console.log('FETCH STATUS:', res.status);
    console.log('FETCH URL:', res.url);

    const raw = await res.text();
    console.log('RAW RESPONSE:', raw.slice(0, 300));

    const data: TOrdersResponse = JSON.parse(raw);

    if (!res.ok || !data.success) {
      console.log('API ERROR:', data);
      return rejectWithValue(data.message ?? 'Не удалось загрузить заказы');
    }

    console.log('ORDERS RECEIVED:', data.orders);

    return data.orders;
  } catch (e) {
    console.log('THUNK ERROR:', e);
    return rejectWithValue('Ошибка загрузки заказов');
  }
});

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        console.log('REDUX: pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        console.log('REDUX: fulfilled', action.payload);
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        console.log('REDUX: rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки заказов';
      });
  }
});

export const profileOrdersReducer = profileOrdersSlice.reducer;
