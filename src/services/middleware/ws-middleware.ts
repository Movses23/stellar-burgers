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

export const createWsMiddleware =
  <TMessage = unknown>(
    wsActions: TWsActions<TMessage>,
    withAuth = false
  ): Middleware =>
  (store: MiddlewareAPI) => {
    let socket: WebSocket | null = null;

    const getAccessToken = (): string => {
      const raw = document.cookie
        .split('; ')
        .find((row) => row.startsWith('accessToken='))
        ?.split('=')[1];

      if (!raw) return '';

      const decoded = decodeURIComponent(raw);
      return decoded.replace('Bearer ', '').trim();
    };

    const buildUrl = (baseUrl: string): string => {
      if (!withAuth) return baseUrl;

      const token = getAccessToken();
      if (!token) return '';

      const sep = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${sep}token=${token}`;
    };

    return (next) => (action) => {
      const { dispatch } = store;

      const result = next(action);

      if (wsActions.wsConnect.match(action)) {
        const url = buildUrl(action.payload);

        if (!url) {
          dispatch(wsActions.wsError('Нет токена для WebSocket'));
          return result;
        }

        if (socket && socket.readyState === WebSocket.CONNECTING) {
          return result;
        }

        if (socket) {
          socket.close();
          socket = null;
        }

        dispatch(wsActions.wsConnecting());

        socket = new WebSocket(url);

        socket.onopen = () => {
          dispatch(wsActions.wsOpen());
        };

        socket.onerror = () => {
          dispatch(wsActions.wsError('WebSocket error'));
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as TMessage;
            dispatch(wsActions.wsMessage(data));
          } catch {
            dispatch(wsActions.wsError('Ошибка обработки WS сообщения'));
          }
        };

        socket.onclose = () => {
          dispatch(wsActions.wsClose());
          socket = null;
        };
      }

      if (wsActions.wsDisconnect.match(action)) {
        if (socket) {
          if (socket.readyState !== WebSocket.CONNECTING) {
            try {
              socket.close(1000, 'disconnect');
            } catch {}
          }

          socket = null;
        }
      }

      return result;
    };
  };
