import { GetFields }                        from "../../../../blocks/globalStorage.js";
import { autorefresh }                      from './autorefresh.js';
import { loadTableData }                    from './loadRows.js';

let idCurrTable;
let offsetParam;
let itemTreeId;
let idFindElem;


function getItemData (table){

    const tableElem = $$(table);

    const reccount  = tableElem.config.reccount;

    if (reccount){
        const remainder = reccount - offsetParam;

        if (remainder > 0){
            loadTableData(table, idCurrTable, itemTreeId, offsetParam  ); 
        }

    } else {
        loadTableData(table, idCurrTable, itemTreeId, offsetParam ); 
    }

   
}

function setDataRows (type){
    if(type == "dbtable"){
        getItemData ("table");
    } else if (type == "tform"){
        getItemData ("table-view");
    }
}


function createTableRows (id, idsParam, offset = 0){

    const data  = GetFields.item(idsParam);

    idCurrTable = id;
    offsetParam = offset;      
    itemTreeId  = idsParam;
    idFindElem  = idCurrTable + "-findElements";

    setDataRows         (data.type);
    autorefresh         (data);
          
}

export {
    createTableRows,
    getItemData
};