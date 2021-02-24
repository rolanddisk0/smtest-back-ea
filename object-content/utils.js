//Микросервис "Сущность СТП"
//Получает контент записи по клику по строке в левой части для его отображения в правой

/**
 * Преобразует значение поля в нужный для отображения вид
 * @param {Any} value Значение поля
 * @param {String} name Имя поля
 * @return {Any} Значение поля в нужном для отображения виде
 */
const beatifyValue = (value, name) => {
   let retValue = value;
   if (retValue === null) return '';
   
   //По полю
   switch (name) {
      case 'resolution':
      case 'feedback':
      case 'description':
      case 'action':
      case 'closureComments':
         retValue.value = value.value && value.value.length > 0 ? value.value.join('\n') : '';
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
   let retData = {};
   for (let key in data) { retData[key] = beatifyValue(data[key], key); }
   return retData;
}

const parseJsonString = (str) => {
   let ret = null;
   try {
       ret = JSON.parse(str);
   } catch (e) {
       return ret;
   }
   return ret;
}

module.exports.getReactRespObj = getReactRespObj;
module.exports.parseJsonString = parseJsonString;