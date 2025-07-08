import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Button, Typography, Space, Spin } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import styles from './AttachmentsViewer.module.scss';
import { fetchDocument } from '../../../../redux/slices/documentSlices';

const { Title, Text, Link } = Typography;

const viewingSections = [
  { key: 'info', title: 'Зарегистрированный документ' },
  { key: 'review', title: 'Документы для рассмотрения' },
];

function formatDate(unix) {
  if (!unix) return '';
  const d = new Date(unix * 1000);
  return `${String(d.getDate()).padStart(2, '0')}.${String(
    d.getMonth() + 1
  ).padStart(2, '0')}.${d.getFullYear()}`;
}
function formatSize(bytes) {
  if (bytes == null) return '';
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

const AttachmentsViewer = () => {
  const dispatch = useDispatch();
  const { data: doc, status } = useSelector((state) => state.document);

  useEffect(() => {
    dispatch(fetchDocument());
  }, [dispatch]);

  if (status === 'loading' || !doc) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <Spin />
      </div>
    );
  }

  const infoFiles = (doc.attachmentsCategories || [])
    .filter((cat) => cat.isPrimary)
    .flatMap((cat) => cat.attachments)
    .map((att) => ({
      url: `/alfresco/service/api/node/content/${encodeURIComponent(
        att.nodeRef
      )}`,
      name: att.name,
      date: formatDate(att.modified),
      user: doc.initiator?.shortName || doc.initiator?.fullName,
      size: formatSize(att.size),
      description: att.description,
      tags: att.tags,
    }));

  const reviewFiles = (doc.attachmentsCategories || [])
    .filter((cat) => !cat.isPrimary)
    .flatMap((cat) => cat.attachments)
    .map((att) => ({
      url: `/alfresco/service/api/node/content/${encodeURIComponent(
        att.nodeRef
      )}`,
      name: att.name,
      date: formatDate(att.modified),
      user: doc.initiator?.shortName || doc.initiator?.fullName,
      size: formatSize(att.size),
      description: att.description,
      tags: att.tags,
    }));

  const data = { info: infoFiles, review: reviewFiles };

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      {viewingSections.map(({ key, title }) => {
        const files = data[key] || [];
        if (!files.length) return null;
        return (
          <div key={key} className={styles.section}>
            <Title level={5}>{title}</Title>
            <List
              itemLayout='horizontal'
              dataSource={files}
              renderItem={(file) => (
                <List.Item
                  actions={[
                    <Button
                      key='dl'
                      type='link'
                      icon={<DownloadOutlined />}
                      href={file.url}
                      download={file.name}
                      style={{ color: '#004e90'}}
                    >
                      Скачать
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <FileTextOutlined
                        style={{ fontSize: 48, color: 'rgb(98 108 110)' }}
                      />
                    }
                    title={
                      <Link
                        href={file.url}
                        target='_blank'
                        style={{ fontSize: '16px', color: '#004e90' }}
                      >
                        {file.name}
                      </Link>
                    }
                    description={
                      <>
                        <Text>
                          Изменено {`${file.date} `} пользователем {` `}
                          {file.user}
                        </Text>
                        <br />
                        <Text type='secondary'>{file.size}</Text>
                        <br />
                        <Text type='secondary'>
                          {file.description || 'Нет описания'}
                        </Text>
                        <br />
                        <Text type='secondary'>
                          {file.tags?.join(', ') || 'Нет меток'}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        );
      })}
    </Space>
  );
};

export default AttachmentsViewer;
