import { Action }           from "../../../blocks/commonFunctions.js";
import { Filter }           from "./actions/_FilterActions.js";

function filterFormDefState(){
    const filterContainer = $$("filterTableBarContainer");
    const inputs          = $$("inputsFilter");

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
 
}

export {
    filterFormDefState
};