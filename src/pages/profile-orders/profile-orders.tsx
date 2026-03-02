import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { profileWsActions } from '../../services/profile-ws-slice';

const WS_PROFILE_URL = 'wss://norma.education-services.ru/orders';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.profileWs.orders);
  const status = useSelector((state) => state.profileWs.status);
  const error = useSelector((state) => state.profileWs.error);

  const didConnectRef = useRef(false);

  useEffect(() => {
    if (didConnectRef.current) return;
    didConnectRef.current = true;

    dispatch(profileWsActions.wsConnect(WS_PROFILE_URL));

    return () => {
      dispatch(profileWsActions.wsDisconnect());
      didConnectRef.current = false;
    };
  }, [dispatch]);

  if (status === 'CONNECTING' && !orders.length) return null;
  if (error && !orders.length) return null;

  return <ProfileOrdersUI orders={orders} />;
};
