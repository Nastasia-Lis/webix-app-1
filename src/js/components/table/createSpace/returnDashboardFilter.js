

import { Filter }               from "../filterForm/actions/_FilterActions.js";
import { createChildFields }    from "../filterForm/createElements/childFilter.js";
import { getTable, Action }     from "../../../blocks/commonFunctions.js";

let conditions;

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


function iterateConditions(){
    conditions.forEach(function(el, i){
        const arr = el.split(' ');
        checkCondition(arr);
    });

}


function returnConditions(filter){
    const array = filter.split(' ');

    const conditions = [];
    let r            = "";
    let counter      = 0;

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
 
    const inputs  = Filter.getItems();
    const result = [];
    Object.keys(indexes).forEach(function(el){

        if (inputIsVisible(inputs, el)){
            result.push(indexes[el]);
        }
      
    });

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