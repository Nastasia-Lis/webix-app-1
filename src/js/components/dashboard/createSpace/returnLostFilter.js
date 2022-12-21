function returnLostFilter (id){
    const url       = window.location.search;
    const params    = new URLSearchParams(url);
    const viewParam = params.get("view"); 

    
    if (viewParam == "filter"){
        $$("dashFilterBtn").callEvent("clickEvent", [ "" ]);

        const data = webix.storage.local.get("dashFilterState");
  
        if (data){
            const content = data.content;
          
            if (content){
                content.forEach(function(el, i){
                    const input = $$(el.id);
                    if (input){
                        let value = el.value;

                        if (input.config.id.includes("-time")){
                            const formatting = webix.Date.dateToStr("%H:%i:%s");
                            value = formatting(value);
                        }
                        
                        
                        input.setValue(value);
                    }
                });

            }
        
        }
      
    }
}

export {
    returnLostFilter
};