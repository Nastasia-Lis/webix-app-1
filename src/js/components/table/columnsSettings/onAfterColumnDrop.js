import { postPrefsValues } from "./userprefsPost.js";

 
function createValues(table){
    const cols = table.getColumns();
    const values = [];

    cols.forEach(function(col, i){
        values.push({
            column   : col.id, 
            position : i,
            width    : Number(col.width)
        });
    });

 
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