// src/components/order-info/order-info.tsx
import { FC, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import type { TIngredient, TOrder } from '@utils-types';

import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { formatOrderDate } from '../../utils/date';

// тип ingredientsInfo, который ожидает UI
type TIngredientsInfo = Record<string, TIngredient & { count: number }>;

// то, что мы отдаём в UI как orderInfo
type TOrderInfo = TOrder & {
  ingredientsInfo: TIngredientsInfo;
  total: number;
  date: Date;
  dateText: string; // ✅ добавили
};

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();

  const orderNumber = Number(number);

  // ингредиенты из стора
  const ingredients = useSelector((state) => state.ingredients.items);

  // заказы из WS ленты
  const feedOrders = useSelector((state) => state.feedWs.orders);

  // заказы из WS профиля (если у тебя слайс/ключ иначе — переименуй)
  const profileOrders = useSelector((state) => state.profileWs?.orders ?? []);

  const isProfile = location.pathname.startsWith('/profile/orders');

  // пытаемся найти заказ в WS-списке
  const orderFromStore = useMemo(() => {
    const source = isProfile ? profileOrders : feedOrders;
    return source.find((o) => o.number === orderNumber) ?? null;
  }, [feedOrders, profileOrders, isProfile, orderNumber]);

  // если прямой заход по URL и в сторе нет — подгружаем по API
  const [apiOrder, setApiOrder] = useState<TOrder | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!orderNumber || Number.isNaN(orderNumber)) return;

      // если есть в сторе — не грузим
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

    // собираем словарь ингредиентов с count
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

    // total = сумма price * count
    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      total,
      date: new Date(order.createdAt),
      dateText: formatOrderDate(order.createdAt) // ✅ формат как в feed/profile
    };
  }, [order, ingredients]);

  if (apiLoading && !orderInfo) return <Preloader />;
  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
