import { Action }                     from "../../../blocks/commonFunctions.js";
import { setFunctionError }           from "../../../blocks/errors.js";

const logNameFile = "table => filterForm => setDefaultState";


function filterFormDefState(){
    const filterContainer = $$("filterTableBarContainer");
    const inputs          = $$("inputsFilter");

    try{
        if (filterContainer && filterContainer.isVisible()){
            Action.hideItem  (filterContainer);
        }

       Action.disableItem($$("btnFilterSubmit"));
       Action.disableItem($$("filterLibrarySaveBtn"));
       Action.disableItem($$("resetFilterBtn"));

        Action.removeItem(inputs);

        Action.showItem($$("filterEmptyTempalte"));
    } catch (err){
        setFunctionError(
            err, 
            logNameFile, 
            "setFilterDefaultState"
        );
    }
}

export {
    filterFormDefState
};