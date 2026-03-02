import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';
import { getOrderByNumberApi } from '../utils/burger-api';

type TOrderInfoState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  order: null,
  isLoading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orderInfo/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const res = await getOrderByNumberApi(number);

    // API возвращает { success, orders: TOrder[] }
    const order = res?.orders?.[0];
    if (!order) return rejectWithValue('Заказ не найден');

    return order;
  } catch (e) {
    return rejectWithValue('Не удалось загрузить заказ');
  }
});

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = null;
    },
    setOrderInfo: (state, action: PayloadAction<TOrder>) => {
      state.order = action.payload;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderInfo, setOrderInfo } = orderInfoSlice.actions;
export const orderInfoReducer = orderInfoSlice.reducer;
