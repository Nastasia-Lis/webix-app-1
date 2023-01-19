///////////////////////////////

// Пересоздание фильтра после перезагрузки / перехода в таб

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { mediator }     from "../../../blocks/_mediator.js";

function setDataToTab(currState){
    const data = mediator.tabs.getInfo();
 
    if (data){
        if(!data.temp){
            data.temp = {};
        }
        if(!data.temp.filter){
            data.temp.filter = {};
        }

        data.temp.filter.dashboards = true;
        data.temp.filter.values     = currState;

        mediator.tabs.setInfo(data);
    }
 }


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
                setDataToTab(content);

                content.forEach(function(el){
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