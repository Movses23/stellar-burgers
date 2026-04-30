import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import type { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { OrderCardProps } from './type';

const maxIngredients = 6;

const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;

const pad2 = (n: number) => String(n).padStart(2, '0');

const pluralDays = (n: number) => {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod100 >= 11 && mod100 <= 14) return 'дней';
  if (mod10 === 1) return 'день';
  if (mod10 >= 2 && mod10 <= 4) return 'дня';
  return 'дней';
};

const formatOrderDate = (isoDate: string) => {
  const orderMs = new Date(isoDate).getTime();
  const nowMs = Date.now();

  const orderShift = new Date(orderMs + MSK_OFFSET_MS);
  const nowShift = new Date(nowMs + MSK_OFFSET_MS);

  const startOfDayUTC = (d: Date) =>
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

  const diffDays = Math.floor(
    (startOfDayUTC(nowShift) - startOfDayUTC(orderShift)) /
      (24 * 60 * 60 * 1000)
  );

  let prefix = '';
  if (diffDays === 0) prefix = 'Сегодня';
  else if (diffDays === 1) prefix = 'Вчера';
  else prefix = `${diffDays} ${pluralDays(diffDays)} назад`;

  const hours = pad2(orderShift.getUTCHours());
  const minutes = pad2(orderShift.getUTCMinutes());

  return `${prefix}, ${hours}:${minutes} i-GMT+3`;
};

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.items
  );

  const orderInfo = useMemo(() => {
    const ingredientsInfo = order.ingredients.reduce<TIngredient[]>(
      (acc, id) => {
        const ingredient = ingredients.find((ing) => ing._id === id);
        if (ingredient) acc.push(ingredient);
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date: new Date(order.createdAt),
      dateText: formatOrderDate(order.createdAt)
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
