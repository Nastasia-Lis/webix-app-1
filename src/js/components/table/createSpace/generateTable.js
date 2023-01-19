
///////////////////////////////

// Подготовка таблицы и загрузка

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { setLogValue }                      from '../../logBlock.js';
import { LoadServerData, GetFields }        from "../../../blocks/globalStorage.js";

import { setFunctionError }                 from "../../../blocks/errors.js";
import { createTableRows }                  from './rows/createRows.js';
import { createTableCols }                  from './cols/createCols.js';
import { createDetailAction }               from './cols/detailAction.js';
import { createDynamicElems }               from './cols/dynamicElements/createElements.js';
import { Action, isArray }                  from '../../../blocks/commonFunctions.js';

const logNameFile = "getContent => getInfoTable";

let titem;
let idsParam;
let idCurrTable;

function setTableName(idCurrTable, idsParam) {
  
    try{
        const names = GetFields.names;

        if (isArray(names, logNameFile, "setTableName")){

            names.forEach(function(el){
                if (el.id == idsParam){  
                    const template  = $$(idCurrTable + "-templateHeadline");
                    const value     = el.name.toString();
                    template.setValues(value);
                }
            });
        }
 

        
    } catch (err){  
        setFunctionError(err, logNameFile, "setTableName");
    }
} 


function getValsTable (){
    titem     = $$("tree").getItem(idsParam);

    if (!titem){
        titem = idsParam;
    }
}


function preparationTable (){
    try{
        $$(idCurrTable).clearAll();

        if (idCurrTable == "table-view"){
            const popup       = $$("contextActionsPopup");
            
            if (popup){
                popup.destructor();
            }

            Action.removeItem($$("contextActionsBtnAdaptive"));
            Action.removeItem($$("customInputs"             ));
            Action.removeItem($$("customInputsMain"         ));

        
        }
    } catch (err){  
        setFunctionError(err, logNameFile, "preparationTable");
    }
}

async function loadFields(){
    await LoadServerData.content("fields");
    return GetFields.keys;
}

async function generateTable (showExists){ 
 
    let keys;
    
    if (!showExists){
        keys = await loadFields();
    } 
    
    if (!keys && showExists){ // if tab is clicked but dont have fields
        keys = await loadFields();
    }
 
    if (keys){
        const columnsData = createTableCols (idsParam, idCurrTable);
  
        createDetailAction  (columnsData, idsParam, idCurrTable);

        createDynamicElems  (idCurrTable, idsParam);

        createTableRows     (idCurrTable, idsParam);
  
        setTableName        (idCurrTable, idsParam);

    }
   
} 


function createTable (id, ids, showExists) {
 
    idCurrTable = id;
    idsParam    = ids;

    getValsTable ();
   
    if (titem == undefined) {
        setLogValue("error","Данные не найдены");
    } else {
        preparationTable ();
        generateTable (showExists);
    } 

 

}

export{
    createTable
};