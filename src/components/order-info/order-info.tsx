import { FC, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import type { TIngredient, TOrder } from '@utils-types';

import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { formatOrderDate } from '../../utils/date';

type TIngredientsInfo = Record<string, TIngredient & { count: number }>;

type TOrderInfo = TOrder & {
  ingredientsInfo: TIngredientsInfo;
  total: number;
  date: Date;
  dateText: string;
};

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();

  const orderNumber = Number(number);

  const ingredients = useSelector((state) => state.ingredients.items);

  const feedOrders = useSelector((state) => state.feedWs.orders);

  const profileOrders = useSelector((state) => state.profileWs?.orders ?? []);

  const isProfile = location.pathname.startsWith('/profile/orders');

  const orderFromStore = useMemo(() => {
    const source = isProfile ? profileOrders : feedOrders;
    return source.find((o) => o.number === orderNumber) ?? null;
  }, [feedOrders, profileOrders, isProfile, orderNumber]);

  const [apiOrder, setApiOrder] = useState<TOrder | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!orderNumber || Number.isNaN(orderNumber)) return;

      if (orderFromStore) {
        setApiOrder(null);
        return;
      }

      setApiLoading(true);
      try {
        const res = await getOrderByNumberApi(orderNumber);
        const found = res?.orders?.[0] ?? null;
        if (!cancelled) setApiOrder(found);
      } catch {
        if (!cancelled) setApiOrder(null);
      } finally {
        if (!cancelled) setApiLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [orderNumber, orderFromStore]);

  const order = orderFromStore ?? apiOrder;

  const orderInfo: TOrderInfo | null = useMemo(() => {
    if (!order) return null;
    if (!ingredients.length) return null;

    const ingredientsInfo: TIngredientsInfo = {};
    for (const id of order.ingredients) {
      const ing = ingredients.find((i) => i._id === id);
      if (!ing) continue;

      if (!ingredientsInfo[id]) {
        ingredientsInfo[id] = { ...ing, count: 1 };
      } else {
        ingredientsInfo[id].count += 1;
      }
    }

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      total,
      date: new Date(order.createdAt),
      dateText: formatOrderDate(order.createdAt)
    };
  }, [order, ingredients]);

  if (apiLoading && !orderInfo) return <Preloader />;
  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
