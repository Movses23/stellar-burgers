import { FC, useEffect, useRef, useCallback } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { feedWsActions, fetchFeeds } from '../../services/feed-ws-slice';

const WS_URL = 'wss://norma.nomoreparties.space/orders/all';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feedWs.orders);
  const status = useSelector((state) => state.feedWs.status);

  // защита от двойного подключения в dev (StrictMode)
  const didConnectRef = useRef(false);

  useEffect(() => {
    if (didConnectRef.current) return;
    didConnectRef.current = true;

    // ✅ Чтобы /feed открывался даже если WebSocket временно недоступен,
    // сначала получаем актуальные заказы по HTTP.
    dispatch(fetchFeeds());

    dispatch(feedWsActions.wsConnect(WS_URL));

    return () => {
      dispatch(feedWsActions.wsDisconnect());
      didConnectRef.current = false;
    };
  }, [dispatch]);

  const handleGetFeeds = useCallback(() => {
    // По ТЗ: повторно запрашиваем список заказов с сервера
    dispatch(fetchFeeds());
  }, [dispatch]);

  // Лоадер показываем только пока идёт первое подключение и данных ещё нет.
  if (status === 'CONNECTING' && !orders.length) return <Preloader />;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
