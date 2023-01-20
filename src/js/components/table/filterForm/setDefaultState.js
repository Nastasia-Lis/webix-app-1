 
///////////////////////////////

// Дефолтное состояние фильтра 

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Action, getTable } from "../../../blocks/commonFunctions.js";
import { Filter }           from "./actions/_FilterActions.js";


function setToolbarBtnState(){
    const node = $$("table-filterId").getNode();

    Filter.addClass   (node, "webix-transparent-btn");
    Filter.removeClass(node, "webix-transparent-btn--primary");
}

function resetTableFilter(){
    const table = getTable();

    if (table){
        table.config.filter = null;
    }

}


function filterFormDefState(){
    const filterContainer = $$("filterTableBarContainer");
    const inputs          = $$("inputsFilter");

    resetTableFilter();

    Filter.clearAll();
    Filter.showApplyNotify(false);

    if (filterContainer && filterContainer.isVisible()){
        Action.hideItem  (filterContainer);
    }

    Action.disableItem($$("btnFilterSubmit"));
    Action.disableItem($$("filterLibrarySaveBtn"));
    Action.disableItem($$("resetFilterBtn"));

    Action.removeItem(inputs);

    Action.showItem($$("filterEmptyTempalte"));
    
    setToolbarBtnState();
}

export {
    filterFormDefState
};