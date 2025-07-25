// import {
//     FileOutlined,
//     ExclamationCircleOutlined,
//     EditOutlined,
//     FieldTimeOutlined
// } from '@ant-design/icons';

// const SIDEBAR_CONFIG = {
//     create: {
//         title: 'Создать карточку',
//         titleColor: 'black',
//         icon: < FileOutlined />,
//         sections: {
//             id: 'actions',
//             title: 'Действия',
//             icon: < ExclamationCircleOutlined />,
//             items: [{
//                 key: 'save',
//                 label: 'Сохранить проект'
//             }, {
//                 key: 'send',
//                 label: 'Направить на согласование'
//             }, {
//                 key: 'cancel',
//                 label: 'Отмена'
//             }]
//         }
//     },
//     viewing: {
//         title: 'Редактировать карточку',
//         titleColor: '#2b6fa3',
//         icon: <EditOutlined />,
//         dropdownLists: [{
//             id: 'actions',
//             title: 'Действия',
//             type: 'list',
//             items: [{
//                 key: 'revokeApproval',
//                 label: 'Отозвать согласование'
//             }, {
//                 key: 'printingMaterials',
//                 label: 'Печать материалов'
//             }, {
//                 key: 'removeAttachments',
//                 label: 'Удалить вложения'
//             }, {
//                 key: 'WithdrawDecision',
//                 label: 'Отозвать решение'
//             }, {
//                 key: 'softenDecision',
//                 label: 'Смягчить решение'
//             }, {
//                 key: 'uploadAttachment',
//                 label: 'Загрузить вложение'
//             }, {
//                 key: 'generateRegisterComments',
//                 label: 'Сформировать реестр замечаний'
//             }]
//         }, {
//             id: 'basicInformation',
//             title: 'Основные сведения',
//             type: 'information',
//             items: [{
//                 key: 'initiator',
//                 label: 'Инициатор:'
//             }, {
//                 key: 'documentType',
//                 label: 'Вид документа:'
//             }, {
//                 key: 'heading',
//                 label: 'Заголовок:'
//             }, {
//                 key: 'status',
//                 label: 'Статус:'
//             }]
//         },
//         {
//             id: 'basicInformation',
//             title: 'Основные сведения',
//             type: 'information',
//         }, {
//             id: 'communications',
//             title: 'Связи',
//             type: 'list',
//             items: []
//         }, {
//             id: 'tags',
//             title: 'Метки',
//             type: 'list',
//             items: []
//         },
//         {
//             id: 'comments',
//             title: 'Комментарии',
//             type: 'information',
//         }]
//     },
//     edit: {
//         title: 'Редактировать карточку',
//         titleColor: 'black',
//         icon: < EditOutlined />,
//         sections: {
//             id: 'actions',
//             title: 'Действия',
//             icon: < ExclamationCircleOutlined />,
//             items: [{
//                 key: 'save',
//                 label: 'Сохранить изменнения'
//             }, {
//                 key: 'cancel',
//                 label: 'Отмена'
//             }]
//         }
//     },
//     decision: {
//         title: 'Редактировать карточку',
//         titleColor: '#2b6fa3',
//         icon: <EditOutlined />,
//         sections: {
//             id: 'actions',
//             title: 'Решения по согласованию',
//             deadline: '02.03.2004',
//             icon: <FieldTimeOutlined />,
//             items: [{
//                 key: 'approve',
//                 label: 'Согласовать'
//             }, {
//                 key: 'approveComments',
//                 label: 'Согласовать с комментариями'
//             }, {
//                 key: 'reject',
//                 label: 'Отклонить'
//             },
//             {
//                 key: 'addComments',
//                 label: 'Добавить замечания'
//             },
//             {
//                 key: 'internalConsistency',
//                 label: 'Внутреннее согласование'
//             }]
//         },
//         dropdownLists: [{
//             id: 'actions',
//             title: 'Действия',
//             type: 'list',
//             items: [{
//                 key: 'revokeApproval',
//                 label: 'Отозвать согласование'
//             }, {
//                 key: 'printingMaterials',
//                 label: 'Печать материалов'
//             }, {
//                 key: 'removeAttachments',
//                 label: 'Удалить вложения'
//             }, {
//                 key: 'WithdrawDecision',
//                 label: 'Отозвать решение'
//             }, {
//                 key: 'softenDecision',
//                 label: 'Смягчить решение'
//             }, {
//                 key: 'uploadAttachment',
//                 label: 'Загрузить вложение'
//             }, {
//                 key: 'generateRegisterComments',
//                 label: 'Сформировать реестр замечаний'
//             }]
//         }, {
//             id: 'basicInformation',
//             title: 'Основные сведения',
//             type: 'information',
//             items: [{
//                 key: 'initiator',
//                 label: 'Инициатор:'
//             }, {
//                 key: 'documentType',
//                 label: 'Вид документа:'
//             }, {
//                 key: 'heading',
//                 label: 'Заголовок:'
//             }, {
//                 key: 'status',
//                 label: 'Статус:'
//             }]
//         },]
//     }
// }

// export default SIDEBAR_CONFIG

import {
    EditOutlined,
    PaperClipOutlined,
    TeamOutlined,
    LinkOutlined,
    TagsOutlined,
    MessageOutlined,
    UsergroupAddOutlined,
    HistoryOutlined,
    FileTextOutlined
} from '@ant-design/icons';

const SIDEBAR_CONFIG = {
    viewing: {
        title: 'Редактировать карточку',
        titleColor: '#2b6fa3',
        icon: <EditOutlined />,
        dropdownLists: [
            { id: 'actions', title: 'Действия', type: 'list', items: [] },
            {
                id: 'basicInformation', title: 'Основные сведения', type: 'information',
                items: [
                    { key: 'title', label: 'Заголовок:' },
                    { key: 'regnum', label: 'Номер:' },
                    { key: 'meetingDate', label: 'Дата совещания (заседания):' },
                    { key: 'meetingChairman', label: 'Председатель:' },
                    { key: 'statusName', label: 'Статус:' }
                ]
            },
            // { id: 'attachments', title: 'Вложения', type: 'list', icon: <PaperClipOutlined />, items: [] },
            // { id: 'reviewItems', title: 'Поручения', type: 'list', icon: <TeamOutlined />, items: [] },
            { id: 'connections', title: 'Связи', type: 'list', icon: <LinkOutlined />, items: [] },
            { id: 'tags', title: 'Метки', type: 'list', icon: <TagsOutlined />, items: [] },
            // { id: 'history', title: 'История', type: 'list', icon: <HistoryOutlined />, items: [] },
            // { id: 'printForms', title: 'Печатные формы', type: 'list', icon: <FileTextOutlined />, items: [] },
        ]
    }
};

export default SIDEBAR_CONFIG