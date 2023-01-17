
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

function setDataToTab(currState){
   const data = mediator.tabs.getInfo();

    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(!data.temp.edit){
            data.temp.edit = {};
        }
       
        data.temp.edit.values = currState;

        if (currState.status == "put"){
         
           data.temp.edit.selected = currState.values.id;
        }

        mediator.tabs.setInfo(data);
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

                setDataToTab(data);
        
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



    mediator.tabs.setDirtyParam();

    const tabInfo = mediator.tabs.getInfo();

  
    if (tabInfo.isClose){ // tab в процессе удаления
        mediator.getGlobalModalBox().then(function(result){

            if (result){
                const tabbar = $$("globalTabbar");
                const id     = tabbar.getValue();
                tabbar.removeOption(id);
            }

        });
    }

     
}

export {
    returnLostData
};