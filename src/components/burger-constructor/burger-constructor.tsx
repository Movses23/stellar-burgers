import { FC, useMemo } from 'react';

import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructorBun,
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest,
  selectOrderError
} from '../../services/selectors';
import { getCookie } from '../../utils/cookie';
import { createOrder, clearOrderModalData } from '../../services/order-slice';
import { resetConstructor } from '../../services/constructor-slice';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = Boolean(getCookie('accessToken'));

  const dispatch = useDispatch();

  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorItems);

  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const orderError = useSelector(selectOrderError);

  const constructorItems = useMemo(
    () => ({
      bun,
      ingredients: ingredients ?? []
    }),
    [bun, ingredients]
  );

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, item: { price: number }) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item: { _id: string }) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
    if (orderModalData) {
      dispatch(resetConstructor());
    }
  };

  return (
    <>
      {orderError && (
        <p className='text text_type_main-default text_color_error'>
          {orderError}
        </p>
      )}

      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
    </>
  );
};
