import { GetFields }            from "../../../../blocks/globalStorage.js";

import { setFunctionError }     from "../../../../blocks/errors.js";

import { getComboOptions }      from '../../../../blocks/commonFunctions.js';

import { setUserPrefs }         from './columnsWidth.js';

const logNameFile = "table => createSpace => cols => createCols";

let table;
let field;

function refreshCols(columnsData){
    if(table){
        table.refreshColumns(columnsData);
    }
}


function createReferenceCol (){
    try{
        
        const findTableId           = field.type.slice(10);
        field.editor     = "combo";
        field.collection = getComboOptions (findTableId);
        field.template   = function(obj, common, val, config){
            const itemId = obj[config.id];
            const item   = config.collection.getItem(itemId);
            return item ? item.value : "";
        };
    }catch (err){
        setFunctionError(err, logNameFile, "createReferenceCol");
    }
}

function createDatetimeCol  (){
    try{
        field.format = webix.Date.dateToStr("%d.%m.%Y %H:%i:%s");
        field.editor = "date";
        field.css    = {"text-align":"right"};
    }catch (err){
        setFunctionError(err, logNameFile, "createTableCols => createDatetimeCol")
    }
}

function createTextCol      (){
    try{

        field.editor = "text";
        field.sort   = "string";
    }catch (err){
        setFunctionError(err,logNameFile,"createTableCols => createTextCol")
    }
}

function createIntegerCol   (){
    try{
        field.editor         = "text";
        field.sort           = "int";
        field.numberFormat   = "1 111";
        field.css            = {"text-align":"right"};
        
    }catch (err){
        setFunctionError(err,logNameFile,"createTableCols => createIntegerCol");
    }
}
function createBoolCol      (){
    try{
        field.editor     = "combo";
        field.sort       = "text";
        field.collection = [
            {id : 1, value : "Да" },
            {id : 2, value : "Нет"}
        ];
    }catch (err){
        setFunctionError(err,logNameFile,"createTableCols => createBoolCol");
    }
}

function setIdCol       (data){
    field.id = data;
}

function setFillCol     (dataFields){
    const values      = Object.values(dataFields);
    const length      = values.length;
    const scrollWidth = 17;
    const tableWidth  = $$("tableContainer").$width - scrollWidth;
    const colWidth    = tableWidth / length;

    field.width  = colWidth;
}


function setHeaderCol   (){
    field.header     = field["label"];
}

function userPrefsId    (){
    const setting = webix.storage.local.get("userprefsOtherForm");

    if( setting && setting.visibleIdOpt == "2" ){
        field.hidden = true;
    }
}  


function createField(type){
    if (type.includes("reference")){
        createReferenceCol();

    } else if ( type == "datetime"){
        createDatetimeCol ();

    } else if ( type == "boolean"){
        createBoolCol     ();

    } else if ( type == "integer" || 
                type == "id")
    {
        createIntegerCol  ();

    } else {
        createTextCol     ();
    }   
}

function createTableCols (idsParam, idCurrTable){
  
    const data          = GetFields.item(idsParam);
    const dataFields    = data.fields;
    const colsName      = Object.keys(data.fields);
    const columnsData   = [];
    
    table               = $$(idCurrTable);

    try{
        colsName.forEach(function(data) {
            field = dataFields[data]; 

            createField(field.type);

            setIdCol    (data);
            setFillCol  (dataFields);
            setHeaderCol();

            if(field.id == "id"){
                userPrefsId();
            }
           
            if (field.label){
                columnsData.push(field);
            }
    
        });

        refreshCols(columnsData);
        setUserPrefs(table, idsParam);


    } catch (err){
        setFunctionError(err, logNameFile, "createTableCols");
    }


    return columnsData;
}

export {
    createTableCols
};