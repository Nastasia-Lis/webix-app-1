
///////////////////////////////

// Сокрытие всех элементов

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { Action }             from "../../../blocks/commonFunctions.js";
import { setFunctionError }   from "../../../blocks/errors.js";


function hideAllElements (){

  
    const container = $$("container");
    const childs    = container.getChildViews();
    
    if (childs.length){
        childs.forEach(function(el){
            const view = el.config.view;
            if(view == "scrollview" || view == "layout"){
                Action.hideItem($$(el.config.id));
            }
        });
    } else {
        setFunctionError(
            "array length is null",
            "routerConfig/hideAllElements",
            "hideAllElements"
        ); 
    }

  
     
}

export {
    hideAllElements
};