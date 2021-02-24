//Получает контент записи по клику по строке в левой части для его отображения в правой

/**
 * Маппинг полей SM-реакт
 * @param {String} fName Имя поля, которое пришло из SM
 * @return {String} Имя поля для реакта
 */
//TODO: Не учел пока что разные таблицы

const getFieldType = (tablename) => {
   switch (tablename) {
      case 'incidents':
      default:
         return {
            number: 'String',
            status:'String',
            category: 'String',
            feedbackType: 'String',
            deadline: 'String',
            priority: 'String',
            kc: 'String',
            kcDisp: 'String',
            ck: 'String',
            ckInj: 'String',
            direction: 'String',
            groupAffectedItem: 'String',
            affectedItem: 'String',
            service: 'String',
            contactName: 'String',
            contactName_vip: 'String',
            contactName_skype: 'String',
            contactName_whatsapp: 'String',
            contactName_telegramm: 'String',
            contactName_organization: 'String',
            contactName_location: 'String',
            callbackContact: 'String',
            callbackContact_vip: 'String',
            callbackContact_skype: 'String',
            callbackContact_whatsapp: 'String',
            callbackContact_telegramm: 'String',
            callbackContact_organization: 'String',
            callbackContact_location: 'String',
            feedback: 'Array',
            closeMark: 'String',
            knowledgeArticle: 'String',
            resolution: 'Array',
            resolutionCode: 'String',
            closedCKKC: 'String',
            briefDescription: 'String',
            description: 'Array',
         }
   }
}

/**
 * Преобразует значение поля в нужный для отображения вид
 * @param {Any} value Значение поля
 * @param {String} name Имя поля
 * @param {String} type Тип поля
 * @return {Any} Значение поля в нужном для отображения виде
 */
const beatifyValue = (value, name, type) => {
   let retValue = value;
 
   if (retValue === null) return '';
   let retValueArr = []; //Если значение - массив, построим его

   //По типу
   switch (type) {
      case 'String':
         retValue = value.length > 0 ? value[0].toUpperCase() + value.slice(1) : value; //С большой буквы
         break;
      case 'Array':
         for (let key in value) { retValueArr = [ ...retValueArr, value[key] ]; }
         retValue = retValueArr.join('\n');
         break;
   }

   //По полю
   switch (name) {
      case 'priority':
         switch (value) {
            case '1':
               retValue = 'Наивысший';
               break;
            case '2':
               retValue = 'Высокий';
               break;
            case '3':
               retValue = 'Средний';
               break;
            case '4':
            default:
               retValue = 'Низкий';
         }

         break;
   }

   return retValue;
}

/**
 * Строит объект для ответа в Реакт
 * @param {String Array} data Response, который пришел из SM
 * @return {Object} Объект для ответа в Реакт
 */
const getReactRespObj = (data) => {
   let retData = { ...data };
   let fTypes = getFieldType('incidents'); //TODO: - Имя файла надо будет брать откуда-то
   
   for (let key in retData) {
      retData[key] = beatifyValue(retData[key], key, fTypes[key]);
   }
   
   return retData;
}

module.exports.getReactRespObj = getReactRespObj;