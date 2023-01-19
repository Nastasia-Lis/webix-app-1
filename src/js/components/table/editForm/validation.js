import { setFunctionError }     from "../../../blocks/errors.js";
import { setLogValue }          from "../../logBlock.js";

const logNameFile = "tableEditForm => validation";

function validateProfForm (){

    const errors = {};
    const messageErrors = [];
    const property      = $$("editTableFormProperty");
    
    function checkConditions (){ 
       
        const values = property.getValues();
        if (values){
            const propVals = Object.keys(values);

            if (propVals.length){
                propVals.forEach(function(el){
    
    
                    const propElement = property.getItem(el);
                    const values      = property.getValues();
        
                    let propValue  = values[el];
                    errors[el] = {};
        
                    function numberField(){
                        
                        function containsText(str) {
                            return /\D/.test(str);
                        }
        
               
                        if (propElement.customType              &&
                            propElement.customType == "integer" ){
        
                            const check =  containsText(propValue) ;
        
                            if ( check ){
                                errors[el].isNum = "Данное поле должно содержать только числа";
                            } else {
                                errors[el].isNum = null;
                            }
                               
                        }
                    }
        
                    function dateField(){
        
                        function getAllIndexes(arr, val) {
                            let indexes = [], i;
                            for(i = 0; i < arr.length; i++){
                                if (arr[i] === val){
                                    indexes.push(i);
                                }
                            }
                                 
                            return indexes;
                        }
        
                        function isTrueLength(arr){
                            if (arr.length === 2){
                                return true;
                            }
                        }
        
                        function isTrueIndexes(arr, first, second){
                            if (arr[0] == first && arr[1] == second){
                                return true;
                            }
                        }
        
                        function checkArr(arr, firstIndex, secondIndex){
                            if (isTrueLength(arr) && 
                                isTrueIndexes(arr, firstIndex, secondIndex )){
                                    return true;
                            }
                        }
         
                        function findDividers(arr){
                            if (arr.length === 17) {
                                const dateDividers = getAllIndexes(arr, ".");
                                const timeDividers = getAllIndexes(arr, ":");
        
                                const dateResult = checkArr(dateDividers, 2,  5 );
                                const timeResult = checkArr(timeDividers, 11, 14);
        
                                if (dateResult && timeResult){
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        }
                 
                        if (propElement.type                 &&
                            propElement.type == "customDate" &&
                            propValue                        ){
                         
                            const dateArray = propValue.split('');
                            
                            let check      = findDividers(dateArray);
                            let countEmpty = 0;
                                 
                            const x = propValue.replace(/\D/g, '')
                            .match(/(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})/);
                
                            for (let i = 1; i < 7; i++) {
        
                                if (x[i].length == 0){
                                    countEmpty++;
                                }
        
                                if (x[i].length !== 2){
                                 
                                    if (!check){
                                        check = true;
                                    }
                                }
                            }
        
        
                            if ( countEmpty == 6 ){
                                errors[el].date = null;
        
                            } else {
        
                                if( (x[1] > 31 || x[1] < 1) ||
                                    (x[2] > 12 || x[2] < 1) ||
        
                                    x[4] > 23 ||
                                    x[5] > 59 ||
                                    x[6] > 59 ){
                                        check = true;
                                    }
              
                                if ( check ) {
                                    errors[el].date = 
                                    "Неверный формат даты. Введите дату в формате xx.xx.xx xx:xx:xx";
            
                                } else {
                                    errors[el].date = null;
                                }
                            }
                               
                        }
               
                    }
        
                    function valLength(){ 
                        try{
                       
                            if(propValue){
                                
                                if (propValue.length > propElement.length && propElement.length !== 0){
                                    errors[el].length = "Длина строки не должна превышать " + propElement.length + " симв.";
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
                            if ( propElement.notnull == false && propValue.length == 0 ){
                                errors[el].notnull = "Поле не может быть пустым";
                            } else {
                                errors[el].notnull = null;
                            }
                        } catch (err){
                            setFunctionError(err, logNameFile, "valNotNull");
                        }
                    }
        
                    function valUnique (){
                        
                        errors[el].unique = null;

                        const pull = $$("table").data.pull;
                                        
                        if (propElement.unique == true && pull){
    
                            const tableRows   = Object.values(pull);
    
                            if (tableRows.length){
                                tableRows.forEach(function(row){
                                    let tableValue = row[el];
        
                                    function numToString(element){
                                        if (element && typeof element === "number"){
                                            return element.toString();
                                        } else {
                                            return element;
                                        }
                                    }
        
                                    tableValue = numToString(tableValue);
                                    propValue  = numToString(propValue);
                            
                                    if (tableValue && typeof tableValue == "number"){
                                        tableValue = tableValue.toString();
                                    }
        
                                    if (propValue && tableValue){
                                        const isIdenticValues = propValue.localeCompare(tableValue) == 0;
                                        const tableElemId     = row.id;
                                        const propElemId      = values.id;
        
                                        if (isIdenticValues && propElemId !== tableElemId){
                                            errors[el].unique = "Поле должно быть уникальным";
            
                                        } 
                                        
                                    }
                                });
                            } else {
                                setFunctionError("array is null", logNameFile, "valUnique");
                            }
                          
                        }
                    
                         
                    }
                   
                    dateField   ();
                    numberField ();
                    valLength   ();
                    valNotNull  ();
                    valUnique   ();
                });
            } else {
                setFunctionError("array length is null", logNameFile, "checkConditions");
            }
          
        }
        
    }

    function createErrorMessage (){
     
        function findErrors (){
         
            if (errors){
                const values = Object.values(errors);
                if (values && values.length){
                    values.forEach(function(col, i){

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
                } else {
                    setFunctionError("array length is null", logNameFile, "findErrors");
                }
            
            }
           
        }

        findErrors ();
        
    }
    try{
        checkConditions ();
        createErrorMessage ();
    } catch (err){
        setFunctionError(err, logNameFile, "validateProfForm");
    }

  
    if (messageErrors && messageErrors.length){
     
        messageErrors.forEach(function(prop){
            const item =  property.getItem(prop.nameCol);
            item.css = "propery-error";
            property.refresh();

        });

       
    } 
    return messageErrors;
}

function setLogError (){
    try{
        const table = $$("table");
        validateProfForm ().forEach(function(el){

            let nameEl;

            const cols = table.getColumns(true);
            if (cols && cols.length){
                table.getColumns(true).forEach(function(col){
             
                    if (col.id == el.nameCol){
                        nameEl = col.label;
                    }
                });
    
                setLogValue("error", el.textError + " (Поле: " + nameEl + ")");
            } else {
                setFunctionError("array is null", logNameFile, "setLogError");
            }

   
        });

    } catch (err){
        setFunctionError(err, logNameFile, "setLogError");
    }
}


function uniqueData (itemData){
    const validateData = {};
    if (itemData) {
        const table      = $$("table");
        const dataValues = Object.values(itemData);

        if (dataValues.length){
            dataValues.forEach(function(el, i){

                const oldValues    = table.getItem(itemData.id);
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
        } else {
            setFunctionError("array is null", logNameFile, "uniqueData");
        }
     
    } 
    
 
      
     

    return validateData;
}


export {
    validateProfForm,
    setLogError,
    uniqueData
};
