import {setFunctionError} from "../errors.js";
import {setLogValue} from "../logBlock.js";

const logNameFile = "tableEditForm => validation";

function validateProfForm (){

    const errors = {};
    const messageErrors = [];

    
    function checkConditions (){ 
        const property = $$("editTableFormProperty");
        const propVals = Object.keys(property.getValues());

        propVals.forEach(function(el,i){

            const propElement = property.getItem(el);
            const values      = property.getValues();
            
            errors[el] = {};

            function numberField(){
                
                function containsText(str) {
                    return /\D/.test(str);
                }

                if (propElement.customType              &&
                    propElement.customType == "integer" ){

                    const check =  containsText(values[el]) ;

                    if ( check ){
                        errors[el].isNum = "Данное поле должно содержать только числа";
                    } else {
                        errors[el].isNum = null;
                    }
                       
                }
            }

            function valLength(){ 
                try{
               
                    if(values[el]){
                        
                        if (values[el].length > propElement.length && propElement.length !==0){
                            errors[el].length = "Длина строки не должна превышать "+propElement.length+" симв.";
                        } else {
                            errors[el].length = null;
                        }
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"valLength");
                }
            }

            function valNotNull (){
                try{
                    if ( propElement.notnull == true && values[el].length == 0 ){
                        errors[el].notnull = "Поле не может быть пустым";
                    } else {
                        errors[el].notnull = null;
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"valNotNull");
                }
            }

            function valUnique (){
                try{
                    errors[el].unique = null;
                    if (propElement.unique == true){
                        const tableRows   = Object.values($$("table").data.pull);
                        const tableSelect = $$("table").getSelectedId().id;

                        tableRows.forEach(function(row,i){
                            if (values[el].localeCompare(row[el]) == 0 && row.id !== tableSelect){
                                errors[el].unique = "Поле должно быть уникальным";
                            }
                        });
                    }
                } catch (err){
                    setFunctionError(err,logNameFile,"valUnique");
                }
            }
           

            numberField();
            valLength ();
            valNotNull ();
            valUnique ();
            console.log(errors)
        });
    }

    function createErrorMessage (){
     
        function findErrors (){
            Object.values(errors).forEach(function(col,i){

                function createMessage (){
                    Object.values(col).forEach(function(error,e){
                        if (error !== null){
                            let nameCol = Object.keys(errors)[i];
                            let textError = error;
                            let typeError = Object.keys(col)[e];
                            messageErrors.push({nameCol,typeError,textError})
                        }
                        
                    });
                    return messageErrors;
                }

                createMessage ();
        
            });
        }

        findErrors ();
        
    }
    try{
        checkConditions ();
        createErrorMessage ();
    } catch (err){
        setFunctionError(err,logNameFile,"validateProfForm");
    }
    return messageErrors;
}

function setLogError (){
    try{
        const table = $$("table");
        validateProfForm ().forEach(function(el,i){

            let nameEl;

            table.getColumns().forEach(function(col,i){
                if (col.id == el.nameCol){
                    nameEl = col.label;
                }
            });

            setLogValue("error",el.textError+" (Поле: "+nameEl+")");
        });

    } catch (err){
        setFunctionError(err,logNameFile,"setLogError");
    }
}


function uniqueData (itemData){
    const validateData = {};
    try{
        const table = $$("table");

        Object.values(itemData).forEach(function(el,i){

            const oldValues    = table.getItem(itemData.id)
            const oldValueKeys = Object.keys(oldValues);

            function compareVals (){
                const newValKey = Object.keys(itemData)[i];
                
                oldValueKeys.forEach(function(oldValKey){
                    
                    if (oldValKey == newValKey){
                        
                        if (oldValues   [oldValKey] !== Object.values(itemData)[i]){
                            validateData[newValKey]  =  Object.values(itemData)[i];
                        } 
                        
                    }
                }); 
            }
            compareVals ();
        });
    } catch (err){
        setFunctionError(err,logNameFile,"uniqueData");
    }

    console.log(validateData,"validateData")
    return validateData;
}


export {
    validateProfForm,
    setLogError,
    uniqueData
};
