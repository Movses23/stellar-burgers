import { FC, SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';

import { registerUserApi } from '../../utils/burger-api';
import { setCookie } from '../../utils/cookie';

type TLocationState = {
  from?: Location;
};

export const Register: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as TLocationState | null)?.from?.pathname;

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      const data = await registerUserApi({
        name: userName,
        email,
        password
      });

      // сохраняем токены так же, как в login/refresh
      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken);

      // редирект: туда, откуда пришли, или на главную
      navigate(from || '/', { replace: true });
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: string }).message)
          : 'Ошибка регистрации';
      setErrorText(message);
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
