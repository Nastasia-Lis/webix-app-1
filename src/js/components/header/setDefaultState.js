///////////////////////////////

// Дефолтное состояние header после адаптива

// Copyright (c) 2022 CA Expert

///////////////////////////////

import { isArray }          from "../../blocks/commonFunctions.js";
function headerDefState(){
    const headerChilds = $$("header").getChildViews();

    if (isArray(headerChilds, "header/setDefaultState", "headerDefState")){
        headerChilds.forEach(function(el){
            if (el.config.id.includes("search")){
                el.show();
            }
        });
    }
  
}


export {
    headerDefState
};