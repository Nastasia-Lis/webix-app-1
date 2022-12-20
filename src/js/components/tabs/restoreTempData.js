
import { returnLostFilter }         from "../table/createSpace/returnLostFilter.js";

///внести return fitler & edit в медиатор


function restoreTempData(tempConfig, field){

    const filter = tempConfig.filter;
    const edit   = tempConfig.edit;

    console.log(field)
    if (filter){
        webix.storage.local.put("currFilterState", filter);
        returnLostFilter(field);
    }
      
    if (edit){
        webix.storage.local.put("editFormTempData", edit);
    }


   
}

export {
    restoreTempData
};