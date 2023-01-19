
///////////////////////////////

// Переход в таблицу после action дашборда с фильтром

// Copyright (c) 2022 CA Expert

///////////////////////////////


import { Filter }                        from "../filterForm/actions/_FilterActions.js";
import { createChildFields }             from "../filterForm/createElements/childFilter.js";
import { getTable, Action, isArray }     from "../../../blocks/commonFunctions.js";
import { setFunctionError }               from "../../../blocks/errors.js";
let conditions;

const logNameFile = "tables/createSpace/returnDashboardFilter";

function returnInputId(id){
    const index = id.lastIndexOf(".");
    return id.slice(index + 1);
}

function setOperation(id, value){
    if (value){
        const operationBtn = $$(id + "-btnFilterOperations");
        operationBtn.setValue(value);  
    }
   
}

function setSegmentBtn(id, value){
    if (value && value == "or"){
        const segmentBtn = $$(id + "_segmentBtn");
        const orId       = 2;
        segmentBtn.setValue(orId);  
    }
}

function setInputValue(id, value){
    if (value){
        const trueValue = value.replace(/['"]+/g, '');
        $$(id).setValue(trueValue);
    }
  
}

function setBtnsValue(id, array){
    setOperation (id, array[2]); // array[2] - operation
    setInputValue(id, array[3]); // array[2] - value
    setSegmentBtn(id, array[4]); // array[4] - and/or
}


function checkCondition(array){
    const id = returnInputId(array[1]); //[1] - id

    let inputId       = id + "_filter"; 
    const parentInput = $$(inputId);


    if (!parentInput.isVisible()){
        Filter.setFieldState(1, id);

    } else {
        const table = getTable();
        const col   = table.getColumnConfig(id);
        inputId     = createChildFields(col);

    }

    setBtnsValue(inputId, array);

}
   
// array[1] - id
// array[2] - operation   -- setValue
// array[3] - value  
// array[4] - and/or
function returInputsId(ids){
    const result = [];
    if (isArray(ids, logNameFile, "returInputsId")){
        ids.forEach(function(el, i){
            const index = el.lastIndexOf(".") + 1;
            result.push(el.slice(index));
        });
    }
  
    
    
    return result;
}


function iterateConditions(){
    const ids = [];
    if (isArray(conditions, logNameFile, "iterateConditions")){
        conditions.forEach(function(el){
            const arr = el.split(' ');
            checkCondition(arr);
            ids.push(arr[1]);
         
        });
        
        const inputsId = returInputsId(ids);
        Filter.hideInputsContainers(inputsId);
    }

}


function returnConditions(filter){
    const array = filter.split(' ');

    const conditions = [];
    let r            = "";
    let counter      = 0;

    if (isArray(array, logNameFile, "returnConditions")){
        array.forEach(function(el, i){
            const length = array.length;
    
            if (length - 1 === i){
                r += " " + el;
                counter ++;
            }
    
            if (counter >= 4 || length - 1 === i){
                conditions.push(r);
                r       = "";
                counter = 0;
            }
    
            if (counter < 4){
                r += " " + el;
                counter ++;
            }
    
            
        });
    }
  
   

    return conditions;
}

function inputIsVisible(inputs, el){
    return inputs.find(
        element => element == el
    );
} 

function lastItem(result){
    return Math.max.apply(Math, result);
}

function returnCurrIndexes(indexes){
    const result = [];
    if (isArray(indexes, logNameFile, "returnCurrIndexes")){
        const inputs  = Filter.getItems();

        const keys = Object.keys(indexes);
        if (keys.length){
            keys.forEach(function(el){
    
                if (inputIsVisible(inputs, el)){
                    result.push(indexes[el]);
                }
              
            });
        } else {
            setFunctionError(
                `array length is null`, 
                logNameFile, 
                "returnCurrIndexes"
            ); 
        }
       
    
    }
 
    return result;

}


function findLastCollection(indexes, item){
    let lastItemId;

    Object.values(indexes).find(function(el, i){

        if(el == item) {

            lastItemId = Object.keys(indexes)[i]
        }
    });

    return lastItemId;
}

function findLastId(lastItemId){
    const collection = Filter.getItem (lastItemId);

    const index  = collection.length - 1;
    return collection[index];
}

function hideLastSegmentBtn(){
    const indexes     = Filter.getIndexFilters();

    const currIndexes = returnCurrIndexes (indexes);

    const item        = lastItem          (currIndexes);
    const lastItemId  = findLastCollection(indexes, item);
    const lastId      = findLastId        (lastItemId);

    Action.hideItem($$(lastId + "_segmentBtn"));

}

function returnDashboardFilter(filter){
    Filter.clearFilter();
    Filter.clearAll();

    conditions = returnConditions(filter);
    iterateConditions();
    hideLastSegmentBtn();

    Action.enableItem($$("btnFilterSubmit"));

    Filter.setStateToStorage();
}

export {
    returnDashboardFilter
};