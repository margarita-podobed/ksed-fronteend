import style from './ApprovalCard.module.scss';
import DocumentSettings from '../../components/DocumentSettings/DocumentSettings';
import DocumentSidebar from '../../components/DocumentSidebar/DocumentSidebar';
import Document from '../../components/Document/Document';

const ApprovalCard = () => {
  return (
    <>
      <div className={style.row}>
        <div className={style.sidebarWrap}>
          <DocumentSidebar type='decision' />
        </div>
        <div className={style.settingsWrap}>
          <DocumentSettings type='viewing' />
        </div>
        <div className={style.documentWrap}>
          <Document />
        </div>
      </div>
    </>
  );
};

export default ApprovalCard;
