import { getTable }             from '../../../../blocks/commonFunctions.js';
import { returnDefaultValue }   from '../../defaultValues.js';


function isExists(value){
    if (value){
        return value.toString().length;
    }

}


function returnValue(fieldValue){
    const table = getTable();
    const cols  = table.getColumns(true);
    
   
    cols.forEach(function(el){
        const defValue =  returnDefaultValue(el);
       
        const value = fieldValue[el.id];

        if (isExists(defValue) && !value){
            fieldValue[el.id] = returnDefaultValue(el);
        }

    });
}

function setDefaultValues (data){

    data.forEach(function(el){
        returnValue(el);
    });

}

export {
    setDefaultValues
};