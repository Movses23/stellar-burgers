import { FC, SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { LoginUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/user-slice';

type TLocationState = {
  from?: Location;
};

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as TLocationState | null)?.from?.pathname;

  const errorText = useSelector((state) => state.user.error) || '';
  const isLoading = useSelector((state) => state.user.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const action = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(action)) {
      navigate(from || '/', { replace: true });
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
