import { FC, ReactElement } from 'react';
import { Navigate, useLocation, type Location } from 'react-router-dom';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const location = useLocation();

  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);


  if (!isAuthChecked) {
    return null;
  }

  const isAuth = Boolean(user);

 
  if (onlyUnAuth && isAuth) {
    const from = (location.state as { from?: Location } | null)?.from;
    return <Navigate to={from?.pathname || '/'} replace />;
  }


  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
