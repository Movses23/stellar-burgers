import { OrderCardUI } from '@ui';
import { formatOrderDate } from '../utils/date';
import type { Meta, StoryObj } from '@storybook/react';

const ingredientMock = {
  _id: '111',
  name: 'Булка',
  type: 'bun',
  proteins: 12,
  fat: 33,
  carbohydrates: 22,
  calories: 33,
  price: 123,
  image: 'https://via.placeholder.com/100',
  image_large: 'https://via.placeholder.com/400',
  image_mobile: 'https://via.placeholder.com/200'
};

const meta = {
  title: 'Example/OrderCard',
  component: OrderCardUI,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof OrderCardUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    orderInfo: {
      ingredientsInfo: [ingredientMock],
      ingredientsToShow: [ingredientMock],

      remains: 2,
      total: 246,

      date: new Date('2024-01-25T10:20:00.000Z'),
      dateText: formatOrderDate('2024-01-25T10:20:00.000Z'),

      _id: '32',
      status: 'done',
      name: 'Начинка',
      createdAt: '2024-01-25T10:20:00.000Z',
      updatedAt: '2024-01-25T10:20:00.000Z',
      number: 3,
      ingredients: ['111']
    },
    maxIngredients: 5,
    locationState: {
      background: {
        hash: '',
        key: 'eitkep27',
        pathname: '/',
        search: '',
        state: null
      }
    }
  }
};
