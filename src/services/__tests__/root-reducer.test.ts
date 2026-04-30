import { rootReducer } from '../root-reducer';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null,
        updateUserRequest: false,
        updateUserError: null,
        logoutRequest: false,
        logoutError: null
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null
      },
      feedWs: {
        status: 'OFFLINE',
        orders: [],
        total: 0,
        totalToday: 0,
        error: null
      },
      profileWs: {
        status: 'OFFLINE',
        orders: [],
        total: 0,
        totalToday: 0,
        error: null
      },
      orderInfo: {
        order: null,
        isLoading: false,
        error: null
      },
      orderDetails: {
        data: null,
        isLoading: false,
        error: null
      }
    });
  });
});
