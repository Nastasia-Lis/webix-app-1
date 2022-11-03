import { postPrefsValues }                  from "./common.js";

function setColsWidthStorage(table){
    table.attachEvent("onColumnResize",function(id,newWidth, oldWidth, action){
        if (action){
           
            const cols   = table.getColumns();
            const values = [];

            cols.forEach(function(el,i){

                values.push({
                    column  : el.id, 
                    position: table.getColumnIndex(el.id),
                    width   : el.width.toFixed(2)
                });
            });
            postPrefsValues(values);
        }
    });     
}

export {
    setColsWidthStorage
};