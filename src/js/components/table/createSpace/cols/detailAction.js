
///////////////////////////////

// Создание динамических колонок с действиями

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { GetFields }        from "../../../../blocks/globalStorage.js";
import { isArray }         from "../../../../blocks/commonFunctions.js";

function createDetailAction (columnsData, idsParam, idCurrTable){
    let idCol;
    let actionKey;
    let checkAction     = false;

    const data          = GetFields.item(idsParam);
    const table         = $$(idCurrTable);
    if (isArray(columnsData, "table/createSpace/cols/detailAction", "createDetailAction")){
        columnsData.forEach(function(field, i){
            if( field.type  == "action" && data.actions[field.id].rtype == "detail"){
                checkAction = true;
                idCol       = i;
                actionKey   = field.id;
            } 
        });
    }

    
    if (actionKey !== undefined){
        const urlFieldAction = data.actions[actionKey].url;
    
        if (checkAction){
            const columns = table.config.columns;
            columns.splice(0, 0, { 
                id      : "action-first" + idCol, 
                maxWidth: 130, 
                src     : urlFieldAction, 
                css     : "action-column",
                label   : "Подробнее",
                header  : "Подробнее", 
                template: "<span class='webix_icon wxi-angle-down'></span> "
            });

            table.refreshColumns();
        }
    }


}

export {
    createDetailAction
};