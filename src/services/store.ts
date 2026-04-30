import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { rootReducer } from './root-reducer';

import { createWsMiddleware } from './middleware/ws-middleware';
import { feedWsActions } from './feed-ws-slice';
import { profileWsActions } from './profile-ws-slice';

const feedWsMiddleware = createWsMiddleware(feedWsActions, false);

const profileWsMiddleware = createWsMiddleware(profileWsActions, true);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedWsMiddleware, profileWsMiddleware)
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
