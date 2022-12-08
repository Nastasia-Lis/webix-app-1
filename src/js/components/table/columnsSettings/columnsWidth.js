import { postPrefsValues }  from "./userprefsPost.js";

function setColsWidthStorage(table){
    table.attachEvent("onColumnResize",function(id, newWidth, oldWidth, action){
        if (action){
           
            const cols   = table.getColumns();
            const values = [];

            cols.forEach(function(el){

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