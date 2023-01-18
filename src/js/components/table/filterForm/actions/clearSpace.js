import { Action }     from "../../../../blocks/commonFunctions.js";
import { Filter }     from "./_FilterActions.js";
 

function hideElements(arr){
    if (arr && arr.length){
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

}


function clearSpace(){

    const values = Filter.getAllChilds ();
 
    if (values && values.length){
        values.forEach(function(el){
    
            if (el.length){
                hideElements(el);
            }
        });
    
        Action.disableItem($$("btnFilterSubmit"));
    }

}

export {
    clearSpace
};