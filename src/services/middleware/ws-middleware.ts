import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import type {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload
} from '@reduxjs/toolkit';

export type TWsActions<TMessage = unknown> = {
  wsConnect: ActionCreatorWithPayload<string>;
  wsDisconnect: ActionCreatorWithoutPayload;

  wsConnecting: ActionCreatorWithoutPayload;
  wsOpen: ActionCreatorWithoutPayload;
  wsClose: ActionCreatorWithoutPayload;

  wsError: ActionCreatorWithPayload<string>;
  wsMessage: ActionCreatorWithPayload<TMessage>;
};

/**
 * Универсальный middleware для WebSocket.
 * ВАЖНО: никаких импортов из store.ts, чтобы не словить циклы типов.
 */
export const createWsMiddleware =
  <TMessage = unknown>(
    wsActions: TWsActions<TMessage>,
    withAuth = false
  ): Middleware =>
  (store: MiddlewareAPI) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;

      // CONNECT
      if (wsActions.wsConnect.match(action)) {
        const urlFromAction = action.payload;

        // ✅ ВАЖНО: если уже есть активный сокет — не трогаем
        if (socket && socket.readyState === WebSocket.OPEN) {
          return next(action);
        }

        dispatch(wsActions.wsConnecting());

        if (socket) {
          socket.close(1000, 'reconnect');
        }

        let url = urlFromAction;

        if (withAuth) {
          const raw = document.cookie
            .split('; ')
            .find((row) => row.startsWith('accessToken='))
            ?.split('=')[1];

          const accessToken = raw
            ? decodeURIComponent(raw).replace('Bearer ', '')
            : '';

          url = `${urlFromAction}?token=${accessToken}`;
        }

        socket = new WebSocket(url);

        socket.onopen = () => dispatch(wsActions.wsOpen());
        // Не бросаем исключения: ошибка сокета не должна «ронять» страницу.
        socket.onerror = () => dispatch(wsActions.wsError('WebSocket error'));

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as TMessage;
            dispatch(wsActions.wsMessage(data));
          } catch {
            dispatch(wsActions.wsError('Некорректные данные WebSocket'));
          }
        };

        socket.onclose = () => {
          dispatch(wsActions.wsClose());
          socket = null;
        };
      }

      // DISCONNECT
      if (wsActions.wsDisconnect.match(action)) {
        if (socket) {
          socket.close(1000, 'disconnect');
          socket = null;
        }
      }

      return next(action);
    };
  };
