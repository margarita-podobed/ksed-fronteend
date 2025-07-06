import React from 'react';
import { Row, Col, Button, Input, Badge } from 'antd';
import attributeFields from '../settingsConfig';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocument } from '../../../redux/slices/documentSlices';

const AttributesTab = ({ openModal }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.document);

  dispatch(
    fetchDocument()
  );

  const header = data && (
    <div style={{ marginBottom: 16 }}>
      <Badge
        status='processing'
        text={`Статус: ${data.statusName || data.status}`}
      />
    </div>
  );
  const fieldValues = data
    ? {
        initiator: data.initiator.shortName,
        documentKind: data.documentKind.title,
        lndKind: data.lndKind?.title || '(не указано)',
        title: data.title,
        documentTitle: data.documentTitle,
        projectDataNumber: data.projectDataNumber,
        priority: data.priority,
        connectedDocuments:
          (data.connectedDocuments || []).length > 0
            ? data.connectedDocuments.map((d) => d.documentTitle).join(', ')
            : '(не выбрано)',
        curators:
          (data.curators || []).length > 0
            ? data.curators.map((c) => c.shortName).join(', ')
            : '(не указано)',
      }
    : {};

  return (
    <div style={{ padding: 16 }}>
      {header}

      {attributeFields.map(({ key, label, required }) => (
        <Row key={key} gutter={12} style={{ marginBottom: 12 }} align='middle'>
          <Col span={7}>
            <label>
              {label}
              {required && <span style={{ color: 'red' }}> *</span>}
            </label>
          </Col>
          <Col span={17}>
            {key === 'title' ? (
              <Input.TextArea
                readOnly
                value={fieldValues[key] || ''}
                style={{ maxHeight: 130 }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  readOnly
                  value={fieldValues[key] || ''}
                  style={{ flex: 1 }}
                />
                <Button
                  onClick={() => openModal(key)}
                  style={{ marginLeft: 8 }}
                >
                  …
                </Button>
              </div>
            )}
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default AttributesTab;
