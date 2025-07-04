import {
    PlusOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons'

import {
    Typography,
  } from 'antd';
  
const {Link } = Typography;
export const AVAILABLE_ROUTES = [
  {
    id: '1',
    title: 'Типовой маршрут для C91755',
    description: 'Маршрут для прохождения согласования процессов ЛНД',
  },
  {
    id: '2',
    title: 'Согласование ЛНД тестовое универсальное',
    description: 'Тестовый маршрут для согласования процессов ЛНД',
  },
  {
    id: '3',
    title: 'Маршрут_Автосогласование',
    description: 'Тестовый автосогласователь',
  },
];

export const columns = [
    {
      title: '',
      dataIndex: 'key',
      key: 'icon',
      width: 40,
      render: () => <PlusOutlined style={{ color: '#2b6fa3' }} />,
    },
    {
      title: 'Вид этапа',
      dataIndex: 'name',
      key: 'name',
      render: (txt) => <Link>{txt}</Link>,
    },
    {
      title: 'Тип этапа',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Срок',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: () => <CloseCircleOutlined style={{ cursor: 'pointer' }} />,
    },
  ];