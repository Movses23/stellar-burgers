import { FC, useEffect, useRef, useCallback } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { feedWsActions, fetchFeeds } from '../../services/feed-ws-slice';

const WS_URL = 'wss://norma.education-services.ru/orders/all';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feedWs.orders);
  const status = useSelector((state) => state.feedWs.status);

  const didConnectRef = useRef(false);

  useEffect(() => {
    if (didConnectRef.current) return;
    didConnectRef.current = true;

    dispatch(fetchFeeds());

    dispatch(feedWsActions.wsConnect(WS_URL));

    return () => {
      dispatch(feedWsActions.wsDisconnect());
      didConnectRef.current = false;
    };
  }, [dispatch]);

  const handleGetFeeds = useCallback(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (status === 'CONNECTING' && !orders.length) return <Preloader />;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
