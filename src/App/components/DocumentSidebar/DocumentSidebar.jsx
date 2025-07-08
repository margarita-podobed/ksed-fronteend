import React, { useState, useEffect } from 'react';
import { Layout, Collapse, Descriptions, Avatar, Button, Spin } from 'antd';
import { UserOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import styles from './DocumentSidebar.module.scss';
import { fetchDocument } from '../../redux/slices/documentSlices';
import SIDEBAR_CONFIG from '../DocumentSidebar/sidebarConfig';

const { Panel } = Collapse;
const { Sider } = Layout;

function formatDate(unix) {
  if (!unix) return '';
  const d = new Date(unix * 1000);
  return `${String(d.getDate()).padStart(2, '0')}.${String(
    d.getMonth() + 1
  ).padStart(2, '0')}.${d.getFullYear()}`;
}

const DocumentSidebar = ({ type = 'viewing', t, nodeRef }) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { data: doc, status } = useSelector((s) => s.document);

  useEffect(() => {
    if (t && nodeRef) dispatch(fetchDocument({ t, nodeRef }));
  }, [t, nodeRef, dispatch]);

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

  const config = SIDEBAR_CONFIG[type] || SIDEBAR_CONFIG.viewing;
  const {
    title,
    titleColor,
    icon,
    sections, 
    dropdownLists = [],
  } = config;

  const dynamicDropdown = dropdownLists.map((block) => {
    switch (block.id) {
      // ——— ДЕЙСТВИЯ ———
      case 'actions':
        return {
          ...block,
          items:
            Array.isArray(doc.actions) && doc.actions.length
              ? doc.actions.map((a) => ({ key: a, label: a }))
              : [{ key: 'none', label: 'действия отсутствуют' }],
        };

      // ——— ОСНОВНЫЕ СВЕДЕНИЯ ———
      case 'basicInformation':
        return {
          ...block,
          items: block.items.map((f) => {
            let value = 'нет данных';
            switch (f.key) {
              case 'title':
                value = doc.title;
                break;
              case 'regnum':
                value = doc.regnum;
                break;
              case 'meetingDate':
                value = formatDate(doc.meetingDate);
                break;
              case 'meetingChairman':
                value =
                  Array.isArray(doc.meetingChairman) &&
                  doc.meetingChairman.length
                    ? doc.meetingChairman[0].fullName
                    : 'нет данных';
                break;
              case 'statusName':
                value = doc.statusName;
                break;
            }
            return { ...f, value };
          }),
        };

      // ——— ВЛОЖЕНИЯ ———
      case 'attachments': {
        const atts = (doc.attachmentsCategories || []).flatMap((cat) =>
          (cat.attachments || []).map((a) => ({
            key: a.nodeRef,
            label: a.name,
          }))
        );
        return {
          ...block,
          items: atts.length ? atts : [{ key: 'none', label: 'вложений нет' }],
        };
      }

      // ——— ПОРУЧЕНИЯ ———
      case 'reviewItems': {
        const revs = (doc.reviewItems || []).flatMap((ri) =>
          (ri.reviewers || []).map((r) => ({
            key: r.nodeRef,
            label: r.employee.fullName,
          }))
        );
        return {
          ...block,
          items: revs.length ? revs : [{ key: 'none', label: 'поручений нет' }],
        };
      }

      // ——— СВЯЗИ ———
      case 'connections': {
        const conns = (doc.connectedDocuments || []).map((cd) => ({
          key: cd.nodeRef,
          label: cd.isAccessDenied
            ? `⛔ ${cd.connectionType}: ${cd.documentTitle}`
            : `${cd.connectionType}: ${cd.documentTitle}`,
        }));
        return {
          ...block,
          items: conns.length ? conns : [{ key: 'none', label: 'связей нет' }],
        };
      }

      // ——— УЧАСТНИКИ ДОКУМЕНТА ———
      case 'attended': {
        const users = (doc.attended || []).map((u) => ({
          key: u.nodeRef,
          label: u.fullName,
        }));
        return {
          ...block,
          items: users.length
            ? users
            : [{ key: 'none', label: 'участников нет' }],
        };
      }

      // ——— МЕТКИ ———
      case 'tags':
        return {
          ...block,
          items:
            Array.isArray(doc.tags) && doc.tags.length
              ? doc.tags.map((t, i) => ({ key: i, label: t }))
              : [{ key: 'none', label: 'меток нет' }],
        };

      // ——— ИСТОРИЯ ———
      case 'history': {
        const h = (doc.history || []).map((item, i) => ({
          key: i,
          label: `${formatDate(item.created)}: ${
            item.comment || '<нет текста>'
          }`,
        }));
        return {
          ...block,
          items: h.length ? h : [{ key: 'none', label: 'истории нет' }],
        };
      }

      // ——— ПЕЧАТНЫЕ ФОРМЫ ———
      case 'printForms': {
        const pf = Array.isArray(doc.printForms) ? doc.printForms : [];
        const forms = pf.map((pfm, i) => ({
          key: i,
          label: pfm.name || String(pfm),
        }));
        return {
          ...block,
          items: forms.length
            ? forms
            : [{ key: 'none', label: 'печ. форм нет' }],
        };
      }

      // ——— КОММЕНТАРИИ ———
      case 'comments': {
        const cm = (doc.comments || []).map((c, i) => ({
          key: i,
          label: c,
        }));
        return {
          ...block,
          items: cm.length ? cm : [{ key: 'none', label: 'комментариев нет' }],
        };
      }

      default:
        return block;
    }
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
          {sections?.items?.length > 0 && (
            <ul className={styles.list}>
              <div className={styles.listTitleWrap}>
                <span className={styles.listTitleIcon}>{sections.icon}</span>
                <span className={styles.listTitle}>{sections.title}</span>
                {sections.deadline && (
                  <>
                    <br />
                    <span className={styles.deadline}>
                      Крайний срок:{' '}
                      <span className={styles.date}>{sections.deadline}</span>
                    </span>
                  </>
                )}
              </div>
              {sections.items.map((item) => (
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
            {dynamicDropdown.map((sec) =>
              sec.type === 'information' ? (
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
                    {sec.items.map((f) => (
                      <Descriptions.Item key={f.key} label={f.label}>
                        {f.key === 'initiator' ? (
                          <>
                            <Avatar
                              icon={<UserOutlined />}
                              size='small'
                              className={styles.avatar}
                            />
                            {f.value}
                          </>
                        ) : (
                          f.value
                        )}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Panel>
              ) : (
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
              )
            )}
          </Collapse>
        </div>
      </Sider>

      <Button
        onClick={() => setCollapsed((c) => !c)}
        icon={<MenuFoldOutlined />}
        style={{
          position: 'absolute',
          top: 0,
          right: -20,
          width: 50,
          height: 52,
          padding: 0,
          border: '1px solid #fff',
          background: '#fff',
          color: '#ddaa04',
          borderRadius: 0,
          fontSize: 25,
          boxShadow: 'none',
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default DocumentSidebar;
