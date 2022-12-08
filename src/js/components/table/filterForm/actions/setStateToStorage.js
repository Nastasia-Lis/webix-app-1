import { getItemId }  from "../../../../blocks/commonFunctions.js";
import { Filter }     from "./_FilterActions.js";

function setState () {
    const result   = Filter.getFilter();
    const template = Filter.getActiveTemplate();
    
    const sentObj  = {
        id             : getItemId(),
        activeTemplate : template,
        values         : result
    };

    webix.storage.local.put(
        "currFilterState", 
        sentObj
    );
    
}


export {
    setState
};