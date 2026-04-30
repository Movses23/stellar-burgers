import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import type { TOrder } from '@utils-types';

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector((state) => state.feedWs.orders);
  const total = useSelector((state) => state.feedWs.total);
  const totalToday = useSelector((state) => state.feedWs.totalToday);

  const readyOrders = useMemo(
    () => orders.filter((o) => o.status === 'done').map((o) => o.number),
    [orders]
  );

  const pendingOrders = useMemo(
    () =>
      orders
        .filter((o) => o.status === 'pending' || o.status === 'created')
        .map((o) => o.number),
    [orders]
  );

  const feed = useMemo(
    () => ({
      total,
      totalToday
    }),
    [total, totalToday]
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
