import { getTable, isArray }    from '../../../../blocks/commonFunctions.js';
import { returnDefaultValue }   from '../../defaultValues.js';

const logNameFile = "table/createSpace/rows/setDefaultValues";

function isExists(value){
    if (value){
        return value.toString().length;
    }

}


function returnValue(fieldValue){
    const table = getTable();
    const cols  = table.getColumns(true);
    
    if (isArray(cols, logNameFile, "returnValue")){
        cols.forEach(function(el){
            const defValue =  returnDefaultValue(el);
        
            const value = fieldValue[el.id];

            if (isExists(defValue) && !value){
                fieldValue[el.id] = returnDefaultValue(el);
            }

        });
    }
  
}

function setDefaultValues (data){

    if (isArray(data, logNameFile, "setDefaultValues")){
        data.forEach(function(el){
            returnValue(el);
        });
    }
   

}

export {
    setDefaultValues
};