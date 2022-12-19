import { Action, getTable }     from "../../../../blocks/commonFunctions.js";
import { Filter }               from "./_FilterActions.js";
 
function hideElements(arr){
    arr.forEach(function(el){
        if ( !el.includes("_filter-child-") ){

            const colId      = $$(el).config.columnName;
            const segmentBtn = $$(el + "_segmentBtn");

            Filter.setFieldState(0, colId, el);
            segmentBtn.setValue (1);
            Action.hideItem     (segmentBtn);
        }   
    });
}

function clearTableFilter(){
    const table = getTable();
    table.config.filter = null;
}

function clearSpace(){

    clearTableFilter();

    const values = Filter.getAllChilds ();
 
    values.forEach(function(el){
    
        if (el.length){
            hideElements(el);
        }
    });

    Action.disableItem($$("btnFilterSubmit"));
}

export {
    clearSpace
};