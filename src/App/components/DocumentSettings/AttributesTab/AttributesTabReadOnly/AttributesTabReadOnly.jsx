import React, { useEffect, useMemo } from 'react';
import { Descriptions, Typography, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import attributeFields from '../../settingsConfig';
import styles from './AttributesTabReadOnly.module.scss';
import { fetchDocument } from '../../../../redux/slices/documentSlices';

const { Text } = Typography;

const formatDate = (ts) =>
  ts
    ? new Date(ts * 1000).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

const AttributesTabReadOnly = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.document);

  useEffect(() => {
    dispatch(
      fetchDocument()
    );
  }, [dispatch]);

  const fieldValues = useMemo(() => {
    if (!data) return {};
    return {
      documentKind: data.documentKind?.title,
      collegial: data.collegial?.title,
      title: data.title,
      meetingDate: formatDate(data.meetingDate),
      meetingCategory: data.meetingCategory?.title,
      meetingChairman: data.meetingChairman?.map((c) => c.shortName) || [],
      controlGroup: data.controlGroup?.title,
      secretary: data.secretary?.shortName,
      attended: data.attended?.map((a) => a.shortName) || [],
      thirdPartyAttendees: data.thirdPartyAttendees || null,
      thirdPartyApproval: data.thirdPartyApproval || null,
      documentCategory: data.documentCategory?.title,
      projectDataNumber: data.projectDataNumber,
      regnum: data.regnum,
      receivedDate: formatDate(data.receivedDate),
      regdate: formatDate(data.regdate),
    };
  }, [data]);

  const renderValue = (key) => {
    const v = fieldValues[key];
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) {
      return <Text type='secondary'>(Нет)</Text>;
    }
    if (Array.isArray(v)) {
      return v.join(', ');
    }
    return <Text>{v}</Text>;
  };

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 24 }}>
        <Spin tip='Загрузка данных...' />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <Alert
        message='Ошибка загрузки данных'
        description={error}
        type='error'
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <div className={styles.scrollContainer}>
      <Descriptions
        column={1}
        bordered
        size='small'
        className={styles.descriptions}
      >
        {attributeFields.map(({ key, label, required }) => (
          <Descriptions.Item
            key={key}
            label={
              <>
                {label}
                {required && <span className={styles.required}> *</span>}
              </>
            }
          >
            {renderValue(key)}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </div>
  );
};

export default AttributesTabReadOnly;
