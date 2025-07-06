import { useDispatch, useSelector } from 'react-redux';
import { Button, Spin, Alert } from 'antd';
import { login } from '../../redux/slices/authSlice';

const LoginButton = () => {
  const dispatch = useDispatch();
  const { status, error, ticket } = useSelector((state) => state.auth);

  const handleClick = () => {
    dispatch(login());
  };

  return (
    <div style={{ backgroundColor: '#eeeeee', padding: '10px' }}>
      {status === 'loading' && <Spin style={{ marginBottom: 16 }} />}
      {error && (
        <Alert
          type='error'
          message='Ошибка авторизации'
          description={error}
          style={{ marginBottom: 16 }}
        />
      )}
      {ticket && (
        <Alert
          type='success'
          message='Авторизация успешна'
          description={`ticket: ${ticket}`}
          style={{ marginBottom: 16 }}
        />
      )}
      <Button
        type='primary'
        onClick={handleClick}
        disabled={status === 'loading'}
      >
        Войти
      </Button>
    </div>
  );
};

export default LoginButton;
