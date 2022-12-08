 
import { createWorkspace }   from "../filterForm/userTemplate.js";
import { Action }            from "../../../blocks/commonFunctions.js";


function isDataExists(data){
    if (data && data.values.values.length){
        return true;
    }
}

function isFormFill(){
    const formValues = $$("filterTableForm").getValues();
    const values = Object.values(formValues);

    let check = true;

    values.forEach(function(val){
        if (!val && check){
            check = false;
        }
    });

    return check;
}

function returnLostFilter(id){
    const url       = window.location.search;
    const params    = new URLSearchParams(url);
    const viewParam = params.get("view"); 

  

    if (viewParam && viewParam == "filter"){
        const data = webix.storage.local.get("currFilterState");
     
 
        if (isDataExists(data) && id == data.id){
            Action.hideItem($$("table-editForm"));

            $$("table-filterId").callEvent("clickEvent", [ "" ]);
            createWorkspace(data.values.values);

            if (isFormFill()){
                Action.enableItem($$("btnFilterSubmit"));
            }
       
        }

    }



}

export {
    returnLostFilter
};