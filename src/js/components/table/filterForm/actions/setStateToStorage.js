import { getItemId }  from "../../../../blocks/commonFunctions.js";
import { Filter }     from "./_FilterActions.js";

function setState () {
    const result = Filter.getFilter();
    const sentObj = {
        id    :getItemId(),
        values:result
    };
    webix.storage.local.put("currFilterState", sentObj);
    
}


export {
    setState
};