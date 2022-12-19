import { setLogValue }                      from '../../logBlock.js';
import { LoadServerData, GetFields }        from "../../../blocks/globalStorage.js";
import { mediator }                         from "../../../blocks/_mediator.js";


import { setFunctionError }                 from "../../../blocks/errors.js";
import { createTableRows }                  from './rows/createRows.js';
import { createTableCols }                  from './cols/createCols.js';
import { createDetailAction }               from './cols/detailAction.js';
import { createDynamicElems }               from './cols/dynamicElements/createElements.js';
import { Action }                           from '../../../blocks/commonFunctions.js';

const logNameFile = "getContent => getInfoTable";

let titem;
let idsParam;
let idCurrTable;

function setTableName(idCurrTable, idsParam) {
  
    try{
        const names = GetFields.names;

        if (names){

            names.forEach(function(el){
                if (el.id == idsParam){  
                    const template  = $$(idCurrTable + "-templateHeadline");
                    const value     = el.name.toString();
                    template.setValues(value);
                }
            });
        }
       // $$("tree").callEvent("onBeforeOpen", [ "","auth_group" ]);

        
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


function setTabInfo(data){
    const info = mediator.tabs.getInfo();
    if (info && info.tree){
        info.tree.data = data;
    }

    mediator.tabs.setInfo(info);
 
}


async function generateTable (showExists){ 
 
    if (!showExists){
        await LoadServerData.content("fields");
    }

    setTabInfo(GetFields.item(idsParam));

    const keys = GetFields.keys;

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