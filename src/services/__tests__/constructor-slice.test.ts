import { describe, expect, it } from '@jest/globals';

import {
  addIngredient,
  constructorReducer,
  moveIngredient,
  removeIngredient
} from '../constructor-slice';
import type { TIngredient } from '../../utils/types';

const bun: TIngredient = {
  _id: 'bun-id',
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

const main: TIngredient = {
  _id: 'main-id',
  name: 'Биокотлета',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const sauce: TIngredient = {
  _id: 'sauce-id',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

describe('burgerConstructor reducer', () => {
  it('добавляет булку в поле bun', () => {
    const state = constructorReducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual(expect.objectContaining(bun));
    expect(state.bun?._id).toEqual(expect.any(String));
    expect(state.ingredients).toEqual([]);
  });

  it('добавляет начинку в список ingredients', () => {
  const state = constructorReducer(undefined, addIngredient(main));

  expect(state.bun).toBeNull();
  expect(state.ingredients).toHaveLength(1);
  expect(state.ingredients[0]).toEqual(expect.objectContaining(main));
});

  it('удаляет ингредиент из конструктора по id', () => {
    const stateWithIngredient = constructorReducer(undefined, addIngredient(main));
    const id = stateWithIngredient.ingredients[0].id;

    const state = constructorReducer(stateWithIngredient, removeIngredient(id));

    expect(state.ingredients).toEqual([]);
  });

  it('меняет порядок ингредиентов в начинке', () => {
    const withMain = constructorReducer(undefined, addIngredient(main));
    const withSauce = constructorReducer(withMain, addIngredient(sauce));

    const state = constructorReducer(withSauce, moveIngredient({ from: 0, to: 1 }));

    expect(state.ingredients[0]._id).toBe('sauce-id');
    expect(state.ingredients[1]._id).toBe('main-id');
  });
});
