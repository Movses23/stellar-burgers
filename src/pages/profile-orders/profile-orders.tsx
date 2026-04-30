import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { profileWsActions } from '../../services/profile-ws-slice';
import { WS_BASE_URL } from '../../utils/ws-url';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.profileWs.orders);
  const status = useSelector((state) => state.profileWs.status);

  useEffect(() => {
    dispatch(profileWsActions.wsConnect(`${WS_BASE_URL}/orders`));

    return () => {
      dispatch(profileWsActions.wsDisconnect());
    };
  }, [dispatch]);

  if (status !== 'ONLINE') return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
