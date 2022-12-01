import { setLogValue }  from "../../logBlock.js";
import { mediator }     from "../../../blocks/_mediator.js";
import { Action }       from "../../../blocks/commonFunctions.js";

let prop;
let form;

function getLinkParams(param){
    const href   = window.location.search;
    const params = new URLSearchParams (href);
    return params.get(param);
}

function isThisIdSelected(id){
    const selectedId = getLinkParams("id");
    if (id == selectedId){
        return true;
    }
    return false;
}

function setVals(values){
    prop.setValues(values);
    form.setDirty(true);

    setLogValue(
        "success", 
        "Данные редактора восстановлены"
    );
}

function returnLostData(){
    prop          = $$("editTableFormProperty");
    form          = $$("table-editForm");

    const data    = webix.storage.local.get("editFormTempData");

    const table   = $$("table");
    const tableId = table.config.idTable;

    const values  = data.values;
    const field   = data.table;
 
    if (data.status === "put"){
        const id = values.id;
        if (table.exists(id)     &&
            isThisIdSelected(id) &&
            tableId == field     )
        {

            table.select(id);
            setVals(values);
                
        }
     
    } else if (data.status === "post" && tableId == field){
        Action.showItem(form);
        mediator.tables.editForm.postState();
        setVals(values);
    }
}

export {
    returnLostData
};