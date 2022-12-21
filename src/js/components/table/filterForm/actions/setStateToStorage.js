import { getItemId }  from "../../../../blocks/commonFunctions.js";
import { mediator }   from "../../../../blocks/_mediator.js";
import { Filter }     from "./_FilterActions.js";

function setTabInfo(id, sentVals){
    const tabData =  mediator.tabs.getInfo();
 
    if (tabData){
        if (!tabData.temp){
            tabData.temp = {};
        }
        tabData.temp.filter = sentVals;
    }
}

function setState () {
    const result   = Filter.getFilter();
    const template = Filter.getActiveTemplate();
    const id       = getItemId();
 
    const sentObj  = {
        id             : id,
        activeTemplate : template,
        values         : result
    };

    setTabInfo(id, sentObj);

    webix.storage.local.put(
        "currFilterState", 
        sentObj
    );
    
}


export {
    setState
};