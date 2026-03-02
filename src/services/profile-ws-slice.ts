import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';

type TWsStatus = 'OFFLINE' | 'CONNECTING' | 'ONLINE';

type TProfileWsState = {
  status: TWsStatus;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
};

const initialState: TProfileWsState = {
  status: 'OFFLINE',
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

type TProfileWsMessage = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const profileWsSlice = createSlice({
  name: 'profileWs',
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
    },
    wsMessage: (state, action: PayloadAction<TProfileWsMessage>) => {
      state.error = null;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  }
});

export const profileWsActions = profileWsSlice.actions;
export const profileWsReducer = profileWsSlice.reducer;
