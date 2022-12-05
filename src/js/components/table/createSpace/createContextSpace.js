import { getTable }         from "../../../blocks/commonFunctions.js";
import { mediator }         from "../../../blocks/_mediator.js";

function getLinkParams(param){
    const href   = window.location.search;
    const params = new URLSearchParams (href);
    return params.get(param);
}

function selectContextId(){
    const idParam = getLinkParams("id");
    const table   = getTable();
    
    if (table && table.exists(idParam)){
        table.select(idParam);
    } else {
        mediator.linkParam(false, "id");
    }
 
}


export {
    selectContextId
};