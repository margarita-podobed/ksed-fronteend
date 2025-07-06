import React, { useState, useEffect } from 'react';
import { Layout, Collapse, Descriptions, Avatar, Button, Spin } from 'antd';
import { UserOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import styles from './DocumentSidebar.module.scss';
import { fetchDocument } from '../../redux/slices/documentSlices';
import SIDEBAR_CONFIG from '../DocumentSidebar/sidebarConfig';

const { Panel } = Collapse;
const { Sider } = Layout;

// Утилита для форматирования UNIX-времени в «DD.MM.YYYY»
function formatDate(unixSeconds) {
  if (!unixSeconds) return '';
  const d = new Date(unixSeconds * 1000);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

const DocumentSidebar = ({ type, ticket, t, nodeRef }) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { data: doc, status } = useSelector((state) => state.document);

  useEffect(() => {
    if (ticket && t && nodeRef) {
      dispatch(fetchDocument());
    }
  }, [ticket, t, nodeRef, dispatch]);

  if (status === 'loading' || !doc) {
    return (
      <div
        style={{
          width: collapsed ? 32 : 300,
          textAlign: 'center',
          paddingTop: 50,
        }}
      >
        <Spin />
      </div>
    );
  }

  const baseConfig = SIDEBAR_CONFIG[type] || {};
  const { title, titleColor, icon, sections, dropdownLists = [] } = baseConfig;

  let sectionConfig = sections;
  if (sectionConfig && sectionConfig.deadlineKey) {
    sectionConfig = {
      ...sectionConfig,
      deadline: formatDate(doc[sectionConfig.deadlineKey]),
    };
  }

  const dynamicDropdown = dropdownLists.map((block) => {
    if (block.type === 'information') {
      return {
        ...block,
        items: block.items.map((field) => ({
          ...field,
          value:
            field.key === 'initiator'
              ? doc.initiator?.shortName || doc.initiator?.fullName
              : doc[field.key] || 'нет данных',
        })),
      };
    }
    return block;
  });

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: collapsed ? 32 : 300,
        transition: 'width 0.2s ease',
        overflow: 'visible',
      }}
    >
      <Sider
        width={300}
        collapsedWidth={0}
        collapsible
        collapsed={collapsed}
        trigger={null}
        className={styles.sider}
        style={{ height: '100%', overflow: 'hidden' }}
      >
        <div className={styles.headerWithIcon} style={{ color: titleColor }}>
          <span className={styles.headerIcon}>{icon}</span>
          <span className={styles.headerTitle}>{title}</span>
        </div>

        <div className={styles.drawerBody}>
          {sectionConfig?.items?.length > 0 && (
            <ul className={styles.list}>
              <div className={styles.listTitleWrap}>
                <span className={styles.listTitleIcon}>
                  {sectionConfig.icon}
                </span>
                <span className={styles.listTitle}>{sectionConfig.title}</span>
                <br />
                {sectionConfig.deadline && (
                  <span className={styles.deadline}>
                    Крайний срок:{' '}
                    <span className={styles.date}>
                      {sectionConfig.deadline}
                    </span>
                  </span>
                )}
              </div>
              {sectionConfig.items.map((item) => (
                <li key={item.key}>{item.label}</li>
              ))}
            </ul>
          )}

          <Collapse
            bordered={false}
            expandIconPosition='left'
            className={styles.collapse}
            rootClassName={styles.myCollapse}
            defaultActiveKey={[]}
          >
            {dynamicDropdown.map((sec) => {
              if (sec.type === 'list') {
                return (
                  <Panel
                    key={sec.id}
                    header={
                      <div className={styles.panelHeader}>
                        <span className={styles.panelTitle}>{sec.title}</span>
                      </div>
                    }
                    className={styles.panel}
                  >
                    <ul className={styles.listDrop}>
                      {sec.items.map((item) => (
                        <li key={item.key}>{item.label}</li>
                      ))}
                    </ul>
                  </Panel>
                );
              }
              if (sec.type === 'information') {
                return (
                  <Panel
                    key={sec.id}
                    header={
                      <div className={styles.panelHeader}>
                        <span className={styles.panelTitle}>{sec.title}</span>
                      </div>
                    }
                    className={styles.panel}
                  >
                    <Descriptions
                      column={1}
                      bordered
                      size='small'
                      className={styles.info}
                    >
                      {sec.items.map((field) => (
                        <Descriptions.Item key={field.key} label={field.label}>
                          {field.key === 'initiator' ? (
                            <>
                              <Avatar
                                icon={<UserOutlined />}
                                size='small'
                                className={styles.avatar}
                              />
                              {field.value}
                            </>
                          ) : (
                            field.value
                          )}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </Panel>
                );
              }
              return null;
            })}
          </Collapse>
        </div>
      </Sider>

      <Button
        onClick={() => setCollapsed((c) => !c)}
        icon={<MenuFoldOutlined />}
        style={{
          position: 'absolute',
          fontSize: 25,
          top: 0,
          right: -20,
          width: 50,
          height: 52,
          padding: 0,
          border: '1px solid #fff',
          background: '#fff',
          color: '#ddaa04',
          borderRadius: 0,
          boxShadow: 'none',
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default DocumentSidebar;
