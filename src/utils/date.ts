export const formatOrderDate = (iso: string) => {
  const date = new Date(iso);

  const time = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfThatDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfThatDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  const dayText =
    diffDays === 0
      ? 'Сегодня'
      : diffDays === 1
        ? 'Вчера'
        : `${diffDays} дней назад`;

  return `${dayText}, ${time} i-GMT+3`;
};
