import { useState, useMemo } from 'react';
import style from './ApprovalTab.module.scss'
import {
  Space,
  Typography,
  Button,
  Dropdown,
  Menu,
  Modal,
  Input,
  List,
  Descriptions,
  Table,
  Form,
  Select,
  Checkbox,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { columns, AVAILABLE_ROUTES } from './ApprovalConfig';
const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ApprovalTab = () => {
  const [completedIterations] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stages, setStages] = useState([]);

  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [routeChosen, setRouteChosen] = useState(null);

  const openRouteModal = () => {
    setSearchText('');
    setRouteChosen(selectedRoute);
    setRouteModalVisible(true);
  };
  const closeRouteModal = () => setRouteModalVisible(false);
  const handleRouteOk = () => {
    setSelectedRoute(routeChosen);
    setStages([]);
    setRouteModalVisible(false);
  };

  const filteredRoutes = useMemo(() => {
    const txt = searchText.trim().toLowerCase();
    if (!txt) return AVAILABLE_ROUTES;
    return AVAILABLE_ROUTES.filter(
      (r) =>
        r.title.toLowerCase().includes(txt) ||
        r.description.toLowerCase().includes(txt)
    );
  }, [searchText]);

  // Dropdown для «Создать маршрут»
  const onMenuClick = ({ key }) => {
    if (key === 'typical') {
      openRouteModal();
    } else {
      Modal.info({
        title: 'Индивидуальный маршрут',
        content:
          'Здесь откроется ваша логика создания индивидуального маршрута.',
      });
    }
  };
  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item key='typical'>Типовой маршрут</Menu.Item>
      <Menu.Item key='individual'>Индивидуальный маршрут</Menu.Item>
    </Menu>
  );

  // Модалка добавления этапа
  const [stageModalVisible, setStageModalVisible] = useState(false);
  const [form] = Form.useForm();

  const openStageModal = () => setStageModalVisible(true);
  const closeStageModal = () => {
    form.resetFields();
    setStageModalVisible(false);
  };

  const handleStageOk = async () => {
    try {
      const vals = await form.validateFields();
      const newStage = {
        key: Date.now(),
        name: vals.name,
        type: vals.type,
        description: vals.description || '',
        deadline: `${vals.deadlineValue} ${vals.deadlineUnit}`,
        status: 'Не начат',
      };
      setStages((prev) => [...prev, newStage]);
      closeStageModal();
    } catch (err) {}
  };

  return (
    <>
      <Space direction='vertical' size='small' style={{ width: '100%' }}>
        <p className={style.title}>Согласование</p>

        {!selectedRoute ? (
          // 1) Начальный вид
          <>
            <Text>Завершено итераций: {completedIterations}</Text>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button>
                Создать маршрут <DownOutlined />
              </Button>
            </Dropdown>
          </>
        ) : (
          // 3) После выбора маршрута
          <>
            <Descriptions
              bordered
              column={1}
              size='small'
              style={{ marginBottom: 10 }}
            >
              <Descriptions.Item label='Статус текущей итерации'>
                Не начато
              </Descriptions.Item>
              <Descriptions.Item label='Маршрут'>
                {selectedRoute.title}
              </Descriptions.Item>
            </Descriptions>

            <Button
              type='primary'
              style={{
                backgroundColor: '#ecd102',
                borderColor: '#ecd102',
                color: '#000',
                marginBottom: 12,
              }}
              onClick={openStageModal}
            >
              Добавить этап
            </Button>

            {stages.length > 0 && (
              <Table
                dataSource={stages}
                columns={columns}
                pagination={false}
                locale={{ emptyText: 'Этапы не добавлены' }}
              />
            )}
          </>
        )}
      </Space>

      {/* 2) Модалка «Типовой маршрут»*/}
      <Modal
        title='Создать типовой маршрут'
        visible={routeModalVisible}
        onCancel={closeRouteModal}
        onOk={handleRouteOk}
        okText='ОК'
        cancelText='Отмена'
        width={600}
      >
        <Search
          placeholder='Поиск маршрута'
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <List
          dataSource={filteredRoutes}
          renderItem={(item) => {
            const isSelected = routeChosen?.id === item.id;
            return (
              <List.Item
                actions={[
                  <Button
                    key='select'
                    type={isSelected ? 'primary' : 'default'}
                    onClick={() => setRouteChosen(item)}
                  >
                    {isSelected ? 'Выбрано' : 'Выбрать'}
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            );
          }}
          locale={{ emptyText: 'Ничего не найдено' }}
        />
      </Modal>

      {/*4) Модалка «Новый этап»*/}
      <Modal
        title='Новый этап'
        visible={stageModalVisible}
        onCancel={closeStageModal}
        onOk={handleStageOk}
        okText='OK'
        cancelText='Отмена'
        width={700}
        style={{
          // Ограничиваем общую высоту окна, включая header и footer
          maxHeight: '80vh',
        }}
        bodyStyle={{
          // Ограничиваем область содержимого (Form) и включаем скролл при переполнении
          maxHeight: 'calc(80vh - 55px)', // 55px — примерная высота header+footer, подберите точнее
          overflowY: 'auto',
        }}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            name='type'
            label='Тип этапа'
            rules={[{ required: true, message: 'Выберите тип этапа' }]}
          >
            <Select placeholder='Параллельное или Последовательное'>
              <Option value='Параллельное'>Параллельное</Option>
              <Option value='Последовательное'>Последовательное</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name='name'
            label='Вид этапа'
            rules={[{ required: true, message: 'Введите вид этапа' }]}
          >
            <Input
              placeholder='Введите вид этапа'
              suffix={
                <Button type='text' size='small' onClick={() => {}}>
                  …
                </Button>
              }
            />
          </Form.Item>

          <Form.Item name='description' label='Описание'>
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name='finishOnRejection' valuePropName='checked'>
            <Checkbox>Завершать после первого отклонения согласующим</Checkbox>
          </Form.Item>

          <Form.Item label='Срок согласования'>
            <Space.Compact>
              <Form.Item
                name='deadlineValue'
                noStyle
                rules={[{ required: true, message: 'Введите цифру' }]}
              >
                <Input style={{ width: 80 }} placeholder='1' />
              </Form.Item>
              <Form.Item
                name='deadlineUnit'
                noStyle
                rules={[{ required: true, message: 'Выберите единицу' }]}
              >
                <Select placeholder='Часы' style={{ width: 120 }}>
                  <Option value='Часы'>Часы</Option>
                  <Option value='Дни'>Дни</Option>
                </Select>
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          <Form.Item name='required' valuePropName='checked'>
            <Checkbox>Признак «Обязательный» для согласующих в этапе</Checkbox>
          </Form.Item>

          <Form.Item name='notifyOptional' valuePropName='checked'>
            <Checkbox>Уведомлять о решении необязательных согласующих</Checkbox>
          </Form.Item>

          <Form.Item
            name='afterDeadline'
            label='По истечении срока согласования'
          >
            <Select placeholder='Ожидать вынесения решения'>
              <Option value='Ожидать вынесения решения'>
                Ожидать вынесения решения
              </Option>
              <Option value='Автоматически завершать'>
                Автоматически завершать
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name='result' label='С результатом'>
            <Select placeholder='Выберите результат'>
              <Option value='Утвердить'>Утвердить</Option>
              <Option value='Отклонить'>Отклонить</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name='approvers'
            label='Согласующие'
            rules={[{ required: true, message: 'Выберите согласующих' }]}
          >
            <Input
              placeholder='Согласующие'
              suffix={
                <Button type='text' size='small' onClick={() => {}}>
                  …
                </Button>
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ApprovalTab;
