import { getTable }       from '../../blocks/commonFunctions.js'; 


function restoreTempData(tempConfig, field){
 
    const filter = tempConfig.filter;
    const edit   = tempConfig.edit;
 
    if (filter){
     
        if (filter.dashboards){
            const data = {
                content : filter.values
            };
            
            webix.storage.local.put("dashFilterState", data);
        } else {
       
            if (tempConfig.queryFilter){
          
                const table = getTable();
                if (table){
                    table.config.filter = {
                        table : filter.id,
                        query : tempConfig.queryFilter
                    };
                  
                }

             
            }
            webix.storage.local.put("currFilterState", filter);
        }
   
        window.history.pushState('', '', "?view=filter");
  
    } 
 
    if (edit){
      
        webix.storage.local.put("editFormTempData", edit.values);
        if (edit.selected){
            window.history.pushState('', '', "?id=" + edit.selected);
        }

    }


   
}

export {
    restoreTempData
};