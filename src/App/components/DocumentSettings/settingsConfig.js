const attributeFields = [
    { key: 'documentKind', label: 'Вид документа', required: true },
    { key: 'collegial', label: 'Коллегиальный орган', required: true },
    { key: 'title', label: 'Заголовок', required: true },
    { key: 'meetingDate', label: 'Дата совещания (заседания)' },
    { key: 'meetingCategory', label: 'Тип совещания (заседания)' },
    { key: 'meetingChairman', label: 'Председатель' },
    { key: 'controlGroup', label: 'Группа контроля' },
    { key: 'secretary', label: 'Секретарь' },
    { key: 'attended', label: 'Участники' },
    { key: 'thirdPartyAttendees', label: 'Сторонние участники' },
    { key: 'thirdPartyApproval', label: 'Согласование сторонними участниками' },
    { key: 'documentCategory', label: 'Категория документа', required: true },
    { key: 'projectDataNumber', label: 'Учётный номер' },
    { key: 'regnum', label: 'Регистрационный номер' },
    { key: 'receivedDate', label: 'Дата поступления на регистрацию' },
    { key: 'regdate', label: 'Дата регистрации' }
];

export default attributeFields;
