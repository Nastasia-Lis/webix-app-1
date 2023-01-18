import { postPrefsValues }  from "./userprefsPost.js";
import { setFunctionError } from "../../../blocks/errors.js";

function setColsWidthStorage(table){
    table.attachEvent("onColumnResize",function(id, newWidth, oldWidth, action){
        if (action){
           
            const cols   = table.getColumns();
            const values = [];

            if (cols.length){
                cols.forEach(function(el){

                    values.push({
                        column  : el.id, 
                        position: table.getColumnIndex(el.id),
                        width   : el.width.toFixed(2)
                    });
                });
                postPrefsValues(values);
            } else {
                setFunctionError(
                    "array length is null", 
                    "table/columnsSettings/columnsWidtn", 
                    "visibleColsSubmitClick"
                ); 
            }
         
        }
    });     
}

export {
    setColsWidthStorage
};