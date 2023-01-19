 
///////////////////////////////

// Возвращение утерянного состояния сортировки после перезагрузки

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { getTable }  from "../../../blocks/commonFunctions.js";

function returnSortData(){
    const values = webix.storage.local.get("tableSortData");

    if (values){
        const table = getTable();
        table.config.sort = {
            idCol : values.idCol,
            type  : values.type
        };

    }
}

export {
    returnSortData
};