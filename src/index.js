import './global.scss'
import { ConfigProvider } from 'antd';
import App from './App/App'
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './App/redux/store';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <ConfigProvider theme={{ token: { fontFamily: 'Arial, sans-serif' } }}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);

