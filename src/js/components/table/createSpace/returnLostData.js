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

function isFilterParamExists(){
    const param = getLinkParams("view");
    if (param == "filter"){
        return true;
    }
}

function isEditParamExists(){
    const param = getLinkParams("view");
    if (param == "edit"){
        return true;
    }
}


function returnLostData(){
  
    if (isEditParamExists()){
        $$("table-editTableBtnId").callEvent("clickEvent", [ "" ]);
    }
  
    if (!isFilterParamExists()){

        const data = webix.storage.local.get("editFormTempData");

        if (data){
            prop          = $$("editTableFormProperty");
            form          = $$("table-editForm");
            const table   = $$("table");
            const tableId = table.config.idTable;

            const values  = data.values;
            const field   = data.table;
            const status  = data.status;

            if (tableId == field ){
                Action.hideItem($$("filterTableForm"));

               
        
                if (status === "put"){
                    const id = values.id;
                    if (table.exists(id)     &&
                        isThisIdSelected(id) )
                    {

                        table.select(id);
                        setVals(values);
                            
                    }
                
                } else if (status === "post"){
                    Action.showItem(form);
                    mediator.tables.editForm.postState();
                    setVals(values);
                }
            }
        }
    }
}

export {
    returnLostData
};