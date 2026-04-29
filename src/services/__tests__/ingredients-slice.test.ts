import { fetchIngredients, ingredientsReducer } from '../ingredients-slice';
import type { TIngredient } from '../../utils/types';

const ingredient: TIngredient = {
  _id: 'ingredient-id',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

describe('ingredients reducer', () => {
  it('обрабатывает начало запроса ингредиентов', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('', undefined)
    );

    expect(state).toEqual({
      items: [],
      isLoading: true,
      error: null
    });
  });

  it('обрабатывает успешное получение ингредиентов', () => {
    const state = ingredientsReducer(
      { items: [], isLoading: true, error: null },
      fetchIngredients.fulfilled([ingredient], '', undefined)
    );

    expect(state).toEqual({
      items: [ingredient],
      isLoading: false,
      error: null
    });
  });

  it('обрабатывает ошибку получения ингредиентов', () => {
    const state = ingredientsReducer(
      { items: [], isLoading: true, error: null },
      fetchIngredients.rejected(null, '', undefined, 'Ошибка загрузки')
    );

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: 'Ошибка загрузки'
    });
  });
});
