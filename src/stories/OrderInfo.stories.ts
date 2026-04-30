import { OrderInfoUI } from '@ui';
import { formatOrderDate } from '../utils/date';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Example/OrderInfo',
  component: OrderInfoUI,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof OrderInfoUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orderInfo: {
      ingredientsInfo: {
        bun: {
          _id: 'bun',
          name: 'Флюоресцентная булка',
          type: 'bun',
          proteins: 12,
          fat: 33,
          carbohydrates: 22,
          calories: 33,
          price: 150,
          image: '',
          image_large: '',
          image_mobile: '',
          count: 2
        },
        main: {
          _id: 'main',
          name: 'Космическая начинка',
          type: 'main',
          proteins: 10,
          fat: 20,
          carbohydrates: 5,
          calories: 40,
          price: 100,
          image: '',
          image_large: '',
          image_mobile: '',
          count: 1
        }
      },

      total: 400,

      date: new Date('2024-01-25T10:20:00.000Z'),
      dateText: formatOrderDate('2024-01-25T10:20:00.000Z'),

      _id: 'order-1',
      status: 'done',
      name: 'Заказ из модалки',
      createdAt: '2024-01-25T10:20:00.000Z',
      updatedAt: '2024-01-25T10:20:00.000Z',
      number: 777,
      ingredients: ['bun', 'main']
    }
  }
};
