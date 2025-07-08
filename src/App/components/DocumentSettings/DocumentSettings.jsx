import React, { useEffect } from 'react';
import { Tabs, Modal, List } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import styles from './DocumentSettings.module.scss';
import attributeFields from './settingsConfig';
import AttributesTab from './AttributesTab/AttributesTab';
import ApprovalTab from './ApprovalTab/ApprovalTab';
import AttributesTabReadOnly from './AttributesTab/AttributesTabReadOnly/AttributesTabReadOnly';
import { fetchDocument } from '../../redux/slices/documentSlices';
import AttachmentsViewer from './AttachmentsTab/AttachmentsViewer/AttachmentsViewer';
import AttachmentsEditor from './AttachmentsTab/AttachmentsEditor/AttachmentsEditor';

const { TabPane } = Tabs;

const MOCK_SELECTION = {
  organization: ['ПАО "НК Роснефть"', 'ООО "Газпром нефть"'],
  initiator: ['Иванов И.И.', 'Петров П.П.'],
};

const DocumentSettings = ({ type }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.document);
  const title = data?.documentTitle || data?.title || '';

  useEffect(() => {
    dispatch(fetchDocument());
  }, [dispatch]);

  const [values, setValues] = React.useState({});
  const [modalField, setModalField] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(null);

  const openModal = (key) => setModalField(key);
  const closeModal = () => setModalField(null);
  const selectValue = (val) => {
    if (!modalField) return;
    setValues((v) => ({ ...v, [modalField]: val }));
    closeModal();
  };

  // const handlePlusClick = (key) => setModalVisible(key);
  const handleModalCancel = () => setModalVisible(null);

  // const uploadProps = {
  // };

  return (
    <div className={styles.wrapper}>
      <h1>Информация по документу «{title}»</h1>

      <div className={styles.cardContainer}>
        <div className={styles.tabsWrapper}>
          <Tabs type='card' size='small' defaultActiveKey='1'>
            <TabPane tab='Атрибуты' key='1'>
              {type === 'viewing' ? (
                <AttributesTabReadOnly />
              ) : (
                <AttributesTab
                  values={values}
                  setValues={setValues}
                  openModal={openModal}
                />
              )}
            </TabPane>
            <TabPane tab='Вложения' key='2'>
              {type === 'viewing' ? (
                <AttachmentsViewer />
              ) : (
                <AttachmentsEditor />
              )}
            </TabPane>
            <TabPane tab='Согласование' key='3'>
              <ApprovalTab />
            </TabPane>
          </Tabs>

          <Modal
            visible={!!modalField}
            title={
              modalField &&
              attributeFields.find((f) => f.key === modalField)?.label
            }
            onCancel={closeModal}
            footer={null}
          >
            <List
              dataSource={MOCK_SELECTION[modalField] || []}
              renderItem={(item) => (
                <List.Item
                  onClick={() => selectValue(item)}
                  style={{ cursor: 'pointer' }}
                >
                  {item}
                </List.Item>
              )}
            />
          </Modal>

          <Modal
            visible={!!modalVisible}
            title='Загрузить файлы'
            onCancel={handleModalCancel}
            footer={null}
            closeIcon={<CloseOutlined style={{ color: '#000' }} />}
          ></Modal>
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;
