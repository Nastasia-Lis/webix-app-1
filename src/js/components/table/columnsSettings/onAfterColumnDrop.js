///////////////////////////////

// Перемещение колонок 

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { postPrefsValues }  from "./userprefsPost.js";
import { setFunctionError } from "../../../blocks/errors.js";
 
function createValues(table){
    const cols = table.getColumns();
    const values = [];

    if (cols.length){
        cols.forEach(function(col, i){
            values.push({
                column   : col.id, 
                position : i,
                width    : Number(col.width)
            });
        });
    } else {
        setFunctionError(
            "array length is null", 
            "table/columnsSettings/onAfterColumnDrop", 
            "visibleColsSubmitClick"
        ); 
    }

    return values;
}

function dropColsSettings(table){
 
    table.attachEvent("onAfterColumnDrop", function(){
        const values = createValues(table);
        postPrefsValues(values, false, false);
       
    });
}

export{
    dropColsSettings
};