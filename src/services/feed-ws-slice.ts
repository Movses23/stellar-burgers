import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';
import { getFeedsApi } from '../utils/burger-api';
import type { AppDispatch } from './store';

type TWsStatus = 'OFFLINE' | 'CONNECTING' | 'ONLINE';

type TFeedWsState = {
  status: TWsStatus;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
};

const initialState: TFeedWsState = {
  status: 'OFFLINE',
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

type TFeedWsMessage = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const feedWsSlice = createSlice({
  name: 'feedWs',
  initialState,
  reducers: {
    wsConnect: (_state, _action: PayloadAction<string>) => {},
    wsDisconnect: () => {},

    wsConnecting: (state) => {
      state.status = 'CONNECTING';
      state.error = null;
    },
    wsOpen: (state) => {
      state.status = 'ONLINE';
      state.error = null;
    },
    wsClose: (state) => {
      state.status = 'OFFLINE';
    },

    wsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;

      state.status = 'OFFLINE';
    },
    wsMessage: (state, action: PayloadAction<TFeedWsMessage>) => {
      state.error = null;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  }
});

export const feedWsActions = feedWsSlice.actions;
export const feedWsReducer = feedWsSlice.reducer;

export const fetchFeeds = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(feedWsActions.wsConnecting());
    const data = await getFeedsApi();
    dispatch(feedWsActions.wsMessage(data));
    dispatch(feedWsActions.wsOpen());
  } catch (e) {
    const message =
      typeof (e as { message?: unknown })?.message === 'string'
        ? (e as { message: string }).message
        : 'Не удалось обновить ленту заказов';
    dispatch(feedWsActions.wsError(message));
    dispatch(feedWsActions.wsClose());
  }
};
