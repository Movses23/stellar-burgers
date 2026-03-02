export const formatOrderDate = (iso: string) => {
  const date = new Date(iso);

  // время в Москве
  const time = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);

  // разница по дням тоже лучше считать в "локали" пользователя — но в учебном проекте
  // обычно достаточно локального сравнения:
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
