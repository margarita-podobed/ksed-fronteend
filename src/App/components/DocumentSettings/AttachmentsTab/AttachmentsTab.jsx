import React, { useState } from 'react';
import { Space, Typography, Button, Upload, Modal } from 'antd';
import { PlusOutlined, InboxOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './AttachmentsTab.module.scss';

const { Text } = Typography;
const { Dragger } = Upload;

const secondTabConfig = [
  { key: 'review', title: 'Документы для рассмотрения' },
  { key: 'info', title: 'Документы для информации' },
];

const AttachmentsTab = ({ uploadProps }) => {
  const [modalVisible, setModalVisible] = useState(null);

  const handlePlusClick = (key) => setModalVisible(key);
  const handleModalCancel = () => setModalVisible(null);

  return (
    <>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {secondTabConfig.map(({ key, title }) => (
          <div key={key} className={styles.dropZoneWrapper}>
            <p strong className={styles.title}>
              {title}
            </p>
            <Dragger {...uploadProps} className={styles.customDragger}>
              <p className='ant-upload-drag-icon'>
                <InboxOutlined style={{ fontSize: 32, color: '#999' }} />
              </p>
              <p>Перетащите файл сюда</p>
              <Text type='secondary'>или нажмите «+»</Text>
            </Dragger>
            <Button
              type='text'
              icon={<PlusOutlined />}
              className={styles.plusButton}
              onClick={() => handlePlusClick(key)}
            />
          </div>
        ))}
      </Space>

      <Modal
        visible={!!modalVisible}
        title='Загрузить файлы'
        onCancel={handleModalCancel}
        footer={null}
        closeIcon={<CloseOutlined style={{ color: '#000' }} />}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          <Button
            type='primary'
            block
            className={styles.yellowBtn}
            onClick={() => {
            }}
          >
            Выберите файлы
          </Button>
          <Button
            type='primary'
            block
            className={styles.yellowBtn}
            onClick={() => {
            }}
          >
            Получить со сканера
          </Button>
          <Button
            block
            onClick={handleModalCancel}
          >
            Отмена
          </Button>
        </Space>
      </Modal>
    </>
  );
};

export default AttachmentsTab;
