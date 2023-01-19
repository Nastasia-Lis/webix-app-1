 
///////////////////////////////

// Возвращение утерянного состояния фильтров после перезагрузки

// Copyright (c) 2022 CA Expert

///////////////////////////////



import { createWorkspace }   from "../filterForm/userTemplate.js";
import { Action }            from "../../../blocks/commonFunctions.js";
import { Filter }            from "../filterForm/actions/_FilterActions.js";

function isDataExists(data){
    
    if (data && data.values.values.length){
        return true;
    }
}


function hideHtmlContainers(){
    const container = $$("inputsFilter").getChildViews();

    if (container && container.length){
        container.forEach(function(el){

            const node = el.getNode();
    
            const isShowContainer = node.classList.contains("webix_show-content");
            if (!isShowContainer){
                Filter.addClass(node, "webix_hide-content");
            }
           
        });
    } else {
        setFunctionError(
            `array length is null`, 
            "table/createSpace/returnLostFilter", 
            "hideHtmlContainers"
        ); 
    }
 

}

function returnLostFilter(id){
    const url       = window.location.search;
    const params    = new URLSearchParams(url);
    const viewParam = params.get("view"); 

    if (viewParam == "filter"){
      
        const data = webix.storage.local.get("currFilterState");

        Action.hideItem($$("table-editForm"));

        $$("table-filterId").callEvent("clickEvent", [ "" ]);
   
        if (data){
      
            const activeTemplate = data.activeTemplate;
            Filter.setActiveTemplate(activeTemplate); // option in popup library
        
           
            if (isDataExists(data) && id == data.id){
 
                createWorkspace(data.values.values);
         
                hideHtmlContainers();

                Filter.enableSubmitButton();
        
            }
       
            if (activeTemplate){
                Action.hideItem($$("templateInfo"));
            }

            Filter.setStateToStorage();
 
        }
    }



}

export {
    returnLostFilter
};