import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '@ui';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useSelector } from '../../services/store';
import type { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.items
  );

  const ingredientData = useMemo(() => {
    if (!id) return null;
    return ingredients.find((item) => item._id === id) ?? null;
  }, [id, ingredients]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
