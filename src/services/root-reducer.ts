import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './ingredients-slice';
import { constructorReducer } from './constructor-slice';
import { orderReducer } from './order-slice';
import { userReducer } from './user-slice';
import { profileOrdersReducer } from './profile-orders-slice';
import { feedWsReducer } from './feed-ws-slice';
import { profileWsReducer } from './profile-ws-slice';
import { orderInfoReducer } from './order-info-slice';
import { orderDetailsReducer } from './order-details-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  user: userReducer,
  profileOrders: profileOrdersReducer,
  feedWs: feedWsReducer,
  profileWs: profileWsReducer,
  orderInfo: orderInfoReducer,
  orderDetails: orderDetailsReducer
});
